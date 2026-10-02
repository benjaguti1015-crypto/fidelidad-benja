import { useEffect, useState } from "react";

export function codigoQrDeInstagram(instagram: string) {
  return `DRP:${instagram.trim().replace(/^@/, "").toLowerCase()}`;
}

export function CodigoQR({ valor, size = 132 }: { valor: string; size?: number }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    import("qrcode").then((QR) =>
      QR.toDataURL(valor, {
        width: size * 2,
        margin: 1,
        color: { dark: "#4a2c17", light: "#f7efe1" },
      }).then((d) => {
        if (vivo) setUrl(d);
      }),
    );
    return () => {
      vivo = false;
    };
  }, [valor, size]);

  return (
    <div
      className="flex items-center justify-center rounded-xl border-2 border-primary/50 bg-cream p-2"
      style={{ width: size + 16, height: size + 16 }}
    >
      {url ? (
        <img src={url} alt={`Código QR de la tarjeta (${valor})`} width={size} height={size} />
      ) : (
        <span className="text-[10px] text-muted-foreground">Generando QR…</span>
      )}
    </div>
  );
}
