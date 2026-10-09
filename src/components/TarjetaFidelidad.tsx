import { CodigoQR, codigoQrDeInstagram } from "@/components/CodigoQR";

const META = 8;
const LINK_INSTAGRAM = "https://www.instagram.com/dulces.delreypirata/";

function Tesoro() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden
    >
      <path d="M4 11V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3" />
      <rect x="3" y="11" width="18" height="9" rx="1.5" />
      <path d="M3 14.5h18" />
      <rect x="10.5" y="12.5" width="3" height="3.5" rx="0.5" fill="currentColor" />
    </svg>
  );
}

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
          const premio = numero === 4 || numero === 8;

          return (
            <div
              key={i}
              aria-label={`Sello ${numero} ${activo ? "marcado" : "pendiente"}${premio ? " (premio)" : ""}`}
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-extrabold ${
                activo
                  ? "animate-fade-in border-yellow-200 bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 text-amber-950 shadow-[0_4px_12px_rgba(217,119,6,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)]"
                  : premio
                    ? "border-amber-500/70 bg-amber-500/10 text-amber-700"
                    : "border-primary/30 bg-cream text-primary/30"
              }`}
            >
              {premio ? <Tesoro /> : activo ? "🪙" : numero}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-primary">
        {activos === META
          ? "¡Tesoro completo! Reclama tu premio 🎉"
          : `${activos} de ${META} sellos`}
      </p>

      <ul className="mt-3 space-y-0.5 text-center text-xs text-muted-foreground">
        <li>
          <b className="text-primary">Sello 4:</b> 50% off en tu próxima compra (tope $10.000)
        </li>
        <li>
          <b className="text-primary">Sello 8:</b> 2 galletas premium gratis
        </li>
      </ul>

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
