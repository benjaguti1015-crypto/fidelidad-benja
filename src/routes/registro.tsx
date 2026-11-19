import { useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Terminos } from "@/components/Terminos";
import { CampoCumpleanos, type EstadoCumple } from "@/components/CampoCumpleanos";
import { guardarSuscripcion, pedirSuscripcion } from "@/lib/avisos";
import { MARCA, PROGRAMAS, SELLOS_BIENVENIDA } from "@/lib/marca";

const META_C = PROGRAMAS.concepcion.meta;

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Únete a la tripulación | Dulces del Rey Pirata" },
      {
        name: "description",
        content:
          "Regístrate con tu nombre y tu correo y recibe tu tarjeta de fidelidad de 12 sellos: los 2 primeros van de regalo.",
      },
      { property: "og:title", content: "Únete a la tripulación | Dulces del Rey Pirata" },
      {
        property: "og:description",
        content: "Crea tu tarjeta de fidelidad en segundos. Los 2 primeros sellos van de regalo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Registro,
});

function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [cumple, setCumple] = useState<{ fecha: string | null; estado: EstadoCumple }>({
    fecha: null,
    estado: "vacio",
  });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [quiereAvisos, setQuiereAvisos] = useState(false);
  const [permisoAvisos, setPermisoAvisos] = useState<"pidiendo" | "activo" | "bloqueado" | null>(
    null,
  );
  // Se pide el permiso al marcar la casilla (toque del usuario) y se guarda al crear la tarjeta.
  const suscripcion = useRef<PushSubscription | null>(null);

  async function cambiarAvisos(marcada: boolean) {
    setQuiereAvisos(marcada);
    if (!marcada || suscripcion.current) return;
    setPermisoAvisos("pidiendo");
    try {
      const sub = await pedirSuscripcion();
      if (sub === "denegado") return setPermisoAvisos("bloqueado");
      suscripcion.current = sub;
      setPermisoAvisos(sub ? "activo" : null);
    } catch (e) {
      console.error("No se pudieron pedir los avisos:", e);
      setPermisoAvisos(null);
    }
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acepto) {
      setError("Para crear tu tarjeta debes aceptar los términos y la política de privacidad.");
      return;
    }
    if (nombre.trim().length < 2) {
      setError("Escribe tu nombre.");
      return;
    }
    if (apellido.trim().length < 2) {
      setError("Escribe tu apellido.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Revisa tu correo electrónico.");
      return;
    }

    if (cumple.estado === "invalida") {
      setError("Revisa tu fecha de cumpleaños o déjala en blanco.");
      return;
    }

    setEnviando(true);
    const { data, error: err } = await supabase.rpc("registro_concepcion", {
      p_nombre: nombre.trim(),
      p_apellido: apellido.trim(),
      p_email: email.trim().toLowerCase(),
      p_acepta_promos: quiereAvisos,
      p_cumpleanos: cumple.fecha,
    });
    setEnviando(false);

    if (err || !data) {
      setError(
        err?.message.includes("correo_registrado")
          ? "Ese correo ya tiene una tarjeta. Búscala en «Ver mi tarjeta»."
          : "No pudimos crear tu tarjeta. Inténtalo de nuevo.",
      );
      return;
    }
    localStorage.setItem("tarjeta_enlace", data as string);
    sessionStorage.setItem("recien_registrado", "1");
    if (quiereAvisos) localStorage.setItem("avisos_aceptados", "1");
    if (quiereAvisos && suscripcion.current) {
      await guardarSuscripcion(data as string, suscripcion.current).catch((e) =>
        console.error("No se guardó la suscripción de avisos:", e),
      );
    }
    navigate({ to: "/t/$enlace", params: { enlace: data as string } });
  }

  const campo =
    "mt-1 w-full rounded-xl border border-primary/30 bg-cream px-3 py-2.5 text-base text-primary outline-none transition-colors focus:border-primary";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm rounded-3xl border border-primary/30 bg-card p-6 shadow-card"
      >
        <img
          src="/logo.jpg"
          alt={`Logo ${MARCA}`}
          className="mx-auto h-16 w-16 rounded-full border border-primary/20 bg-cream object-contain p-0.5"
        />
        <h1 className="mt-3 text-center text-xl font-bold leading-tight text-primary">
          Únete a la tripulación
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Tu tarjeta de {META_C} sellos. ¡Los {SELLOS_BIENVENIDA} primeros van de regalo!
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-primary" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              required
              maxLength={40}
              autoComplete="given-name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ana"
              className={campo}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-primary" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              required
              maxLength={40}
              autoComplete="family-name"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Pérez"
              className={campo}
            />
          </div>
        </div>

        <label className="mt-4 block text-sm font-semibold text-primary" htmlFor="email">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          maxLength={120}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className={campo}
        />

        <p className="mt-4 text-sm font-semibold text-primary">
          🎂 Cumpleaños{" "}
          <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
        </p>
        <div className="mt-1">
          <CampoCumpleanos onChange={(fecha, estado) => setCumple({ fecha, estado })} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Día, mes y año. Así te saludamos en tu día. 🎉
        </p>

        <Terminos className="mt-5" programa="concepcion" />

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-primary">
          <input
            type="checkbox"
            checked={acepto}
            onChange={(e) => setAcepto(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[oklch(0.8_0.13_82)]"
          />
          <span>
            Leí y acepto los términos y condiciones y la{" "}
            <a
              href="/privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
            >
              política de privacidad
            </a>
            .
          </span>
        </label>

        <label className="mt-3 flex cursor-pointer items-start gap-3 text-sm text-primary">
          <input
            type="checkbox"
            checked={quiereAvisos}
            onChange={(e) => cambiarAvisos(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[oklch(0.8_0.13_82)]"
          />
          <span>
            Deseo recibir notificaciones y promociones.{" "}
            <span className="text-muted-foreground">
              (Opcional. Por correo, celular o Google Wallet. Puedes darte de baja cuando quieras.)
            </span>
            {quiereAvisos && permisoAvisos && (
              <span className="mt-1 block text-xs font-semibold" role="status">
                {permisoAvisos === "pidiendo" && "Toca «Permitir» en el aviso de tu celular."}
                {permisoAvisos === "activo" && "🔔 ¡Listo! Te avisaremos de las promos."}
                {permisoAvisos === "bloqueado" &&
                  "Bloqueaste los avisos. Puedes activarlos después en los permisos del navegador."}
              </span>
            )}
          </span>
        </label>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={enviando || !acepto || !nombre.trim() || !apellido.trim() || !email.trim()}
          className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-[transform,opacity] hover:opacity-90 active:scale-[0.97] disabled:opacity-60"
        >
          {enviando ? "Creando tarjeta…" : "Crear mi tarjeta"}
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          ¿Ya tienes tarjeta?{" "}
          <Link to="/mi-tarjeta" className="font-semibold text-primary underline">
            Búscala aquí
          </Link>
        </p>
      </form>
    </main>
  );
}
