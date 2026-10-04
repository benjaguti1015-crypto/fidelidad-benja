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
  const activos = Math.max(0, Math.min(META, sellos));
  const restantes = META - activos;

  return (
    <article className="w-full max-w-sm rounded-3xl border-2 border-primary/70 bg-card p-6 shadow-card">
      <header className="flex flex-col items-center text-center">
        <img
          src="/logo.jpg"
          alt="Logo Dulces del Rey Pirata"
          className="h-24 w-24 object-contain"
        />
        <h1 className="mt-3 text-xl leading-tight text-primary">Dulces del Rey Pirata</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Tarjeta de fidelidad
        </p>
      </header>

      <div className="mt-5 rounded-2xl border-2 border-gold bg-gold/15 px-4 py-3 text-center">
        <p className="text-[12px] font-extrabold uppercase leading-snug tracking-wide text-primary">
          Recuerda: para hacer válidos tus sellos debes seguir nuestro Instagram
        </p>
        <a
          href="https://www.instagram.com/dulces.delreypirata"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-full bg-primary px-4 py-1.5 text-[12px] font-bold text-primary-foreground"
        >
          Seguir @dulces.delreypirata
        </a>
      </div>

      <p className="mt-4 rounded-xl border border-dashed border-primary/50 bg-secondary/50 px-4 py-3 text-center text-base font-semibold text-primary">
        Pirata: {nombre}
      </p>

      <div className="mt-6 grid grid-cols-4 gap-3 mb-10">
        {Array.from({ length: META }).map((_, i) => {
          const activo = i < activos;
          const esMitad = i === 3;
          const esPremioMayor = i === 7;
          const circulo = (
            <div
              aria-label={activo ? `Sello ${i + 1} marcado` : `Sello ${i + 1} pendiente`}
              className={[
                "flex aspect-square items-center justify-center rounded-full border-2 text-lg font-bold transition-colors",
                esPremioMayor
                  ? activo
                    ? "border-gold bg-gold text-gold-foreground shadow-[0_0_0_3px_oklch(0.78_0.12_85_/_0.35)]"
                    : "border-gold bg-cream text-gold-foreground"
                  : activo
                    ? "border-primary bg-caramel text-primary"
                    : "border-primary bg-cream text-primary/25",
              ].join(" ")}
            >
              {activo ? "★" : i + 1}
            </div>
          );

          if (!esMitad && !esPremioMayor) return <div key={i}>{circulo}</div>;

          return (
            <div key={i} className="relative">
              {circulo}
              {esMitad && (
                <span className="absolute -right-14 top-1/2 z-10 w-16 -translate-y-1/2 rotate-3 rounded-lg border-2 border-primary/40 bg-caramel px-1.5 py-1 text-center text-[9px] font-extrabold uppercase leading-tight text-primary shadow-md sm:-right-16 sm:w-[4.5rem] sm:text-[10px]">
                  50% OFF
                  <span className="block font-bold lowercase">próxima compra</span>
                </span>
              )}
              {esPremioMayor && (
                <span className="absolute -bottom-7 left-1/2 z-10 w-[5.5rem] -translate-x-1/2 rounded-lg border-2 border-gold bg-gold px-1 py-1 text-center text-[8px] font-extrabold uppercase leading-tight text-gold-foreground shadow-md sm:w-28 sm:text-[9px]">
                  ¡2 Galletas Premium Gratis!
                  <span className="block font-bold normal-case">Nutella / Red Velvet</span>
                </span>
              )}
            </div>
          );
        })}
      </div>

      {instagram && (
        <div className="mt-6 flex flex-col items-center">
          <CodigoQR valor={codigoQrDeInstagram(instagram)} />
          <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Muestra este QR para tu sello
          </p>
          <p className="text-[11px] font-semibold text-primary">
            @{instagram.replace(/^@/, "")}
          </p>
        </div>
      )}

      <footer className="mt-6 text-center text-sm text-muted-foreground">
        {restantes === 0 ? (
          <span className="font-semibold text-primary">
            ¡Tesoro completo! Reclama tu premio.
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
