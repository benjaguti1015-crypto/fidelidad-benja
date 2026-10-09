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

// Acepta dd/mm/aaaa (formato del registro) y aaaa-mm-dd.
function esHoyCumpleanos(fecha?: string | null) {
  const m =
    fecha?.match(/^(\d{1,2})\/(\d{1,2})\/\d{4}$/) ?? fecha?.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!m || !fecha) return false;
  const [dia, mes] = fecha.includes("/") ? [+m[1]!, +m[2]!] : [+m[2]!, +m[1]!];
  const hoy = new Date();
  return dia === hoy.getDate() && mes === hoy.getMonth() + 1;
}

function VistaCliente() {
  const { enlace } = Route.useParams();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [mostrarAyudaInstalacion, setMostrarAyudaInstalacion] = useState(false);

  // Estados para el Modal de Cumpleaños
  const [mostrarModalCumple, setMostrarModalCumple] = useState(false);
  const [fechaCumple, setFechaCumple] = useState("");
  const [guardandoCumple, setGuardandoCumple] = useState(false);
  const [errorCumple, setErrorCumple] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("tarjeta_enlace", enlace);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, [enlace]);

  const { data, isLoading, isError, refetch } = useQuery({
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
    } else if (data && data.cumpleanos) {
      setMostrarModalCumple(false);
    }
  }, [data?.cumpleanos]);

  // Guardar cumpleaños en Supabase con RPC segura
  const handleGuardarCumpleanos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaCumple) return;

    setGuardandoCumple(true);
    setErrorCumple(null);

    // yyyy-mm-dd -> dd/mm/yyyy, mismo formato que usa /registro
    const cumpleanosFormato = fechaCumple.split("-").reverse().join("/");

    const { data: guardado, error } = await supabase.rpc("actualizar_cumpleanos_publico", {
      p_enlace: enlace,
      p_cumpleanos: cumpleanosFormato,
    });

    setGuardandoCumple(false);

    if (error || !guardado) {
      setErrorCumple("No pudimos guardar tu fecha. Inténtalo de nuevo.");
      return;
    }

    setMostrarModalCumple(false);
    setFechaCumple("");
    await refetch();
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
        <p className="text-muted-foreground animate-pulse font-medium">
          Cargando tu tarjeta pirata…
        </p>
      ) : isError || !data ? (
        <p className="max-w-xs text-center text-muted-foreground">
          No encontramos esta tarjeta. Pide a la tripulación un enlace válido.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          {esHoyCumpleanos(data.cumpleanos) && (
            <p className="w-full rounded-2xl border border-gold bg-gold/20 px-4 py-3 text-center text-sm font-semibold text-primary animate-fade-in">
              🎂 ¡Feliz cumpleaños, {data.nombre_completo.split(" ")[0]}! Repostéanos y consigue tu
              galleta gratis.
            </p>
          )}

          <TarjetaFidelidad
            nombre={data.nombre_completo}
            sellos={data.sellos_actuales}
            instagram={data.instagram}
          />

          <button
            type="button"
            onClick={handleClickGuardar}
            className="text-sm font-semibold text-primary underline transition-transform active:scale-[0.97]"
          >
            📲 Guardar mi tarjeta en el celular
          </button>

          <Terminos className="w-full max-w-sm" />
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

              {errorCumple && <p className="text-xs text-destructive text-center">{errorCumple}</p>}

              <button
                type="submit"
                disabled={guardandoCumple}
                className="w-full rounded-xl bg-primary px-4 py-2.5 font-bold text-primary-foreground shadow transition-opacity hover:opacity-90 text-sm disabled:opacity-60"
              >
                {guardandoCumple ? "Guardando..." : "¡Guardar mi fecha! 🏴‍☠️"}
              </button>
              <button
                type="button"
                onClick={() => setMostrarModalCumple(false)}
                className="w-full text-center text-xs text-muted-foreground underline"
              >
                Ahora no
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
              <p>
                📱 <span className="font-semibold">Android (Chrome):</span> Toca los 3 puntos (⋮) y
                selecciona{" "}
                <span className="font-semibold text-primary">
                  "Agregar a la pantalla principal"
                </span>
                .
              </p>
              <p className="pt-2 border-t border-primary/10">
                🍏 <span className="font-semibold">iPhone (Safari):</span> Toca Compartir (⎋) y
                elige <span className="font-semibold text-primary">"Agregar al inicio"</span>.
              </p>
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
