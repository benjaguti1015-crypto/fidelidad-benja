// Datos de la marca en un solo lugar: cambia aquí y se actualiza toda la app.
export const MARCA = "Dulces del Rey Pirata";
export const INSTAGRAM = "dulces.delreypirata";
export const LINK_INSTAGRAM = `https://www.instagram.com/${INSTAGRAM}/`;

// Programa original (clientes de la U): 8 sellos.
export const META = 8;

// Sellos con premio del programa original.
export const PREMIOS: Record<number, string> = {
  4: "50% off en tu próxima compra (tope $10.000)",
  8: "2 galletas premium gratis",
};

// "universidad" = clientes antiguos (8 sellos). "concepcion" = clientes nuevos (12 sellos).
export type Programa = "universidad" | "concepcion";

export const PROGRAMAS: Record<
  Programa,
  { meta: number; premios: Record<number, string>; etiqueta: string }
> = {
  universidad: { meta: META, premios: PREMIOS, etiqueta: "U" },
  concepcion: {
    meta: 12,
    premios: {
      10: "50% off en tu próxima compra (tope $15.000)",
      12: "Caja de 4 galletas a elección",
    },
    etiqueta: "Concepción",
  },
};

// Sellos de regalo con los que parte cada tarjeta de Concepción.
export const SELLOS_BIENVENIDA = 2;

export function programaDe(valor?: string | null): Programa {
  return valor === "concepcion" ? "concepcion" : "universidad";
}

// Prefijo del QR que lee el escáner del panel.
export const PREFIJO_QR = "DRP:";

// Mensaje del botón "Ya llegué a la U" del panel.
export const AVISO_LLEGADA = {
  titulo: "¡Ya llegaron las galletas! 🍪",
  texto: "Estamos en la UBB con galletas frescas. ¡Pasa con tu tarjeta y suma tu sello!",
};
