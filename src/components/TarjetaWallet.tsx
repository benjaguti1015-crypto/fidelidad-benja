import { CodigoQR, codigoQrDeEnlace } from "@/components/CodigoQR";
import { Tesoro } from "@/components/TarjetaFidelidad";
import { LINK_INSTAGRAM, MARCA, PROGRAMAS } from "@/lib/marca";

const { meta: META_C, premios: PREMIOS_C } = PROGRAMAS.concepcion;

// Tarjeta del programa Concepción: el pase replica el diseño de Google Wallet
// (mismo fondo, logo, "Sellos N de 12", nombre y QR), y debajo van los sellos y premios.
export function TarjetaWallet({
  nombre,
  sellos,
  enlace,
  premio10Canjeado = false,
}: {
  nombre: string;
  sellos: number;
  enlace: string;
  premio10Canjeado?: boolean;
}) {
  const activos = Math.max(0, Math.min(META_C, sellos));
  const siguiente = Object.keys(PREMIOS_C)
    .map(Number)
    .find((n) => n > activos);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {/* Pase (igual al de Google Wallet) */}
      <article
        aria-label={`Tarjeta de fidelidad de ${nombre}`}
        className="w-full overflow-hidden rounded-3xl border border-primary/30 bg-background shadow-card"
      >
        <header className="flex items-center gap-3 px-5 pt-5">
          <img
            src="/icon-512.png"
            alt={`Logo ${MARCA}`}
            className="h-10 w-10 rounded-full bg-cream object-cover"
          />
          <p className="text-sm font-semibold text-primary">{MARCA}</p>
        </header>

        <h1 className="px-5 pt-4 text-2xl leading-tight text-primary">Tarjeta de fidelidad</h1>

        <div className="grid grid-cols-2 gap-3 px-5 pt-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Sellos
            </p>
            <p className="text-xl font-bold text-primary">
              {activos} de {META_C}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Nombre
            </p>
            <p className="break-words text-base font-bold leading-tight text-primary">{nombre}</p>
          </div>
        </div>

        <div className="flex flex-col items-center px-5 pb-6 pt-6">
          <CodigoQR valor={codigoQrDeEnlace(enlace)} size={168} />
          <p className="mt-2 text-[11px] text-muted-foreground">Muestra este QR para tu sello</p>
        </div>
      </article>

      {/* Sellos y premios */}
      <section className="w-full rounded-3xl border border-primary/30 bg-card p-5 shadow-card">
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: META_C }).map((_, i) => {
            const numero = i + 1;
            const activo = i < activos;
            const premio = numero in PREMIOS_C;
            return (
              <div
                key={i}
                aria-label={`Sello ${numero} ${activo ? "marcado" : "pendiente"}${premio ? " (premio)" : ""}`}
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full border text-sm font-extrabold ${
                  activo
                    ? "animate-fade-in border-yellow-200 bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 text-amber-950 shadow-[0_3px_10px_rgba(217,119,6,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)]"
                    : premio
                      ? "border-amber-500/70 bg-amber-500/10 text-amber-400"
                      : "border-primary/30 bg-cream text-primary/40"
                }`}
              >
                {premio ? <Tesoro /> : activo ? "🪙" : numero}
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-center text-sm font-semibold text-primary">
          {activos === META_C
            ? "¡Tesoro completo! Reclama tu caja de galletas"
            : siguiente
              ? `Te faltan ${siguiente - activos} para tu próximo premio`
              : `${activos} de ${META_C} sellos`}
        </p>

        <ul className="mt-3 space-y-0.5 text-center text-xs text-muted-foreground">
          {Object.entries(PREMIOS_C).map(([sello, premio]) => (
            <li key={sello}>
              <b className="text-primary">Sello {sello}:</b> {premio}
              {sello === "10" && premio10Canjeado && (
                <span className="font-semibold text-primary"> · canjeado ✓</span>
              )}
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-[11px] leading-snug text-muted-foreground">
          <a
            href={LINK_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline"
          >
            Pedir galletas
          </a>
        </p>
      </section>
    </div>
  );
}
