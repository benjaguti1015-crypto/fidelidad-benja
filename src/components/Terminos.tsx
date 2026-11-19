import type { Programa } from "@/lib/marca";

export function Terminos({
  className = "",
  programa = "universidad",
}: {
  className?: string;
  programa?: Programa;
}) {
  return (
    <details
      className={`rounded-2xl border border-primary/30 bg-secondary/40 px-4 py-3 text-left ${className}`}
      aria-label="Términos y condiciones"
    >
      <summary className="cursor-pointer text-center text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
        Términos y condiciones
      </summary>
      {programa === "concepcion" ? <TerminosConcepcion /> : <TerminosUniversidad />}
    </details>
  );
}

function TerminosConcepcion() {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[11px] leading-relaxed text-muted-foreground">
      <li>Tu tarjeta tiene 12 sellos y parte con 2 sellos de regalo.</li>
      <li>Máximo 1 sello por día por cliente.</li>
      <li>
        Sello 10: 50% de descuento en tu próxima compra, con un tope máximo de descuento de $15.000.
      </li>
      <li>
        Sello 12: una caja de 4 galletas a elección. Al canjearla, tu tarjeta vuelve a 0 sellos.
      </li>
      <li>
        Tu correo se usa para identificar tu tarjeta y ayudarte a recuperarla. Solo te enviaremos
        promociones (por correo o Google Wallet) si marcas la casilla «Deseo recibir notificaciones
        y promociones». Puedes darte de baja cuando quieras.
      </li>
      <li>
        Más detalles en la{" "}
        <a href="/privacidad" className="font-semibold text-primary underline">
          política de privacidad
        </a>
        .
      </li>
    </ul>
  );
}

function TerminosUniversidad() {
  return (
    <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[11px] leading-relaxed text-muted-foreground">
      <li>Máximo 1 sello por día por cliente.</li>
      <li>
        Cada sello requiere una compra mínima de $2.000 (equivalente a 2 galletas clásicas o 1
        premium).
      </li>
      <li>
        Para validar tus sellos y premios es obligatorio seguir a{" "}
        <a
          href="https://www.instagram.com/dulces.delreypirata"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-primary underline"
        >
          @dulces.delreypirata
        </a>{" "}
        en Instagram.
      </li>
      <li>
        Premios oficiales: 50% de descuento en tu próxima compra al completar el 4° sello (con un
        tope máximo de descuento de $10.000), y 2 galletas premium gratis (Nutella o Red Velvet) al
        completar el 8° sello.
      </li>
      <li>Los premios se canjean en la próxima compra y están sujetos al stock del día.</li>
    </ul>
  );
}
