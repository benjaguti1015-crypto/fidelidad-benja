import { useState } from "react";
import { CodigoQR, codigoQrDeInstagram } from "@/components/CodigoQR";

const META = 8;

export function TarjetaFidelidad({
  nombre,
  sellos,
  instagram,
}: {
  nombre: string;
  sellos: number;
  instagram?: string | null;
}) {
  const [mensajeCopiado, setMensajeCopiado] = useState(false);

  const activos = Math.max(0, Math.min(META, sellos));
  const restantes = META - activos;
  const porcentaje = Math.min((activos / META) * 100, 100);
  const linkInstagram = "https://www.instagram.com/dulces.delreypirata/";

  // Lógica para compartir o copiar el enlace de referido
  const handleCompartirReferido = () => {
    const usuarioRef = instagram ? instagram.replace(/^@/, "") : nombre.toLowerCase().replace(/\s+/g, "");
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://dulcesdelreypirata.com";
    const urlReferido = `${baseUrl}/registro?ref=${encodeURIComponent(usuarioRef)}`;

    const textoMensaje = `🏴‍☠️ ¡Únete a la tripulación de Dulces del Rey Pirata! Usa mi enlace para registrarte, sigue la cuenta oficial de Instagram y ganaremos un sello gratis: ${urlReferido}`;

    if (navigator.share) {
      navigator.share({
        title: "Dulces del Rey Pirata 🏴‍☠️",
        text: textoMensaje,
        url: urlReferido,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(textoMensaje);
      setMensajeCopiado(true);
      setTimeout(() => setMensajeCopiado(false), 3000);
    }
  };

  return (
    <article className="w-full max-w-sm rounded-3xl border-2 border-primary/70 bg-card p-5 shadow-card flex flex-col items-center relative">

      {/* 1. CABECERA CON LOGO */}
      <header className="flex flex-col items-center text-center">
        <img
          src="/logo.jpg"
          alt="Logo Dulces del Rey Pirata"
          className="h-20 w-20 object-contain rounded-full border-2 border-primary/20 bg-cream p-1 shadow-sm"
        />
        <h1 className="mt-2 text-lg font-bold leading-tight text-primary">
          Dulces del Rey Pirata
        </h1>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Tarjeta de fidelidad
        </p>
      </header>

      {/* 2. AVISO INSTAGRAM */}
      <div className="mt-3 w-full rounded-2xl border-2 border-gold bg-gold/15 px-3 py-2.5 text-center">
        <p className="text-[12px] font-extrabold uppercase leading-snug tracking-wide text-primary">
          Recuerda: para hacer válidos tus sellos debes seguir nuestro Instagram
        </p>
        <a
          href={linkInstagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-full bg-primary px-4 py-1.5 text-[12px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Seguir @dulces.delreypirata
        </a>
      </div>

      {/* 3. NOMBRE DEL PIRATA */}
      <p className="mt-3 w-full rounded-xl border border-dashed border-primary/50 bg-secondary/50 px-4 py-2 text-center text-base font-semibold text-primary">
        Pirata: <span className="font-bold">{nombre}</span>
      </p>

      {/* 4. CÓDIGO QR DE INSTAGRAM — arriba para que se vea sin hacer scroll */}
      {instagram && (
        <div className="mt-3 flex flex-col items-center w-full">
          <CodigoQR valor={codigoQrDeInstagram(instagram)} />
          <p className="mt-1.5 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Muestra este QR para tu sello
          </p>
          <p className="text-[11px] font-semibold text-primary">
            @{instagram.replace(/^@/, "")}
          </p>
        </div>
      )}

      {/* 5. BARRA DE PROGRESO VISUAL ("EL CAMINO DEL TESORO") */}
      <div className="mt-4 w-full space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-bold text-primary px-1">
          <span>🏴‍☠️ Camino del Tesoro</span>
          <span>{activos} de {META} sellos ({porcentaje.toFixed(0)}%)</span>
        </div>
        <div className="w-full bg-cream/80 rounded-full h-3.5 border border-primary/30 overflow-hidden shadow-inner p-0.5">
          <div
            className="bg-gradient-to-r from-amber-500 via-amber-400 to-caramel h-full rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      {/* 6. CUADRÍCULA DE SELLOS CON EFECTO "MONEDA DE ORO" */}
      <div className="mt-4 grid grid-cols-4 gap-2 w-full">
        {Array.from({ length: META }).map((_, i) => {
          const numero = i + 1;
          const activo = i < activos;

          return (
            <div key={i} className="flex flex-col items-center">
              <div
                aria-label={activo ? `Sello ${numero} marcado` : `Sello ${numero} pendiente`}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-base border-2 transition-transform ${
                  activo
                    ? "bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 text-amber-950 border-yellow-200 shadow-[0_4px_12px_rgba(217,119,6,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)] scale-105 animate-fade-in"
                    : "bg-cream text-primary/30 border-primary/30"
                }`}
              >
                {activo ? "🪙" : numero}
              </div>
            </div>
          );
        })}
      </div>

      {/* 7. ETIQUETAS DE PREMIOS INTEGRADAS Y LIMPIAS */}
      <div className="mt-4 w-full space-y-2">
        <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-2 text-xs">
          <span className="font-bold text-amber-800">⚓ Sello 4:</span>
          <span className="font-semibold text-primary text-right">
            50% OFF en próxima compra <span className="block text-[10px] font-medium text-muted-foreground">(tope $10.000)</span>
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-gold/20 border border-gold px-3 py-2 text-xs">
          <span className="font-bold text-primary">👑 Sello 8 (Meta):</span>
          <span className="font-semibold text-primary text-right">¡2 Galletas Premium Gratis!</span>
        </div>
      </div>

      {/* 8. MÓDULO DE REFERIDOS ("TRAE A UN PIRATA") */}
      <div className="mt-4 w-full rounded-2xl border-2 border-dashed border-amber-500/60 bg-amber-500/5 p-3 text-center">
        <p className="text-xs font-bold text-primary flex items-center justify-center gap-1">
          <span>🎁</span> ¡Invita a un Pirata a la Tripulación!
        </p>
        <p className="mt-1 text-[10px] text-muted-foreground leading-tight">
          Comparte tu enlace. Si tu amigo se registra y <strong className="text-primary font-bold">sigue a @dulces.delreypirata</strong> en Instagram, ¡ambos ganan 1 sello de regalo!
        </p>
        <button
          type="button"
          onClick={handleCompartirReferido}
          className="mt-2.5 w-full rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 py-2 px-3 text-xs font-extrabold text-amber-900 transition-colors flex items-center justify-center gap-1.5"
        >
          <span>{mensajeCopiado ? "✅" : "🔗"}</span>
          <span>{mensajeCopiado ? "¡Enlace de invitación copiado!" : "Invitar y ganar sello gratis"}</span>
        </button>
      </div>

      {/* 9. BOTÓN DE S.O.S. PEDIR GALLETAS DIRECTO A DM */}
      <a
        href={linkInstagram}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-caramel px-4 py-3 text-center font-extrabold text-primary shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] border-2 border-primary/40 animate-pulse"
      >
        <span className="text-xl">🍪</span>
        <span>🚨 S.O.S. ¡Pedir galletas ahora!</span>
      </a>

      {/* 10. ESTADO DEL TESORO */}
      <footer className="mt-4 text-center text-sm text-muted-foreground">
        {restantes === 0 ? (
          <span className="font-bold text-primary">
            ¡Tesoro completo! Reclama tu premio 🎉
          </span>
        ) : (
          <span>
            {activos} de {META} sellos · te faltan {restantes}
          </span>
        )}
      </footer>
    </article>
  );
}