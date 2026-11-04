export const metrics = {
  temperatura: ['Temperatura', '°C'],
  humedad: ['Humedad relativa', '%'],
  humedad_absoluta: ['Humedad absoluta', 'g/kg'],
  entalpia: ['Entalpía', 'kJ/kg'],
};

// UTC is only a coordinate for the plant's civil clock, never a zone conversion.
export function civilMillis(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return NaN;
  const [year, month, day, hour, minute, second = 0] = match.slice(1).map(v => v === undefined ? 0 : Number(v));
  const ms = Date.UTC(year, month - 1, day, hour, minute, second);
  const date = new Date(ms);
  if (year < 1000 || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day ||
      hour > 23 || minute > 59 || second > 59) return NaN;
  return ms;
}

export function period(from, to) {
  const start = civilMillis(from), end = civilMillis(to);
  if (![start, end].every(Number.isFinite)) throw new Error('Ingresá ambas fechas y horas válidas.');
  if (start >= end) throw new Error('La fecha inicial debe ser anterior a la final.');
  if (end - start > 184 * 86400000) throw new Error('El intervalo máximo por consulta es de 184 días.');
  const sql = value => value.replace('T', ' ') + (value.length === 16 ? ':00' : '');
  return { desde: sql(from), hasta: sql(to) };
}

export function sensorLabel(sensor) {
  return [sensor.nombre, sensor.descripcion !== sensor.nombre && sensor.descripcion].filter(Boolean).join(' · ') || String(sensor.id_instalacion);
}

export async function climateRequest(endpoint, signal, body) {
  const base = (import.meta.env.VITE_SERVER_API || '').replace(/\/$/, '');
  let response;
  try {
    response = await fetch(base + '/api/historico-clima/' + endpoint, {
      credentials: 'include', signal,
      ...(body && { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }),
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new Error('No se pudo conectar. Revisá la conexión e intentá nuevamente.');
  }
  if (!response.ok) {
    const retry = response.headers.get('Retry-After');
    const messages = {
      400: 'Los datos, el período o la selección son inválidos.',
      401: 'Iniciá sesión para consultar el histórico.',
      403: 'Tu sesión no tiene acceso al histórico.',
      422: 'La consulta es demasiado grande. Acortá el período o reducí la cantidad de sensores.',
      429: 'Hay otra consulta en curso. ' + (retry && /^\d+$/.test(retry) ? 'Reintentá en ' + retry + ' segundos.' : 'Reintentá en unos segundos.'),
      500: 'El servidor no pudo completar la operación. Intentá nuevamente.',
    };
    throw new Error(messages[response.status] || 'No se pudo completar la operación.');
  }
  return response.json();
}

export const limits = {
  temperatura: ['min_A_temperatura', 'min_temperatura', 'max_temperatura', 'max_A_temperatura'],
  humedad: ['min_A_humedad', 'min_humedad', 'max_humedad', 'max_A_humedad'],
  humedad_absoluta: ['min_humedad_absoluta', 'max_humedad_absoluta'],
  entalpia: [],
};

// Historical dashboard convention: zero is a disabled threshold, not a missing measurement.
export function usableLimit(value) {
  return Number.isFinite(value) && value !== 0 ? value : null;
}
export function classifyClimateValue(metric, value, point) {
  if (!Number.isFinite(value)) return null;
  for (const [side, outside] of [['min', (x, limit) => x < limit], ['max', (x, limit) => x > limit]]) {
    const alarm = usableLimit(point[side + '_A_' + metric]);
    if (limits[metric].includes(side + '_A_' + metric) && alarm !== null && outside(value, alarm)) return 'alarma';
  }
  for (const field of limits[metric].filter(key => !key.includes('_A_'))) {
    const threshold = usableLimit(point[field]);
    const side = field.startsWith('min') ? 'min' : 'max';
    if (threshold !== null && (side === 'min' ? value < threshold : value > threshold)) {
      return usableLimit(point[side + '_A_' + metric]) === null ? 'alarma' : 'aviso';
    }
  }
  return 'normal';
}

const plantClock = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
export function plantNowInputValue(now = new Date()) {
  const p = Object.fromEntries(plantClock.formatToParts(now).map(part => [part.type, part.value]));
  return p.year + '-' + p.month + '-' + p.day + 'T' + p.hour + ':' + p.minute + ':' + p.second;
}
export function formatCivilInput(milliseconds) {
  const d = new Date(milliseconds);
  const pad = n => String(n).padStart(2, '0');
  return [d.getUTCFullYear(), pad(d.getUTCMonth() + 1), pad(d.getUTCDate())].join('-') + 'T' +
    [d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()].map(pad).join(':');
}
export function applyQuickPeriod(duration, now) {
  const to = plantNowInputValue(now);
  return { from: formatCivilInput(civilMillis(to) - duration), to };
}

// The API returns fixed-width civil timestamps. Sort each sensor independently and retain ties.
export function chronologicalPoints(points) {
  return [...points].sort((a, b) => a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0);
}

export function measurementSummary(sortedPoints, metric) {
  let validCount = 0, last = null;
  for (const p of sortedPoints) {
    if (Number.isFinite(p[metric])) {
      validCount++;
      last = p[metric];
    }
  }
  return { total: sortedPoints.length, validCount, nullCount: sortedPoints.length - validCount,
    firstTimestamp: sortedPoints[0]?.fecha ?? null, lastTimestamp: sortedPoints.at(-1)?.fecha ?? null, last };
}
