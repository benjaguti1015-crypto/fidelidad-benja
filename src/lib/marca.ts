// Datos de la marca en un solo lugar: cambia aquí y se actualiza toda la app.
export const MARCA = "Dulces del Rey Pirata";
export const INSTAGRAM = "dulces.delreypirata";
export const LINK_INSTAGRAM = `https://www.instagram.com/${INSTAGRAM}/`;

export const META = 8;

// Sellos con premio.
export const PREMIOS: Record<number, string> = {
  4: "50% off en tu próxima compra (tope $10.000)",
  8: "2 galletas premium gratis",
};

// Prefijo del QR que lee el escáner del panel.
export const PREFIJO_QR = "DRP:";

// Mensaje del botón "Ya llegué a la U" del panel.
export const AVISO_LLEGADA = {
  titulo: "¡Ya llegaron las galletas! 🍪",
  texto: "Estamos en la UBB con galletas frescas. ¡Pasa con tu tarjeta y suma tu sello!",
};
