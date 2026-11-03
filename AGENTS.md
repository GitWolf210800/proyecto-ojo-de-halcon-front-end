# Instrucciones del frontend

- Aplicación Vue 3 con Vite, Router y Pinia; usar npm y conservar package-lock.json.
- Ejecutar comandos desde esta carpeta.
- Desarrollo: npm run dev. Compilación: npm run build.
- No hay scripts de pruebas ni lint; no informar que fueron ejecutados.
- El backend eyeHawk-express-back-end es un repositorio Git independiente adjunto al mismo proyecto.
- Antes de modificar el backend, localizar su carpeta adjunta y leer el AGENTS.md de su raíz.
- Express gestiona login y operaciones; Node-RED suministra telemetría.
- Configurar destinos mediante variables VITE_; nunca incluir secretos en ellas.
- Nunca mostrar, copiar, registrar ni versionar valores de secretos, contraseñas, tokens o credenciales.
- Mantener contratos de API, rutas existentes y nombres de roles.
- Los permisos visuales no sustituyen la autorización del servidor.
- Separar claramente datos reales, antiguos y de demostración.
- Preservar mapas SVG, navegación y comportamiento responsive.
- No editar .env sin autorización explícita.
- Está permitido modificar código cuando la tarea lo solicite.
- No ejecutar escrituras contra bases de datos reales, iniciar conexiones industriales ni contactar equipos o servicios de producción sin autorización explícita del usuario.
- Las pruebas deben utilizar mocks, datos de prueba o entornos aislados, respetando las restricciones de acceso a sistemas reales.
- Para auditorías de solo lectura, no ejecutar builds ni comandos que escriban.
- Informar archivos modificados, validación realizada y limitaciones.

## Node-RED productivo: acceso exclusivamente de lectura

- La carpeta secundaria `.node-red` adjunta al proyecto corresponde al runtime
  productivo de Node-RED.
- Puede inspeccionarse para comprender los flujos, subflows, nodos Function,
  contratos HTTP, tópicos MQTT, consultas SQL y relaciones con Vue y Express.
- La carpeta .node-red debe tratarse estrictamente como de solo lectura.
- Nunca crear, modificar, renombrar, mover ni eliminar archivos dentro de ella.
- Nunca iniciar, detener, reiniciar ni desplegar Node-RED.
- Nunca ejecutar node-red, npm install, npm update ni scripts dentro de esa
  carpeta.
- Nunca contactar localhost:1880, bases de datos, brokers MQTT, PLC,
  ESP8266, ESP32 ni otros equipos o servicios industriales.
- No abrir, copiar, mostrar ni registrar flows_cred.json, .env, sesiones,
  certificados, claves, contraseñas o tokens.
- No inicializar Git ni crear commits dentro de .node-red.
- Toda mejora debe entregarse en el chat como explicación, código o pasos
  revisables.
- El usuario aplicará y desplegará manualmente cualquier modificación desde
  el editor de Node-RED.
