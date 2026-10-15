import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "content-type": "application/json" },
  });

const esUuid = (v: unknown) =>
  typeof v === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

// undefined = sin lista (todos); null = lista inválida; si no, la lista de ids.
function leerIds(v: unknown): string[] | undefined | null {
  if (v === undefined) return undefined;
  return Array.isArray(v) && v.length > 0 && v.length <= 2000 && v.every(esUuid)
    ? (v as string[])
    : null;
}

// Solo el admin con sesión iniciada puede enviar: se valida el token con Supabase.
export const Route = createFileRoute("/api/enviar-aviso")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer /i, "");
        if (!token) return json({ error: "Inicia sesión." }, 401);

        const url = process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"];
        const clave =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
        const vapidPublica = process.env["VITE_VAPID_PUBLIC_KEY"];
        const vapidPrivada = process.env["VAPID_PRIVATE_KEY"];
        if (!url || !clave) return json({ error: "Faltan variables de Supabase." }, 500);

        const supabase = createClient(url, clave, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false },
        });
        const { data: usuario } = await supabase.auth.getUser(token);
        if (!usuario.user) return json({ error: "Sesión no válida." }, 401);

        const cuerpo = (await request.json().catch(() => null)) as {
          titulo?: unknown;
          texto?: unknown;
          clientes?: unknown;
          push?: unknown;
          wallet?: unknown;
          clientesWallet?: unknown;
        } | null;
        const titulo = typeof cuerpo?.titulo === "string" ? cuerpo.titulo.trim() : "";
        const texto = typeof cuerpo?.texto === "string" ? cuerpo.texto.trim() : "";
        if (!titulo || !texto || titulo.length > 60 || texto.length > 200) {
          return json({ error: "Título (máx. 60) y texto (máx. 200) son obligatorios." }, 400);
        }

        const enviarPush = cuerpo?.push !== false;
        if (enviarPush && (!vapidPublica || !vapidPrivada)) {
          return json({ error: "Faltan variables de entorno de avisos." }, 500);
        }

        // Sin "clientes" = todos. Con lista = solo esos clientes (ids de la tabla clientes).
        const ids = leerIds(cuerpo?.clientes);
        const idsWallet = leerIds(cuerpo?.clientesWallet);
        if (ids === null || idsWallet === null) {
          return json({ error: "Elige al menos un cliente válido." }, 400);
        }

        // push: false = solo Wallet (cuando nadie del grupo tiene avisos activos).
        let suscripciones: {
          id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          clientes: { enlace_unico: string } | { enlace_unico: string }[] | null;
        }[] = [];
        if (enviarPush) {
          let consulta = supabase
            .from("suscripciones_push")
            .select("id, endpoint, p256dh, auth, clientes(enlace_unico)");
          if (ids) consulta = consulta.in("cliente_id", ids);
          const { data, error } = await consulta;
          if (error) return json({ error: "No pudimos leer las suscripciones." }, 500);
          suscripciones = data ?? [];
        }

        const caducadas: string[] = [];
        let enviados = 0;
        const webpush = enviarPush ? (await import("web-push")).default : null;
        webpush?.setVapidDetails(
          process.env["VAPID_SUBJECT"] ?? "mailto:admin@example.com",
          vapidPublica!,
          vapidPrivada!,
        );
        await Promise.all(
          suscripciones.map(async (s) => {
            const cliente = Array.isArray(s.clientes) ? s.clientes[0] : s.clientes;
            try {
              await webpush!.sendNotification(
                { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
                JSON.stringify({
                  titulo,
                  texto,
                  url: cliente ? `/t/${cliente.enlace_unico}` : "/",
                }),
              );
              enviados++;
            } catch (e) {
              const codigo = (e as { statusCode?: number }).statusCode;
              if (codigo === 404 || codigo === 410) caducadas.push(s.id);
            }
          }),
        );

        // Dispositivos que ya no existen: se limpian solos.
        if (caducadas.length)
          await supabase.from("suscripciones_push").delete().in("id", caducadas);

        // Mensaje en el pase de Google Wallet. No sabemos quién lo guardó: se intenta con
        // todos los del grupo y a quien no lo tiene Google responde 404 (se ignora).
        let wallet: { enviados: number; intentos: number } | { error: string } | undefined;
        if (cuerpo?.wallet === true) {
          const { configWallet, enviarMensajePase, tokenApi } = await import("@/lib/wallet.server");
          const cfg = configWallet();
          if (!cfg) {
            wallet = { error: "Wallet no está configurado." };
          } else {
            let clientesQ = supabase.from("clientes").select("enlace_unico");
            if (idsWallet) clientesQ = clientesQ.in("id", idsWallet);
            const { data: clientesWallet, error: errW } = await clientesQ;
            if (errW) {
              wallet = { error: "No pudimos leer los clientes para Wallet." };
            } else {
              try {
                const tokenGoogle = await tokenApi(cfg);
                const enlaces = (clientesWallet ?? []).map((c) => c.enlace_unico);
                let ok = 0;
                // De a 10 en paralelo para no saturar la API de Google.
                for (let i = 0; i < enlaces.length; i += 10) {
                  const lote = await Promise.all(
                    enlaces
                      .slice(i, i + 10)
                      .map((e) => enviarMensajePase(cfg, tokenGoogle, e, titulo, texto)),
                  );
                  ok += lote.filter(Boolean).length;
                }
                wallet = { enviados: ok, intentos: enlaces.length };
              } catch (e) {
                console.error(e);
                wallet = { error: "No se pudo enviar a Wallet." };
              }
            }
          }
        }

        return json({
          enviados,
          total: suscripciones.length,
          eliminadas: caducadas.length,
          wallet,
        });
      },
    },
  },
});
