import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Terminos } from "@/components/Terminos";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Únete a la tripulación | Dulces del Rey Pirata" },
      {
        name: "description",
        content:
          "Regístrate con tu nombre, tu usuario de Instagram y tu cumpleaños para recibir tu tarjeta de fidelidad pirata con 8 sellos.",
      },
      { property: "og:title", content: "Únete a la tripulación | Dulces del Rey Pirata" },
      {
        property: "og:description",
        content: "Crea tu tarjeta de fidelidad pirata en segundos y empieza a juntar sellos.",
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
  const [instagram, setInstagram] = useState("");
  const [cumpleanos, setCumpleanos] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [acepto, setAcepto] = useState(false);
  const [quiereAvisos, setQuiereAvisos] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acepto) {
      setError("Para crear tu tarjeta debes aceptar los términos y la política de privacidad.");
      return;
    }
    if (nombre.trim().length < 3) {
      setError("Escribe tu nombre y apellido.");
      return;
    }
    if (instagram.trim().replace(/^@/, "").length < 2) {
      setError("Déjanos tu usuario de Instagram.");
      return;
    }

    const cumpleanosFormato = cumpleanos ? cumpleanos.split("-").reverse().join("/") : null;
    setEnviando(true);
    const { data, error: err } = await supabase.rpc("registro_publico", {
      p_nombre: nombre.trim(),
      p_instagram: instagram.trim().replace(/^@/, ""),
      p_cumpleanos: cumpleanosFormato,
    });
    setEnviando(false);

    if (err || !data) {
      setError("No pudimos crear tu tarjeta. Inténtalo de nuevo.");
      return;
    }
    // Respaldo del consentimiento; si falla no bloquea el registro.
    await supabase
      .rpc("registrar_consentimiento", { p_enlace: data as string, p_acepta_avisos: quiereAvisos })
      .then(({ error: e }) => e && console.error(e));
    localStorage.setItem("tarjeta_enlace", data as string);
    sessionStorage.setItem("recien_registrado", "1");
    if (quiereAvisos) localStorage.setItem("avisos_aceptados", "1");
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
          alt="Logo Dulces del Rey Pirata"
          className="mx-auto h-16 w-16 rounded-full border border-primary/20 bg-cream object-contain p-0.5"
        />
        <h1 className="mt-3 text-center text-xl font-bold leading-tight text-primary">
          Únete a la tripulación
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Tu tarjeta de 8 sellos</p>

        <label className="mt-5 block text-sm font-semibold text-primary" htmlFor="nombre">
          Nombre y apellido
        </label>
        <input
          id="nombre"
          required
          maxLength={80}
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Ana Pérez"
          className={campo}
        />

        <label className="mt-4 block text-sm font-semibold text-primary" htmlFor="instagram">
          Usuario de Instagram
        </label>
        <input
          id="instagram"
          required
          maxLength={50}
          autoCapitalize="none"
          autoCorrect="off"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@tuusuario"
          className={campo}
        />

        <label className="mt-4 block text-sm font-semibold text-primary" htmlFor="cumpleanos">
          🎂 Cumpleaños{" "}
          <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="cumpleanos"
          type="date"
          value={cumpleanos}
          onChange={(e) => setCumpleanos(e.target.value)}
          className={campo}
        />
        <p className="mt-1 text-xs text-muted-foreground">Así te saludamos en tu día. 🎉</p>

        <Terminos className="mt-5" />

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
            onChange={(e) => setQuiereAvisos(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[oklch(0.8_0.13_82)]"
          />
          <span>
            Quiero recibir avisos de promociones en mi celular.{" "}
            <span className="text-muted-foreground">
              (Opcional. Puedes desactivarlos cuando quieras.)
            </span>
          </span>
        </label>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={enviando || !acepto || !nombre.trim() || !instagram.trim()}
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
