import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TarjetaFidelidad } from "@/components/TarjetaFidelidad";
import { Terminos } from "@/components/Terminos";

export const Route = createFileRoute("/t/$enlace")({
  component: VistaCliente,
});

type Tarjeta = {
  nombre_completo: string;
  sellos_actuales: number;
  instagram: string | null;
  cumpleanos?: string | null;
  enlace_unico?: string;
};

function VistaCliente() {
  const { enlace } = Route.useParams();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [mostrarAyudaInstalacion, setMostrarAyudaInstalacion] = useState(false);

  // Estados para el Modal de Cumpleaños
  const [mostrarModalCumple, setMostrarModalCumple] = useState(false);
  const [fechaCumple, setFechaCumple] = useState("");
  const [guardandoCumple, setGuardandoCumple] = useState(false);

  useEffect(() => {
    localStorage.setItem("tarjeta_enlace", enlace);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
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

  // Evaluar si falta el cumpleaños al cargar la tarjeta
  useEffect(() => {
    if (data && !data.cumpleanos) {
      setMostrarModalCumple(true);
    }
  }, [data]);

  // Guardar cumpleaños en Supabase
  const handleGuardarCumpleanos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaCumple) return;

    setGuardandoCumple(true);
    const { error } = await supabase
      .from("clientes") // Reemplazar por el nombre de tu tabla en Supabase
      .update({ cumpleanos: fechaCumple })
      .eq("enlace_unico", enlace);

    setGuardandoCumple(false);

    if (!error) {
      setMostrarModalCumple(false);
      refetch();
    }
  };

  const handleClickGuardar = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    } else {
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
          <button
            type="button"
            onClick={handleClickGuardar}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-caramel px-4 py-3 text-center font-bold text-primary shadow-lg border-2 border-primary/40"
          >
            <span className="text-lg">🏴‍☠️</span>
            <span>¡Haz clic acá para no perderme!</span>
          </button>

          <TarjetaFidelidad
            nombre={data.nombre_completo}
            sellos={data.sellos_actuales}
            instagram={data.instagram}
          />

          <Terminos className="w-full max-w-sm" />

          <button
            onClick={() => refetch()}
            className="w-full rounded-xl border-2 border-primary/50 bg-cream/30 py-2.5 text-sm font-semibold text-primary"
          >
            {isFetching ? "Actualizando…" : "🔄 Actualizar sellos"}
          </button>
        </div>
      )}

      {/* MODAL CUMPLEAÑOS (Para clientes existentes) */}
      {mostrarModalCumple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xs rounded-3xl border-2 border-primary/80 bg-card p-6 shadow-2xl text-primary">
            <div className="text-center">
              <span className="text-4xl">🎂</span>
              <h3 className="mt-2 text-lg font-bold">¡Premio Pirata de Cumpleaños!</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Ingresa tu fecha de cumpleaños para regalarte una sorpresa especial en tu mes. 🎈
              </p>
            </div>

            <form onSubmit={handleGuardarCumpleanos} className="mt-4 space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-primary block mb-1">
                  Tu fecha de nacimiento:
                </label>
                <input
                  type="date"
                  value={fechaCumple}
                  onChange={(e) => setFechaCumple(e.target.value)}
                  required
                  className="w-full rounded-xl border-2 border-primary/40 bg-cream/50 px-3 py-2 text-sm text-primary outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={guardandoCumple}
                className="w-full rounded-xl bg-primary px-4 py-2.5 font-bold text-primary-foreground shadow transition-opacity hover:opacity-90 text-sm"
              >
                {guardandoCumple ? "Guardando..." : "¡Guardar mi fecha! 🏴‍☠️"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL GUÍA PWA */}
      {mostrarAyudaInstalacion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-xs rounded-3xl border-2 border-primary/80 bg-card p-6 shadow-2xl text-primary">
            <div className="text-center">
              <span className="text-3xl">🗺️</span>
              <h3 className="mt-2 text-lg font-bold">¡Guarda tu tarjeta pirata!</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                Accede directo a tus sellos desde tu pantalla de inicio:
              </p>
            </div>
            <div className="mt-4 space-y-2 text-xs bg-cream p-3 rounded-xl border border-primary/20">
              <p>📱 <span className="font-semibold">Android (Chrome):</span> Toca los 3 puntos (⋮) y selecciona <span className="font-semibold text-primary">"Agregar a la pantalla principal"</span>.</p>
              <p className="pt-2 border-t border-primary/10">🍏 <span className="font-semibold">iPhone (Safari):</span> Toca Compartir (⎋) y elige <span className="font-semibold text-primary">"Agregar al inicio"</span>.</p>
            </div>
            <button
              type="button"
              onClick={() => setMostrarAyudaInstalacion(false)}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground shadow text-sm"
            >
              ¡Entendido, Capitán!
            </button>
          </div>
        </div>
      )}
    </main>
  );
}