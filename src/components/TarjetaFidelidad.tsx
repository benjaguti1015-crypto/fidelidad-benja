import { CodigoQR, codigoQrDeInstagram } from "@/components/CodigoQR";

const META = 8;
const LINK_INSTAGRAM = "https://www.instagram.com/dulces.delreypirata/";

export function TarjetaFidelidad({
  nombre,
  sellos,
  instagram,
}: {
  nombre: string;
  sellos: number;
  instagram?: string | null;
}) {
  const activos = Math.max(0, Math.min(META, sellos));

  return (
    <article className="w-full max-w-sm rounded-3xl border border-primary/30 bg-card p-5 shadow-card">
      <header className="flex items-center gap-3">
        <img
          src="/logo.jpg"
          alt="Logo Dulces del Rey Pirata"
          className="h-12 w-12 rounded-full border border-primary/20 bg-cream object-contain p-0.5"
        />
        <h1 className="text-lg font-bold leading-tight text-primary">Dulces del Rey Pirata</h1>
      </header>

      <div className="mt-5 grid grid-cols-4 gap-2">
        {Array.from({ length: META }).map((_, i) => {
          const numero = i + 1;
          const activo = i < activos;

          return (
            <div
              key={i}
              aria-label={activo ? `Sello ${numero} marcado` : `Sello ${numero} pendiente`}
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-extrabold ${
                activo
                  ? "animate-fade-in border-yellow-200 bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 text-amber-950 shadow-[0_4px_12px_rgba(217,119,6,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)]"
                  : "border-primary/30 bg-cream text-primary/30"
              }`}
            >
              {activo ? "🪙" : numero}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-primary">
        {activos === META
          ? "¡Tesoro completo! Reclama tu premio 🎉"
          : `${activos} de ${META} sellos`}
      </p>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs">
          <span className="font-bold text-amber-800">⚓ Sello 4:</span>
          <span className="text-right font-semibold text-primary">
            50% OFF en próxima compra{" "}
            <span className="block text-[10px] font-medium text-muted-foreground">
              (tope $10.000)
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-gold bg-gold/20 px-3 py-2 text-xs">
          <span className="font-bold text-primary">👑 Sello 8:</span>
          <span className="text-right font-semibold text-primary">¡2 Galletas Premium Gratis!</span>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Nombre
          </p>
          <p className="break-words text-base font-bold leading-tight text-primary">{nombre}</p>
          {instagram && (
            <p className="mt-1 text-[11px] text-muted-foreground">Muestra este QR para tu sello</p>
          )}
        </div>
        {instagram && <CodigoQR valor={codigoQrDeInstagram(instagram)} size={112} />}
      </div>

      <p className="mt-4 text-center text-[11px] leading-snug text-muted-foreground">
        Sigue a{" "}
        <a
          href={LINK_INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline"
        >
          @dulces.delreypirata
        </a>{" "}
        para validar tus sellos ·{" "}
        <a
          href={LINK_INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline"
        >
          Pedir galletas
        </a>
      </p>
    </article>
  );
}
