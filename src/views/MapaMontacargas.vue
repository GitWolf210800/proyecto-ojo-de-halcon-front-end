<template>
  <nav>
    <NavBarUniversal />
  </nav>

  <main class="seguimiento">
    <header class="encabezado">
      <div>
        <p class="encabezado__subtitulo">TELEMETRÍA EN TIEMPO REAL</p>
        <h1>Seguimiento de montacargas</h1>
      </div>

      <div class="encabezado__acciones">
        <span :class="['fuente', `fuente--${modo}`]">
          {{ etiquetaFuente }}
        </span>
        <button type="button" :disabled="cargando" @click="cargarUbicaciones">
          <fa :icon="cargando ? 'spinner' : 'rotate'" :spin="cargando" />
          Actualizar
        </button>
      </div>
    </header>

    <div v-if="mensaje" :class="['aviso', { 'aviso--demo': modo === 'demo' }]">
      {{ mensaje }}
    </div>

    <section class="resumen" aria-label="Resumen de la flota">
      <article>
        <span>Total</span>
        <strong>{{ montacargas.length }}</strong>
      </article>
      <article class="resumen__online">
        <span>Online</span>
        <strong>{{ totales.online }}</strong>
      </article>
      <article class="resumen__demorado">
        <span>Demorados</span>
        <strong>{{ totales.demorado }}</strong>
      </article>
      <article class="resumen__offline">
        <span>Offline</span>
        <strong>{{ totales.offline }}</strong>
      </article>
      <article>
        <span>Con posición GPS</span>
        <strong>{{ totales.conGps }}</strong>
      </article>
    </section>

    <section class="panel-principal">
      <div class="mapa-contenedor">
        <MapaMontacargasLeaflet
          :montacargas="montacargas"
          :seleccionado-id="seleccionadoId"
          @seleccionar="seleccionar"
        />

        <div v-if="montacargas.length === 0 && !cargando" class="mapa-vacio">
          Todavía no hay montacargas para mostrar.
        </div>
      </div>

      <aside class="lateral">
        <div class="lateral__cabecera">
          <h2>Flota</h2>
          <small>Actualizado: {{ formatearHora(actualizadoEn) }}</small>
        </div>

        <div class="lista-flota">
          <button
            v-for="item in montacargas"
            :key="item.id"
            type="button"
            :class="['vehiculo', { 'vehiculo--seleccionado': item.id === seleccionadoId }]"
            @click="seleccionar(item.id)"
          >
            <span :class="['estado-dot', `estado-dot--${item.estadoConexion}`]"></span>
            <span class="vehiculo__texto">
              <strong>{{ item.id }}</strong>
              <small>{{ etiquetaEstado(item.estadoConexion) }}</small>
            </span>
            <span class="vehiculo__gps">{{ item.gpsValido ? 'GPS' : 'SIN GPS' }}</span>
          </button>
        </div>

        <div v-if="seleccionado" class="detalle">
          <div class="detalle__titulo">
            <div>
              <small>MONTACARGAS</small>
              <h3>{{ seleccionado.id }}</h3>
            </div>
            <span :class="['estado-chip', `estado-chip--${seleccionado.estadoConexion}`]">
              {{ etiquetaEstado(seleccionado.estadoConexion) }}
            </span>
          </div>

          <dl>
            <div>
              <dt>Contacto</dt>
              <dd>{{ seleccionado.contacto ? 'ENCENDIDO' : 'APAGADO' }}</dd>
            </div>
            <div>
              <dt>Última trama</dt>
              <dd>#{{ seleccionado.secuencia ?? 'N/D' }}</dd>
            </div>
            <div>
              <dt>Satélites / HDOP</dt>
              <dd>{{ seleccionado.satelites ?? 'N/D' }} / {{ formatearNumero(seleccionado.hdop, 2) }}</dd>
            </div>
            <div>
              <dt>Temperatura</dt>
              <dd>{{ formatearNumero(seleccionado.temperaturaC, 1, ' °C') }}</dd>
            </div>
            <div>
              <dt>RSSI / SNR</dt>
              <dd>{{ formatearNumero(seleccionado.rssi, 0, ' dBm') }} / {{ formatearNumero(seleccionado.snr, 1, ' dB') }}</dd>
            </div>
            <div>
              <dt>Gateway</dt>
              <dd>{{ seleccionado.gateway ?? 'N/D' }}</dd>
            </div>
            <div class="detalle__ancho">
              <dt>Última recepción</dt>
              <dd>{{ formatearFecha(seleccionado.ultimaRecepcion) }}</dd>
            </div>
            <div class="detalle__ancho">
              <dt>Coordenadas</dt>
              <dd>{{ coordenadas(seleccionado) }}</dd>
            </div>
          </dl>
        </div>
      </aside>
    </section>
  </main>

  <footer>
    <div class="footer__nav">
      <EyeHawkIconVersion />
      <LogoTipoitiFooter />
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import NavBarUniversal from '@/components/componentesVue/NavBarUniversal.vue'
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue'
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue'
import MapaMontacargasLeaflet from '@/components/montacargas/MapaMontacargasLeaflet.vue'
import {
  modoDemoHabilitado,
  obtenerUbicacionesDemo,
  obtenerUbicacionesMontacargas
} from '@/services/montacargasApi'

const montacargas = ref([])
const seleccionadoId = ref('')
const cargando = ref(false)
const modo = ref('sin-datos')
const mensaje = ref('')
const actualizadoEn = ref(null)

let intervaloId = null

const seleccionado = computed(() =>
  montacargas.value.find((item) => item.id === seleccionadoId.value) || null
)

const totales = computed(() => ({
  online: montacargas.value.filter((item) => item.estadoConexion === 'online').length,
  demorado: montacargas.value.filter((item) => item.estadoConexion === 'demorado').length,
  offline: montacargas.value.filter((item) => item.estadoConexion === 'offline').length,
  conGps: montacargas.value.filter((item) => item.gpsValido).length
}))

const etiquetaFuente = computed(() => {
  if (modo.value === 'mqtt') return 'Node-RED · MQTT'
  if (modo.value === 'demo') return 'DEMOSTRACIÓN GPS'
  return 'SIN DATOS'
})

function aplicarResultado(resultado) {
  montacargas.value = resultado.data
  modo.value = resultado.modo === 'demo' ? 'demo' : 'mqtt'
  actualizadoEn.value = resultado.generadoEn

  if (!seleccionadoId.value && resultado.data.length > 0) {
    seleccionadoId.value = resultado.data[0].id
  }
}

async function cargarUbicaciones() {
  if (cargando.value) return
  cargando.value = true

  try {
    const resultado = await obtenerUbicacionesMontacargas()
    aplicarResultado(resultado)
    mensaje.value = ''
  } catch (error) {
    if (modoDemoHabilitado) {
      aplicarResultado(obtenerUbicacionesDemo())
      mensaje.value = `No se pudo consultar Node-RED (${error.message}). Se muestran los datos GPS reales de la prueba en modo demostración.`
    } else {
      modo.value = 'sin-datos'
      mensaje.value = `No se pudo consultar el endpoint de Node-RED: ${error.message}`
    }
  } finally {
    cargando.value = false
  }
}

function seleccionar(id) {
  seleccionadoId.value = id
}

function etiquetaEstado(estado) {
  return {
    online: 'ONLINE',
    demorado: 'DEMORADO',
    offline: 'OFFLINE'
  }[estado] || 'DESCONOCIDO'
}

function formatearNumero(valor, decimales = 1, sufijo = '') {
  return typeof valor === 'number' && Number.isFinite(valor)
    ? `${valor.toFixed(decimales)}${sufijo}`
    : 'N/D'
}

function formatearFecha(valor) {
  if (!valor) return 'N/D'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return 'N/D'
  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(fecha)
}

function formatearHora(valor) {
  if (!valor) return 'N/D'
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return 'N/D'
  return new Intl.DateTimeFormat('es-AR', { timeStyle: 'medium' }).format(fecha)
}

function coordenadas(item) {
  if (typeof item.latitud !== 'number' || typeof item.longitud !== 'number') return 'N/D'
  return `${item.latitud.toFixed(6)}, ${item.longitud.toFixed(6)}`
}

watch(montacargas, (nuevaLista) => {
  if (
    seleccionadoId.value &&
    !nuevaLista.some((item) => item.id === seleccionadoId.value)
  ) {
    seleccionadoId.value = nuevaLista[0]?.id || ''
  }
})

onMounted(async () => {
  document.title = 'Ojo de Halcón - Montacargas'
  await cargarUbicaciones()
  intervaloId = window.setInterval(cargarUbicaciones, 3000)
})

onUnmounted(() => {
  window.clearInterval(intervaloId)
})
</script>

<style scoped>
.seguimiento {
  position: fixed;
  inset: calc(6.5vh + 17px) 0 calc(5.1vh + 4px) 0;
  box-sizing: border-box;
  overflow: auto;
  padding: 18px 22px 24px;
  color: #e2e8f0;
  background:
    radial-gradient(circle at 85% 5%, rgba(14, 165, 233, 0.13), transparent 28%),
    #111827;
  touch-action: pan-x pan-y;
}

.encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  max-width: 1600px;
  margin: 0 auto 14px;
}

.encabezado h1 {
  margin: 2px 0 0;
  font-size: clamp(1.35rem, 2.5vw, 2.15rem);
}

.encabezado__subtitulo {
  margin: 0;
  color: #38bdf8;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.encabezado__acciones {
  display: flex;
  align-items: center;
  gap: 10px;
}

.encabezado button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 13px;
  border: 1px solid #334155;
  border-radius: 10px;
  background: #1e293b;
  color: #f8fafc;
  cursor: pointer;
}

.encabezado button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.fuente,
.estado-chip {
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.06em;
}

.fuente--mqtt {
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.fuente--demo {
  background: rgba(245, 158, 11, 0.17);
  color: #fcd34d;
}

.fuente--sin-datos {
  background: rgba(148, 163, 184, 0.16);
  color: #cbd5e1;
}

.aviso {
  max-width: 1600px;
  margin: 0 auto 12px;
  padding: 10px 13px;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 10px;
  background: rgba(127, 29, 29, 0.22);
  color: #fecaca;
  font-size: 0.82rem;
}

.aviso--demo {
  border-color: rgba(245, 158, 11, 0.35);
  background: rgba(120, 53, 15, 0.23);
  color: #fde68a;
}

.resumen {
  display: grid;
  grid-template-columns: repeat(5, minmax(110px, 1fr));
  gap: 10px;
  max-width: 1600px;
  margin: 0 auto 12px;
}

.resumen article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 54px;
  padding: 10px 14px;
  box-sizing: border-box;
  border: 1px solid #27364d;
  border-radius: 12px;
  background: rgba(30, 41, 59, 0.78);
}

.resumen span {
  color: #94a3b8;
  font-size: 0.78rem;
}

.resumen strong {
  font-size: 1.45rem;
}

.resumen__online strong {
  color: #4ade80;
}

.resumen__demorado strong {
  color: #fbbf24;
}

.resumen__offline strong {
  color: #cbd5e1;
}

.panel-principal {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 12px;
  max-width: 1600px;
  min-height: 520px;
  height: calc(100% - 154px);
  margin: 0 auto;
}

.mapa-contenedor {
  position: relative;
  min-height: 420px;
  overflow: hidden;
  border: 1px solid #27364d;
  border-radius: 14px;
  z-index: 0;
}

.mapa-vacio {
  position: absolute;
  z-index: 500;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  padding: 8px 12px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.9);
  color: #cbd5e1;
}

.lateral {
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: 14px;
  border: 1px solid #27364d;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.9);
}

.lateral__cabecera,
.detalle__titulo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.lateral h2,
.detalle h3 {
  margin: 0;
}

.lateral__cabecera small {
  color: #64748b;
}

.lista-flota {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 190px;
  margin: 12px 0;
  overflow-y: auto;
}

.vehiculo {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #1e293b;
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
}

.vehiculo--seleccionado {
  border-color: #38bdf8;
  background: rgba(14, 116, 144, 0.24);
}

.estado-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #94a3b8;
}

.estado-dot--online {
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
}

.estado-dot--demorado {
  background: #f59e0b;
}

.vehiculo__texto {
  display: flex;
  flex-direction: column;
}

.vehiculo__texto small,
.vehiculo__gps {
  color: #94a3b8;
  font-size: 0.67rem;
}

.detalle {
  padding-top: 13px;
  border-top: 1px solid #27364d;
}

.detalle__titulo small {
  color: #64748b;
  font-size: 0.64rem;
  letter-spacing: 0.12em;
}

.estado-chip--online {
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.estado-chip--demorado {
  background: rgba(245, 158, 11, 0.15);
  color: #fcd34d;
}

.estado-chip--offline {
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
}

.detalle dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin: 12px 0 0;
}

.detalle dl > div {
  padding: 8px;
  border-radius: 9px;
  background: rgba(30, 41, 59, 0.72);
}

.detalle dt {
  color: #64748b;
  font-size: 0.68rem;
}

.detalle dd {
  margin: 3px 0 0;
  overflow-wrap: anywhere;
  font-size: 0.8rem;
  font-weight: 700;
}

.detalle__ancho {
  grid-column: 1 / -1;
}

@media (max-width: 1050px) {
  .seguimiento {
    padding-inline: 12px;
  }

  .panel-principal {
    grid-template-columns: 1fr;
    height: auto;
  }

  .lateral {
    min-height: 320px;
  }
}

@media (max-width: 720px) {
  .encabezado {
    align-items: flex-start;
    flex-direction: column;
  }

  .encabezado__acciones {
    width: 100%;
    justify-content: space-between;
  }

  .resumen {
    grid-template-columns: repeat(2, 1fr);
  }

  .resumen article:last-child {
    grid-column: 1 / -1;
  }
}
</style>
