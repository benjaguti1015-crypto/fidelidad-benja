import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { CodigoQR } from "@/components/CodigoQR";
import { PREFIJO_PUNTO } from "@/lib/marca";

export const Route = createFileRoute("/puntos")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Puntos de venta | Dulces del Rey Pirata" }],
  }),
  component: PuntosVenta,
});

type Punto = { id: string; nombre: string; codigo: string; activo: boolean };

function PuntosVenta() {
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargando(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="animate-pulse text-muted-foreground">Cargando…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-muted-foreground">Inicia sesión en el panel para ver esta página.</p>
          <a href="/" className="mt-3 inline-block font-semibold text-primary underline">
            Ir al panel
          </a>
        </div>
      </main>
    );
  }

  return <Lista />;
}

function Lista() {
  const qc = useQueryClient();
  const [nombre, setNombre] = useState("");
  const [imprimir, setImprimir] = useState<string | null>(null);

  const {
    data: puntos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["puntos_venta"],
    queryFn: async (): Promise<Punto[]> => {
      const { data, error } = await supabase
        .from("puntos_venta")
        .select("id, nombre, codigo, activo")
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const crear = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("puntos_venta").insert({ nombre: nombre.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setNombre("");
      qc.invalidateQueries({ queryKey: ["puntos_venta"] });
    },
  });

  const cambiarActivo = useMutation({
    mutationFn: async (p: Punto) => {
      const { error } = await supabase
        .from("puntos_venta")
        .update({ activo: !p.activo })
        .eq("id", p.id);
      if (error) throw error;
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["puntos_venta"] }),
  });

  // Imprime solo la tarjeta del punto elegido.
  useEffect(() => {
    if (!imprimir) return;
    const fin = () => setImprimir(null);
    window.addEventListener("afterprint", fin);
    const t = setTimeout(() => window.print(), 300); // espera a que se genere el QR
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", fin);
    };
  }, [imprimir]);

  return (
    <main className="min-h-screen bg-background px-4 py-6 print:bg-white print:p-0">
      <div className="mx-auto w-full max-w-sm">
        <header className="flex items-center gap-3 print:hidden">
          <img
            src="/logo.jpg"
            alt="Logo Dulces del Rey Pirata"
            className="h-10 w-10 rounded-full border border-primary/20"
          />
          <h1 className="min-w-0 flex-1 text-lg leading-tight text-primary">Puntos de venta</h1>
          <a
            href="/"
            className="rounded-lg border border-primary/40 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            Volver
          </a>
        </header>

        <p className="mt-3 text-sm text-muted-foreground print:hidden">
          Imprime el QR de cada local. El cliente lo escanea desde su tarjeta y suma 1 sello (máximo
          1 por día).
        </p>

        <form
          className="mt-4 flex gap-2 print:hidden"
          onSubmit={(e) => {
            e.preventDefault();
            if (nombre.trim()) crear.mutate();
          }}
        >
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value.slice(0, 60))}
            placeholder="Nombre del local"
            aria-label="Nombre del local"
            className="min-w-0 flex-1 rounded-xl border border-primary/40 bg-card px-3 py-2.5 text-primary placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={crear.isPending || !nombre.trim()}
            className="rounded-xl bg-caramel px-4 py-2.5 font-semibold text-primary-foreground disabled:opacity-60"
          >
            Crear
          </button>
        </form>

        {(error || crear.error) && (
          <p className="mt-3 rounded-xl border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive print:hidden">
            {(error ?? crear.error) instanceof Error
              ? (error ?? crear.error)?.message
              : "Error al cargar los puntos de venta."}
          </p>
        )}

        {isLoading ? (
          <p className="mt-6 text-center text-muted-foreground">Cargando…</p>
        ) : puntos.length === 0 ? (
          <p className="mt-6 text-center text-muted-foreground print:hidden">
            Aún no hay puntos de venta.
          </p>
        ) : (
          <ul className="mt-5 space-y-4">
            {puntos.map((p) => (
              <li
                key={p.id}
                className={`rounded-2xl border border-primary/30 bg-card p-4 print:border-0 print:bg-white ${
                  imprimir && imprimir !== p.id ? "print:hidden" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 print:hidden">
                  <p className="truncate font-semibold text-primary">{p.nombre}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      p.activo ? "bg-gold/30 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.activo ? "Activo" : "Pausado"}
                  </span>
                </div>

                {/* Lo que se imprime */}
                <div className="mt-3 flex flex-col items-center text-center print:mt-10 print:text-black">
                  <p className="hidden text-3xl font-bold print:block">Suma tu sello aquí</p>
                  <div className="print:mt-6">
                    <CodigoQR valor={`${PREFIJO_PUNTO}${p.codigo}`} size={imprimir ? 320 : 200} />
                  </div>
                  <ol className="hidden text-left text-lg print:mt-6 print:block">
                    <li>1. Abre tu tarjeta Rey Pirata</li>
                    <li>2. Toca «Escanear QR del local»</li>
                    <li>3. ¡Listo! 1 sello por día</li>
                  </ol>
                  <p className="mt-2 text-xs text-muted-foreground print:mt-6 print:text-sm">
                    {p.nombre}
                  </p>
                </div>

                <div className="mt-3 flex gap-2 print:hidden">
                  <button
                    onClick={() => setImprimir(p.id)}
                    className="flex-1 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    Imprimir QR
                  </button>
                  <button
                    onClick={() => cambiarActivo.mutate(p)}
                    disabled={cambiarActivo.isPending}
                    className="flex-1 rounded-xl border-2 border-primary/50 px-3 py-2 text-sm font-semibold text-primary disabled:opacity-60"
                  >
                    {p.activo ? "Pausar" : "Activar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
