import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TarjetaFidelidad } from "@/components/TarjetaFidelidad";
import { Terminos } from "@/components/Terminos";

export const Route = createFileRoute("/t/$enlace")({
  head: () => ({
    meta: [
      { title: "Mi tarjeta pirata | Dulces del Rey Pirata" },
      {
        name: "description",
        content: "Consulta los sellos acumulados en tu tarjeta de fidelidad pirata.",
      },
      { property: "og:title", content: "Mi tarjeta pirata | Dulces del Rey Pirata" },
      {
        property: "og:description",
        content: "Consulta los sellos acumulados en tu tarjeta de fidelidad pirata.",
      },
    ],
  }),
  component: VistaCliente,
});

type Tarjeta = {
  nombre_completo: string;
  sellos_actuales: number;
  instagram: string | null;
};

function VistaCliente() {
  const { enlace } = Route.useParams();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [mostrarAyudaInstalacion, setMostrarAyudaInstalacion] = useState(false);

  useEffect(() => {
    // Guardar el código único en localStorage para rápida recuperación
    localStorage.setItem("tarjeta_enlace", enlace);

    // Escuchar evento nativo de instalación PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [enlace]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["tarjeta", enlace],
    queryFn: async (): Promise<Tarjeta | null> => {
      const { data, error } = await supabase.rpc("tarjeta_publica", { p_enlace: enlace });
      if (error) throw error;
      return (data as Tarjeta[])?.[0] ?? null;
    },
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const handleClickGuardar = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      // Si no hay evento nativo (ej. Safari en iOS), se despliega el modal de instrucciones
      setMostrarAyudaInstalacion(true);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 relative">
      {isLoading ? (
        <p className="text-muted-foreground animate-pulse font-medium">Cargando tu tarjeta pirata…</p>
      ) : isError || !data ? (
        <p className="max-w-xs text-center text-muted-foreground">
          No encontramos esta tarjeta. Pide a la tripulación un enlace válido.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          
          {/* BOTÓN DESTACADO PWA: ¡Haz clic acá para no perderme! */}
          <button
            type="button"
            onClick={handleClickGuardar}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-caramel px-4 py-3 text-center font-bold text-primary shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] border-2 border-primary/40"
          >
            <span className="text-lg">🏴‍☠️</span>
            <span>¡Haz clic acá para no perderme!</span>
          </button>

          {/* COMPONENTE PRINCIPAL DE LA TARJETA */}
          <TarjetaFidelidad
            nombre={data.nombre_completo}
            sellos={data.sellos_actuales}
            instagram={data.instagram}
          />

          {/* TÉRMINOS Y CONDICIONES */}
          <Terminos className="w-full max-w-sm" />

          {/* BOTÓN RECARGAR/ACTUALIZAR SELLOS */}
          <button
            onClick={() => refetch()}
            className="w-full rounded-xl border-2 border-primary/50 bg-cream/30 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            {isFetching ? "Actualizando…" : "🔄 Actualizar sellos"}
          </button>
        </div>
      )}

      {/* GUÍA FLOTANTE DE INSTALACIÓN PWA (MODAL) */}
      {mostrarAyudaInstalacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs rounded-3xl border-2 border-primary/80 bg-card p-6 shadow-2xl text-primary">
            <div className="text-center">
              <span className="text-3xl">🗺️</span>
              <h3 className="mt-2 text-lg font-bold">¡Guarda tu tarjeta pirata!</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Para tener acceso directo a tus sellos desde tu pantalla de inicio sin buscar el enlace:
              </p>
            </div>

            <div className="mt-4 space-y-2 text-xs bg-cream p-3 rounded-xl border border-primary/20">
              <p>📱 <span className="font-semibold">En Android (Chrome):</span> Toca los 3 puntos (⋮) arriba a la derecha y selecciona <span className="font-semibold text-primary">"Agregar a la pantalla principal"</span>.</p>
              <p className="pt-2 border-t border-primary/10">🍏 <span className="font-semibold">En iPhone (Safari):</span> Toca el botón Compartir (⎋) y selecciona <span className="font-semibold text-primary">"Agregar al inicio"</span>.</p>
            </div>

            <button
              type="button"
              onClick={() => setMostrarAyudaInstalacion(false)}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow transition-opacity hover:opacity-90 text-sm"
            >
              ¡Entendido, Capitán!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}