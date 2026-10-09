---
name: branding-pirata
description: Branding de la tarjeta de fidelidad digital de Dulces del Rey Pirata (tarjeta del cliente, registro, panel admin). Úsala al crear o cambiar cualquier pantalla, componente, color, texto o animación de esta app, para mantener la identidad oscura con dorado y el tono cercano. No aplica a publicaciones de Instagram (para eso está diseno-del-pirata).
---

# Branding Pirata — tarjeta de fidelidad

Marca: **Dulces del Rey Pirata** (@dulces.delreypirata). Tarjeta de 8 sellos; premios en el sello 4 (50% off, tope $10.000) y el 8 (2 galletas premium gratis). Idioma: español.

## Principio
Una pantalla = una cosa importante. En la tarjeta del cliente solo mandan: **sellos, premio, QR y nombre del negocio**. Todo lo demás va como enlace de texto pequeño o plegado.

## Voz
Cercana, tuteo, frases cortas. Un emoji por mensaje como máximo.
- Sí: "¡Tu tarjeta está lista! Guárdala para tener tus sellos a un toque." · "Así te saludamos en tu día." · "Muestra este QR para tu sello."
- No: mayúsculas gritadas, "debes", "estimado cliente", varias exclamaciones seguidas, jerga pirata en exceso (un guiño basta: "tripulación", "tesoro").
- Botones: verbo + objeto ("Guardar en mi celular", "Sumar sello", "Crear mi tarjeta").

## Paleta (tema oscuro, definida en `src/styles.css` → `:root`)
Usa siempre los tokens de Tailwind, nunca hex sueltos. Todo color nuevo va en oklch.

| Token | Clase | oklch | ≈ Hex | Uso |
|---|---|---|---|---|
| background | `bg-background` | 0.17 0.02 55 | #160d07 | fondo de página |
| card | `bg-card` | 0.22 0.025 55 | #24180f | tarjetas, modales |
| cream | `bg-cream` | 0.27 0.03 55 | #322318 | superficie de inputs y casillas vacías |
| primary | `text-primary` / `bg-primary` | 0.95 0.025 85 | #f6eedc | texto principal; botón principal (con `text-primary-foreground`) |
| muted-foreground | `text-muted-foreground` | 0.72 0.04 75 | #b4a289 | texto secundario |
| caramel / accent | `bg-caramel` | 0.80 0.13 82 | #e7b551 | acento dorado; botón de acción (texto **oscuro**: `text-primary-foreground`) |
| gold | `border-gold` `bg-gold/20` | 0.82 0.14 85 | #eebc4a | banners y avisos amables |
| destructive | `text-destructive` | 0.68 0.19 25 | #f75d59 | errores y eliminar |

Reglas: texto sobre dorado siempre oscuro. Bordes `border-primary/30` (1px, sutil). Fondo detrás de modales: `bg-black/60`.
`<meta theme-color>` y `background_color` del manifest = color de `background`.

## Tipografía
- **Rye** (`font-rustic`): solo `h1`/`h2` — nombre del negocio y títulos de pantalla. Ya está aplicada por CSS base.
- **Cabin** 400–700: todo lo demás.
- Inputs en `text-base` (16px) para que iOS no haga zoom. Texto auxiliar nunca menor a 11px.
- Etiqueta tipo NOMBRE: `text-[10px] uppercase tracking-[0.2em] text-muted-foreground`.

## Forma
- Tarjeta/modal: `rounded-3xl border border-primary/30 bg-card shadow-card`.
- Inputs y botones: `rounded-xl`; acciones del admin: `rounded-full`, alto mínimo 44px (`h-11`).
- Sin `border-2`, sin gradientes decorativos (excepto la moneda de oro), sin sombras duras.
- Ancho de contenido `max-w-sm`, centrado, con 16px de margen lateral. Debe verse bien a 375px y a 1440px.

## Tarjeta de sellos (`src/components/TarjetaFidelidad.tsx`)
Orden fijo: cabecera (logo redondo 48px + nombre en Rye) → cuadrícula 4×2 → "N de 8 sellos" → dos líneas de premios → NOMBRE (izquierda) + QR (derecha) → línea con enlace a Instagram y "Pedir galletas".
- Sello ganado: moneda de oro (gradiente amber, 🪙). Pendiente: círculo `bg-cream` con el número.
- Casillas **4 y 8**: cofre del tesoro (SVG `Tesoro`). Pendiente = contorno ámbar (`text-amber-400`); ganado = dorado lleno.
- QR: siempre fondo claro `#f7efe1` y tinta `#4a2c17` (se escanea con cámara; nunca invertirlo a oscuro). Valor `DRP:usuario`. Tamaño 112px en la tarjeta.
- Fuera de la tarjeta: sin barra de progreso, sin bloque de invitar amigos, sin botón SOS que pulse.

## Componentes
- Botón principal: `rounded-xl bg-primary text-primary-foreground font-semibold`.
- Botón dorado de acción: `bg-caramel text-primary-foreground`.
- Acción secundaria: enlace de texto `text-sm font-semibold text-primary underline`.
- Aviso amable (cumpleaños, tarjeta lista): `rounded-2xl border border-gold bg-gold/20 px-4 py-3 text-center text-sm font-semibold`.
- Texto legal (términos): siempre plegado en `<details>`.
- Cumpleaños: mensaje "Repostéanos y consigue tu galleta gratis" **solo el día del cumpleaños** (`esHoyCumpleanos`, fechas `dd/mm/aaaa`).
- Todo modal tiene salida clara ("Ahora no" / "Entendido").

## Movimiento
- Solo `transform` y `opacity`; nada de `transition: all`.
- Pulsación: `transition-transform active:scale-[0.97]` en cada botón.
- Entradas: `animate-fade-in`, ≤ 200ms, `ease-out`. Nada de `animate-pulse` en llamados a la acción.
- No animar acciones repetidas del admin (sumar sello, abrir menú) más allá del feedback de pulsación.

## No tocar al cambiar el diseño
Sumar/anular sellos con confirmación, QR `DRP:`, interruptor de acumulación, eliminar cliente con confirmación, refresco cada 5 s, enlace único `/t/$enlace`, manifest por tarjeta `/api/manifest/$enlace`.

## Antes de dar algo por terminado
1. Revisar a 375px y 1440px.
2. Contraste legible: texto crema sobre fondo oscuro, texto oscuro sobre dorado.
3. Verificar que el QR siga claro y escaneable.
4. `npm run build` sin errores y `eslint` limpio en los archivos tocados.
