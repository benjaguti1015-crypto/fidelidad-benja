import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { TarjetaFidelidad } from "@/components/TarjetaFidelidad";
import { EscanerQR } from "@/components/EscanerQR";
import logo from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Panel Pirata | Dulces del Rey Pirata" },
      {
        name: "description",
        content:
          "Panel de administración de la tarjeta de fidelidad de Dulces del Rey Pirata: registra clientes y suma sellos.",
      },
      { property: "og:title", content: "Panel Pirata | Dulces del Rey Pirata" },
      {
        property: "og:description",
        content: "Registra clientes y suma sellos a sus tarjetas de fidelidad.",
      },
    ],
  }),
  component: Admin,
});

type Cliente = {
  id: string;
  nombre_completo: string;
  enlace_unico: string;
  instagram: string | null;
  sellos: number;
};

function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCargando(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando…</p>
      </main>
    );
  }

  return session ? <Panel /> : <Login />;
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modo, setModo] = useState<"entrar" | "crear">("entrar");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);
    if (modo === "entrar") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMensaje(error.message);
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setMensaje(error.message);
      else if (!data.session) setMensaje("Revisa tu correo para confirmar la cuenta.");
    }
    setCargando(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <form
        onSubmit={enviar}
        className="w-full max-w-sm rounded-3xl border-2 border-primary/70 bg-card p-6 shadow-card"
      >
        <img src={logo.url} alt="Logo Dulces del Rey Pirata" className="mx-auto h-20 w-20" />
        <h1 className="mt-3 text-center text-lg text-primary">Panel del Capitán</h1>
        <p className="mt-1 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Solo administración
        </p>

        <label className="mt-6 block text-sm font-medium text-primary" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl border-2 border-primary/40 bg-cream px-3 py-2 text-primary outline-none focus:border-primary"
        />

        <label className="mt-4 block text-sm font-medium text-primary" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl border-2 border-primary/40 bg-cream px-3 py-2 text-primary outline-none focus:border-primary"
        />

        {mensaje && <p className="mt-3 text-sm text-destructive">{mensaje}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {modo === "entrar" ? "Entrar" : "Crear cuenta"}
        </button>

        <button
          type="button"
          onClick={() => setModo(modo === "entrar" ? "crear" : "entrar")}
          className="mt-3 w-full text-center text-sm text-muted-foreground underline"
        >
          {modo === "entrar" ? "Crear cuenta de administrador" : "Ya tengo cuenta"}
        </button>
      </form>
    </main>
  );
}

function Panel() {
  const qc = useQueryClient();
  const [busqueda, setBusqueda] = useState("");
  const [nuevo, setNuevo] = useState("");
  const [verTarjeta, setVerTarjeta] = useState<Cliente | null>(null);
  const [errorSellos, setErrorSellos] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [confirmar, setConfirmar] = useState<{
    cliente: Cliente;
    accion: "sumar" | "restar";
    sellos: number;
  } | null>(null);
  const [eliminar, setEliminar] = useState<Cliente | null>(null);
  const [escaneando, setEscaneando] = useState(false);

  const eliminarCliente = useMutation({
    mutationFn: async (clienteId: string) => {
      const { error: e1 } = await supabase
        .from("fidelidad")
        .delete()
        .eq("cliente_id", clienteId);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from("clientes").delete().eq("id", clienteId);
      if (e2) throw e2;
    },
    onSuccess: (_v, clienteId) => {
      qc.setQueryData<Cliente[]>(["clientes"], (old) =>
        (old ?? []).filter((c) => c.id !== clienteId),
      );
      setEliminar(null);
    },
    onError: (err) =>
      setErrorSellos(err instanceof Error ? err.message : "No se pudo eliminar la tarjeta."),
  });

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async (): Promise<Cliente[]> => {
      const { data, error } = await supabase
        .from("clientes")
        .select("id, nombre_completo, enlace_unico, instagram, fidelidad(sellos_actuales)")
        .order("nombre_completo");
      if (error) throw error;
      return (data ?? []).map((c) => {
        const f = (c as { fidelidad: unknown }).fidelidad;
        const fila = Array.isArray(f) ? f[0] : f;
        return {
          id: c.id,
          nombre_completo: c.nombre_completo,
          enlace_unico: c.enlace_unico,
          instagram: c.instagram,
          sellos: (fila as { sellos_actuales: number } | null)?.sellos_actuales ?? 0,
        };
      });
    },
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  const { data: acumulacionActiva = true } = useQuery({
    queryKey: ["configuracion"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("configuracion")
        .select("acumulacion_activa")
        .maybeSingle();
      if (error) throw error;
      return data?.acumulacion_activa ?? true;
    },
    refetchInterval: 10000,
  });

  const cambiarAcumulacion = useMutation({
    mutationFn: async (valor: boolean) => {
      const { error } = await supabase
        .from("configuracion")
        .update({ acumulacion_activa: valor })
        .eq("id", true);
      if (error) throw error;
      return valor;
    },
    onSuccess: (valor) => qc.setQueryData(["configuracion"], valor),
    onError: (err) =>
      setErrorSellos(err instanceof Error ? err.message : "No se pudo cambiar el ajuste."),
  });

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase().replace(/^@/, "");
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nombre_completo.toLowerCase().includes(q) ||
        (c.instagram ?? "").toLowerCase().replace(/^@/, "").includes(q),
    );
  }, [clientes, busqueda]);


  const crear = useMutation({
    mutationFn: async (nombre: string) => {
      const { error } = await supabase
        .from("clientes")
        .insert({ nombre_completo: nombre.trim() });
      if (error) throw error;
    },
    onSuccess: () => {
      setNuevo("");
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
  });

  const actualizarSellos = useMutation({
    mutationFn: async ({ clienteId, delta }: { clienteId: string; delta: 1 | -1 }) => {
      const { data, error } = await supabase.rpc("ajustar_sellos", {
        p_cliente_id: clienteId,
        p_delta: delta,
      });
      if (error) throw error;
      return { clienteId, sellos: data as number };
    },
    onMutate: () => {
      setErrorSellos(null);
    },
    onSuccess: ({ clienteId, sellos }) => {
      qc.setQueryData<Cliente[]>(["clientes"], (old) =>
        (old ?? []).map((c) =>
          c.id === clienteId ? { ...c, sellos } : c,
        ),
      );
    },
    onError: (err) => {
      setErrorSellos(err instanceof Error ? err.message : "Error al actualizar los sellos.");
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ["clientes"] }),
  });


  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto w-full max-w-sm">
        <header className="flex items-center gap-3">
          <img src={logo.url} alt="Logo Dulces del Rey Pirata" className="h-12 w-12" />
          <div className="flex-1">
            <h1 className="text-lg leading-tight text-primary">Panel del Capitán</h1>
            <p className="text-xs text-muted-foreground">Clientes y sellos</p>
          </div>
          <button
            onClick={async () => {
              await qc.cancelQueries();
              qc.clear();
              await supabase.auth.signOut();
            }}
            className="rounded-lg border-2 border-primary/50 px-3 py-1 text-xs font-semibold text-primary"
          >
            Salir
          </button>
        </header>

        <button
          onClick={() => {
            setErrorSellos(null);
            setEscaneando(true);
          }}
          className="mt-4 w-full rounded-xl bg-caramel px-3 py-3 text-sm font-bold text-primary"
        >
          📷 Escanear QR
        </button>

        <button
          onClick={() =>
            navigator.clipboard.writeText(`${window.location.origin}/registro`)
          }
          className="mt-3 w-full rounded-xl border-2 border-primary/50 px-3 py-2 text-xs font-semibold text-primary"
        >
          Copiar enlace de registro para clientes
        </button>

        <div className="mt-4 rounded-2xl border-2 border-primary/60 bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-primary">Acumulación de sellos</p>
              <p className="text-xs text-muted-foreground">
                {acumulacionActiva ? "Activada" : "Pausada"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={acumulacionActiva}
              aria-label="Activar o desactivar la acumulación de sellos"
              disabled={cambiarAcumulacion.isPending}
              onClick={() => cambiarAcumulacion.mutate(!acumulacionActiva)}
              className={`relative h-8 w-14 shrink-0 rounded-full border-2 border-primary transition-colors disabled:opacity-60 ${
                acumulacionActiva ? "bg-caramel" : "bg-cream"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-primary transition-all ${
                  acumulacionActiva ? "left-[26px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {!acumulacionActiva && (
            <p className="mt-3 rounded-xl border-2 border-destructive/50 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
              ⚠️ Acumulación pausada por falta de stock temporal. No se pueden sumar sellos
              nuevos.
            </p>
          )}
        </div>



        <form

          onSubmit={(e) => {
            e.preventDefault();
            if (nuevo.trim()) crear.mutate(nuevo);
          }}
          className="mt-6 rounded-2xl border-2 border-primary/60 bg-card p-4 shadow-card"
        >
          <label htmlFor="nuevo" className="text-sm font-semibold text-primary">
            Nuevo cliente
          </label>
          <input
            id="nuevo"
            value={nuevo}
            maxLength={80}
            placeholder="Nombre completo"
            onChange={(e) => setNuevo(e.target.value)}
            className="mt-2 w-full rounded-xl border-2 border-primary/40 bg-cream px-3 py-2 text-primary outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={crear.isPending}
            className="mt-3 w-full rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground disabled:opacity-60"
          >
            Registrar
          </button>
        </form>

        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o @Instagram…"
          className="mt-6 w-full rounded-xl border-2 border-primary/40 bg-cream px-3 py-2 text-primary outline-none focus:border-primary"
        />

        {errorSellos && (
          <p className="mt-4 rounded-xl border-2 border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorSellos}
          </p>
        )}

        <section className="mt-4 space-y-3 pb-10">
          {isLoading && <p className="text-sm text-muted-foreground">Cargando clientes…</p>}
          {!isLoading && filtrados.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin clientes todavía.</p>
          )}
          {filtrados.map((c) => {
            const sellos = c.sellos;
            return (
              <div
                key={c.id}
                className="rounded-2xl border-2 border-primary/60 bg-card p-4 shadow-card"
              >
                <p className="font-semibold text-primary">Pirata: {c.nombre_completo}</p>
                {c.instagram && (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {`@${c.instagram.replace(/^@/, "")}`}
                  </p>
                )}
                <p className="mt-1 text-sm text-muted-foreground">
                  {sellos} de 8 sellos
                  {sellos === 8 && (
                    <span className="ml-2 font-semibold text-primary">· ¡Tesoro completo!</span>
                  )}
                </p>
                <div className="mt-2 flex gap-1.5" aria-hidden>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-3 w-3 rounded-full border-2 border-primary ${
                        i < sellos ? "bg-caramel" : "bg-cream"
                      }`}
                    />
                  ))}
                </div>


                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() =>
                      setConfirmar({
                        cliente: c,
                        accion: "restar",
                        sellos: Math.max(0, sellos - 1),
                      })
                    }
                    disabled={sellos === 0}
                    className="h-10 w-10 rounded-full border-2 border-primary text-lg font-bold text-primary disabled:opacity-40"
                  >
                    −
                  </button>
                  <button
                    onClick={() =>
                      setConfirmar({
                        cliente: c,
                        accion: "sumar",
                        sellos: Math.min(8, sellos + 1),
                      })
                    }
                    disabled={sellos === 8 || !acumulacionActiva}
                    className="h-10 flex-1 rounded-full bg-caramel font-semibold text-primary disabled:opacity-40"
                  >
                    {acumulacionActiva ? "Sumar sello" : "Pausado"}

                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/t/${c.enlace_unico}`,
                      );
                      setCopiado(c.id);
                      setTimeout(() => setCopiado(null), 1500);
                    }}
                    className="flex-1 rounded-lg border-2 border-primary/50 px-3 py-2 text-xs font-semibold text-primary"
                  >
                    {copiado === c.id ? "¡Copiado!" : "Copiar enlace"}
                  </button>
                  <button
                    onClick={() => setVerTarjeta(c)}
                    className="flex-1 rounded-lg border-2 border-primary/50 px-3 py-2 text-xs font-semibold text-primary"
                  >
                    Ver tarjeta
                  </button>
                  <button
                    onClick={() => setEliminar(c)}
                    aria-label={`Eliminar tarjeta de ${c.nombre_completo}`}
                    className="rounded-lg border-2 border-destructive/50 px-3 py-2 text-xs font-semibold text-destructive"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {escaneando && (
        <EscanerQR
          onCerrar={() => setEscaneando(false)}
          onLeer={(texto) => {
            setEscaneando(false);
            const usuario = texto.trim().replace(/^DRP:/i, "").replace(/^@/, "").toLowerCase();
            const cliente = clientes.find(
              (c) => (c.instagram ?? "").replace(/^@/, "").toLowerCase() === usuario,
            );
            if (!cliente) {
              setErrorSellos(`No encontramos ningún cliente con el QR leído (${usuario}).`);
              return;
            }
            if (!acumulacionActiva) {
              setErrorSellos("Acumulación pausada por falta de stock temporal.");
              return;
            }
            if (cliente.sellos >= 8) {
              setErrorSellos(`${cliente.nombre_completo} ya completó sus 8 sellos.`);
              return;
            }
            setConfirmar({ cliente, accion: "sumar", sellos: cliente.sellos + 1 });
          }}
        />
      )}

      {verTarjeta && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 px-4"
          onClick={() => setVerTarjeta(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <TarjetaFidelidad
              nombre={verTarjeta.nombre_completo}
              instagram={verTarjeta.instagram}
              sellos={
                clientes.find((c) => c.id === verTarjeta.id)?.sellos ?? 0
              }
            />
            <button
              onClick={() => setVerTarjeta(null)}
              className="mx-auto mt-4 block rounded-xl bg-primary px-6 py-2 font-semibold text-primary-foreground"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {confirmar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 px-4"
          onClick={() => setConfirmar(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-3xl border-2 border-primary/70 bg-card p-6 shadow-card"
          >
            <p className="text-center text-lg font-semibold text-primary">
              ¿Confirmar sello?
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Vas a {confirmar.accion === "sumar" ? "agregar" : "quitar"} un sello a
            </p>
            <p className="text-center font-bold text-primary">
              Pirata: {confirmar.cliente.nombre_completo}
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {confirmar.sellos} de 8 sellos
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmar(null)}
                className="flex-1 rounded-xl border-2 border-primary/50 px-4 py-2.5 font-semibold text-primary"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  actualizarSellos.mutate({
                    clienteId: confirmar.cliente.id,
                    delta: confirmar.accion === "sumar" ? 1 : -1,
                  });
                  setConfirmar(null);
                }}
                disabled={actualizarSellos.isPending}
                className="flex-1 rounded-xl bg-caramel px-4 py-2.5 font-semibold text-primary disabled:opacity-60"
              >
                {actualizarSellos.isPending ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {eliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 px-4"
          onClick={() => setEliminar(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xs rounded-3xl border-2 border-destructive/70 bg-card p-6 shadow-card"
          >
            <p className="text-center text-lg font-semibold text-destructive">
              ¿Eliminar tarjeta?
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Se eliminará permanentemente la tarjeta de
            </p>
            <p className="text-center font-bold text-primary">
              Pirata: {eliminar.nombre_completo}
            </p>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Perderá sus {eliminar.sellos} sellos y su enlace dejará de funcionar.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEliminar(null)}
                className="flex-1 rounded-xl border-2 border-primary/50 px-4 py-2.5 font-semibold text-primary"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminarCliente.mutate(eliminar.id)}
                disabled={eliminarCliente.isPending}
                className="flex-1 rounded-xl bg-destructive px-4 py-2.5 font-semibold text-primary-foreground disabled:opacity-60"
              >
                {eliminarCliente.isPending ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
