import { createFileRoute } from "@tanstack/react-router";
import { JuegoReloj } from "@/components/JuegoReloj";

export const Route = createFileRoute("/reloj")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Para el reloj en 10.00 | Dulces del Rey Pirata" },
      {
        name: "description",
        content: "Juego del stand: para el reloj justo en 10.00 segundos y gánate una galleta.",
      },
    ],
  }),
  component: JuegoReloj,
});
