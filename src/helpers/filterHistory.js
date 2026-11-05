import { period, usableLimit } from './climateHistory.js';

// Node-RED UI 33cd8251d3d881d9: clasificarPunto / limiteUtil.
// Historical integer "estado" is deliberately not involved in visual classification.
export function classifyFilterValue(metric, point) {
  const value = point[metric.campo];
  if (!Number.isFinite(value)) return null;
  const limits = Object.fromEntries(metric.limites.map(limit => [limit.tipo, usableLimit(point[limit.campo])]));
  if ((limits.alarmaMin != null && value < limits.alarmaMin) ||
      (limits.alarmaMax != null && value > limits.alarmaMax)) return 'alarma';
  if (limits.min != null && value < limits.min) return limits.alarmaMin != null ? 'aviso' : 'alarma';
  if (limits.max != null && value > limits.max) return limits.alarmaMax != null ? 'aviso' : 'alarma';
  return 'normal';
}
export const filterLimitLabel = limit => ({ min: 'Mínimo', max: 'Máximo',
  alarmaMin: 'Alarma mínima', alarmaMax: 'Alarma máxima' })[limit.tipo] || limit.campo;
export const catalogStatus = sensor => ({ historico: 'Histórico', inactivo: 'Inactivo' })[sensor.situacion_catalogo] || 'Activo';

export function groupFilters(sensors) {
  const factories = new Map();
  for (const sensor of sensors) {
    const label = sensor.fabrica || 'Sin fábrica';
    // Description is the supplied sector/location label; factory ID is only metadata.
    const id = sensor.descripcion || 'Sin sector / ubicación';
    if (!factories.has(label)) factories.set(label, { label, sensors: [], sectors: new Map() });
    const factory = factories.get(label);
    if (!factory.sectors.has(id)) factory.sectors.set(id, { id, sensors: [] });
    factory.sensors.push(sensor);
    factory.sectors.get(id).sensors.push(sensor);
  }
  return [...factories.values()];
}
export function addFilterIds(current, added, catalog) {
  const next = [...new Set([...current, ...added])];
  if (next.length > 100) throw new Error('El máximo es de 100 filtros. Se conservó la selección anterior.');
  const known = new Set(catalog.map(sensor => sensor.id_instalacion));
  if (!next.every(id => Number.isSafeInteger(id) && id > 0 && known.has(id))) throw new Error('La selección contiene un filtro inválido.');
  return next;
}
export function filterQuery(ids, from, to) {
  if (!ids.length || ids.length > 100 || !ids.every(id => Number.isSafeInteger(id) && id > 0)) {
    throw new Error('Seleccioná entre 1 y 100 filtros.');
  }
  return Object.freeze({ alcance: 'seleccion', id_instalaciones: Object.freeze([...new Set(ids)]), ...period(from, to) });
}
export function retryAfterTime(value, now = Date.now()) {
  if (!value) return 0;
  const parsed = /^\d+$/.test(value) ? now + Number(value) * 1000 : Date.parse(value);
  return Number.isFinite(parsed) && parsed > now ? parsed : 0;
}
export async function filterRequest(endpoint, signal, body) {
  const base = (import.meta.env.VITE_SERVER_API || '').replace(/\/$/, '');
  let response;
  try {
    response = await fetch(base + '/api/historico-filtros/' + endpoint, {
      credentials: 'include', signal,
      ...(body && { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error('No se pudo conectar. Revisá la conexión e intentá nuevamente.');
  }
  if (!response.ok) {
    const messages = {
      400: 'La selección o el período no son válidos. Revisalos y consultá nuevamente.',
      401: 'Iniciá sesión para consultar el histórico.',
      403: 'Tu sesión no tiene acceso al histórico.',
      422: 'El resultado es demasiado grande. Reducí el período o la selección; no se recibieron datos parciales.',
      429: 'Hay otra consulta histórica en curso. Esperá antes de reintentar.',
      500: 'El servidor no pudo completar la operación. Intentá nuevamente.',
    };
    const error = new Error(messages[response.status] || 'No se pudo completar la operación.');
    error.retryAt = retryAfterTime(response.headers.get('Retry-After'));
    error.status = response.status;
    throw error;
  }
  return response.json();
}
