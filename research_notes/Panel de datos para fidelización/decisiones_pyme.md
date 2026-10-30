# Cómo un micro-negocio de comida convierte datos de tarjeta de fidelidad en decisiones (y qué funciones van más allá del "10 sellos = 1 gratis")

> Nota metodológica para quien redacte el informe: en esta sesión las descargas de páginas completas (WebFetch) fueron bloqueadas por la red (hippocampus.si, depositonce.tu-berlin.de, helloagain.com, casestudies.com no resolvieron). Todos los hallazgos citados vienen de los resúmenes de búsqueda de las fuentes enlazadas, no de la lectura del texto completo. Las cifras de proveedores (vendors) se marcan como tales. Se revisó además el esquema de base de datos del propio proyecto (`supabase/migrations/*.sql`) para aterrizar las inferencias.

## 1. ¿Qué KPIs y segmentaciones simples (RFM, retención por cohorte, ventanas de abandono, top clientes, sabor preferido por cliente) son prácticos con unos pocos cientos de clientes? ¿Qué decisiones concretas habilitan?

### Takeaway
Con unos cientos de clientes no hace falta ciencia de datos: basta con un RFM simplificado (escala 1–3 y 4–6 grupos), una "ventana de abandono" calculada desde el propio intervalo típico entre visitas (≈1,5× ese intervalo), el % de clientes activos y la concentración de ingresos en los "habituales". La economía de la retención (Bain/Reichheld) y datos de Square 2026 justifican enfocarse en los habituales, pero la cifra famosa de "5 % más retención = 25–95 % más utilidad" es un rango ilustrativo, no una ley.

### Cited Findings
**Economía de la retención (por qué vale la pena medir)**
- La cifra "aumentar la retención 5 % sube las utilidades 25 %–95 %" viene de Bain & Company (Reichheld, con Earl Sasser de Harvard) y fue reformulada por Reichheld y Schefter en un extracto de HBR del año 2000; en *The Loyalty Effect* Reichheld hablaba de oscilaciones de 25–100 %, y un paper académico que cita el trabajo de Bain de 1990 da 25–80 %. El rango depende de la estructura de costos de cada industria; conviene tratarlo como ilustrativo — [Bain, The Loyalty Effect](https://www.bain.com/es/insights/books/the-loyalty-effect/); [Zenify, retention profit impact](https://zenify.vn/blog/retention-profit-impact); [Scribd, The Loyalty Effect pdf](https://www.scribd.com/document/344972184/The-Loyalty-Effect-pdf)
- Square Local Economy Report (18 de marzo de 2026, Canadá): los "regulares" (clientes con 4+ visitas en un año) generan casi 6× más ingreso anual que los visitantes de una sola vez; los regulares vuelven en promedio 9–10 veces al año; en Montreal valen ~7×. Basado en datos transaccionales de Square + encuesta a >1.000 consumidores y dueños (dato del propio proveedor, no estudio independiente) — [Square, nota de prensa Canadá](https://squareup.com/ca/fr/press/canada-square-local-economy-report); [Retail Insider, 2026](https://retail-insider.com/retail-insider/2026/03/square-report-finds-group-of-loyal-regulars-generates-6x-more-revenue-for-canadas-small-businesses/); [Square Local Economy Report](https://squareup.com/ca/en/the-bottom-line/reaching-customers/square-local-economy-report)
- Mismo informe: en Toronto el 49 % de los negocios comparte clientes regulares con al menos otro negocio local (55 % en Vancouver), y cada conexión con otro negocio local se asocia a ~2.067 (moneda ambigua entre fuentes) de ingreso anual extra — [Fintech.ca, 2026](https://www.fintech.ca/2026/03/19/square-report-local-business-network-shared-regulars/); [Business Wire](https://www.businesswire.com/news/home/20260318865757/en/)

**RFM a escala pequeña**
- Para un negocio pequeño, la escala clásica 1–5 por dimensión (125 segmentos) es excesiva; basta una escala 1–3 (3 = alto, 1 = bajo) y unos cinco grupos que se pueden ordenar en una planilla — [Letteros, RFM sin CRM complejo para pequeño negocio](https://dev1.letteros.com/en/blog/rfm-segmentacziya-bez-slozhnoj-crm-prostoj-podhod-dlya-malogo-biznesa)
- Un modelo práctico suele dar 6–10 grupos accionables, menos cuando la base es pequeña o el ciclo de compra es simple; ventana de análisis recomendada de 6 a 24 meses; limpiar duplicados y estandarizar identificadores de cliente antes de puntuar — [MCP Analytics, RFM whitepaper](https://mcpanalytics-website.pages.dev/whitepapers/whitepaper-rfm-segmentation); [MCP Analytics, guía práctica](https://mcpanalytics-website.pages.dev/articles/rfm-segmentation-practical-guide-for-data-driven-decisions)
- Pipedrive advierte que muchas pymes caen en sobre-ingeniería del puntaje (demasiados tramos o fórmulas ponderadas) — [Pipedrive, What is RFM](https://www.pipedrive.com/en/blog/what-is-rfm)
- Recomendación de correrlo mensualmente y en Google Sheets para pymes (fuente antigua, 2019) — [Christopher Penn, RFM para small business](https://www.christopherspenn.com/2019/10/you-ask-i-answer-rfm-analysis-for-small-business-with-google-sheets-and-ibm-watson-studio/)

**Ventana de abandono / reactivación**
- No hay un benchmark autoritativo para cafeterías; las guías coinciden en que el umbral debe salir del propio ciclo de recompra. Una guía usa ~1,5× el ciclo típico de recompra (≈60 días para consumibles); otra pone consumibles en ciclos de 30–60 días y "lapsed" a 75–90 días; una guía de cafés sugiere considerar inactivo tras 30 días — [Kanal, win-back campaigns](https://getkanal.com/blog/win-back-campaigns); [Digital Applied, playbook win-back 2026](https://www.digitalapplied.com/blog/customer-win-back-campaigns-2026-retention-playbook); [FaveCard, clientes inactivos](https://favecard.netlify.app/en/blog/how-to-bring-back-inactive-customers/)
- Benchmark de proveedor: campañas de reactivación recuperan 5–12 % de los clientes inactivos; separar ~1 semana entre mensajes y no volver a insistir por 60–90 días si no convierte (cifras de vendor) — [Kanal](https://getkanal.com/blog/win-back-campaigns); [Preferred Patron, win-back guide](https://www.preferredpatron.com/blog/?p=814)
- Caso de proveedor: una cadena de café reactivó 13.000 clientes inactivos con retorno 6× usando Adentro/Zenreach (escala de cadena, no micro-negocio; cifra del proveedor) — [CaseStudies.com, Adentro](https://www.casestudies.com/company/adentro/case-study/zenreach-brews-up-a-new-way-to-bring-back-lost-customers)

**KPIs de programa que sí importan**
- "Total de inscritos" es la métrica vanidosa clásica; medir miembros activos que compran. Tasa de miembros activos = % de inscritos que interactúan al menos una vez en el período; programas con <30 % de activos tienen problemas estructurales (umbral de un proveedor) — [Talon.One, loyalty KPIs](https://www.talon.one/blog/loyalty-program-analytics-kpis); [Adviso](https://www.adviso.ca/en/blog/is-your-loyalty-program-measuring-the-right-kpis)
- La tasa de canje es ambigua (puede ser valor o "gastar antes de irse"); medir conversión a primer canje como indicador adelantado. Alta "breakage" (recompensas no canjeadas) suele indicar recompensas poco atractivas, no ahorro; un vendor sugiere <20 % ideal y >40 % problema. Los que canjean gastan ~25 % más que inscritos inactivos (un análisis) — [Prodata, medir éxito de programa](https://www.prodata.de/kundenbindung/en/how-do-i-measure-the-success-of-a-loyalty-program/); [Epsilon, loyalty metrics](https://www.epsilon.com/us/insights/blog/loyalty-program-metrics); [Smile.io](https://blog.smile.io/loyalty-metrics-program-performance)
- Churn (activos que pasan a inactivos de un período a otro) se describe como uno de los indicadores más reveladores; métricas financieras sugeridas: costo de recompensas / ingreso, margen bruto después de recompensas, costo por cliente retenido — [Euromonitor, leaky bucket](https://www.euromonitor.com/article/the-leaky-bucket-of-customers-fixing-churn-rates-in-loyalty-programmes); [Xoxoday, KPIs CFO/CMO](https://www.xoxoday.com/blogs/loyalife/how-to-set-loyalty-program-kpis-that-both-your-cfo-and-cmo-care-about)

**Psicología de la tarjeta (decide el diseño de la tarjeta y cuándo empujar)**
- Kivetz, Urminsky y Zheng (2006, *Journal of Marketing Research* 43:39–58), estudio en café real con "10 compras = 1 café gratis": los clientes compran con más frecuencia a medida que se acercan al premio (goal-gradient); una tarjeta de 12 sellos con 2 de regalo se completa más rápido que una de 10 en blanco; acelerar más hacia la meta predice mayor retención y re-enganche más rápido en el programa — [Columbia Business School, paper](https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf); [Columbia, resumen](https://business.columbia.edu/faculty/research/goal-gradient-hypothesis-resurrected-purchase-acceleration-illusionary-goal)
- Nunes y Drèze (2006, *Journal of Consumer Research* 32(4):504–512), "endowed progress effect" en un lavado de autos: tarjeta de 8 sellos desde cero vs 10 sellos con 2 ya puestos (mismo número de compras) → canje 19 % vs 34 %. Ojo: muchos sitios lo citan erróneamente como estudio de café — [EconPapers, JCR](https://econpapers.repec.org/RePEc:oup:jconrs:v:32:y:2006:i:4:p:504-512); [Coglode](https://www.coglode.com/nuggets/endowed-progress-effect)

### Inferences
- **KPI mínimo viable para una sola persona (5 números semanales):** (1) clientes activos últimos 30 días / total registrados; (2) visitas por cliente activo; (3) % de ventas/visitas que vienen de "regulares" (definición Square: 4+ visitas/año, o adaptar a 4+ en el semestre académico); (4) clientes "en riesgo" (sin visita > 1,5× su intervalo típico); (5) canjes del período y tiempo promedio en completar la tarjeta.
- **RFM recomendado para ~200–500 clientes:** R (días desde última visita) y F (visitas en 90 días) en escala 1–3; M solo si se registra monto. Grupos: *Fans* (R3 F3), *Nuevos prometedores* (R3 F1), *En riesgo* (R1–2 con F alto previo), *Dormidos* (R1 F1), *Ocasionales*. Con tarjeta de sellos, F y R ya capturan casi todo; M es secundario si el ticket es casi fijo (una galleta/café).
- **Cohortes:** con pocos cientos, usar cohortes mensuales (mes de registro) y una sola pregunta: "¿qué % volvió al menos una vez en los 30 días siguientes?" — es el KPI más sensible al cambio de producto o servicio. Con <30 personas por cohorte, los % saltan mucho: mirar tendencias de 2–3 meses, no semana a semana.
- **Mapa decisión → dato (para negocio de galletas/café en campus):**
  - *Planificación de producción / merma:* visitas por día de semana y franja horaria → cuántas unidades hornear; requiere timestamp por sello.
  - *Qué sabores mantener o eliminar:* sabor por visita → % de recompra del sabor (¿quién lo prueba vuelve a pedirlo?) mejor que ventas totales; requiere registrar producto.
  - *Precio y promos:* promociones en días/horas valle detectadas en el histograma de visitas; aprovechar el goal-gradient (empujar a quienes les faltan 1–2 sellos) en vez de descuentos generales.
  - *Dónde/cuándo vender en campus:* si se registra punto de venta/ubicación, comparar visitas y clientes nuevos por lugar; calendario académico (pruebas, vacaciones) como variable.
  - *A quién reactivar:* lista "en riesgo" semanal con mensaje push personal; medir % reactivado vs referencia 5–12 %.
  - *Programa de embajadores:* top 10–20 clientes por frecuencia = candidatos naturales.
  - *Flujo de caja:* visitas esperadas × ticket promedio por semana; pasivo de recompensas = tarjetas casi completas × costo del premio (cuántas galletas gratis "debo").
- **Diseño de tarjeta:** el proyecto usa 8 sellos (`CHECK sellos_actuales <= 8` en `supabase/migrations`); la evidencia sugiere que regalar 1–2 sellos al registrarse (tarjeta de 10 con 2 marcados) puede acelerar la primera tarjeta completada sin cambiar el costo efectivo.

### Gaps
- No encontré benchmarks publicados de retención por cohorte o intervalo entre visitas específicos para micro-panaderías, marcas de galletas o venta en campus; los umbrales de inactividad son reglas de proveedores.
- No pude verificar el texto completo del extracto HBR 2000 de Reichheld & Schefter (fetch bloqueado); la cifra 25–95 % debe citarse como "atribuida a Bain/Reichheld".
- No encontré estudios que validen RFM específicamente con <500 clientes; la recomendación de escala 1–3 es de guías prácticas, no académica.

## 2. Funciones innovadoras vistas en startups/academia: pronóstico de demanda desde patrones de visita, resúmenes semanales con IA y "acciones recomendadas", feedback/ratings ligados a compra, referidos, desafíos gamificados, votación comunitaria de sabores, pre-pedido/reserva vía tarjeta, insights de merma

### Takeaway
Las funciones con mejor respaldo para un micro-negocio son: (a) pronóstico de producción simple a partir del historial (evidencia académica y de proveedores de 10–30 % menos merma/devoluciones), (b) programas de referidos (clientes referidos ~18 % más propensos a quedarse, evidencia Wharton), (c) mecánicas de progreso en la tarjeta (goal-gradient / endowed progress), y (d) asistentes de IA tipo "resumen + recomendación", que en 2026 ya ofrecen plataformas grandes como Square. La votación de sabores y el pre-pedido tienen buenos ejemplos pero casi sin cifras independientes.

### Cited Findings
**Pronóstico de demanda / merma**
- Evaluación de ciclo de vida (TU Berlin) del servicio en la nube "Foodforecast" (machine learning) para panaderías: reducción promedio de 30 % en devoluciones (principalmente pan y bollos) según reportes de ventas; los autores advierten incertidumbres metodológicas y de datos — [TU Berlin, DepositOnce](https://depositonce.tu-berlin.de/items/162a5cdb-17f5-4110-9d22-688f321be672/full)
- Estudio sobre panaderías pequeñas en Eslovenia (Lipnik): las brechas de planificación de producción agravan la merma de pan; prueba modelos simples de inventario para reducir merma en origen y mejorar utilidad; señala que las grandes panaderías usan herramientas avanzadas mientras las pequeñas tienen márgenes ajustados y pocos recursos — [Managing Global Transitions / hippocampus.si](https://www.hippocampus.si/ISSN/1854-6935/23.259-294.pdf)
- Investigación-acción en una panadería brasileña (UFU): el factor clave de sobreproducción era la falta de cualquier técnica de pronóstico de demanda — [Repositorio UFU](https://repositorio.ufu.br/handle/123456789/24020)
- Proyecto europeo PrO4bake: participantes eran panaderías artesanales de 1 a 3 trabajadores; objetivo optimizar producción y predicción de demanda — [Core.ac.uk](https://core.ac.uk/download/482733157.pdf)
- Caso de proveedor (GlobalBake) en Red Hen Baking (Vermont, artesanal): devoluciones bajaron rápido bajo la meta de 10 % y ventas subieron 24 %, inversión recuperada en <6 meses; publicado por el proveedor — [CaseStudies.com, Red Hen](https://www.casestudies.com/company/globalbakeus/case-study/reduced-waste-and-improved-sales-sees-investment-recouped-in-less-than-six-months)
- PYMEs panaderas en Yogyakarta: simulación (proyección, no medición) de 19 % de reducción de merma — [IEOM 2026](https://ieomsociety.org/proceedings/bangkok2026/215.pdf)
- Bakkerij Aernoudt (Bélgica, 35 tiendas): forecasts con ML mejoraron precisión (caso de proveedor, cadena, no micro) — [element61](https://element61.be/en/node/43436)

**Resúmenes con IA / acciones recomendadas**
- Square lanzó en 2026 "Square AI", asistente en lenguaje natural para que el comercio consulte sus datos, combinando datos propios con contexto local (clima, eventos, tendencias del barrio); gratis para vendedores del Reino Unido — [Square UK, prensa](https://squareup.com/gb/en/press/square-ai); [Business Wire, feb 2026](https://www.businesswire.com/news/home/20260210922162/en/Introducing-Square-AI-Helping-UK-Small-Businesses-Turn-Instinct-Into-Confident-Decisions)
- "Managerbot" de Square: monitorea operación, entrega insights proactivos y automatiza tareas; su valor descansa en la integración con pagos, loyalty y marketing; encuesta encargada por Square: 60 % de encuestados ya usa herramientas de IA — [Pulse, Square AI agent](https://www.pulse.bot/ecommerce/news/new-square-ai-agent-automates-daily-tasks-for-main-street-sellers-d8764e4e-a6a7-4a33-b9c8-4d735eef7035/); [TechRadar](https://www.techradar.com/pro/square-is-letting-business-owners-get-more-ai-insight-into-their-neighborhoods-and-even-accept-bitcoin)

**Referidos**
- Van den Bulte, Bayer, Skiera y Schmitt (Wharton/JMR): ~10.000 clientes de un banco alemán durante ~33 meses; los referidos tuvieron mayor margen (ventaja que se erosiona con el tiempo) y mayor retención (ventaja que persiste); ~18 % más probabilidad de quedarse. Mecanismos: mejor "match" cliente–empresa y enriquecimiento social por el referente. (Contexto bancario, no alimentos) — [Schmitt, Skiera & Van den Bulte 2011](https://faculty.wharton.upenn.edu/wp-content/uploads/2012/04/Schmitt-Skiera-vandenBulte-2011-Referral-Programs-Customer-Value.pdf); [Van den Bulte et al. JMR 2018](https://faculty.wharton.upenn.edu/wp-content/uploads/2017/07/VdB-et-al.-JMR-2018.pdf); [Knowledge at Wharton](https://knowledge.wharton.upenn.edu/article/turning-social-capital-into-economic-capital-straight-talk-about-word-of-mouth-marketing/)
- La cifra "82 % de referidos activos tras 33 meses" circula en blogs de proveedores (Talkable) pero no se pudo confirmar en el paper — [Talkable](https://get.talkable.com/blog/referral-marketing-as-a-retention-strategy)

**Gamificación / progreso**
- Ver hallazgos de Kivetz et al. 2006 y Nunes & Drèze 2006 en la sección 1 (aceleración cerca del premio; sellos de regalo aumentan canje 19 %→34 %). La aceleración hacia la meta predice retención y re-enganche — [Columbia, goal-gradient](https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf)
- Comunicado de JCR: si no se da una razón para el progreso regalado, el efecto solo aparece cuando se entrega en moneda alternativa (puntos) — [EurekAlert](https://eurekalert.org/news-releases/904084)

**Feedback ligado a compra y votación de sabores**
- Resch&Frisch (panadería, Austria) con app de fidelización de hello again: +12,7 % visitas de clientes cuatro meses después del lanzamiento; recoge feedback directo en la app para responder rápido (caso del proveedor) — [hello again, Resch&Frisch](https://www.helloagain.com/en/customers/bakeries/success-story-resch-frisch)
- Programa de Maison Kayser permite a clientes votar la próxima receta (co-creación de contenido) — [Pongo, Maison Kayser](https://en.heypongo.com/blog/carte-de-fidelite-boulangerie-maison-kayser)
- Ejemplos de marcas grandes: Auntie Anne's "Pretzel Nation" (fans eligen sabor nuevo); Dawn Foods "Cake Co-Creation Project" con panaderías (ganadores: café, coco y miel); Ben & Jerry's sabores por ciudad votados — [Trend Hunter](https://www.trendhunter.com/trends/pretzel-nation); [Supermarket Perimeter](https://www.supermarketperimeter.com/articles/4085-dawn-unveils-three-creative-cake-flavors); [Grocery Dive](https://www.grocerydive.com/news/ben-jerrys-to-launch-city-specific-flavors-chosen-by-non-traditional-vo/537212/)
- Advertencia: muchas iniciativas de co-creación fracasan cuando la marca no cumple lo que la comunidad eligió — [Social Media Today, Glacéau](https://www.socialmediatoday.com/news/beyond-the-campaign-crowdsourcing-co-creation-with-glaceau/482279/)
- "Desafío de sabor de barrio" (proponer + votar + lanzar el ganador) como táctica de bajo costo para testear sabores — [Zigpoll](https://www.zigpoll.com/content/can-you-suggest-effective-promotional-strategies-to-test-the-market-appeal-of-a-new-ice-cream-flavor-in-a-small-neighborhood-setting)

**Pre-pedidos**
- Guías del sector recomiendan pronóstico con historial de ventas y sistemas de pre-pedido para producir contra demanda conocida — [Waste Managed UK](https://wastemanaged.co.uk/our-news/bakery/how-to-reduce-bakery-waste)
- Proveedores afirman reducciones de merma de 15–25 % con apps de pre-pedido (Kolonell, sin datos publicados); Jamezz/Deonde lo plantean sin cifras medidas. Costo acumulado de POS + pre-pedido + inventario puede ser relevante; un formulario o pedidos por mensaje puede bastar en negocios chicos — [Kolonell 2026](https://kolonell.com/en/blog/bakery-preorder-management-app-accra-2026); [Jamezz](https://jamezz.com/industries/bakeries); [Nopex](https://www.nopex.cloud/blog/bakery-pre-ordering-app)

### Inferences
- **Priorización para un estudiante emprendedor (costo ≈ 0, una persona):**
  1. *Registro de eventos* (cada sello con fecha/hora y, opcionalmente, producto) — habilita todo lo demás.
  2. *Lista semanal "a quién escribir"* (en riesgo + a 1–2 sellos del premio) con push personal — usa goal-gradient y reactivación, impacto directo.
  3. *Resumen semanal automático* en lenguaje natural ("esta semana: 42 visitas, +8 % vs promedio; 6 clientes en riesgo; el martes fue tu peor día") con 1–3 acciones sugeridas — versión micro de Square AI/Managerbot; un LLM puede redactarlo a partir de 5 KPIs ya calculados (evitar que el LLM calcule números).
  4. *Referidos con código en la tarjeta* (sello extra a ambos) — evidencia Wharton de mejor retención; fácil de medir.
  5. *Rating de 1 toque del sabor tras el sello* + *votación del próximo sabor* — feedback ligado a compra real (evita reseñas de no-clientes); comprometerse a producir el ganador.
  6. *Pre-pedido/reserva del día* (p. ej. "apártame 2 galletas para las 13:00 en el campus") — reduce incertidumbre de producción; empezar con un botón que genere mensaje antes de construir sistema.
  7. *Pronóstico simple:* promedio de las últimas 4 semanas del mismo día × factor de calendario académico; el paso a ML no se justifica con pocos cientos de clientes (las evidencias de 30 % de reducción son de servicios ML sobre panaderías con más volumen).
- **Desafíos gamificados viables:** "prueba 3 sabores distintos este mes", "racha de 3 semanas seguidas", "trae a un amigo" — cada uno debe atarse a una decisión del dueño (descubrir sabores, suavizar días valle, adquirir clientes), no ser solo diversión.

### Gaps
- No encontré estudios independientes (no-proveedor) que midan el efecto de pre-pedidos en la merma de micro-panaderías.
- No encontré evaluaciones publicadas de resúmenes semanales de IA para dueños de micro-negocios (solo anuncios de producto de Square); no hay evidencia de impacto en decisiones o ventas.
- No encontré cifras de efecto de votación comunitaria de sabores sobre retención o ventas en negocios pequeños.
- La evidencia de referidos proviene de banca; su traslado a ticket bajo (galletas/café) es inferencia.

## 3. Evidencia o casos con resultados medibles (lift de retención, reducción de merma, ingresos) en panaderías/cafés pequeños

### Takeaway
La evidencia cuantitativa es escasa y mayormente de proveedores: +12,7 % de visitas (Resch&Frisch con app), −30 % de devoluciones (Foodforecast, evaluación académica), devoluciones <10 % y +24 % ventas (Red Hen, caso de proveedor), y la evidencia experimental más sólida es sobre la mecánica de la tarjeta (19 %→34 % de canje) y el comportamiento cerca del premio. No encontré estudios independientes en micro-negocios de comida de una sola persona.

### Cited Findings
- Resch&Frisch: +12,7 % de visitas de clientes cuatro meses después de lanzar su app de fidelización (caso publicado por el proveedor hello again) — [hello again](https://www.helloagain.com/en/customers/bakeries/success-story-resch-frisch)
- Foodforecast: −30 % promedio en devoluciones de panadería según reportes de ventas, con advertencias metodológicas de los autores (evaluación de ciclo de vida, TU Berlin) — [DepositOnce TU Berlin](https://depositonce.tu-berlin.de/items/162a5cdb-17f5-4110-9d22-688f321be672/full)
- Red Hen Baking: devoluciones bajo meta de 10 %, +24 % en ventas (atribuido parcialmente al software por el dueño), payback <6 meses (caso de proveedor) — [CaseStudies.com](https://www.casestudies.com/company/globalbakeus/case-study/reduced-waste-and-improved-sales-sees-investment-recouped-in-less-than-six-months)
- Experimento de campo (lavado de autos): 34 % vs 19 % de tarjetas completadas con 2 sellos regalados — [EconPapers JCR 2006](https://econpapers.repec.org/RePEc:oup:jconrs:v:32:y:2006:i:4:p:504-512)
- Café real: compras se aceleran al acercarse al café gratis; tarjeta 12 con 2 de regalo se completa más rápido que tarjeta 10 — [Kivetz et al. 2006](https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf)
- Una fuente secundaria afirma que el estudio de café de Kivetz siguió a 948 miembros; no verificado en el paper — [Yu-kai Chou](https://yukaichou.com/behavioral-analysis/goal-gradient-hypothesis-hull-kivetz-motivation-acceleration/)
- Regulares (4+ visitas/año) ≈ 6× ingreso anual vs una visita (datos Square, Canadá 2026) — [Square](https://squareup.com/ca/fr/press/canada-square-local-economy-report)
- Cadena de café: 13.000 clientes inactivos reactivados, retorno 6× (proveedor Adentro) — [CaseStudies.com, Adentro](https://www.casestudies.com/company/adentro/case-study/zenreach-brews-up-a-new-way-to-bring-back-lost-customers)

### Inferences
- Para el informe, es honesto presentar estos números como "rango de lo que reportan otros", y proponer que el propio negocio mida su línea base antes/después (p. ej. 4 semanas sin acción vs 4 semanas con mensajes a clientes "en riesgo").
- La mecánica de la tarjeta (sellos regalados, recordatorio cerca del premio) es la palanca con evidencia más robusta y costo casi cero.

### Gaps
- No hallé casos medidos de carros de café, ventas en campus universitario o marcas de galletas tipo emprendimiento estudiantil.
- No hallé estudios que aíslen el efecto de un panel de datos para el dueño (vs. la tarjeta en sí) sobre ingresos.
- Los casos de Resch&Frisch y Red Hen no pudieron leerse completos (fetch bloqueado): faltan tamaño del negocio y metodología exacta.

## 4. Trampas: métricas vanidosas, calidad de datos (sellos sin info de producto), privacidad, tiempo del dueño

### Takeaway
La trampa más grande para este proyecto es de calidad de datos: hoy la base guarda solo un contador de sellos actual por cliente (sin historial ni producto), lo que impide casi todas las decisiones de la sección 1. Además: no confundir inscritos con activos, no leer "breakage" como ahorro, prepararse para la Ley 21.719 de datos personales en Chile (vigencia prevista 1-dic-2026, con proyecto de postergación a 2027), y diseñar todo para 5 minutos semanales del dueño.

### Cited Findings
- **Métricas vanidosas:** total de inscritos es la métrica vanidosa clásica; tasa de canje mide actividad, no lealtad; breakage alta suele significar recompensas poco atractivas; segmentar breakage por cohorte porque el promedio puede ocultar que los mejores clientes dejaron de canjear — [Talon.One](https://www.talon.one/blog/loyalty-program-analytics-kpis); [Prodata](https://www.prodata.de/kundenbindung/en/how-do-i-measure-the-success-of-a-loyalty-program/); [Epsilon](https://www.epsilon.com/us/insights/blog/loyalty-program-metrics)
- **Calidad de datos:** limpiar duplicados y estandarizar identificadores de cliente antes de un RFM — [MCP Analytics](https://mcpanalytics-website.pages.dev/whitepapers/whitepaper-rfm-segmentation)
- **Sobre-ingeniería:** muchas pymes complican el puntaje con demasiados tramos/pesos — [Pipedrive](https://www.pipedrive.com/en/blog/what-is-rfm)
- **Co-creación sin cumplimiento** quema confianza — [Social Media Today](https://www.socialmediatoday.com/news/beyond-the-campaign-crowdsourcing-co-creation-with-glaceau/482279/)
- **Privacidad (Chile):** la Ley 21.719 crea la Agencia de Protección de Datos Personales y la mayoría de las fuentes fija su entrada en vigor el 1 de diciembre de 2026; no excluye a las pymes (todas deben cumplir según el tratamiento que hagan) — [Diario Constitucional, jun 2026](https://www.diarioconstitucional.cl/2026/06/12/la-ley-21-719-entra-en-vigor-el-1-de-diciembre-y-expone-vacios-en-regulacion-de-pequenas-empresas/); [Diario Estrategia](https://www.diarioestrategia.cl/texto-diario/mostrar/5993452/ley-proteccion-datos-desafio-pymes-no-pueden-seguir-postergando)
- Durante los primeros 12 meses de vigencia, empresas de menor tamaño (Ley 20.416) podrían recibir amonestaciones escritas en lugar de multas — [YourDevs (proveedor)](https://www.yourdevs.net/blog/ley-21719-proteccion-datos-chile)
- **Conflicto de fuentes:** Cuatrecasas (sept 2026) informa que el Mensaje N°110-374 del 31-ago-2026 propone postergar la vigencia al 1-dic-2027 y extender a todas las empresas el beneficio de amonestación en el primer año; es un proyecto de ley (boletín 18.623-07), no ley aprobada a la fecha de las fuentes — [Cuatrecasas](https://www.cuatrecasas.com/es/spain/mercantil/art/proyecto-que-modifica-ley-proteccion-datos-personales); [Ecosistema Startup](https://ecosistemastartup.com/?p=104145)
- **Esquema actual del proyecto (revisión directa del repo):** tablas `clientes` (id, nombre_completo, enlace_unico, created_at), `fidelidad` (cliente_id único, `sellos_actuales` 0–8, updated_at), `configuracion` y `suscripciones_push`. No existe tabla de eventos/visitas ni campo de producto/sabor — `/home/user/fidelidad-benja/supabase/migrations/` (archivo local, no web)

### Inferences
- **Calidad de datos = prioridad #1:** con solo `sellos_actuales` y `updated_at` no se pueden calcular frecuencia, recencia real, intervalos entre visitas, cohortes, días/horas pico ni sabor preferido; al canjear se pierde el historial. Se necesita una tabla de eventos append-only (cliente_id, tipo [sello/canje/referido], timestamp, opcional: producto/sabor, lugar, monto). Registrar el sabor debe costar ≤1 toque en el panel admin, o el dueño dejará de hacerlo.
- **Minimizar datos personales:** guardar solo nombre y lo necesario; no pedir RUT ni fecha de nacimiento si no se usa; consentimiento explícito para push/marketing; botón para borrar cuenta (el esquema ya tiene `ON DELETE CASCADE`). Con la Ley 21.719 cerca, una política de privacidad corta en el registro es barata y reduce riesgo.
- **Tamaño de muestra:** con pocos cientos de clientes, un sabor con 15 ventas no permite concluir; usar umbrales mínimos (p. ej. ≥30 ventas antes de declarar "malo") y mirar tasa de recompra del sabor en vez de volumen.
- **Tiempo del dueño:** el panel debe responder "¿qué hago esta semana?" en <5 minutos: 3–5 números + 1–3 acciones sugeridas + listas con botón de acción (enviar push). Evitar gráficos que no cambian ninguna decisión.
- **Sesgo de la tarjeta:** los datos solo cubren a clientes inscritos; ventas a no-inscritos no aparecen, así que el pronóstico de producción debe combinar visitas de la tarjeta con un conteo simple de ventas totales del día (aunque sea manual).
- **Costo de recompensas:** monitorear "galletas gratis comprometidas" (tarjetas a 1–2 sellos del premio) como pasivo para el flujo de caja.

### Gaps
- No verifiqué el estado legislativo final del proyecto de postergación de la Ley 21.719 (boletín 18.623-07) a fines de octubre 2026; revisar bcn.cl / Diario Oficial.
- No encontré literatura específica sobre "carga cognitiva/tiempo" de dueños de micro-negocios al usar dashboards; las recomendaciones de simplicidad son inferencia y práctica de proveedores.
- No encontré fuentes sobre aplicabilidad de normas de consentimiento para notificaciones push web en Chile específicamente.
