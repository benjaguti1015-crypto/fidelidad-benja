import { useRef, useState } from "react";
import { fechaCumpleanos } from "@/lib/fecha";

export type EstadoCumple = "vacio" | "valida" | "invalida";

const campo =
  "w-full rounded-xl border border-primary/30 bg-cream px-3 py-2.5 text-center text-base text-primary outline-none transition-colors focus:border-primary";

// Día, mes y año por separado. Entrega "dd/mm/aaaa" cuando la fecha es válida.
export function CampoCumpleanos({
  onChange,
}: {
  onChange: (fecha: string | null, estado: EstadoCumple) => void;
}) {
  const [f, setF] = useState({ dia: "", mes: "", anio: "" });
  const [invalida, setInvalida] = useState(false);
  const mesRef = useRef<HTMLInputElement>(null);
  const anioRef = useRef<HTMLInputElement>(null);

  function cambiar(parte: "dia" | "mes" | "anio", valor: string) {
    const largo = parte === "anio" ? 4 : 2;
    const nuevo = { ...f, [parte]: valor.replace(/\D/g, "").slice(0, largo) };
    setF(nuevo);

    const fecha = fechaCumpleanos(nuevo.dia, nuevo.mes, nuevo.anio);
    const vacio = !nuevo.dia && !nuevo.mes && !nuevo.anio;
    // Solo marcamos error cuando ya escribió el año completo.
    setInvalida(!fecha && nuevo.anio.length === 4);
    onChange(fecha, vacio ? "vacio" : fecha ? "valida" : "invalida");

    if (parte === "dia" && nuevo.dia.length === 2) mesRef.current?.focus();
    if (parte === "mes" && nuevo.mes.length === 2) anioRef.current?.focus();
  }

  return (
    <div role="group" aria-label="Fecha de cumpleaños">
      <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2">
        <input
          aria-label="Día"
          inputMode="numeric"
          autoComplete="bday-day"
          placeholder="DD"
          value={f.dia}
          onChange={(e) => cambiar("dia", e.target.value)}
          className={campo}
        />
        <input
          ref={mesRef}
          aria-label="Mes"
          inputMode="numeric"
          autoComplete="bday-month"
          placeholder="MM"
          value={f.mes}
          onChange={(e) => cambiar("mes", e.target.value)}
          className={campo}
        />
        <input
          ref={anioRef}
          aria-label="Año"
          inputMode="numeric"
          autoComplete="bday-year"
          placeholder="AAAA"
          value={f.anio}
          onChange={(e) => cambiar("anio", e.target.value)}
          className={campo}
        />
      </div>
      {invalida && (
        <p className="mt-1 text-xs text-destructive">
          Revisa la fecha: escribe un día, mes y año que existan.
        </p>
      )}
    </div>
  );
}
