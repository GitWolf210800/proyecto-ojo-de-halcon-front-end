<template>
  <div ref="mapElement" class="mapa-leaflet" aria-label="Mapa de ubicación de montacargas"></div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { UBICACION_INICIAL } from '@/services/montacargasApi'

const props = defineProps({
  montacargas: {
    type: Array,
    default: () => []
  },
  seleccionadoId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['seleccionar'])
const mapElement = ref(null)

let mapa = null
let ajustadoInicialmente = false
const marcadores = new Map()
const recorridos = new Map()

const colores = {
  online: '#22c55e',
  demorado: '#f59e0b',
  offline: '#94a3b8'
}

function escaparHtml(valor) {
  return String(valor ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function numeroValido(valor) {
  return typeof valor === 'number' && Number.isFinite(valor)
}

function tienePosicion(item) {
  return numeroValido(item?.latitud) && numeroValido(item?.longitud)
}

function formatearNumero(valor, decimales = 1, sufijo = '') {
  return numeroValido(valor) ? `${valor.toFixed(decimales)}${sufijo}` : 'N/D'
}

function crearIcono(item) {
  const estado = colores[item.estadoConexion] ? item.estadoConexion : 'offline'
  const seleccionado = props.seleccionadoId === item.id ? ' mc-marker--seleccionado' : ''

  return L.divIcon({
    className: 'mc-marker-wrapper',
    html: `<div class="mc-marker mc-marker--${estado}${seleccionado}">
      <span class="mc-marker__simbolo">◆</span>
      <span class="mc-marker__etiqueta">${escaparHtml(item.id)}</span>
    </div>`,
    iconSize: [88, 44],
    iconAnchor: [44, 38],
    popupAnchor: [0, -38]
  })
}

function crearPopup(item) {
  const contenedor = document.createElement('div')
  contenedor.className = 'mc-popup'

  const titulo = document.createElement('strong')
  titulo.textContent = item.id
  contenedor.appendChild(titulo)

  const lineas = [
    `Estado: ${item.estadoConexion}`,
    `Contacto: ${item.contacto ? 'ENCENDIDO' : 'APAGADO'}`,
    `Satélites: ${item.satelites ?? 'N/D'} · HDOP: ${formatearNumero(item.hdop, 2)}`,
    `Temperatura: ${formatearNumero(item.temperaturaC, 1, ' °C')}`,
    `RSSI: ${formatearNumero(item.rssi, 0, ' dBm')}`,
    `Gateway: ${item.gateway ?? 'N/D'}`
  ]

  for (const texto of lineas) {
    const linea = document.createElement('div')
    linea.textContent = texto
    contenedor.appendChild(linea)
  }

  return contenedor
}

function actualizarMapa() {
  if (!mapa) return

  const idsVigentes = new Set()
  const limites = []

  for (const item of props.montacargas) {
    if (!tienePosicion(item)) continue

    idsVigentes.add(item.id)
    const posicion = [item.latitud, item.longitud]
    limites.push(posicion)

    let marcador = marcadores.get(item.id)
    if (!marcador) {
      marcador = L.marker(posicion, { icon: crearIcono(item), title: item.id })
        .addTo(mapa)
        .on('click', () => emit('seleccionar', item.id))
      marcadores.set(item.id, marcador)
    } else {
      marcador.setLatLng(posicion)
      marcador.setIcon(crearIcono(item))
    }
    marcador.bindPopup(crearPopup(item))

    const puntosRecorrido = (item.recorrido || [])
      .filter(tienePosicion)
      .map((punto) => [punto.latitud, punto.longitud])

    let linea = recorridos.get(item.id)
    if (puntosRecorrido.length >= 2) {
      if (!linea) {
        linea = L.polyline(puntosRecorrido, {
          color: colores[item.estadoConexion] || colores.offline,
          weight: 4,
          opacity: 0.75
        }).addTo(mapa)
        recorridos.set(item.id, linea)
      } else {
        linea.setLatLngs(puntosRecorrido)
        linea.setStyle({ color: colores[item.estadoConexion] || colores.offline })
      }
    } else if (linea) {
      linea.remove()
      recorridos.delete(item.id)
    }
  }

  for (const [id, marcador] of marcadores.entries()) {
    if (!idsVigentes.has(id)) {
      marcador.remove()
      marcadores.delete(id)
    }
  }

  for (const [id, linea] of recorridos.entries()) {
    if (!idsVigentes.has(id)) {
      linea.remove()
      recorridos.delete(id)
    }
  }

  if (!ajustadoInicialmente && limites.length > 0) {
    ajustadoInicialmente = true
    if (limites.length === 1) {
      mapa.setView(limites[0], UBICACION_INICIAL.zoom)
    } else {
      mapa.fitBounds(limites, { padding: [48, 48], maxZoom: UBICACION_INICIAL.zoom })
    }
  }
}

function centrarSeleccionado() {
  if (!mapa || !props.seleccionadoId) return
  const item = props.montacargas.find((registro) => registro.id === props.seleccionadoId)
  if (!tienePosicion(item)) return

  mapa.flyTo([item.latitud, item.longitud], Math.max(mapa.getZoom(), 17), {
    duration: 0.5
  })
  marcadores.get(item.id)?.openPopup()
}

onMounted(async () => {
  await nextTick()
  mapa = L.map(mapElement.value, {
    zoomControl: true,
    attributionControl: true
  }).setView(
    [UBICACION_INICIAL.latitud, UBICACION_INICIAL.longitud],
    UBICACION_INICIAL.zoom
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapa)

  actualizarMapa()
  window.setTimeout(() => mapa?.invalidateSize(), 100)
})

watch(
  () => props.montacargas,
  () => actualizarMapa(),
  { deep: true }
)

watch(
  () => props.seleccionadoId,
  () => {
    actualizarMapa()
    centrarSeleccionado()
  }
)

onBeforeUnmount(() => {
  mapa?.remove()
  mapa = null
  marcadores.clear()
  recorridos.clear()
})
</script>

<style scoped>
.mapa-leaflet {
  width: 100%;
  height: 100%;
  min-height: 420px;
  background: #111827;
  border-radius: 14px;
  touch-action: auto;
}

:global(.mc-marker-wrapper) {
  background: transparent;
  border: 0;
}

:global(.mc-marker) {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #f8fafc;
  filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.5));
}

:global(.mc-marker__simbolo) {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 3px solid #f8fafc;
  border-radius: 50% 50% 50% 8px;
  transform: rotate(-45deg);
  background: #94a3b8;
  font-size: 10px;
}

:global(.mc-marker__simbolo::first-letter) {
  transform: rotate(45deg);
}

:global(.mc-marker__etiqueta) {
  margin-top: 2px;
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.9);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

:global(.mc-marker--online .mc-marker__simbolo) {
  background: #22c55e;
}

:global(.mc-marker--demorado .mc-marker__simbolo) {
  background: #f59e0b;
}

:global(.mc-marker--offline .mc-marker__simbolo) {
  background: #94a3b8;
}

:global(.mc-marker--seleccionado .mc-marker__simbolo) {
  box-shadow: 0 0 0 6px rgba(56, 189, 248, 0.35);
}

:global(.mc-popup) {
  min-width: 205px;
  line-height: 1.55;
  color: #0f172a;
}

:global(.mc-popup strong) {
  display: block;
  margin-bottom: 4px;
  font-size: 15px;
}

@media (max-width: 900px) {
  .mapa-leaflet {
    min-height: 360px;
  }
}
</style>
