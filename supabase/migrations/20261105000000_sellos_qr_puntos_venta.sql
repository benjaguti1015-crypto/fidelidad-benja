-- Sellos por QR en puntos de venta (modo invertido):
-- el local muestra un QR fijo impreso y el cliente lo escanea desde su tarjeta.
-- Cambios solo aditivos: no modifica clientes, fidelidad ni funciones existentes.

-- 1) Puntos de venta. "codigo" es lo que va dentro del QR impreso.
CREATE TABLE IF NOT EXISTS public.puntos_venta (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL CHECK (length(trim(nombre)) BETWEEN 1 AND 60),
  codigo text NOT NULL UNIQUE DEFAULT replace(gen_random_uuid()::text, '-', ''),
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.puntos_venta TO authenticated;
GRANT ALL ON public.puntos_venta TO service_role;
ALTER TABLE public.puntos_venta ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins gestionan puntos de venta" ON public.puntos_venta;
CREATE POLICY "Admins gestionan puntos de venta" ON public.puntos_venta
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2) Registro de sellos por QR. El UNIQUE (cliente_id, fecha) garantiza 1 sello por día.
CREATE TABLE IF NOT EXISTS public.sellos_qr (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  punto_id uuid NOT NULL REFERENCES public.puntos_venta(id) ON DELETE CASCADE,
  fecha date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (cliente_id, fecha)
);

GRANT SELECT ON public.sellos_qr TO authenticated;
GRANT ALL ON public.sellos_qr TO service_role;
ALTER TABLE public.sellos_qr ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins leen sellos por QR" ON public.sellos_qr;
CREATE POLICY "Admins leen sellos por QR" ON public.sellos_qr
  FOR SELECT TO authenticated USING (true);

-- 3) El cliente (sin sesión) escanea el QR del local desde su tarjeta.
--    Devuelve los sellos nuevos o lanza un error con un mensaje para mostrar.
CREATE OR REPLACE FUNCTION public.sello_por_qr(p_enlace text, p_codigo text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_cliente uuid;
  v_punto uuid;
  v_activa boolean;
  v_actual integer;
  v_nuevo integer;
  v_hoy date := (now() AT TIME ZONE 'America/Santiago')::date;
BEGIN
  SELECT id INTO v_cliente FROM public.clientes WHERE enlace_unico = p_enlace;
  IF v_cliente IS NULL THEN
    RAISE EXCEPTION 'No encontramos tu tarjeta.';
  END IF;

  SELECT id INTO v_punto FROM public.puntos_venta
  WHERE codigo = p_codigo AND activo;
  IF v_punto IS NULL THEN
    RAISE EXCEPTION 'Este QR no es de un punto de venta válido.';
  END IF;

  SELECT c.acumulacion_activa INTO v_activa FROM public.configuracion c LIMIT 1;
  IF COALESCE(v_activa, true) = false THEN
    RAISE EXCEPTION 'La acumulación de sellos está pausada por ahora.';
  END IF;

  INSERT INTO public.fidelidad (cliente_id, sellos_actuales)
  VALUES (v_cliente, 0)
  ON CONFLICT (cliente_id) DO NOTHING;

  SELECT sellos_actuales INTO v_actual FROM public.fidelidad
  WHERE cliente_id = v_cliente FOR UPDATE;
  IF v_actual >= 8 THEN
    RAISE EXCEPTION 'Tu tarjeta ya está completa. ¡Canjea tu premio!';
  END IF;

  BEGIN
    INSERT INTO public.sellos_qr (cliente_id, punto_id, fecha)
    VALUES (v_cliente, v_punto, v_hoy);
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Ya sumaste tu sello de hoy. ¡Vuelve mañana!';
  END;

  UPDATE public.fidelidad
  SET sellos_actuales = LEAST(8, sellos_actuales + 1),
      updated_at = now(),
      ultimo_sello_en = now()
  WHERE cliente_id = v_cliente
  RETURNING sellos_actuales INTO v_nuevo;

  RETURN v_nuevo;
END;
$function$;

REVOKE ALL ON FUNCTION public.sello_por_qr(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.sello_por_qr(text, text) TO anon, authenticated;
