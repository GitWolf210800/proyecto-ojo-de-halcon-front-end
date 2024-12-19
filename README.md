# ojoDeHalcon - express - back-end - Version 3.6

**Ojo de Halcón** es una aplicación web full-stack desarrollada para Tipoiti S.A.T.I.C. en el Departamento de Innovación y Desarrollo. El proyecto está orientado a la visualización y monitoreo de sistemas industriales en tiempo real.

**Desarrollado por:** [@GitWolf210800](https://github.com/GitWolf210800)  
**Fecha de inicio:** 2023  
**Última actualización:** 2024

## Tecnologías utilizadas

### Frontend:
- **HTML5**
- **CSS3**
- **SVG** (gráficos en XML, diseño realizado con InkScape)
- **JavaScript** (para la lógica en el cliente)
- **Chart.js** (para gráficos interactivos)
- **Vue.js 3** (para la gestión del frontend en la versión más reciente de la aplicación)

### Backend:
- **Node-RED** (gestor de servidores basado en Node.js)
- **Express.js** (framework para crear servidores web y APIs)
- **MariaDB** (servidor de base de datos SQL)

## Historial de versiones

### v3.6 (Última actualización)
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

