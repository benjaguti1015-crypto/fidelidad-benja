import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "content-type": "application/json" },
  });

// El cliente escanea el QR impreso del punto de venta desde su tarjeta:
// suma 1 sello (máximo 1 por día, lo valida la base de datos) y actualiza su pase de Wallet.
export const Route = createFileRoute("/api/sello-qr")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cuerpo = (await request.json().catch(() => null)) as {
          enlace?: unknown;
          codigo?: unknown;
        } | null;
        const enlace = typeof cuerpo?.enlace === "string" ? cuerpo.enlace : "";
        const codigo = typeof cuerpo?.codigo === "string" ? cuerpo.codigo : "";
        if (!/^[\w-]{1,64}$/.test(enlace)) return json({ error: "Tarjeta no válida." }, 400);
        if (!/^[\w-]{1,64}$/.test(codigo))
          return json({ error: "Este QR no es de un punto de venta válido." }, 400);

        const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
        const clave =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !clave) return json({ error: "Faltan variables de Supabase." }, 500);

        const { data, error } = await createClient(url, clave, {
          auth: { persistSession: false },
        }).rpc("sello_por_qr", { p_enlace: enlace, p_codigo: codigo });
        if (error) {
          // Los errores de la función ya vienen redactados para el cliente.
          const conocido = error.code === "P0001";
          if (!conocido) console.error("sello-qr:", error);
          return json(
            { error: conocido ? error.message : "No pudimos sumar el sello. Inténtalo de nuevo." },
            conocido ? 409 : 500,
          );
        }

        // Actualiza el pase de Google Wallet si está configurado; si falla, el sello ya quedó.
        try {
          const { configWallet, leerTarjeta, actualizarPase } = await import("@/lib/wallet.server");
          const cfg = configWallet();
          if (cfg) {
            const tarjeta = await leerTarjeta(enlace);
            if (tarjeta) await actualizarPase(cfg, enlace, tarjeta);
          }
        } catch (e) {
          console.error("sello-qr wallet:", e);
        }

        return json({ sellos: data });
      },
    },
  },
});
