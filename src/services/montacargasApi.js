import axios from 'axios'

export const UBICACION_INICIAL = Object.freeze({
  latitud: -27.464134,
  longitud: -58.792216,
  zoom: 18
})

const nodeRedBaseUrl = String(import.meta.env.VITE_SERVER_NODE_RED || '').replace(/\/$/, '')
const apiPath = String(
  import.meta.env.VITE_MONTACARGAS_API_PATH || '/api/montacargas/ubicaciones'
)

export const modoDemoHabilitado =
  String(import.meta.env.VITE_MONTACARGAS_DEMO || 'false').toLowerCase() === 'true'

function numeroONull(valor) {
  if (valor === null || valor === undefined || valor === '') return null
  const numero = Number(valor)
  return Number.isFinite(numero) ? numero : null
}

function booleano(valor) {
  return valor === true || valor === 1 || valor === '1' || valor === 'true'
}

function normalizarPunto(punto) {
  const latitud = numeroONull(punto?.latitud ?? punto?.lat)
  const longitud = numeroONull(punto?.longitud ?? punto?.lon ?? punto?.lng)

  if (latitud === null || longitud === null) return null
  if (latitud < -90 || latitud > 90 || longitud < -180 || longitud > 180) return null
  if (latitud === 0 && longitud === 0) return null

  return {
    latitud,
    longitud,
    fecha: punto?.fecha ?? punto?.fecha_hora ?? punto?.recibido_en ?? null
  }
}

function calcularEstado(item) {
  const estadoInformado = String(
    item?.estado_conexion ?? item?.estado ?? item?.estado_online ?? ''
  ).toLowerCase()

  if (['online', 'demorado', 'offline'].includes(estadoInformado)) {
    return estadoInformado
  }

  const ultimaRecepcion = item?.ultima_recepcion ?? item?.recibido_en ?? item?.fecha_hora
  const instante = Date.parse(ultimaRecepcion)
  if (!Number.isFinite(instante)) return 'offline'

  const edadSegundos = Math.max(0, (Date.now() - instante) / 1000)
  if (edadSegundos <= 15) return 'online'
  if (edadSegundos <= 60) return 'demorado'
  return 'offline'
}

export function normalizarMontacargas(item) {
  const punto = normalizarPunto(item) || {}
  const recorrido = Array.isArray(item?.recorrido)
    ? item.recorrido.map(normalizarPunto).filter(Boolean)
    : []

  return {
    id: String(item?.id ?? item?.montacargas_id ?? 'SIN-ID'),
    gateway: item?.gateway_seleccionado ?? item?.gateway ?? null,
    bootId: item?.boot_id ?? null,
    secuencia: numeroONull(item?.seq ?? item?.secuencia),
    latitud: punto.latitud ?? null,
    longitud: punto.longitud ?? null,
    gpsValido: booleano(item?.gps_valido) && punto.latitud !== undefined,
    satelites: numeroONull(item?.satelites),
    hdop: numeroONull(item?.hdop),
    gpsEdadMs: numeroONull(item?.gps_edad_ms),
    contacto: booleano(item?.contacto),
    rpm: numeroONull(item?.rpm),
    aceiteOk:
      item?.presion_aceite_ok === null || item?.presion_aceite_ok === undefined
        ? null
        : booleano(item.presion_aceite_ok),
    temperaturaC: numeroONull(item?.temperatura_motor_c ?? item?.temperatura_c),
    voltajeV: numeroONull(item?.voltaje_sistema_v),
    rssi: numeroONull(item?.rssi),
    snr: numeroONull(item?.snr),
    ultimaRecepcion:
      item?.ultima_recepcion ?? item?.recibido_en ?? item?.fecha_hora ?? null,
    ultimaPosicion:
      item?.ultima_posicion ?? punto.fecha ?? item?.ultima_recepcion ?? item?.recibido_en ?? null,
    estadoConexion: calcularEstado(item),
    desdeCola: booleano(item?.desde_cola ?? item?.recuperada_desde_cola),
    simulado: booleano(item?.simulado),
    recorrido
  }
}

export async function obtenerUbicacionesMontacargas() {
  if (!nodeRedBaseUrl) {
    throw new Error('VITE_SERVER_NODE_RED no está configurado')
  }

  const respuesta = await axios.get(`${nodeRedBaseUrl}${apiPath}`, {
    timeout: 4500,
    headers: { Accept: 'application/json' }
  })

  const cuerpo = respuesta.data
  const registros = Array.isArray(cuerpo) ? cuerpo : cuerpo?.data

  if (!Array.isArray(registros)) {
    throw new Error('El endpoint de ubicaciones no devolvió una lista válida')
  }

  return {
    modo: cuerpo?.modo || 'mqtt',
    generadoEn: cuerpo?.generado_en || new Date().toISOString(),
    data: registros.map(normalizarMontacargas)
  }
}

export function obtenerUbicacionesDemo() {
  const ahora = new Date().toISOString()
  const puntoAnterior = {
    latitud: -27.464208,
    longitud: -58.792228,
    fecha: ahora
  }

  const puntoActual = {
    latitud: UBICACION_INICIAL.latitud,
    longitud: UBICACION_INICIAL.longitud,
    fecha: ahora
  }

  return {
    modo: 'demo',
    generadoEn: ahora,
    data: [
      normalizarMontacargas({
        id: 'MC-001',
        gateway: 'GW-001',
        boot_id: '9E2347F7',
        seq: 5,
        contacto: 1,
        gps_valido: true,
        latitud: puntoActual.latitud,
        longitud: puntoActual.longitud,
        satelites: 11,
        hdop: 1.24,
        gps_edad_ms: 900,
        temperatura_motor_c: 22.5,
        rssi: -33,
        snr: 9.75,
        simulado: true,
        estado_conexion: 'online',
        ultima_recepcion: ahora,
        ultima_posicion: ahora,
        recorrido: [puntoAnterior, puntoActual]
      })
    ]
  }
}
