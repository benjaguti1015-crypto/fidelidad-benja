# Analítica para el dueño en plataformas internacionales de tarjetas de fidelidad digital (EE.UU., Europa, LatAm sin Chile, Asia)

> Nota metodológica: en esta sesión la descarga directa de páginas (WebFetch) a squareup.com, loopyloyalty.com y docs.boomerangme.cards falló por restricción de red. Por eso, los datos salen de los fragmentos y resúmenes que devuelve el buscador sobre páginas oficiales (centros de ayuda, páginas de producto) y de sitios de terceros. Casi todas las cifras de impacto las publican los propios proveedores y no están verificadas por terceros. Fecha de corte: octubre de 2026.

## 1. ¿Qué plataformas lideran y qué analítica le dan al dueño?

### Takeaway
La analítica se divide en tres niveles. (a) Las apps simples de sellos (Loopy Loyalty, Stamp Me, SumUp Loyalty, PassKit) muestran conteos: inscritos, sellos, canjes, visitas por día/semana/mes y exportación CSV. (b) Los CRM de punto de venta (Square, Toast) suman retención, clientes "habituales" y "perdidos" (lapsed) calculados solos, comparación miembro vs no miembro y análisis por producto. (c) Las plataformas de gama media/alta (Boomerangme, Kangaroo, Smile.io) agregan segmentación RFM, CLV, cohortes, ROI de campañas y predicción de abandono (churn). Para un negocio pequeño, lo que más aporta es el nivel (b) con algo de RFM.

### Cited Findings

**Square Loyalty / Square Customer Directory (EE.UU., también IE/GB/CA/AU)**
- El resumen de Loyalty entrega métricas del desempeño del programa, filtrables por fecha y por local. En "Reports" se elige entre **Visits, Sales o Top Customers** — [Square Help 6467](https://squareup.com/help/us/en/article/6467-view-your-square-loyalty-metrics)
- Reportes de cada visita y transacción ligada a recompensas, comparación de **visitas y gasto promedio** y desglose de top clientes por visita y por nivel (tier) — [Square Help 6467](https://squareup.com/help/article/6467)
- Compara gasto promedio y visitas de clientes **con fidelidad vs sin fidelidad** — [GetApp (tercero)](https://www.getapp.com/customer-management-software/a/square-loyalty/features)
- Square publicó métricas nuevas como **frecuencia de visita** — [Square Seller Community](https://sellercommunity.com/t5/Product-Updates/View-New-Loyalty-Program-Metrics-such-as-Visit-Frequency-and/ba-p/105660)
- Los reportes solo están en el Dashboard web y requieren un programa activo. Las fuentes no coinciden en el plan necesario (unas dicen Square Plus/Premium, otras "suscriptores de Square Loyalty") — [Square Help 6467](https://squareup.com/help/ca/en/article/6467)
- Dos **"smart groups" vienen por defecto: "Regulars" y "Lapsed"**. Por defecto, Regulars = 3 visitas en los últimos 6 meses. Los grupos se actualizan solos según la actividad y se pueden editar — [Square Help 6245](https://squareup.com/help/us/en/article/6245-manage-customer-groups-and-filters)
- Campaña automática de **win-back**: correo a clientes perdidos, definidos como quienes hicieron 3 compras en 6 meses pero no vuelven hace 6 semanas — [Square Help 5660](https://squareup.com/help/ie/article/5660); [Square Help 3834](https://squareup.com/help/us/en/article/3834)
- Limitación que reporta un comerciante: el win-back solo apunta a ex "Regulars", no a quien vino una sola vez — [Square Community](https://community.squareup.com/t5/Square-Marketing/Winback-lapsed-customers/m-p/807680); [Seller Community](https://www.sellercommunity.com/t5/Troubleshooting/Can-I-customize-the-time-that-is-considered-to-be-a-quot-lapsed/m-p/54554)

**Toast (EE.UU./UK, restaurantes) – Guest Insights + Guest CRM**
- Guest Insights muestra visitas repetidas, ticket promedio y **tasa de retención** (% de clientes que volvieron a pedir dentro del rango de fechas elegido) — [Toast Support](https://support.toasttab.com/en/article/Guest-Insights-Overview)
- "Order Volume and Frequency": pedidos promedio por cliente y frecuencia promedio. Separa clientes **nuevos, recurrentes y perdidos**. Un cliente perdido es quien pidió en los 6 meses previos al rango pero no dentro de él — [Toast Support](https://support.toasttab.com/en/article/Guest-Insights-Overview?lang=en_US)
- **Análisis por producto ligado a la retención**: marca los ítems que más piden los recurrentes ("retention drivers") y los que más pedían los perdidos ("churn contributors") — [Toast Support](https://support.toasttab.com/en/article/Guest-Insights-Overview)
- Cada módulo tiene botones para pasar a los clientes frecuentes o de mayor gasto a Toast Marketing — [Toast Support](https://intercom.help/toast-central/en/articles/11563502-guest-insights-overview)
- El Guest CRM trae una vista **"High Value Guests at Risk"** y ofertas para recuperar perdidos. Junta pedidos, visitas y reservas en un solo perfil — [Toast Guest CRM](https://pos.toasttab.com/products/guest-crm)
- La integración con Klaviyo lleva frecuencia y último producto comprado para campañas de win-back — [Klaviyo blog](https://marketing-origin-netlify.klaviyo.com/blog/toast-integration-elevate-your-restaurants-marketing)

**Loopy Loyalty (Australia/global, sellos en Wallet)**
- **Estima los ingresos que genera el programa**: el comerciante define cuánto vale un sello y cuánto cuesta la recompensa. También muestra la actividad e historial de cada cliente — [Loopy Loyalty – Insights & Reporting](https://loopyloyalty.com/features/analytics/)
- Vista de clientes: quién se inscribió, quién está activo y quién canjeó. Exporta a CSV. El dashboard web muestra inscritos, sellos emitidos y recompensas ganadas y canjeadas — [Loopy Web Dashboard](https://loopyloyalty.com/features/web-app/)
- Un tercero la describe como analítica "básica": actividad de sellos, tasa de canje y frecuencia de visita — [Sig.ai](https://geo.sig.ai/brands/loopy-loyalty.md)

**Boomerangme (global, Wallet, alcance en LatAm)**
- **Análisis RFM integrado en el CRM**: ordena a los clientes por recencia, frecuencia y monto. Los etiqueta como **Champions, Loyal–Regular, Needs attention, At risk, Sleeping**, y los umbrales de Recencia y Frecuencia se ajustan al negocio — [Boomerangme Docs – RFM](https://docs.boomerangme.cards/customers-crm/rfm-analysis)
- Los segmentos RFM se exportan a ActiveCampaign para campañas personalizadas — [ActiveCampaign](https://activecampaign.com/apps/boomerangme-integration)
- Capterra lista segmentación de campañas, SMS, **seguimiento de referidos** y estadísticas en tiempo real — [Capterra](https://www.capterra.com/p/241848/Boomerangme). Un sitio de reseñas dice que su reporting es "más básico" que el de plataformas enterprise — [FitGap](https://us.fitgap.com//products/001633/boomerangme)

**Kangaroo Rewards (Canadá/EE.UU.)**
- El dashboard mide **CLV, tasa de recompra, métricas de churn y ROI del programa**. Ofrece "99+ segmentos", predicción de churn y seguimiento del ROI de campañas (análisis avanzado en el plan Elite) — [Kangaroo](https://loyalty.kangaroorewards.com/home-2/); [Kangaroo – Robust reporting](https://loyalty.kangaroorewards.com/fr/robust-reporting)
- Los precios publicados no coinciden: USD 349/mes en una página de Kangaroo y desde 79/mes en GetApp — [Kangaroo](https://loyalty.kangaroorewards.com/lp-master-version-3/); [GetApp](https://www.getapp.com/project-management-planning-software/a/kangaroo-rewards/)

**Smile.io (e-commerce/Shopify)**
- Panel de atribución: **AOV de miembros vs no miembros, tasa de recompra e ingresos incrementales**. Mide recompra, CLV e ingreso por miembro **por cohorte, por nivel y por fuente de adquisición** — [Smile.io](https://smile.io/lp/customer-retention-software)
- "Loyalty program insights" está en los planes Essential a Enterprise. Algunas funciones (segmentos, benchmarks de desempeño, VIP insights) son solo de planes altos — [Smile Help](https://help.smile.io/en/articles/12587689-understand-loyalty-program-insights)
- Crítica de un competidor interesado: Smile muestra puntos y canjes aparte de los pedidos, cohortes y LTV reales de la tienda — [Polar Analytics](https://www.polaranalytics.com/integrations/smile-io)

**Stamp Me (Australia/global)**
- Mencionan reportes, seguimiento de retención y "reportes personalizados". En el centro de ayuda hay una sección Analytics con estados de cada sello — [Stamp Me Help](https://help.stampme.com/en/articles/15725055-what-are-the-stamp-statuses); [Stamp Me llms.txt](https://www.stampme.com/llms.txt)
- No hay evidencia de mapas de calor ni de reportes de cohortes en Stamp Me. Ojo: el "Customer Retention Dashboard" con gráfico de ingreso por cliente según mes de adquisición es de **Stamped.io**, otra empresa — [Stamped blog](https://stamped.io/blog/4-plays-to-optimize-our-new-loyalty-analytics-update)

**SumUp Loyalty (ex Fivestars; Europa/EE.UU.)**
- Registra visitas e inscripciones con vistas diarias, semanales y mensajes. La pestaña Customers muestra el historial de visitas y el saldo de sellos o puntos. También mide el desempeño de campañas — [SumUp UK](https://www.sumup.com/en-gb/sumup-loyalty-program/)
- Precio: £19/mes más el costo del dispositivo de cara al cliente — [SumUp UK](https://sumup.com/en-gb/loyalty-program)
- Según un tercero, incluye analítica de referidos y retención — [Cuspera](https://www.cuspera.com/compare/fivestars-vs-lightspeed-loyalty/4911/12186)

**PassKit (infraestructura de pases Apple/Google Wallet)**
- Mide eventos del ciclo de vida del pase: creación, **instalación, actualización, desinstalación** y borrado, además de la fuente de distribución. **No mide** cuántas veces se abre el wallet, se ve el pase ni impresiones — [PassKit Help](https://help.passkit.com/en/articles/3721146-how-are-my-analytics-calculated)
- Las instalaciones y desinstalaciones se deduplican (solo cuenta la primera por tipo de wallet). Hay webhooks para enviarlas a un CRM — [PassKit Help](https://help.passkit.com/en/articles/4739416-subscribe-to-passkit-webhooks); [PassKit Wallet Pass Analytics](https://passkit.com/wallet-pass-analytics/)
- También ofrece seguimiento y analítica de códigos QR — [PassKit QR Code Analytics](https://passkit.com/qr-code-analytics/)

**Asia**
- **LINE (Japón)**: la "shop card" funciona como tarjeta de puntos o sellos dentro de la cuenta oficial. La analítica de la cuenta muestra número de amigos, sus atributos y por qué vía llegaron. Se pueden segmentar mensajes por edad, región y género — [LINE Business Guide (LY Corp)](https://www.lycbiz.com/sites/default/files/media/jp/download/EN_LINE%20Business%20Guide_202404-202409_summary.pdf); [respond.io](https://respond.io/blog/line-business)
- **LINE (Tailandia)**: no se encontró una shop card nativa documentada. Una guía tailandesa recomienda revisar si la billetera de puntos y el flujo de canje viven dentro de la interfaz de LINE — [Greenfish blog](https://blog.ourgreenfish.com/the-business-mind/12-loyalty-platform-features-to-compare-in-thailand)
- **WeChat (China)**: la tarjeta de membresía oficial registra el comportamiento del usuario con la tarjeta y estadísticas por canal de distribución — [WeChat Dev Docs](https://developers.weixin.qq.com/doc/service/en/guide/product/card/Membership_Cards/introduction.html). La analítica nativa de mini programas ("We Analytics") trae embudos y análisis de acciones — [WeChat WeData](https://developers.weixin.qq.com/miniprogram/en/analysis/wedata/intro/). Críticas: cuesta exportar datos, y muestra el "qué" pero no el "por qué" — [Wiredcraft](https://wiredcraft.com/blog/wechat-mini-program-analytics-what-more-to-know/)
- Weimob y Youzan ofrecen tienda + campañas + analítica + membresía. Su analítica de miembros sirve para medir el ROI de descuentos — [Walkthechat](https://walkthechat.com/3-best-platforms-for-wechat-membership-card/); [Weimob](https://m.weimob.com/en/wsc)

**Latinoamérica (sin Chile)**
- **Fidelimax (Brasil)**: su centro de ayuda lista encuestas **NPS**, cashback, **referidos**, automatización por WhatsApp y campañas de cumpleaños. No se encontró documentación de reportes de inactivos — [Nuvemshop – Fidelimax](https://atendimento.nuvemshop.com.br/marketing-e-comunicacao/como-integrar-o-fidelimax-na-minha-loja)
- **Noknoker (México)**: tarjeta digital con QR único y "reportes estadísticos" sobre el perfil de los visitantes — [Blog Think Big](https://blogthinkbig.com/tendencias-de-los-programas-de-lealtad-y-fidelizacion-de-clientes)
- **Woncards**: su panel muestra ingresos de clientes fieles, visitas y registrados — [G2 Woncards](https://www.g2.com/products/woncards/reviews)
- **Tienda de Puntos (Argentina → México)**: puntos por compra canjeables — [El Cronista](https://www.cronista.com/negocios/crearon-una-empresa-que-permite-mimar-a-los-clientes-ya-estan-en-300-ciudades-y-ahora-llegan-a-mexico)

### Inferences
- Para un negocio de galletas con QR + Wallet, el "piso" que ya ofrece la competencia barata (Loopy, Stamp Me, SumUp) es: inscritos, activos, sellos, canjes, visitas por período y CSV. El diferenciador al alcance de una app propia está en tres cosas que hoy traen Square y Toast: (1) grupos automáticos de "Regulares" y "Perdidos" con umbrales editables, (2) qué productos se asocian a quien vuelve y a quien se va, y (3) una estimación de ingresos del programa como la de Loopy (valor del sello vs costo del premio).
- El RFM de Boomerangme, con 5 etiquetas y umbrales configurables, se puede replicar con solo fecha de visita, número de visitas y monto. Es el modelo de "segmentos con nombre" más usado en el segmento pyme.
- Si se usan pases de Wallet, las **desinstalaciones del pase** (que PassKit mide) son una señal temprana de abandono que casi ninguna app de sellos le muestra al dueño.

### Gaps
- No se pudo abrir el texto completo de los centros de ayuda (Square, Loopy, Boomerangme) por restricción de red. Faltan definiciones exactas de cada métrica y capturas.
- No se encontró documentación de analítica de BonusQR (Polonia) ni de Yotpo en esta búsqueda.
- No hay información confiable sobre la analítica para el dueño de apps de fidelidad en México o Argentina más allá de descripciones de marketing.
- No se confirmó si Square o Toast ofrecen mapas de calor de horas o días específicos de fidelidad. Ambos tienen reportes de ventas por hora en su POS general, pero no se verificó en esta búsqueda.

## 2. ¿Qué métricas son estándar?

### Takeaway
Casi todas las plataformas tienen: inscritos, clientes activos, sellos/puntos emitidos, canjes (tasa de canje), visitas y frecuencia, top clientes, y gasto de miembros vs no miembros. Las de gama media agregan: retención por período, clientes perdidos o en riesgo, segmentos RFM y referidos. CLV, cohortes, ROI de campañas y NPS aparecen en los planes avanzados (Kangaroo Elite, Smile Growth/Plus, Fidelimax con NPS). No se encontró evidencia de mapas de calor de horas en las apps de sellos.

### Cited Findings
- **Retención y frecuencia**: Toast define la tasa de retención como el % que volvió dentro del rango, más la frecuencia promedio de pedidos — [Toast Support](https://support.toasttab.com/en/article/Guest-Insights-Overview). Square agregó frecuencia de visita — [Square Seller Community](https://sellercommunity.com/t5/Product-Updates/View-New-Loyalty-Program-Metrics-such-as-Visit-Frequency-and/ba-p/105660)
- **Perdidos y en riesgo**: Toast cuenta como perdido a quien pidió en los 6 meses previos y no en el período, y tiene la vista "High Value Guests at Risk" — [Toast Support](https://support.toasttab.com/en/article/Guest-Insights-Overview); [Toast Guest CRM](https://pos.toasttab.com/products/guest-crm). Square usa el smart group "Lapsed" — [Square Help 6245](https://squareup.com/help/us/en/article/6245-manage-customer-groups-and-filters). Boomerangme usa las etiquetas RFM "At risk" y "Sleeping" — [Boomerangme Docs](https://docs.boomerangme.cards/customers-crm/rfm-analysis)
- **RFM**: Boomerangme lo trae nativo y configurable — [Boomerangme Docs](https://docs.boomerangme.cards/customers-crm/rfm-analysis)
- **CLV, cohortes, ROI**: Smile.io mide CLV e ingreso por miembro por cohorte, nivel y fuente — [Smile.io](https://smile.io/lp/customer-retention-software). Kangaroo mide CLV, recompra, churn y ROI de campañas — [Kangaroo](https://loyalty.kangaroorewards.com/home-2/)
- **Miembro vs no miembro**: Square (gasto y visitas) — [GetApp](https://www.getapp.com/customer-management-software/a/square-loyalty/features). Smile (AOV, recompra, ingreso incremental) — [Smile.io](https://smile.io/lp/customer-retention-software)
- **Canje**: Loopy muestra recompensas ganadas vs canjeadas — [Loopy Web Dashboard](https://loopyloyalty.com/features/web-app/). A nivel industria, más de un cuarto de los puntos en EE.UU. no se usa, y en el Reino Unido el 26,2% no se usa y el 11,9% vence sin canjearse — [Business Wire / Antavo 2026](https://business.mammothtimes.com/mammothtimes/article/bizwire-2026-2-3-antavo-global-customer-loyalty-report-more-than-a-quarter-of-us-loyalty-programme-points-go-unspent-with-an-estimated-10-billion-in-savings-lost-annually); [PowerCommerce resumen](https://powercommerce.com/zh/blogs/ecommerce-hub/understanding-the-challenge-of-unused-loyalty-points-insights-from-the-antavo-global-customer-loyalty-report-2026)
- **Referidos**: Boomerangme — [Capterra](https://www.capterra.com/p/241848/Boomerangme). Fidelimax — [Nuvemshop](https://atendimento.nuvemshop.com.br/marketing-e-comunicacao/como-integrar-o-fidelimax-na-minha-loja). SumUp, según un tercero — [Cuspera](https://www.cuspera.com/compare/fivestars-vs-lightspeed-loyalty/4911/12186)
- **NPS/feedback**: Fidelimax incluye encuestas NPS — [Nuvemshop](https://atendimento.nuvemshop.com.br/marketing-e-comunicacao/como-integrar-o-fidelimax-na-minha-loja)
- **Producto**: Toast muestra qué ítems retienen clientes y cuáles se asocian al abandono — [Toast Support](https://support.toasttab.com/en/article/Guest-Insights-Overview)
- **Canal de adquisición**: LINE muestra por qué vía llegaron los amigos — [LINE Business Guide](https://www.lycbiz.com/sites/default/files/media/jp/download/EN_LINE%20Business%20Guide_202404-202409_summary.pdf). WeChat da estadísticas por canal de distribución de la tarjeta — [WeChat Dev Docs](https://developers.weixin.qq.com/doc/service/en/guide/product/card/Membership_Cards/introduction.html). PassKit registra la fuente de distribución del pase — [PassKit Help](https://help.passkit.com/en/articles/3721146-how-are-my-analytics-calculated)
- **Recuperación**: una agencia peruana estima que los flujos de reactivación por correo recuperan entre 5% y 15% de los inactivos (dato de agencia, sin metodología) — [kom.pe](https://kom.pe/programa-fidelizacion-clientes-tienda-virtual-peru/)

### Inferences
- Un panel mínimo bien hecho para el cliente final tendría: (1) activos vs inscritos, (2) tasa de retorno a 30 días, (3) frecuencia promedio, (4) tasa de canje y premios "olvidados", (5) lista de "en riesgo" (por ejemplo, regulares sin visita en X días, como el criterio de 6 semanas de Square), (6) segmentos RFM con nombre y (7) origen de inscripción (QR de cuál punto o evento del campus).
- En un campus, los períodos académicos (vacaciones, exámenes) distorsionan la recencia. Conviene que los umbrales de "perdido" sean editables, como en Square y Boomerangme.

### Gaps
- No se encontró ninguna plataforma de sellos que documente mapas de calor de horas o días ni análisis de cohortes en pyme física (solo Smile.io en e-commerce).
- Faltan benchmarks públicos de tasa de canje o retención "normal" para pequeños negocios de comida.

## 3. ¿Hay funciones innovadoras o con IA?

### Takeaway
La IA aplicada a la fidelidad en pymes se concentra en tres cosas: puntuar el riesgo de abandono, segmentar y automatizar campañas de recuperación, y personalizar ofertas (el caso de referencia es Starbucks Deep Brew). Lo verificable para pymes es sobre todo predicción de churn con una acción sugerida (Kangaroo) y campañas automáticas de win-back con reglas (Square). No se encontró evidencia de previsión de demanda dentro de apps de fidelidad pequeñas. El uso de IA en la gestión de fidelidad pasó de 37,1% a 51,4% de los marketers.

### Cited Findings
- **Churn predictivo con acción recomendada (Kangaroo)**: el modelo puntúa a cada cliente según la caída de su recencia, la baja en su ritmo de visitas y la velocidad de su gasto. Lo clasifica como "recuperable" o "perdido" y sugiere una acción y una ventana de recuperación — [Kangaroo](https://loyalty.kangaroorewards.com/home-2/). Kangaroo también promete campañas "AI-powered" que ajustan la segmentación solas — [Kangaroo](https://loyalty.kangaroorewards.com/lp-master-version-4/)
- **Win-back automático con reglas (Square)**: Square vigila el directorio y envía el correo solo cuando el cliente cumple la condición. Es una regla, no un modelo de IA. No se encontraron funciones de "Square AI" aplicadas a grupos o win-back — [Square Community](https://community.squareup.com/t5/Square-Marketing/Winback-lapsed-customers/m-p/807680)
- **Insights por producto ligados al churn (Toast)**: ver la sección 1 — [Toast Support](https://support.toasttab.com/en/article/Guest-Insights-Overview)
- **Benchmarks contra marcas similares (Smile.io)**: "performance benchmarks" en planes altos — [Smile Help](https://help.smile.io/en/articles/12587689-understand-loyalty-program-insights); [G2 Smile.io](https://www.g2.com/products/smile-io/reviews)
- **Starbucks Deep Brew**: según el CEO, la plataforma de datos e IA sirve para identificar cohortes específicas de miembros de Rewards y darles incentivos relevantes — [Restaurant Dive](https://www.restaurantdive.com/news/starbucks-rewards-loyalty-q3-personalization/706357/). Hubo 34,3 millones de miembros activos en EE.UU. en el primer trimestre de 2024 — [Marketing Dive](https://www.marketingdive.com/news/starbucks-rewards-loyalty-q3-personalization/706322/)
- **Adopción de IA**: el 51,4% de los marketers usa IA en la gestión de fidelidad (vs 37,1% el año anterior). Datos de Antavo GCLR 2026: encuesta a 3.000 marketers y 10.000 consumidores — [Business Wire / Antavo](https://secure.businesswire.com/news/home/20260203264831/en/Antavo-Global-Customer-Loyalty-Report-2026-Marketers-Are-Spending-More-Than-Half-of-Total-Budgets-on-Loyalty); [Antavo blog](https://antavo.com/blog/global-customer-loyalty-report-2026/)
- **Capillary (LatAm/global)** dice ofrecer "advanced AI models" y analítica en tiempo real (afirmación de la empresa) — [Compara Software / LinkedIn](https://mx.linkedin.com/in/diazllaneza)

### Inferences
- Para cientos de clientes no hace falta un modelo de machine learning. Una regla tipo Kangaroo da casi el mismo valor: alerta cuando un cliente supera 1,5–2 veces su intervalo habitual entre visitas, y sugiere una acción ("enviar sello doble") con plazo. Sería además fácil de explicar al dueño.
- Las ideas tipo Toast ("qué galleta compran los que vuelven" vs "qué compraban los que se fueron") son baratas de calcular si cada sello registra el producto. Le sirven directo para decidir el menú.
- Se pueden generar "acciones recomendadas" en lenguaje natural con un LLM a partir de métricas simples (ej.: "12 clientes regulares no vienen hace 3 semanas; envíales un push el lunes"). Ninguna plataforma de sellos de pyme revisada documenta algo así, así que sería un diferenciador.

### Gaps
- No se encontró documentación técnica ni precisión validada del modelo de churn de Kangaroo.
- No se encontró previsión de demanda (cuántas galletas hornear) en ninguna plataforma de fidelidad pyme revisada.
- No se verificaron las funciones de IA de Toast ni de Square ("Square AI") aplicadas a fidelidad.
- Las cifras de impacto de Deep Brew que circulan (por ejemplo, +37% de recompra o +35% de lealtad, según GrowthHQ) no tienen fuente primaria de Starbucks: [GrowthHQ](https://www.growthhq.io/our-thinking/how-starbucks-is-using-ai-in-2025-to-boost-revenue-speed-and-customer-loyaltywithout-losing-its-human-touch). Pitchgrade comenta que la ejecución de la visión de Deep Brew fue "más compleja de lo presentado" — [Pitchgrade](https://pitchgrade.com/companies/starbucks-ai-use-cases). No usar esas cifras como hechos.

## 4. ¿Hay evidencia de impacto (casos y estadísticas)?

### Takeaway
Hay muchas cifras de impacto, pero casi todas las publican los proveedores sin grupo de control: los miembros quizás ya eran más fieles antes de unirse. Lo más sólido es el reporte de Antavo 2026, que también es autodeclarado por los dueños de programas: el 92,7% de quienes miden reporta ROI positivo, con un ROI promedio de 5,3x. McKinsey advierte que los programas genéricos no se asocian a más crecimiento.

### Cited Findings
- **Antavo GCLR 2026**: el 92,7% de los dueños de programas que miden el desempeño reporta ROI positivo. El ROI promedio es 5,3x (vs 5,2x en 2025, tercer año seguido al alza). La satisfacción de los dueños con su programa sube de 69,2% a 83,0%. Fidelidad y CRM se llevan el 51,5% del presupuesto de marketing — [Business Wire](https://secure.businesswire.com/news/home/20260203264831/en/Antavo-Global-Customer-Loyalty-Report-2026-Marketers-Are-Spending-More-Than-Half-of-Total-Budgets-on-Loyalty); [City AM](https://www.cityam.com/?p=2396770)
- **Puntos no usados**: en EE.UU. queda sin usar más de un cuarto de los puntos, unos USD 10 mil millones en ahorros perdidos al año (Antavo) — [Business Wire vía Mammoth Times](https://business.mammothtimes.com/mammothtimes/article/bizwire-2026-2-3-antavo-global-customer-loyalty-report-more-than-a-quarter-of-us-loyalty-programme-points-go-unspent-with-an-estimated-10-billion-in-savings-lost-annually)
- **Smile.io**: los participantes tienen una tasa de recompra 56% mayor que los no participantes (dato del propio proveedor, sin control) — [eCommerce Fast Lane](https://ecommercefastlane.com/the-state-of-ecommerce-customer-loyalty-in-2023/). Caso Charlie Hustle: +35% en tasa de cliente recurrente — [CaseStudies.com](https://www.casestudies.com/company/smileio/case-study/how-rewards-improved-charlie-hustles-repeat-customer-rate-by-35). Stamp-n-Storage: USD 1M en ingresos de miembros en algo más de 9 meses y 38% de recompra — [CaseStudies.com](https://www.casestudies.com/company/smileio/case-study/how-rewards-created-a-38-repeat-purchase-rate). Inkbox: USD 100K en ingresos por recompensas y 80% más de recompras — [CaseStudies.com](https://www.casestudies.com/company/smileio/case-study/how-inkbox-saw-28-in-repeat-purchase-rate-year-over-year)
- **Kangaroo**: dice lograr +56% de CLV promedio y +74% de ingresos promedio. Sin verificación independiente — [Kangaroo](https://loyalty.kangaroorewards.com/home-2/)
- **Stamp Me**: dice que sus comercios ven +15–30% de retención ("2024 Stamp Me Merchant Survey"). No se encontró la encuesta original — [Stamp Me llms.txt](https://www.stampme.com/llms.txt)
- **Starbucks**: el número de miembros activos de Rewards creció 16% interanual (en el período que reporta la nota) — [Chain Store Age](https://chainstoreage.com/starbucks-improves-customer-experience-ai)
- **McKinsey, a favor y en contra**: varios sitios le atribuyen a McKinsey que los mejores programas suben los ingresos 15–25% al año (cita de segunda mano, sin verificar en la fuente original) — [CleverTap](https://clevertap.com/blog/benefits-of-customer-loyalty-programs). En cambio, un gráfico de McKinsey sobre 55 grandes empresas dice que "los programas de fidelidad no parecen impulsar un mayor crecimiento de ingresos" — [McKinsey – Making loyalty pay](https://www.mckinsey.com.br/capabilities/growth-marketing-and-sales/our-insights/making-loyalty-pay-six-lessons-from-the-innovators); [CustomerThink](https://customerthink.com/mckinsey-thinks-bland-generic-loyalty-programs-are-killing-business-and-they-may-be-right/)

### Inferences
- La mejor evidencia de impacto para el dueño viene de su propio panel. La comparación miembro vs no miembro (Square, Smile) y la estimación de ingresos del programa (Loopy) convierten una promesa genérica en algo medible en su propio negocio.
- La advertencia de McKinsey refuerza el argumento: lo que mueve resultados es usar los datos (segmentar y actuar sobre los clientes en riesgo), no solo tener una tarjeta de sellos.

### Gaps
- No se encontraron estudios independientes (académicos o con grupo de control) sobre el aumento de ingresos por usar paneles de fidelidad en micro negocios de comida.
- No se revisó el texto completo de Bond Brand Loyalty ni de BCG sobre datos de fidelidad. El reporte completo de Antavo está detrás de un formulario, así que las cifras vienen de comunicados.
- No hay casos documentados de negocios de comida en campus universitarios.
