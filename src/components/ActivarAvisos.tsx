import { useEffect, useState } from "react";
import {
  avisosConfigurados,
  avisosDisponibles,
  guardarSuscripcion,
  pedirSuscripcion,
} from "@/lib/avisos";

type Estado = "oculto" | "listo" | "activo" | "bloqueado" | "guardando" | "error" | "ios";

export function ActivarAvisos({
  enlace,
  ios,
  instalada,
}: {
  enlace: string;
  ios: boolean;
  instalada: boolean;
}) {
  const [estado, setEstado] = useState<Estado>("oculto");

  useEffect(() => {
    if (!avisosConfigurados()) return;
    if (!avisosDisponibles()) {
      // iPhone solo permite avisos con la tarjeta guardada en el inicio.
      setEstado(ios && !instalada ? "ios" : "oculto");
      return;
    }
    if (Notification.permission === "denied") return setEstado("bloqueado");
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setEstado(sub ? "activo" : "listo"))
      .catch(() => setEstado("oculto"));
  }, [ios, instalada]);

  async function activar() {
    setEstado("guardando");
    try {
      const sub = await pedirSuscripcion();
      if (sub === "denegado") return setEstado("bloqueado");
      if (!sub) return setEstado("oculto");
      setEstado((await guardarSuscripcion(enlace, sub)) ? "activo" : "error");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "oculto") return null;
  if (estado === "activo")
    return <p className="text-xs text-muted-foreground">🔔 Avisos activados</p>;
  if (estado === "bloqueado")
    return (
      <p className="text-center text-xs text-muted-foreground">
        Bloqueaste los avisos. Puedes activarlos en los permisos del navegador.
      </p>
    );
  if (estado === "ios")
    return (
      <p className="text-center text-xs text-muted-foreground">
        🔔 En iPhone, guarda la tarjeta en tu inicio para activar avisos.
      </p>
    );

  return (
    <div className="text-center">
      <button
        type="button"
        onClick={activar}
        disabled={estado === "guardando"}
        className="text-sm font-semibold text-primary underline transition-transform active:scale-[0.97] disabled:opacity-60"
      >
        {estado === "guardando"
          ? "Activando…"
          : localStorage.getItem("avisos_aceptados")
            ? "🔔 Activa los avisos que aceptaste"
            : "🔔 Activar avisos de promos"}
      </button>
      {estado === "error" && (
        <p className="mt-1 text-xs text-destructive">No pudimos activarlos. Inténtalo de nuevo.</p>
      )}
    </div>
  );
}
