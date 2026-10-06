export function Terminos({ className = "" }: { className?: string }) {
  return (
    <section
      className={`rounded-2xl border-2 border-dashed border-primary/40 bg-secondary/40 px-4 py-3 text-left ${className}`}
      aria-label="Términos y condiciones"
    >
      <h2 className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
        Términos y condiciones
      </h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-4 text-[11px] leading-relaxed text-muted-foreground">
        <li>Máximo 1 sello por día por cliente.</li>
        <li>
          Cada sello requiere una compra mínima de $2.000 (equivalente a 2 galletas clásicas o
          1 premium).
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
          Premios oficiales: 50% de descuento en tu próxima compra al completar el 4° sello (con
          un tope máximo de descuento de $10.000), y 2 galletas premium gratis (Nutella o Red
          Velvet) al completar el 8° sello.
        </li>
        <li>Los premios se canjean en la próxima compra y están sujetos al stock del día.</li>
      </ul>
    </section>
  );
}