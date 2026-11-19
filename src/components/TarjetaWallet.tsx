import { MARCA, PROGRAMAS } from "@/lib/marca";

const { meta: META_C, premios: PREMIOS_C } = PROGRAMAS.concepcion;

// Tarjeta del programa Concepción: replica el pase de Google Wallet.
// Sin QR en la web (el QR solo vive en Google Wallet); los sellos los suma el admin.
export function TarjetaWallet({
  nombre,
  sellos,
  premio10Canjeado = false,
}: {
  nombre: string;
  sellos: number;
  premio10Canjeado?: boolean;
}) {
  const activos = Math.max(0, Math.min(META_C, sellos));

  return (
    <article
      aria-label={`Tarjeta de fidelidad de ${nombre}`}
      className="w-full max-w-sm overflow-hidden rounded-3xl border border-primary/30 bg-background shadow-card"
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

      {/* Sellos minimalistas: punto lleno = ganado, anillo dorado = premio */}
      <div
        role="img"
        aria-label={`${activos} de ${META_C} sellos`}
        className="mx-5 mt-5 flex justify-between border-t border-primary/15 pt-5"
      >
        {Array.from({ length: META_C }).map((_, i) => (
          <span
            key={i}
            className={`h-4 w-4 rounded-full ${i < activos ? "bg-caramel" : "bg-cream"} ${
              i + 1 in PREMIOS_C ? "ring-2 ring-gold ring-offset-2 ring-offset-background" : ""
            }`}
          />
        ))}
      </div>

      <ul className="space-y-1 px-5 pb-6 pt-5 text-xs text-muted-foreground">
        {Object.entries(PREMIOS_C).map(([sello, premio]) => (
          <li key={sello}>
            <b className="text-primary">Sello {sello}:</b> {premio}
            {sello === "10" && premio10Canjeado && (
              <span className="font-semibold text-primary"> · canjeado ✓</span>
            )}
          </li>
        ))}
      </ul>
    </article>
  );
}
