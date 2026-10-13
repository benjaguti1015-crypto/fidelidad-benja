import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de privacidad | Dulces del Rey Pirata" },
      {
        name: "description",
        content:
          "Cómo cuidamos tus datos personales en la tarjeta de fidelidad de Dulces del Rey Pirata.",
      },
    ],
  }),
  component: Privacidad,
});

const INSTAGRAM = "https://www.instagram.com/dulces.delreypirata/";

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="text-base text-primary">{titulo}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function Privacidad() {
  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <article className="mx-auto w-full max-w-xl rounded-3xl border border-primary/30 bg-card p-6 shadow-card">
        <h1 className="text-2xl leading-tight text-primary">Política de privacidad</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Última actualización: 13 de octubre de 2026
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          En Dulces del Rey Pirata cuidamos tus datos. Aquí te contamos qué guardamos, para qué y
          cómo puedes controlarlos. Esta política se rige por la Ley N° 19.628 sobre protección de
          la vida privada y por la Ley N° 21.719, en lo que resulte aplicable.
        </p>

        <Seccion titulo="1. Quién es responsable">
          <p>
            Dulces del Rey Pirata, emprendimiento de galletas y dulces en Chile. Puedes contactarnos
            por mensaje directo en Instagram:{" "}
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline"
            >
              @dulces.delreypirata
            </a>
            .
          </p>
        </Seccion>

        <Seccion titulo="2. Qué datos guardamos">
          <ul className="list-disc space-y-1 pl-5">
            <li>Tu nombre y apellido.</li>
            <li>Tu usuario de Instagram.</li>
            <li>Tu fecha de cumpleaños, solo si decides darla.</li>
            <li>Tus sellos y premios, y un enlace único de tu tarjeta.</li>
            <li>
              Si activas los avisos: un identificador técnico de tu dispositivo, necesario para
              enviarte notificaciones.
            </li>
          </ul>
          <p>
            No pedimos RUT, dirección, datos de pago ni contraseñas. Para recordar tu tarjeta en tu
            celular guardamos el enlace en el almacenamiento de tu navegador; no usamos cookies de
            publicidad.
          </p>
        </Seccion>

        <Seccion titulo="3. Para qué los usamos">
          <ul className="list-disc space-y-1 pl-5">
            <li>Crear tu tarjeta, sumar tus sellos y entregarte tus premios.</li>
            <li>Verificar tu cuenta de Instagram para validar los sellos.</li>
            <li>Saludarte en tu cumpleaños, si nos diste la fecha.</li>
            <li>Enviarte avisos de promociones, solo si lo aceptaste.</li>
          </ul>
          <p>No vendemos tus datos ni los usamos para otros fines.</p>
        </Seccion>

        <Seccion titulo="4. Tu consentimiento">
          <p>
            Tratamos tus datos porque nos das tu consentimiento al registrarte. Aceptar los términos
            y esta política es necesario para tener tu tarjeta. Recibir notificaciones es opcional,
            y puedes cambiar de opinión cuando quieras.
          </p>
          <p>
            Si eres menor de 14 años, necesitas la autorización de tu madre, padre o tutor para
            registrarte.
          </p>
        </Seccion>

        <Seccion titulo="5. Con quién los compartimos">
          <p>Solo con los servicios que hacen funcionar la tarjeta:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Supabase, donde se almacena la base de datos.</li>
            <li>Vercel, donde se aloja el sitio.</li>
            <li>
              Los servicios de notificaciones de tu navegador (Google, Apple o Mozilla, según tu
              dispositivo), si activas los avisos.
            </li>
          </ul>
          <p>
            Algunos de estos servicios pueden almacenar datos fuera de Chile. Los elegimos por sus
            medidas de seguridad.
          </p>
        </Seccion>

        <Seccion titulo="6. Cuánto tiempo los guardamos">
          <p>
            Mientras tu tarjeta esté activa. Si pides que la eliminemos, borramos tus datos y tus
            avisos.
          </p>
        </Seccion>

        <Seccion titulo="7. Tus derechos">
          <p>
            Puedes pedirnos en cualquier momento: acceder a tus datos, corregirlos, eliminarlos u
            oponerte a que los usemos. También puedes retirar tu consentimiento y pedir que dejemos
            de enviarte notificaciones.
          </p>
          <p>
            Escríbenos por Instagram y respondemos tu solicitud en un plazo máximo de 30 días. Para
            dejar de recibir avisos también puedes desactivarlos en los permisos de tu navegador.
          </p>
          <p>
            Si crees que no respetamos tus derechos, puedes reclamar ante la autoridad de protección
            de datos personales que corresponda.
          </p>
        </Seccion>

        <Seccion titulo="8. Seguridad">
          <p>
            Usamos conexiones cifradas y acceso restringido a la base de datos. Ningún sistema es
            100% seguro; si ocurre un incidente que te afecte, te avisaremos.
          </p>
        </Seccion>

        <Seccion titulo="9. Cambios en esta política">
          <p>
            Si la actualizamos, cambiaremos la fecha de arriba. Si el cambio es importante, te lo
            avisaremos.
          </p>
        </Seccion>

        <a
          href="/registro"
          className="mt-8 inline-block text-sm font-semibold text-primary underline"
        >
          ← Volver al registro
        </a>
      </article>
    </main>
  );
}
