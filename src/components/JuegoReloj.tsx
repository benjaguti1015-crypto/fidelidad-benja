import { useCallback, useEffect, useRef, useState } from "react";

// ---- Ajustes editables ----
const META_CS = 1000; // 10.00 s en centésimas
const CIEGO_DESDE_MS = 3000; // a los 3.00 s se ocultan los números
const MAX_RANKING = 5;
const MAX_APODO = 12;
const CLAVE_RANKING = "reloj10-ranking";
// Modo video (para grabar): entrar una vez a /reloj?video deja el resultado siempre en 10.00.
// La dirección vuelve a verse como /reloj y el modo dura mientras la pestaña siga abierta.
// Para apagarlo: cerrar la pestaña o entrar a /reloj?normal.
const PARAMETRO_VIDEO = "video";
const PARAMETRO_NORMAL = "normal";
const CLAVE_VIDEO = "reloj10-video";

function leerModoVideo(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has(PARAMETRO_VIDEO)) sessionStorage.setItem(CLAVE_VIDEO, "1");
    if (params.has(PARAMETRO_NORMAL)) sessionStorage.removeItem(CLAVE_VIDEO);
    if (params.has(PARAMETRO_VIDEO) || params.has(PARAMETRO_NORMAL)) {
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }
    return sessionStorage.getItem(CLAVE_VIDEO) === "1";
  } catch {
    return false;
  }
}

// Frases según la diferencia (en segundos). Se usa la primera cuyo "hasta" sea mayor a la diferencia.
const FRASES: { hasta: number; texto: string }[] = [
  { hasta: 0.1, texto: "¡Casi! Te quedaste muy cerca" },
  { hasta: 0.5, texto: "¡Te quedaste cerca!" },
  { hasta: 1.5, texto: "¡Fallaste! Pero estuviste cerca" },
  { hasta: Infinity, texto: "¡Fallaste! Inténtalo de nuevo" },
];

// Paleta de la sección (solo aquí, no toca estilos globales).
const C = {
  crema: "#FFF8EE",
  cremaOscura: "#F6E9D7",
  durazno: "#F4A97F",
  duraznoOscuro: "#E58A5C",
  salvia: "#A9C2A0",
  salviaOscura: "#7E9E74",
  cafe: "#4A2E1F",
};

type Fase = "inicio" | "corriendo" | "resultado";
type Intento = { apodo: string; cs: number; fecha: number };

const formato = (cs: number) => {
  const s = Math.floor(cs / 100);
  const c = cs % 100;
  return `${String(s).padStart(2, "0")}.${String(c).padStart(2, "0")}`;
};
const diferencia = (cs: number) => Math.abs(cs - META_CS);
const fraseDe = (difSeg: number) =>
  (FRASES.find((f) => difSeg < f.hasta) ?? FRASES[FRASES.length - 1]).texto;

function leerRanking(): Intento[] {
  try {
    const raw = localStorage.getItem(CLAVE_RANKING);
    const datos = raw ? (JSON.parse(raw) as Intento[]) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function guardarRanking(lista: Intento[]) {
  try {
    localStorage.setItem(CLAVE_RANKING, JSON.stringify(lista));
  } catch {
    // sin almacenamiento disponible: el ranking queda solo en memoria
  }
}

const COLORES_CONFETI = [C.durazno, C.salvia, "#F7D488", "#F2B8C6", C.duraznoOscuro];
const CONFETI = Array.from({ length: 40 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: ((i * 13) % 20) / 10,
  dur: 2.4 + ((i * 7) % 10) / 10,
  color: COLORES_CONFETI[i % COLORES_CONFETI.length],
  size: 8 + ((i * 5) % 8),
  redondo: i % 3 === 0,
}));

export function JuegoReloj() {
  const [fase, setFase] = useState<Fase>("inicio");
  const [msVisible, setMsVisible] = useState(0);
  const [ciego, setCiego] = useState(false);
  const [resultadoCs, setResultadoCs] = useState(0);
  const [ranking, setRanking] = useState<Intento[]>([]);
  const [apodo, setApodo] = useState("");
  const [guardado, setGuardado] = useState(false);

  const faseRef = useRef<Fase>("inicio");
  const inicioRef = useRef(0);
  const finRef = useRef(0);
  const rafRef = useRef(0);
  const modoVideoRef = useRef(false);

  useEffect(() => {
    setRanking(leerRanking());
    modoVideoRef.current = leerModoVideo();
  }, []);

  const cambiarFase = (f: Fase) => {
    faseRef.current = f;
    setFase(f);
  };

  const tick = useCallback(() => {
    if (faseRef.current !== "corriendo") return;
    const ms = performance.now() - inicioRef.current;
    if (ms >= CIEGO_DESDE_MS) {
      setCiego(true);
      return; // ya no hace falta seguir dibujando números
    }
    setMsVisible(ms);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const empezar = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setMsVisible(0);
    setCiego(false);
    setApodo("");
    setGuardado(false);
    inicioRef.current = performance.now();
    cambiarFase("corriendo");
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const parar = useCallback(() => {
    if (faseRef.current !== "corriendo") return;
    const ms = performance.now() - inicioRef.current;
    cancelAnimationFrame(rafRef.current);
    finRef.current = performance.now();
    setResultadoCs(modoVideoRef.current ? META_CS : Math.floor(ms / 10));
    cambiarFase("resultado");
  }, []);

  const jugarDeNuevo = () => {
    // evita reinicios accidentales justo después de parar
    if (performance.now() - finRef.current < 400) return;
    empezar();
  };

  // Barra espaciadora = PARAR
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || faseRef.current !== "corriendo") return;
      e.preventDefault();
      parar();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [parar]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const guardar = () => {
    if (guardado) return;
    const nuevo: Intento = {
      apodo: apodo.trim().slice(0, MAX_APODO) || "Anónimo",
      cs: resultadoCs,
      fecha: Date.now(),
    };
    const lista = [...leerRanking(), nuevo]
      .sort((a, b) => diferencia(a.cs) - diferencia(b.cs) || a.fecha - b.fecha)
      .slice(0, MAX_RANKING);
    guardarRanking(lista);
    setRanking(lista);
    setGuardado(true);
  };

  const reiniciarRanking = () => {
    if (!window.confirm("¿Seguro que quieres borrar el ranking del día?")) return;
    guardarRanking([]);
    setRanking([]);
  };

  const gano = fase === "resultado" && resultadoCs === META_CS;
  const difSeg = diferencia(resultadoCs) / 100;

  const btnBase =
    "rounded-3xl font-bold shadow-[0_8px_0_rgba(74,46,31,0.25)] transition-all duration-100 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-1.5 active:shadow-[0_2px_0_rgba(74,46,31,0.25)] focus-visible:outline-4 focus-visible:outline-offset-4";

  return (
    <main
      className="relative min-h-screen overflow-hidden px-4 py-6 md:px-8 md:py-10"
      style={{ backgroundColor: C.crema, color: C.cafe, fontFamily: "var(--font-body)" }}
    >
      <style>{`
        @keyframes rj-caer {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.9; }
        }
        @keyframes rj-pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes rj-latido {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .rj-pop { animation: rj-pop 0.5s ease-out both; }
        .rj-latido { animation: rj-latido 1.2s ease-in-out infinite; }
      `}</style>

      {gano && (
        <div className="pointer-events-none fixed inset-0 z-10" aria-hidden>
          {CONFETI.map((p, i) => (
            <span
              key={i}
              className="absolute top-0 block"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.redondo ? p.size : p.size * 1.6,
                backgroundColor: p.color,
                borderRadius: p.redondo ? "9999px" : "2px",
                animation: `rj-caer ${p.dur}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_340px] lg:gap-10">
        {/* ---- Juego ---- */}
        <section
          className="relative z-20 flex min-h-[70vh] flex-col items-center justify-center rounded-[2rem] px-4 py-8 text-center md:px-10"
          style={{ backgroundColor: C.cremaOscura }}
        >
          <img
            src="/logo.jpg"
            alt="Logo Dulces del Rey Pirata"
            className={`rounded-full border-4 object-cover ${
              fase === "inicio" ? "h-24 w-24 md:h-32 md:w-32" : "h-16 w-16 md:h-20 md:w-20"
            }`}
            style={{ borderColor: C.durazno }}
          />
          <h1
            className={`mt-4 leading-tight ${
              fase === "inicio" ? "text-4xl md:text-6xl" : "text-3xl md:text-4xl"
            }`}
            style={{ color: C.cafe }}
          >
            Para el reloj en 10.00
          </h1>

          {fase === "inicio" && (
            <>
              <p className="mt-4 max-w-xl text-xl md:text-2xl">
                El reloj parte y a los 3 segundos se esconde. Presiona PARAR cuando creas que van
                justo 10.00 segundos.
              </p>
              <button
                onClick={empezar}
                className={`${btnBase} mt-10 w-full max-w-md px-10 py-6 text-4xl md:py-8 md:text-5xl`}
                style={{ backgroundColor: C.durazno, color: C.cafe, outlineColor: C.cafe }}
              >
                EMPEZAR
              </button>
            </>
          )}

          {fase === "corriendo" && (
            <>
              <div className="mt-8 flex min-h-[9rem] items-center justify-center md:min-h-[13rem]">
                {ciego ? (
                  <p className="rj-latido text-5xl font-bold md:text-7xl">¿Ya van 10 segundos?</p>
                ) : (
                  <p className="text-[6rem] leading-none font-bold tabular-nums md:text-[11rem]">
                    {formato(Math.floor(msVisible / 10))}
                  </p>
                )}
              </div>
              <button
                onPointerDown={parar}
                onClick={parar}
                className={`${btnBase} mt-8 w-full max-w-md px-10 py-8 text-5xl md:py-10 md:text-6xl`}
                style={{ backgroundColor: C.salvia, color: C.cafe, outlineColor: C.cafe }}
              >
                PARAR
              </button>
              <p className="mt-4 text-lg opacity-70">También puedes usar la barra espaciadora</p>
            </>
          )}

          {fase === "resultado" && (
            <div className="rj-pop mt-6 flex w-full flex-col items-center">
              {gano ? (
                <>
                  <p className="text-5xl font-bold md:text-7xl" style={{ color: C.duraznoOscuro }}>
                    ¡Lo lograste!
                  </p>
                  <p className="mt-3 text-2xl font-semibold md:text-3xl">
                    ¡Te ganaste una galleta gratis! 🍪
                  </p>
                </>
              ) : (
                <p className="text-4xl font-bold md:text-6xl">{fraseDe(difSeg)}</p>
              )}

              <p className="mt-4 text-[5rem] leading-none font-bold tabular-nums md:text-[8rem]">
                {formato(resultadoCs)}
              </p>
              <p className="mt-2 text-2xl md:text-3xl">
                Diferencia:{" "}
                <span className="font-bold tabular-nums">
                  {resultadoCs > META_CS ? "+" : resultadoCs < META_CS ? "−" : ""}
                  {difSeg.toFixed(2)} s
                </span>
              </p>

              {guardado ? (
                <p className="mt-6 text-xl font-semibold" style={{ color: C.salviaOscura }}>
                  ✓ Guardado en el ranking
                </p>
              ) : (
                <form
                  className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    guardar();
                  }}
                >
                  <input
                    value={apodo}
                    onChange={(e) => setApodo(e.target.value.slice(0, MAX_APODO))}
                    maxLength={MAX_APODO}
                    placeholder="Tu apodo (opcional)"
                    aria-label="Apodo"
                    className="min-w-0 flex-1 rounded-2xl border-2 bg-white px-4 py-3 text-xl outline-none focus:border-[#E58A5C]"
                    style={{ borderColor: C.salvia, color: C.cafe }}
                  />
                  <button
                    type="submit"
                    className="rounded-2xl px-6 py-3 text-xl font-bold transition-all hover:brightness-105 active:scale-95"
                    style={{ backgroundColor: C.salvia, color: C.cafe }}
                  >
                    Guardar
                  </button>
                </form>
              )}

              <button
                onClick={jugarDeNuevo}
                className={`${btnBase} mt-8 w-full max-w-md px-10 py-6 text-3xl md:text-4xl`}
                style={{ backgroundColor: C.durazno, color: C.cafe, outlineColor: C.cafe }}
              >
                Jugar de nuevo
              </button>
            </div>
          )}
        </section>

        {/* ---- Ranking ---- */}
        <aside
          className="relative z-20 flex flex-col rounded-[2rem] border-4 px-6 py-6"
          style={{ borderColor: C.salvia, backgroundColor: "#FFFFFF" }}
        >
          <h2 className="text-3xl md:text-4xl" style={{ color: C.cafe }}>
            Ranking del día
          </h2>
          {ranking.length === 0 ? (
            <p className="mt-4 text-xl opacity-70">Aún no hay intentos. ¡Sé el primero!</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {ranking.map((r, i) => (
                <li
                  key={`${r.fecha}-${i}`}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-2xl"
                  style={{ backgroundColor: i === 0 ? "#FCE3D3" : C.crema }}
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold"
                    style={{ backgroundColor: i === 0 ? C.durazno : C.salvia }}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-semibold">{r.apodo}</span>
                  <span className="text-right leading-tight tabular-nums">
                    <span className="block font-bold">{formato(r.cs)}</span>
                    <span className="block text-base opacity-70">
                      ±{(diferencia(r.cs) / 100).toFixed(2)}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          )}
          <button
            onClick={reiniciarRanking}
            className="mt-auto self-start pt-6 text-sm underline opacity-50 transition-opacity hover:opacity-100"
          >
            Reiniciar ranking
          </button>
        </aside>
      </div>
    </main>
  );
}
