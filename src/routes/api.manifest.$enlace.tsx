import { createFileRoute } from "@tanstack/react-router";

// Un manifest por tarjeta: así el ícono instalado abre directo la tarjeta de cada cliente.
export const Route = createFileRoute("/api/manifest/$enlace")({
  server: {
    handlers: {
      GET: ({ params }) => {
        if (!/^[\w-]{1,64}$/.test(params.enlace)) return new Response("Not found", { status: 404 });

        const manifest = {
          name: "Dulces del Rey Pirata",
          short_name: "Rey Pirata",
          description: "Tu tarjeta de fidelidad: junta 8 sellos y reclama tu tesoro.",
          lang: "es",
          id: `/t/${params.enlace}`,
          start_url: `/t/${params.enlace}`,
          scope: "/t/",
          display: "standalone",
          background_color: "#160d07",
          theme_color: "#160d07",
          icons: [
            { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          ],
        };

        return new Response(JSON.stringify(manifest), {
          headers: { "content-type": "application/manifest+json" },
        });
      },
    },
  },
});
