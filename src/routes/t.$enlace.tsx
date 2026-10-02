import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TarjetaFidelidad } from "@/components/TarjetaFidelidad";
import { Terminos } from "@/components/Terminos";

export const Route = createFileRoute("/t/$enlace")({
  head: () => ({
    meta: [
      { title: "Mi tarjeta pirata | Dulces del Rey Pirata" },
      {
        name: "description",
        content: "Consulta los sellos acumulados en tu tarjeta de fidelidad pirata.",
      },
      { property: "og:title", content: "Mi tarjeta pirata | Dulces del Rey Pirata" },
      {
        property: "og:description",
        content: "Consulta los sellos acumulados en tu tarjeta de fidelidad pirata.",
      },
    ],
  }),
  component: VistaCliente,
});

type Tarjeta = {
  nombre_completo: string;
  sellos_actuales: number;
  instagram: string | null;
};

function VistaCliente() {
  const { enlace } = Route.useParams();

  useEffect(() => {
    localStorage.setItem("tarjeta_enlace", enlace);
  }, [enlace]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["tarjeta", enlace],
    queryFn: async (): Promise<Tarjeta | null> => {
      const { data, error } = await supabase.rpc("tarjeta_publica", { p_enlace: enlace });
      if (error) throw error;
      return (data as Tarjeta[])?.[0] ?? null;
    },
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });


  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      {isLoading ? (
        <p className="text-muted-foreground">Cargando tu tarjeta…</p>
      ) : isError || !data ? (
        <p className="max-w-xs text-center text-muted-foreground">
          No encontramos esta tarjeta. Pide a la tripulación un enlace válido.
        </p>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <TarjetaFidelidad
            nombre={data.nombre_completo}
            sellos={data.sellos_actuales}
            instagram={data.instagram}
          />
          <Terminos className="w-full max-w-sm" />
          <button
            onClick={() => refetch()}
            className="rounded-xl border-2 border-primary/50 px-5 py-2 text-sm font-semibold text-primary"
          >
            {isFetching ? "Actualizando…" : "Actualizar sellos"}
          </button>
        </div>
      )}
    </main>

  );
}
