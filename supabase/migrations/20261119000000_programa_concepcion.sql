-- Programa "concepcion" (12 sellos, 2 de regalo) para clientes nuevos.
-- Los clientes existentes quedan en "universidad" con sus reglas de siempre (8 sellos).

-- 1. Clientes: programa, apellido, correo y fecha del consentimiento de promociones.
ALTER TABLE public.clientes
  ADD COLUMN IF NOT EXISTS programa text NOT NULL DEFAULT 'universidad',
  ADD COLUMN IF NOT EXISTS apellido text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS avisos_aceptados_en timestamptz;

-- Las filas existentes ya quedaron en 'universidad'; desde ahora los nuevos son 'concepcion'.
ALTER TABLE public.clientes ALTER COLUMN programa SET DEFAULT 'concepcion';

ALTER TABLE public.clientes DROP CONSTRAINT IF EXISTS clientes_programa_check;
ALTER TABLE public.clientes
  ADD CONSTRAINT clientes_programa_check CHECK (programa IN ('universidad', 'concepcion'));

CREATE UNIQUE INDEX IF NOT EXISTS clientes_email_unico
  ON public.clientes (lower(email)) WHERE email IS NOT NULL;

-- 2. Fidelidad: tope de sellos 12 (el tope real por programa lo aplica ajustar_sellos)
--    y registro del canje del 50% del sello 10.
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.fidelidad'::regclass AND contype = 'c'
      AND pg_get_constraintdef(oid) ILIKE '%sellos_actuales%'
  LOOP
    EXECUTE format('ALTER TABLE public.fidelidad DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

ALTER TABLE public.fidelidad
  ADD CONSTRAINT fidelidad_sellos_rango CHECK (sellos_actuales BETWEEN 0 AND 12),
  ADD COLUMN IF NOT EXISTS premio_10_canjeado_en timestamptz;

-- 3. Historial de premios canjeados (la tarjeta vuelve a 0 al canjear el sello 12).
CREATE TABLE IF NOT EXISTS public.canjes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  sello integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.canjes ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.canjes TO authenticated;
GRANT ALL ON public.canjes TO service_role;
DROP POLICY IF EXISTS "Admins leen canjes" ON public.canjes;
CREATE POLICY "Admins leen canjes" ON public.canjes FOR SELECT TO authenticated USING (true);

-- 4. Al crear un cliente: los de Concepción parten con 2 sellos de regalo.
CREATE OR REPLACE FUNCTION public.crear_fidelidad()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.fidelidad (cliente_id, sellos_actuales)
  VALUES (NEW.id, CASE WHEN NEW.programa = 'concepcion' THEN 2 ELSE 0 END);
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.crear_fidelidad() FROM PUBLIC, anon, authenticated;

-- 5. Sumar/quitar sellos según el programa.
--    Universidad: igual que antes (tope 8).
--    Concepción: tope 12 y máximo 1 sello por día (quitar el sello de hoy libera el día).
CREATE OR REPLACE FUNCTION public.ajustar_sellos(p_cliente_id uuid, p_delta integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nuevo integer;
  v_activa boolean;
  v_programa text;
  v_meta integer;
  v_ultimo timestamptz;
  v_hoy boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  IF p_delta IS NULL OR p_delta NOT IN (-1, 1) THEN
    RAISE EXCEPTION 'Ajuste inválido';
  END IF;

  SELECT programa INTO v_programa FROM public.clientes WHERE id = p_cliente_id;
  IF v_programa IS NULL THEN
    RAISE EXCEPTION 'Cliente no encontrado';
  END IF;
  v_meta := CASE WHEN v_programa = 'concepcion' THEN 12 ELSE 8 END;

  SELECT c.acumulacion_activa INTO v_activa FROM public.configuracion c LIMIT 1;
  IF p_delta = 1 AND COALESCE(v_activa, true) = false THEN
    RAISE EXCEPTION 'Acumulación de sellos pausada';
  END IF;

  INSERT INTO public.fidelidad (cliente_id, sellos_actuales)
  VALUES (p_cliente_id, 0)
  ON CONFLICT (cliente_id) DO NOTHING;

  SELECT ultimo_sello_en INTO v_ultimo FROM public.fidelidad WHERE cliente_id = p_cliente_id;
  v_hoy := v_ultimo IS NOT NULL
    AND (v_ultimo AT TIME ZONE 'America/Santiago')::date = (now() AT TIME ZONE 'America/Santiago')::date;

  IF p_delta = 1 AND v_programa = 'concepcion' AND v_hoy THEN
    RAISE EXCEPTION 'Este cliente ya recibió su sello de hoy (límite: 1 sello por día)';
  END IF;

  UPDATE public.fidelidad
  SET sellos_actuales = LEAST(v_meta, GREATEST(0, sellos_actuales + p_delta)),
      updated_at = now(),
      ultimo_sello_en = CASE
        WHEN p_delta = 1 THEN now()
        WHEN v_programa = 'concepcion' AND v_hoy THEN NULL
        ELSE ultimo_sello_en
      END
  WHERE cliente_id = p_cliente_id
  RETURNING sellos_actuales INTO v_nuevo;

  IF v_nuevo IS NULL THEN
    RAISE EXCEPTION 'Cliente sin tarjeta';
  END IF;

  RETURN v_nuevo;
END;
$$;
REVOKE ALL ON FUNCTION public.ajustar_sellos(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ajustar_sellos(uuid, integer) TO authenticated;

-- 6. Canjear premios de Concepción (solo admin).
--    Sello 10: marca el 50% como canjeado. Sello 12: entrega la caja y la tarjeta vuelve a 0.
CREATE OR REPLACE FUNCTION public.canjear_premio(p_cliente_id uuid, p_sello integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_programa text;
  v_sellos integer;
  v_canje10 timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT c.programa, f.sellos_actuales, f.premio_10_canjeado_en
    INTO v_programa, v_sellos, v_canje10
  FROM public.clientes c
  JOIN public.fidelidad f ON f.cliente_id = c.id
  WHERE c.id = p_cliente_id
  FOR UPDATE OF f;

  IF v_programa IS DISTINCT FROM 'concepcion' THEN
    RAISE EXCEPTION 'Este cliente no es del programa Concepción';
  END IF;

  IF p_sello = 10 THEN
    IF v_sellos < 10 THEN RAISE EXCEPTION 'Aún no llega al sello 10'; END IF;
    IF v_canje10 IS NOT NULL THEN RAISE EXCEPTION 'El 50%% ya fue canjeado'; END IF;
    UPDATE public.fidelidad SET premio_10_canjeado_en = now(), updated_at = now()
    WHERE cliente_id = p_cliente_id;
  ELSIF p_sello = 12 THEN
    IF v_sellos < 12 THEN RAISE EXCEPTION 'Aún no completa los 12 sellos'; END IF;
    UPDATE public.fidelidad
    SET sellos_actuales = 0, premio_10_canjeado_en = NULL, updated_at = now()
    WHERE cliente_id = p_cliente_id;
    v_sellos := 0;
  ELSE
    RAISE EXCEPTION 'Premio inválido';
  END IF;

  INSERT INTO public.canjes (cliente_id, sello) VALUES (p_cliente_id, p_sello);
  RETURN v_sellos;
END;
$$;
REVOKE ALL ON FUNCTION public.canjear_premio(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.canjear_premio(uuid, integer) TO authenticated;

-- 7. Registro público de Concepción.
CREATE OR REPLACE FUNCTION public.registro_concepcion(
  p_nombre text,
  p_apellido text,
  p_email text,
  p_acepta_promos boolean,
  p_cumpleanos text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nombre text := btrim(coalesce(p_nombre, ''));
  v_apellido text := btrim(coalesce(p_apellido, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_promos boolean := coalesce(p_acepta_promos, false);
  v_enlace text;
BEGIN
  IF length(v_nombre) < 2 OR length(v_nombre) > 40 THEN
    RAISE EXCEPTION 'Nombre inválido';
  END IF;
  IF length(v_apellido) < 2 OR length(v_apellido) > 40 THEN
    RAISE EXCEPTION 'Apellido inválido';
  END IF;
  IF length(v_email) > 120 OR v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Correo inválido';
  END IF;
  IF EXISTS (SELECT 1 FROM public.clientes WHERE lower(email) = v_email) THEN
    RAISE EXCEPTION 'correo_registrado';
  END IF;

  INSERT INTO public.clientes
    (nombre_completo, apellido, email, programa, terminos_aceptados_en, acepta_avisos, avisos_aceptados_en)
  VALUES
    (v_nombre || ' ' || v_apellido, v_apellido, v_email, 'concepcion', now(), v_promos,
     CASE WHEN v_promos THEN now() END)
  RETURNING enlace_unico INTO v_enlace;

  -- El cumpleaños es opcional: si algo falla al guardarlo, el registro sigue igual.
  IF nullif(btrim(coalesce(p_cumpleanos, '')), '') IS NOT NULL THEN
    BEGIN
      PERFORM public.actualizar_cumpleanos_publico(p_enlace => v_enlace, p_cumpleanos => p_cumpleanos);
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN v_enlace;
END;
$$;
REVOKE ALL ON FUNCTION public.registro_concepcion(text, text, text, boolean, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.registro_concepcion(text, text, text, boolean, text) TO anon, authenticated;

-- 8. Datos públicos de la tarjeta (sin correo) para la página y Google Wallet.
CREATE OR REPLACE FUNCTION public.tarjeta_detalle(p_enlace text)
RETURNS TABLE(
  programa text,
  nombre_completo text,
  sellos_actuales integer,
  instagram text,
  cumpleanos text,
  premio_10_canjeado boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.programa,
         c.nombre_completo,
         COALESCE(f.sellos_actuales, 0)::integer,
         c.instagram,
         c.cumpleanos::text,
         f.premio_10_canjeado_en IS NOT NULL
  FROM public.clientes c
  LEFT JOIN public.fidelidad f ON f.cliente_id = c.id
  WHERE c.enlace_unico = p_enlace
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.tarjeta_detalle(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.tarjeta_detalle(text) TO anon, authenticated;

-- 9. Recuperar la tarjeta con el correo.
CREATE OR REPLACE FUNCTION public.buscar_tarjeta_correo(p_email text)
RETURNS TABLE(nombre_completo text, enlace_unico text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.nombre_completo, c.enlace_unico
  FROM public.clientes c
  WHERE c.email IS NOT NULL
    AND lower(c.email) = lower(btrim(coalesce(p_email, '')))
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.buscar_tarjeta_correo(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.buscar_tarjeta_correo(text) TO anon, authenticated;

-- 10. Activar avisos desde la tarjeta = aceptar promociones (solo Concepción).
CREATE OR REPLACE FUNCTION public.aceptar_promociones(p_enlace text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.clientes
     SET acepta_avisos = true,
         avisos_aceptados_en = COALESCE(avisos_aceptados_en, now())
   WHERE enlace_unico = p_enlace
     AND programa = 'concepcion';
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.aceptar_promociones(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aceptar_promociones(text) TO anon, authenticated;
