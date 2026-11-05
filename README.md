# ojoDeHalcon - Vue3.js - front-end - Version 3.8

**Ojo de Halcón** es una aplicación web full-stack desarrollada para Tipoiti S.A.T.I.C. en el Departamento de Innovación y Desarrollo. El proyecto está orientado a la visualización y monitoreo de sistemas industriales en tiempo real.

**Desarrollado por:** [@GitWolf210800](https://github.com/GitWolf210800)  
**Fecha de inicio:** 2023  
**Última actualización:** 2024

## Tecnologías utilizadas

### Frontend:
- **HTML5**
- **CSS3**
- **SVG** (gráficos en XML, diseño realizado con InkScape)
- **JavaScript** 
- **Chart.js** (para gráficos interactivos)
- **Vue.js 3** (para la gestión del frontend en la versión más reciente de la aplicación)

### Backend:
- **Node-RED** (gestor de servidores basado en Node.js)
- **Express.js** (framework para crear servidores web y APIs)
- **MariaDB** (servidor de base de datos SQL)

## Historial de versiones

### v3.8 (Ultima Actualización)
- **Agregado de funciones al front-end**
- Se agrega la vista de salas de filtro-clima en la app

### v3.7
- **componentizacion de funciones propias**
- Se componentizo todo tipo de funciones que habia en express.js, para seguir con los principios de Vue.js

### v3.6
- **Frontend:** Se incorpora **Vue.js 3** como nueva tecnología para el frontend, mejorando la gestión de la interfaz de usuario y permitiendo una mayor escalabilidad en la app.
- Se independiza **Express.js** como backend, delegando la interfaz de usuario a Vue.js 3.
- Se adapta el código de **Express.js** para que las API funcionen correctamente con **Vue.js**, eliminando toda funcionalidad del frontend en **Express.js**.
- Se replicó la aplicación en **Vue.js 3**, adaptando la sintaxis correspondiente a esta tecnología.

### v3.5
- **Mejoras en la interfaz de usuario:**
  - Se agregó un **tooltip tipo tabla** para mejorar la visualización de datos y hacerla más interactiva.

### v3.4
- **Correcciones y nuevas funciones:**
  - Corrección de bugs en los **tooltips**.
  - Mejoras en la recolección de datos desde el servidor **Node-Red**.
  - Implementación de una función para **visualizar y monitorear la sala de chillers**, brindando más control sobre el sistema.

### v2.0
- **Primera versión estable de la app.**
  - Se desarrolló una interfaz básica para la **visualización de datos industriales en tiempo real**.

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/ojoDeHalcon.git
   ```

## Históricos de clima

La selección global conserva el orden de incorporación y admite hasta 100 sensores únicos. Fábrica (`fabrica`) y sector (`id_fabrica`) sirven para explorar el catálogo y agregar o quitar grupos. Cada consulta envía `alcance: "seleccion"`, `id_instalaciones`, `desde` y `hasta`, incluso para un único sensor. El gráfico, el resumen y el Excel usan la respuesta de esa consulta aunque después cambie el formulario.

## Históricos de filtros

El mismo icono de Históricos está disponible en Clima y Sala de filtros. El modal
permite elegir Clima o Filtros y abre la sección correspondiente a la vista.
Cambiar de sección desmonta el panel anterior y cancela su solicitud HTTP;
no supone cancelar el SQL del servidor. Al cerrar se restauran foco y scroll.
Los componentes y helpers climáticos conservan su implementación.

Filtros usa `VITE_SERVER_API`, credenciales incluidas y exclusivamente las rutas
Express `/api/historico-filtros/catalogo`, `/consulta` y `/exportacion`.
No contacta Node-RED. El catálogo incluye activos, inactivos e históricos, incluso
IDs sin instalación actual. Se agrupa por la etiqueta `fabrica` y por
`descripcion` (sector/ubicación); `id_fabrica` es solo metadato.
El buscador compartido admite nombres, fábricas, ubicaciones e IDs.

La selección conserva el orden, deduplica y permite hasta 100 IDs de distintos
grupos. Agregar un grupo que excede el máximo conserva toda la selección anterior.
Las fechas reutilizan el calendario civil de Buenos Aires de Clima: hasta 184 días,
sin límite de antigüedad ni conversión automática del input a UTC.

Cada consulta envía `alcance: "seleccion"`, `id_instalaciones`, `desde` y `hasta`.
La solicitud exitosa y su respuesta quedan asociadas; modificar el formulario no
altera los resultados ni la selección/período utilizados por la descarga.
Un error nuevo conserva el resultado anterior. Consulta y descarga no se solapan
en este panel; Retry-After bloquea reintentos hasta el plazo indicado (segundos o fecha HTTP).

### Métricas y visualización

Las definiciones de métricas, unidades y límites proceden de la respuesta del backend.
Cada filtro ofrece las métricas con datos propios; los filtros sin registros
permanecen visibles. Se monta una gráfica por filtro expandido y métrica elegida.
El resumen usa las estadísticas anteriores al muestreo. El contrato solo ofrece
conteo total por filtro: se distingue de los puntos válidos muestreados de cada
métrica y no se inventa un conteo completo por métrica.

Semántica comprobada en el flow Node-RED `dffd7c25b0156ff8`, plantilla
`33cd8251d3d881d9`, funciones `limiteUtil` y `clasificarPunto`:

- Límite cero o nulo: inactivo. Medición cero: válida; medición nula: hueco real.
- Comparaciones estrictas: menor que mínimo o mayor que máximo.
- Superar un límite de alarma activo: alarma.
- Superar mínimo/máximo: aviso si existe alarma activa del mismo lado; alarma si no existe.
- En los demás casos: normal. El entero histórico `estado` no clasifica mediciones.

Se mantiene la paleta climática: azul normal, ámbar aviso, rojo alarma.
Los segmentos toman la mayor severidad de sus extremos, como en Clima; esto es
una convención de dibujo, no una interpretación adicional del estado industrial.
Se conservan muestras y orden temporal, sin cortar por distancia entre muestras.
Los límites son históricos, escalonados y punteados; se omiten los totalmente
inactivos. El tooltip muestra fecha civil, valor, clasificación y límites aplicables.
Hasta 600 px, solo canvas/ejes usan un escenario de 700×260 con scroll táctil;
leyenda, encabezado y estadísticas permanecen fuera del desplazamiento horizontal.

### Excel completo

Descargar Excel hace un nuevo POST a `/exportacion` usando la selección y período
de la consulta visible. Exporta `filas`, nunca `puntos` de la gráfica. La lectura
es independiente: si la base cambió, el archivo puede diferir de la gráfica.
ExcelJS continúa con importación dinámica, sin nuevas dependencias.
El archivo contiene `Consulta`, `Datos_completos` y `Resumen_por_filtro`.
Los resúmenes del archivo se calculan con todas las filas de exportación, no con
estadísticas de la gráfica anterior. Números permanecen numéricos, NULL es vacío,
con encabezados congelados y autofiltros. Un 422 no descarga resultados parciales.
La importación, generación y descarga se omiten al abortar cuando todavía es posible;
la URL temporal se revoca después de descargar.

### Validación aislada

`tests/filter-history.fixture.js` monta el modal real y reemplaza todos los fetch
antes de montarlo. Verifica selección global, 100 IDs, retirados, fechas, instantánea,
errores, Retry-After, datasets y segmentos reales de Chart.js, y relee el XLSX
generado para comprobar que contiene filas exclusivas del endpoint completo.
El modo `?visual` conserva un resultado sintético para revisar tamaños de pantalla;
`?visual&single` muestra un solo filtro. No es una ruta de la aplicación.
El fixture climático existente se ejecuta como regresión.
