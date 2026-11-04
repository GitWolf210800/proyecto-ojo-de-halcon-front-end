<template>
  <div class="panel">
  <p v-if="loadingCatalog" class="notice" role="status"><span class="spinner" aria-hidden="true"></span> Cargando catálogo de sensores…</p>
  <div v-else-if="catalogError"><p role="alert">{{ catalogError }}</p><button @click="loadCatalog">Reintentar catálogo</button></div>
  <p v-else-if="!factories.length" class="empty" role="status">El catálogo no contiene sensores.</p>
  <template v-else>
    <form class="card config" @submit.prevent="consult">
      <div><h3>Configurar consulta</h3><p class="muted">Seleccioná sensores, período y variable para analizar.</p></div>
      <HistorySearch :factories="factories" @choose="exploreSuggestion" />
      <div class="columns"><fieldset><legend>Explorar catálogo</legend><div class="pickers">
      <label>Fábrica
        <select :value="factoryLabel" @change="exploreFactory($event.target.value)">
          <option v-for="f in factories" :key="f.label">{{ f.label }}</option>
        </select>
      </label>
      <label>Sector
        <select v-model="sectorId">
          <option :value="null">Todos los sectores</option>
          <option v-for="sector in factory.sectors.values()" :key="sector.id" :value="sector.id">{{ sector.id || 'Sin sector' }}</option>
        </select>
      </label>
      </div>
        <p v-if="factory.sensors.length === 1">Esta fábrica tiene un solo sensor disponible en el catálogo histórico.</p>
        <div class="actions">
          <button type="button" @click="addWholeFactory(factoryLabel)">Agregar fábrica completa</button>
          <button type="button" :disabled="sectorId === null" @click="addWholeSector(sectorId)">Agregar sector completo</button>
        </div>
        <div class="sensors">
          <label v-for="s in exploredSensors" :key="s.id_instalacion">
            <input type="checkbox" :checked="isSensorSelected(s.id_instalacion)"
              @change="$event.target.checked = toggleSensor(s.id_instalacion, $event.target.checked)">
            <span class="identity"><b>{{ s.nombre }}</b><small>{{ s.descripcion }}</small></span><span class="badge">{{ s.id_fabrica || 'Sin sector' }}</span><small>#{{ s.id_instalacion }}</small>
          </label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Sensores seleccionados</legend>
        <span class="badge counter" aria-live="polite" aria-label="Sensores seleccionados">{{ selectedSensorIds.length }} / 100</span>
        <p role="alert" v-if="selectionError">{{ selectionError }}</p>
        <button type="button" @click="clearAllSensors">Limpiar selección</button>
        <p v-if="!selectedSensorIds.length" class="empty"><span aria-hidden="true">☷</span> Todavía no seleccionaste sensores.</p>
        <div class="selection-list">
          <div v-for="f in selectedFactories" :key="f.label">
            <h4>{{ f.label }} <span class="badge">{{ f.sensors.length }}</span></h4>
            <button type="button" @click="removeWholeFactory(f.label)">Quitar fábrica de la selección</button>
            <div class="sector" v-for="sector in f.sectors.values()" :key="sector.id">
              <strong class="badge">{{ sector.id || 'Sin sector' }}</strong>
              <button type="button" @click="removeWholeSector(sector.id, f.label)">Quitar sector de la selección</button>
              <ul><li v-for="s in sector.sensors" :key="s.id_instalacion">
                {{ sensorLabel(s) }} · #{{ s.id_instalacion }}
                <button type="button" :aria-label="'Quitar ' + sensorLabel(s)" @click="removeSensor(s.id_instalacion)">×</button>
              </li></ul>
            </div>
          </div>
        </div>
      </fieldset>
      </div><fieldset class="period"><legend>Período de consulta</legend><div class="period-controls"><div class="dates">
        <label>Desde <input v-model="from" @input="activePeriod = null" required type="datetime-local" step="1"></label>
        <label>Hasta <input v-model="to" @input="activePeriod = null" required type="datetime-local" step="1"></label>
      </div>
      <div class="actions" aria-label="Períodos rápidos">
        <button v-for="[label, hours] in shortcuts" :key="hours" type="button" :aria-pressed="activePeriod === hours" @click="setPeriod(hours)">{{ label }}</button>
      </div>
      </div><small><span aria-hidden="true">ⓘ</span> Hora de planta · America/Argentina/Buenos_Aires · Máximo 184 días</small>
      </fieldset><div class="actions action-bar"><button class="submit" :disabled="!canConsult"><span v-if="busy" class="spinner" aria-hidden="true"></span><svg v-else aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg>Consultar histórico</button>
      <button v-if="busy" type="button" @click="cancelQuery">Cancelar consulta</button>
      </div>
    </form>
    <p v-if="busy" class="notice" role="status"><span class="spinner" aria-hidden="true"></span> Procesando la consulta…</p>
    <p v-else-if="error" role="alert">{{ error }}</p>
    <p v-else-if="cancelled" role="status">Solicitud cancelada.</p>
    <p v-else-if="!result" class="empty" role="status">Todavía no realizaste una consulta.</p>
    <section v-else class="card results" aria-label="Resultado de la consulta">
      <div class="result-heading"><div><small class="eyebrow">Resultado de la consulta</small><h3>{{ result.entidad }}</h3></div>
        <span class="badge">{{ consultedIds.length }} sensores</span><span class="badge">{{ result.muestreo_segundos }} s</span></div>
      <p class="muted">{{ result.fabrica }} · {{ result.desde }} — {{ result.hasta }} · {{ result.zona_horaria }}</p>
      <div class="stats"><div v-for="[name, value] in [['Registros',result.resumen.total_registros],['Puntos mostrados',result.resumen.puntos_mostrados],['Sensores',consultedIds.length],['Muestreo',result.muestreo_segundos + ' s']]" :key="name"><small>{{ name }}</small><b>{{ display(value) }}</b></div></div>
      <p class="muted">Esta respuesta corresponde a {{ consultedIds.length }} sensores.</p>
      <p class="warning" v-if="selectionChanged" role="status">La selección cambió. Presioná Consultar para actualizar los resultados.</p>
      <button class="excel" type="button" :disabled="!points.length || exporting" @click="download"><span v-if="exporting" class="spinner" aria-hidden="true"></span><svg v-else viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/></svg>{{ exporting ? 'Preparando Excel…' : 'Descargar Excel' }}</button>
      <p v-if="exportError" role="alert">{{ exportError }}</p>
      <small class="request">Solicitud: {{ result.solicitud_id }}</small>
      </section><section v-if="result" class="card plots"><h3>Gráficas y resumen</h3>
      <div class="metric-buttons" role="group" aria-label="Variable"><button v-for="([name], key) in metrics" :key="key" type="button" :aria-pressed="metric === key" @click="metric = key">{{ name }}</button></div>
      <label class="metric-select">Variable
        <select v-model="metric"><option v-for="([name, unit], key) in metrics" :key="key" :value="key">{{ name }} ({{ unit }})</option></select>
      </label>
      <p v-if="!points.length" role="status">Sin registros para los sensores seleccionados en este período.</p>
      <p v-else-if="!points.some(p => p[metric] != null)">Sin mediciones de {{ metrics[metric][0] }} para esta selección.</p>
      <article v-for="block in blocks" :key="block.sensor.id_instalacion">
        <button class="sensor-heading" type="button" :aria-expanded="expanded.includes(block.sensor.id_instalacion)"
          @click="toggleBlock(block.sensor.id_instalacion)"><span class="identity"><b>{{ block.sensor.nombre }}</b><small>{{ block.sensor.descripcion }}</small></span>
          <span class="badge">{{ block.sensor.fabrica }}</span><span class="badge">{{ block.sensor.id_fabrica || 'Sin sector' }}</span><small>#{{ block.sensor.id_instalacion }}</small><i aria-hidden="true">⌄</i></button>
        <div v-if="expanded.includes(block.sensor.id_instalacion)">
          <div class="stats readings"><div v-for="[name, value] in [['Último valor',block.last],['Mínimo',block.stats?.minimo],['Promedio',block.stats?.promedio],['Máximo',block.stats?.maximo]]" :key="name"><small>{{ name }}</small><b>{{ display(value) }} <small v-if="value != null">{{ metrics[metric][1] }}</small></b></div></div>
          <p class="notice" role="status" v-if="!block.validCount">Este sensor no tiene mediciones válidas de esta variable en el período</p>
          <p class="notice" role="status" v-else-if="block.validCount === 1">Solo existe una medición; no es posible formar una línea</p>
          <ClimateHistoryChart v-if="block.validCount" :points="block.points" :metric="metric" />
        </div>
      </article>
      <div class="table-scroll">
        <table>
          <caption>Resumen por sensor · {{ metrics[metric].join(' · ') }}</caption>
          <thead><tr><th>Sensor</th><th>Registros</th><th>Mínimo</th><th>Promedio</th><th>Máximo</th></tr></thead>
          <tbody><tr v-for="row in summaries" :key="row.id_instalacion">
            <th scope="row">{{ labels.get(row.id_instalacion) }}</th><td>{{ row.total_registros }}</td>
            <td v-for="stat in ['minimo', 'promedio', 'maximo']" :key="stat"><span :class="{muted: row[metric][stat] == null}">{{ display(row[metric][stat]) }}</span></td>
          </tr></tbody>
        </table>
      </div>
    </section>
  </template>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import ClimateHistoryChart from './ClimateHistoryChart.vue';
import { chronologicalPoints, measurementSummary, applyQuickPeriod, climateRequest, metrics, period, sensorLabel } from '@/helpers/climateHistory';

import HistorySearch from './HistorySearch.vue';
import { exportClimateHistory } from '@/helpers/exportClimateHistory';
const formatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 4 });
const display = value => typeof value === 'number' ? formatter.format(value) : value ?? 'Sin dato';
const canConsult = computed(() => {
  if (!selectedSensorIds.value.length) return false;
  try { period(from.value, to.value); return true; } catch { return false; }
});
const cancelled = ref(false), exporting = ref(false), exportError = ref('');
function cancelQuery() {
  request?.abort();
  busy.value = false;
  cancelled.value = true;
}
async function download() {
  exporting.value = true;
  exportError.value = '';
  try { await exportClimateHistory(result.value); }
  catch { exportError.value = 'No se pudo generar el archivo Excel. Intentá nuevamente.'; }
  finally { exporting.value = false; }
}
const selectedSet = computed(() => new Set(selectedSensorIds.value));
const selectionError = ref('');
function isSensorSelected(id) { return selectedSet.value.has(id); }
function addSensors(ids) {
  const next = [...new Set([...selectedSensorIds.value, ...ids])];
  if (!next.every(id => Number.isSafeInteger(id) && id > 0 && byId.value.has(id))) {
    selectionError.value = 'La selección contiene un sensor inválido.';
    return;
  }
  if (next.length > 100) {
    selectionError.value = 'El máximo es de 100 sensores. Se conservó la selección anterior.';
    return;
  }
  selectionError.value = '';
  selectedSensorIds.value = next;
}
function addSensor(id) { addSensors([id]); }
function removeSensors(ids) {
  const removed = new Set(ids);
  selectedSensorIds.value = selectedSensorIds.value.filter(id => !removed.has(id));
  selectionError.value = '';
}
function removeSensor(id) { removeSensors([id]); }
function toggleSensor(id, checked) {
  if (checked) addSensor(id); else removeSensor(id);
  return isSensorSelected(id);
}
function clearAllSensors() { selectedSensorIds.value = []; selectionError.value = ''; }
const idsOf = sensors => sensors.map(s => s.id_instalacion);
function addWholeFactory(label) { addSensors(idsOf(factoryMap.value.get(label).sensors)); }
function removeWholeFactory(label) { removeSensors(idsOf(factoryMap.value.get(label).sensors)); }
function sectorSensors(id, label) { return factoryMap.value.get(label).sectors.get(id).sensors; }
function addWholeSector(id) { addSensors(idsOf(sectorSensors(id, factoryLabel.value))); }
function removeWholeSector(id, label) { removeSensors(idsOf(sectorSensors(id, label))); }
function exploreFactory(label) { factoryLabel.value = label; sectorId.value = null; }
function exploreSuggestion(item) {
  exploreFactory(item.factory);
  sectorId.value = item.sector;
  if (item.sensor) addSensor(item.sensor.id_instalacion);
}
const shortcuts = [['6 horas', 6], ['24 horas', 24], ['7 días', 168], ['30 días', 720]];
const activePeriod = ref(null);
function setPeriod(hours) {
  const dates = applyQuickPeriod(hours * 3600000);
  from.value = dates.from;
  to.value = dates.to;
  activePeriod.value = hours;
}
const catalog = shallowRef([]), factoryLabel = ref(''), sectorId = ref(null);
const selectedSensorIds = ref([]), from = ref(''), to = ref(''), metric = ref('temperatura');
const loadingCatalog = ref(true), catalogError = ref(''), busy = ref(false), error = ref('');
const result = shallowRef(null), consultedIds = shallowRef([]);
let request;
function groupFactories(sensors) {
  const map = new Map();
  for (const sensor of sensors) {
    const label = sensor.fabrica, id = sensor.id_fabrica;
    if (!map.has(label)) map.set(label, { label, sectors: new Map(), sensors: [] });
    const f = map.get(label);
    if (!f.sectors.has(id)) f.sectors.set(id, { id, sensors: [] });
    f.sensors.push(sensor);
    f.sectors.get(id).sensors.push(sensor);
  }
  return map;
}
const factoryMap = computed(() => groupFactories(catalog.value));
const factories = computed(() => [...factoryMap.value.values()]);
const byId = computed(() => new Map(catalog.value.map(s => [s.id_instalacion, s])));
const factory = computed(() => factoryMap.value.get(factoryLabel.value));
const exploredSensors = computed(() => sectorId.value === null ? factory.value.sensors : sectorSensors(sectorId.value, factoryLabel.value));
const selectedFactories = computed(() => [...groupFactories(selectedSensorIds.value.map(id => byId.value.get(id))).values()]);
const selectionChanged = computed(() => consultedIds.value.length !== selectedSensorIds.value.length ||
  consultedIds.value.some((id, i) => id !== selectedSensorIds.value[i]));
const labels = computed(() => new Map(result.value.sensores.map(s => [s.id_instalacion, sensorLabel(s)])));
const points = computed(() => result.value.puntos);
const summaries = computed(() => result.value.resumen_por_sensor);

const expanded = ref([]);
function toggleBlock(id) {
  expanded.value = expanded.value.includes(id) ? expanded.value.filter(other => other !== id) : [...expanded.value, id];
}
const pointsBySensor = computed(() => {
  const grouped = new Map(result.value.sensores.map(s => [s.id_instalacion, []]));
  for (const point of points.value) grouped.get(point.id_instalacion)?.push(point);
  for (const [id, rows] of grouped) grouped.set(id, chronologicalPoints(rows));
  return grouped;
});
const blocks = computed(() => {
  const stats = new Map(summaries.value.map(row => [row.id_instalacion, row[metric.value]]));
  return result.value.sensores.map(sensor => {
    const rows = pointsBySensor.value.get(sensor.id_instalacion);
    return { sensor, points: rows, stats: stats.get(sensor.id_instalacion), ...measurementSummary(rows, metric.value) };
  });
});

function startRequest() {
  request?.abort();
  request = new AbortController();
  return request.signal;
}
async function loadCatalog() {
  const signal = startRequest();
  loadingCatalog.value = true;
  catalogError.value = '';
  try {
    const data = await climateRequest('catalogo', signal);
    if (signal.aborted) return;
    catalog.value = data.sensores;
    exploreFactory(factories.value[0]?.label ?? '');
  } catch (e) {
    if (!signal.aborted) catalogError.value = e.message;
  } finally {
    if (!signal.aborted) loadingCatalog.value = false;
  }
}
async function consult() {
  const signal = startRequest();
  cancelled.value = false;
  exportError.value = '';
  result.value = null;
  error.value = '';
  busy.value = true;
  try {
    const ids = [...selectedSensorIds.value];
    if (!ids.length || ids.length > 100 || !ids.every(id => Number.isSafeInteger(id) && id > 0)) {
      throw new Error('Seleccioná entre 1 y 100 sensores válidos.');
    }
    const dates = period(from.value, to.value);
    const data = await climateRequest('consulta', signal, { alcance: 'seleccion', id_instalaciones: ids, ...dates });
    if (signal.aborted) return;
    consultedIds.value = ids;
    result.value = data;
    expanded.value = result.value.sensores.slice(0, 1).map(s => s.id_instalacion);
  } catch (e) {
    if (!signal.aborted) error.value = e.message;
  } finally {
    if (!signal.aborted) busy.value = false;
  }
}
onMounted(loadCatalog);
onBeforeUnmount(() => request?.abort());
</script>

<style scoped>
.panel {display:grid;gap:14px;min-width:0;color:var(--history-text);overflow-wrap:anywhere}
.card {background:var(--history-surface);border:1px solid var(--history-border);border-radius:10px;padding:clamp(12px,1.4vw,20px);display:grid;gap:12px;min-width:0}
h3,h4,p,ul {margin:0} h3 {font-size:1.12rem} h4 {font-size:.93rem}
.muted,small,caption,.eyebrow {color:var(--history-muted)} small,.muted {font-size:.84rem}
.columns,.pickers,.dates,.stats {display:grid;gap:12px}
.columns {grid-template-columns:1.1fr 1fr}.pickers,.dates {grid-template-columns:repeat(2,minmax(0,1fr))}
fieldset {min-width:0;margin:0;border:1px solid var(--history-border);background:var(--history-bg);padding:12px;border-radius:8px}
legend {font-weight:650;padding:0 5px}.pickers label,.dates label,.metric-select {display:grid;gap:3px;color:var(--history-muted);font-size:.83rem;font-weight:600}
select,input[type=datetime-local] {width:100%;min-width:0;color-scheme:dark}
.actions,.action-bar,.metric-buttons,.result-heading,.period-controls {display:flex;align-items:center;gap:7px;flex-wrap:wrap}
fieldset .actions {margin:8px 0}.period-controls {gap:12px}.period-controls .dates {flex:1 1 320px}.period small {display:block;margin-top:5px}
.period .actions,.metric-buttons {gap:2px}.actions button[aria-pressed=true],.metric-buttons button[aria-pressed=true] {background:var(--history-primary);border-color:var(--history-accent);color:white}
.sensors,.selection-list {max-height:12rem;overflow:auto;scrollbar-color:var(--history-border) transparent}
.sensors label {display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px;border-top:1px solid var(--history-border)}
.sensors label:hover,.selection-list li:hover {background:var(--history-surface-raised)}
.identity {display:grid;min-width:0;margin-right:auto}.identity small {font-weight:400}
.badge {display:inline-block;color:var(--history-accent);background:var(--history-surface-raised);border:1px solid var(--history-border);padding:1px 7px;border-radius:20px;font-size:.72rem;line-height:1.5}
.counter {font-weight:bold;margin-right:8px}.selection-list>div {margin-top:8px;padding:8px;background:var(--history-surface);border-radius:6px}
.selection-list h4,.sector>strong {display:inline-block;margin-right:6px}.selection-list button {padding:3px 6px;font-size:.75rem}
.sector {margin:.4rem 0 0 .45rem}.sector ul {list-style:none;padding:0}.sector li {display:flex;align-items:center;justify-content:space-between;gap:5px;font-size:.85rem;padding:3px}
.empty,.panel [role=status]:not(.counter),.panel [role=alert] {background:var(--history-surface-raised);border:1px solid var(--history-border);border-radius:8px;padding:10px 13px}
.panel .notice[role=status] {border-left:3px solid var(--history-accent);background:var(--history-surface)}
.empty {color:var(--history-muted);margin-top:8px}.panel [role=alert] {color:var(--history-danger);border-left:3px solid currentColor}
.panel .warning[role=status] {color:var(--history-warning);border-left:3px solid currentColor}
button.submit,button.excel {display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:9px 16px;font-weight:650;color:white;background:var(--history-primary)}
button.excel {background:var(--history-success);justify-self:start}.submit svg,.excel svg {width:17px;fill:none;stroke:currentColor;stroke-width:2}
.spinner {display:inline-block;vertical-align:middle;width:1em;height:1em;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin {to {transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spinner{animation:none}}
.eyebrow {text-transform:uppercase;letter-spacing:.07em;font-weight:650}.result-heading>div {margin-right:auto}.request {font-family:ui-monospace,monospace}
.stats {grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.stats>div {background:var(--history-bg);padding:9px 12px;border:1px solid var(--history-border);border-radius:7px;display:grid}
.stats b {font-size:1.1rem;font-variant-numeric:tabular-nums}.stats b small {font-weight:400}.metric-select {display:none}
article {border:1px solid var(--history-border);border-radius:8px;min-width:0}
button.sensor-heading {width:100%;display:flex;align-items:center;gap:8px;flex-wrap:wrap;text-align:left;background:var(--history-bg);border:0;padding:10px 12px}
button.sensor-heading[aria-expanded=true] {background:var(--history-surface-raised)}.sensor-heading i {font-size:1.2rem;font-style:normal}.sensor-heading[aria-expanded=true] i {transform:rotate(180deg)}
article>div {padding:9px;display:grid;grid-template-columns:minmax(0,1fr);gap:8px}
.table-scroll {overflow:auto;max-height:36vh;border:1px solid var(--history-border);border-radius:8px}
table {width:100%;border-spacing:0;font-size:.88rem;font-variant-numeric:tabular-nums}
caption {text-align:left;font-weight:650;padding:10px;color:var(--history-text)}
th,td {padding:8px 10px;border-top:1px solid var(--history-border);text-align:right}
thead th {position:sticky;top:0;background:var(--history-surface-raised);z-index:1}
th:first-child {text-align:left;position:sticky;left:0;background:var(--history-surface)} thead th:first-child {z-index:2;background:var(--history-surface-raised)}tbody tr:nth-child(odd){background:var(--history-bg)}tbody tr:hover{background:var(--history-surface-raised)}
@media(max-width:900px){.columns {grid-template-columns:1fr}}
@media(max-width:600px){.dates,.pickers {grid-template-columns:1fr}.stats {grid-template-columns:1fr 1fr}.metric-buttons {display:none}.metric-select {display:grid}.action-bar button,button.excel {width:100%}.columns,.card {gap:9px}.sensor-heading .identity {width:100%}.period-controls {display:grid}.period .actions button{flex:1}.plots,.config,.results {padding:10px}}
</style>
