// Devuelve "dd/mm/aaaa" si la fecha existe de verdad y no es futura; si no, null.
export function fechaCumpleanos(dia: string, mes: string, anio: string, hoy = new Date()) {
  if (!/^\d{1,2}$/.test(dia) || !/^\d{1,2}$/.test(mes) || !/^\d{4}$/.test(anio)) return null;
  const d = Number(dia);
  const m = Number(mes);
  const a = Number(anio);
  const fecha = new Date(a, m - 1, d);
  const existe = fecha.getFullYear() === a && fecha.getMonth() === m - 1 && fecha.getDate() === d;
  if (!existe || a < 1900 || fecha > hoy) return null;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${a}`;
}

// Acepta dd/mm/aaaa (formato del registro) y aaaa-mm-dd.
export function esHoyCumpleanos(fecha?: string | null, hoy = new Date()) {
  const m =
    fecha?.match(/^(\d{1,2})\/(\d{1,2})\/\d{4}$/) ?? fecha?.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (!m || !fecha) return false;
  const [dia, mes] = fecha.includes("/") ? [+m[1]!, +m[2]!] : [+m[2]!, +m[1]!];
  return dia === hoy.getDate() && mes === hoy.getMonth() + 1;
}
