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

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (nombre.trim().length < 3) {
      setError("Escribe tu nombre y apellido.");
      return;
    }
    if (instagram.trim().replace(/^@/, "").length < 2) {
      setError("Déjanos tu usuario de Instagram.");
      return;
    }

    setEnviando(true);
    const { data, error: err } = await supabase.rpc("registro_publico", {
      p_nombre: nombre.trim(),
      p_instagram: instagram.trim().replace(/^@/, ""),
      p_cumpleanos: cumpleanos ? cumpleanos : null,
    });
    setEnviando(false);

    if (err || !data) {
      setError("No pudimos crear tu tarjeta. Inténtalo de nuevo.");
      return;
    }
    localStorage.setItem("tarjeta_enlace", data as string);
    navigate({ to: "/t/$enlace", params: { enlace: data as string } });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm rounded-3xl border-2 border-primary/70 bg-card p-6 shadow-card"
      >
        <img
          src="/logo.jpg"
          alt="Logo Dulces del Rey Pirata"
          className="mx-auto h-24 w-24 object-contain"
        />
        <h1 className="mt-3 text-center text-xl leading-tight text-primary font-bold">
          Únete a la tripulación
        </h1>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Tu tarjeta de 8 sellos
        </p>

        {/* NOMBRE Y APELLIDO */}
        <label className="mt-6 block text-sm font-semibold text-primary" htmlFor="nombre">
          Nombre y apellido
        </label>
        <input
          id="nombre"
          required
          maxLength={80}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Ana Pérez"
          className="mt-1 w-full rounded-xl border-2 border-primary/40 bg-cream px-3 py-2 text-primary outline-none focus:border-primary"
        />

        {/* USUARIO DE INSTAGRAM */}
        <label className="mt-4 block text-sm font-semibold text-primary" htmlFor="instagram">
          Usuario de Instagram
        </label>
        <input
          id="instagram"
          required
          maxLength={50}
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          placeholder="@tuusuario"
          className="mt-1 w-full rounded-xl border-2 border-primary/40 bg-cream px-3 py-2 text-primary outline-none focus:border-primary"
        />

        {/* FECHA DE CUMPLEAÑOS */}
        <label className="mt-4 block text-sm font-semibold text-primary" htmlFor="cumpleanos">
          🎂 Fecha de cumpleaños <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="cumpleanos"
          type="date"
          value={cumpleanos}
          onChange={(e) => setCumpleanos(e.target.value)}
          className="mt-1 w-full rounded-xl border-2 border-primary/40 bg-cream px-3 py-2 text-primary outline-none focus:border-primary text-sm"
        />
        <p className="mt-1 text-[10px] text-muted-foreground">
          Te regalaremos una sorpresa pirata en tu mes especial. 🎉
        </p>

        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <Terminos className="mt-4" />

        <button
          type="submit"
          disabled={enviando}
          className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {enviando ? "Creando tarjeta…" : "Crear mi tarjeta"}
        </button>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Guarda el enlace de tu tarjeta para ver tus sellos cuando quieras.
        </p>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          ¿Ya tienes tarjeta?{" "}
          <Link to="/mi-tarjeta" className="font-semibold text-primary underline">
            Búscala aquí
          </Link>
        </p>
      </form>
    </main>
  );
}