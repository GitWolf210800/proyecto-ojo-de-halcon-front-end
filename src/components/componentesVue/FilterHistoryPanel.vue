<template>
  <div class="panel">
    <p v-if="loadingCatalog" role="status">Cargando catálogo de filtros…</p>
    <div v-else-if="catalogError"><p role="alert">{{ catalogError }}</p><button :disabled="waiting" @click="loadCatalog">Reintentar catálogo</button></div>
    <p v-else-if="!catalog.length" class="empty">El catálogo no contiene filtros.</p>
    <form v-else class="card config" @submit.prevent="consult">
      <h3>Histórico de filtros</h3>
      <p class="muted">Combiná filtros de distintas fábricas y ubicaciones, incluidos los retirados.</p>
      <HistorySearch :factories="factories" @choose="chooseSuggestion" />
      <div class="columns">
        <fieldset><legend>Explorar catálogo</legend>
          <div class="pickers">
            <label>Fábrica <select :value="factoryLabel" @change="exploreFactory($event.target.value)"><option v-for="f in factories" :key="f.label">{{ f.label }}</option></select></label>
            <label>Sector / ubicación <select v-model="groupLabel"><option :value="null">Todos los grupos</option><option v-for="group in factory?.sectors.values()" :key="group.id">{{ group.id }}</option></select></label>
          </div>
          <div class="actions">
            <button type="button" @click="addSensors(factory.sensors.map(s => s.id_instalacion))">Agregar fábrica completa</button>
            <button type="button" :disabled="groupLabel === null" @click="addSensors(explored.map(s => s.id_instalacion))">Agregar grupo completo</button>
          </div>
          <p class="muted">{{ catalog.length }} disponibles · {{ selectedIds.length }} seleccionados</p>
          <div class="sensors">
            <label v-for="s in explored" :key="s.id_instalacion">
              <input type="checkbox" :checked="selectedIds.includes(s.id_instalacion)" @change="$event.target.checked = toggleSensor(s.id_instalacion, $event.target.checked)">
              <span class="identity"><b>{{ s.nombre }}</b><small>{{ s.descripcion || 'Sin ubicación' }}<template v-if="s.id_instalacion_fisica != null"> · Ubicación #{{ s.id_instalacion_fisica }}</template></small></span>
              <span v-if="s.situacion_catalogo !== 'activo'" class="badge retired">{{ catalogStatus(s) }}</span><small>#{{ s.id_instalacion }}</small>
            </label>
          </div>
        </fieldset>
        <fieldset><legend>Filtros seleccionados</legend>
          <span class="badge counter" aria-live="polite">{{ selectedIds.length }} / 100</span>
          <button type="button" @click="clearSelection">Limpiar selección</button>
          <p v-if="selectionError" role="alert">{{ selectionError }}</p>
          <p v-if="!selectedIds.length" class="empty">Todavía no seleccionaste filtros.</p>
          <ul class="selection-list">
            <li v-for="s in selectedSensors" :key="s.id_instalacion">
              <span class="identity"><b>{{ s.etiqueta || s.nombre }} · #{{ s.id_instalacion }}</b><small>{{ s.fabrica || 'Sin fábrica' }} · {{ catalogStatus(s) }}</small></span>
              <button type="button" :aria-label="'Quitar filtro ' + s.id_instalacion" @click="removeSensor(s.id_instalacion)">×</button>
            </li>
          </ul>
        </fieldset>
      </div>
      <fieldset class="period"><legend>Período de consulta</legend>
        <div class="dates">
          <label>Desde <input v-model="from" type="datetime-local" step="1" required @input="activePeriod = null"></label>
          <label>Hasta <input v-model="to" type="datetime-local" step="1" required @input="activePeriod = null"></label>
        </div>
        <div class="actions"><button v-for="[label, hours] in shortcuts" :key="hours" type="button" :aria-pressed="activePeriod === hours" @click="setPeriod(hours)">{{ label }}</button></div>
        <small>America/Argentina/Buenos_Aires · Hasta 184 días por consulta, sin límite de antigüedad.</small>
      </fieldset>
      <button class="submit" :disabled="busy || exporting || waiting || !selectedIds.length">{{ busy ? 'Consultando…' : 'Consultar histórico' }}</button>
    </form>
    <p v-if="waiting" role="status">Esperá {{ retrySeconds }} segundos antes de reintentar.</p>
    <p v-if="busy" role="status">Procesando la consulta. Los resultados anteriores se conservan hasta recibir la nueva respuesta.</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-if="!visible && !busy" class="empty">Todavía no realizaste una consulta.</p>
    <template v-if="visible">
      <section class="card results" aria-label="Resultado de filtros">
        <h3>{{ result.entidad }}</h3>
        <p class="muted">{{ result.desde }} — {{ result.hasta }} · {{ result.zona_horaria }}</p>
        <div class="stats">
          <div><small>Registros elegibles</small><b>{{ display(result.resumen.total_registros) }}</b></div>
          <div><small>Puntos muestreados</small><b>{{ display(result.resumen.puntos_mostrados) }}</b></div>
          <div><small>Filtros consultados</small><b>{{ result.sensores.length }}</b></div>
          <div><small>Muestreo</small><b>{{ result.muestreo_segundos == null ? 'Sin datos' : result.muestreo_segundos + ' s' }}</b></div>
        </div>
        <p v-if="formChanged" class="warning" role="status">El formulario cambió. La gráfica y la descarga corresponden a la consulta visible.</p>
        <p v-if="!result.puntos.length" role="status">Sin registros elegibles para esta selección y período.</p>
        <button class="excel" type="button" :disabled="busy || exporting || waiting" @click="download">{{ exporting ? 'Preparando Excel…' : 'Descargar Excel' }}</button>
        <small>El Excel consulta todas las filas elegibles, sin muestreo. Es una lectura independiente y puede diferir de la gráfica.</small>
        <p v-if="exportError" role="alert">{{ exportError }}</p>
        <small class="request">Solicitud: {{ result.solicitud_id }}</small>
      </section>
      <section class="card plots" aria-label="Gráficas de filtros"><h3>Gráficas y resumen por filtro</h3>
        <article v-for="block in blocks" :key="block.sensor.id_instalacion">
          <button class="sensor-heading" type="button" :aria-expanded="expanded.includes(block.sensor.id_instalacion)" @click="toggleBlock(block.sensor.id_instalacion)">
            <span class="identity"><b>{{ block.sensor.etiqueta || block.sensor.nombre }}</b><small>{{ block.sensor.fabrica || 'Sin fábrica' }} · {{ block.sensor.descripcion || 'Sin ubicación' }}</small></span>
            <span class="badge">{{ catalogStatus(block.sensor) }}</span><small>#{{ block.sensor.id_instalacion }}</small><span aria-hidden="true">⌄</span>
          </button>
          <div v-if="expanded.includes(block.sensor.id_instalacion)" class="sensor-content">
            <p>Registros elegibles del filtro: {{ display(block.summary?.total_registros ?? 0) }}</p>
            <p v-if="!block.available.length" role="status">Este filtro no tiene mediciones elegibles en el período.</p>
            <template v-else>
              <label class="variable">Métrica
                <select :value="block.metric.campo" @change="activeMetrics[block.sensor.id_instalacion] = $event.target.value"><option v-for="m in block.available" :key="m.campo" :value="m.campo">{{ m.etiqueta }} ({{ m.unidad }})</option></select>
              </label>
              <div class="stats">
                <div v-for="key in ['minimo', 'promedio', 'maximo']" :key="key"><small>{{ statLabels[key] }}</small><b>{{ display(block.summary?.metricas[block.metric.campo]?.[key]) }} <small>{{ block.metric.unidad }}</small></b></div>
                <div><small>Puntos válidos muestreados</small><b>{{ block.validCount }}</b></div>
              </div>
              <p v-if="!block.validCount" role="status">Sin puntos de esta métrica para graficar.</p>
              <p v-else-if="block.validCount === 1" role="status">Solo existe un punto muestreado; no es posible formar una línea.</p>
              <FilterHistoryChart v-if="block.validCount" :key="block.metric.campo" :points="block.points" :metric="block.metric" />
            </template>
            <div v-if="result.metricas.length" class="table-scroll"><table>
              <caption>Estadísticas anteriores al muestreo. El conteo de registros corresponde al filtro; el backend no entrega conteos por métrica.</caption>
              <thead><tr><th>Métrica</th><th>Unidad</th><th>Mínimo</th><th>Promedio</th><th>Máximo</th></tr></thead>
              <tbody><tr v-for="m in result.metricas" :key="m.campo"><th>{{ m.etiqueta }}</th><td>{{ m.unidad }}</td><td v-for="key in ['minimo', 'promedio', 'maximo']" :key="key">{{ display(block.summary?.metricas[m.campo]?.[key]) }}</td></tr></tbody>
            </table></div>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>
<script setup>
import { computed, onMounted, onBeforeUnmount, ref, shallowRef } from 'vue';
import HistorySearch from './HistorySearch.vue';
import FilterHistoryChart from './FilterHistoryChart.vue';
import { applyQuickPeriod, chronologicalPoints } from '@/helpers/climateHistory';
import { addFilterIds, catalogStatus, filterQuery, filterRequest, groupFilters } from '@/helpers/filterHistory';
import { exportFilterHistory } from '@/helpers/exportFilterHistory';

const formatter = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 4 });
const display = value => Number.isFinite(value) ? formatter.format(value) : 'Sin dato';
const statLabels = { minimo: 'Mínimo', promedio: 'Promedio', maximo: 'Máximo' };
const catalog = shallowRef([]), loadingCatalog = ref(true), catalogError = ref('');
const selectedIds = ref([]), selectionError = ref(''), factoryLabel = ref(''), groupLabel = ref(null);
const from = ref(''), to = ref(''), activePeriod = ref(null);
const busy = ref(false), exporting = ref(false), error = ref(''), exportError = ref('');
const visible = shallowRef(null), expanded = ref([]), activeMetrics = ref({});
const result = computed(() => visible.value?.data);
const retryUntil = ref(0), now = ref(Date.now());
const retrySeconds = computed(() => Math.max(0, Math.ceil((retryUntil.value - now.value) / 1000)));
const waiting = computed(() => retrySeconds.value > 0);
let request, ticker;
function waitAfter(error) {
  retryUntil.value = Math.max(retryUntil.value, error.retryAt || 0);
  now.value = Date.now();
  clearInterval(ticker);
  if (waiting.value) ticker = setInterval(() => {
    now.value = Date.now();
    if (!waiting.value) clearInterval(ticker);
  }, 250);
}
const factories = computed(() => groupFilters(catalog.value));
const factory = computed(() => factories.value.find(f => f.label === factoryLabel.value));
const explored = computed(() => groupLabel.value === null ? factory.value?.sensors || [] : factory.value?.sectors.get(groupLabel.value)?.sensors || []);
const selectedSensors = computed(() => {
  const map = new Map(catalog.value.map(s => [s.id_instalacion, s]));
  return selectedIds.value.map(id => map.get(id));
});
function addSensors(ids) {
  try { selectedIds.value = addFilterIds(selectedIds.value, ids, catalog.value); selectionError.value = ''; }
  catch (e) { selectionError.value = e.message; }
}
function removeSensor(id) { selectedIds.value = selectedIds.value.filter(other => other !== id); selectionError.value = ''; }
function clearSelection() { selectedIds.value = []; selectionError.value = ''; }
function toggleSensor(id, checked) { if (checked) addSensors([id]); else removeSensor(id); return selectedIds.value.includes(id); }
function exploreFactory(label) { factoryLabel.value = label; groupLabel.value = null; }
function chooseSuggestion(item) { exploreFactory(item.factory); groupLabel.value = item.sector; if (item.sensor) addSensors([item.sensor.id_instalacion]); }
const shortcuts = [['6 horas', 6], ['24 horas', 24], ['7 días', 168], ['30 días', 720]];
function setPeriod(hours) {
  const dates = applyQuickPeriod(hours * 3600000);
  from.value = dates.from; to.value = dates.to; activePeriod.value = hours;
}
const formChanged = computed(() => {
  if (!visible.value) return false;
  try { return JSON.stringify(filterQuery(selectedIds.value, from.value, to.value)) !== JSON.stringify(visible.value.query); }
  catch { return true; }
});
const blocks = computed(() => {
  if (!result.value) return [];
  const points = new Map(result.value.sensores.map(s => [s.id_instalacion, []]));
  const summaries = new Map(result.value.resumen_por_sensor.map(s => [s.id_instalacion, s]));
  for (const p of result.value.puntos) points.get(p.id_instalacion)?.push(p);
  return result.value.sensores.map(sensor => {
    const rows = chronologicalPoints(points.get(sensor.id_instalacion));
    const summary = summaries.get(sensor.id_instalacion);
    const available = result.value.metricas.filter(m => rows.some(p => Number.isFinite(p[m.campo])) ||
      Object.values(summary?.metricas[m.campo] || {}).some(Number.isFinite));
    const metric = available.find(m => m.campo === activeMetrics.value[sensor.id_instalacion]) || available[0];
    return { sensor, points: rows, summary, available, metric, validCount: metric ? rows.filter(p => Number.isFinite(p[metric.campo])).length : 0 };
  });
});
function toggleBlock(id) { expanded.value = expanded.value.includes(id) ? expanded.value.filter(i => i !== id) : [...expanded.value, id]; }
function startRequest() { request?.abort(); request = new AbortController(); return request.signal; }
async function loadCatalog() {
  if (waiting.value) return;
  const signal = startRequest(); loadingCatalog.value = true; catalogError.value = '';
  try {
    const data = await filterRequest('catalogo', signal);
    if (signal.aborted) return;
    catalog.value = data.sensores; exploreFactory(factories.value[0]?.label || '');
  } catch (e) { if (!signal.aborted) { catalogError.value = e.message; waitAfter(e); } }
  finally { if (!signal.aborted) loadingCatalog.value = false; }
}
async function consult() {
  if (busy.value || exporting.value || waiting.value) return;
  error.value = ''; exportError.value = '';
  let query;
  try { query = filterQuery(selectedIds.value, from.value, to.value); }
  catch (e) { error.value = e.message; return; }
  const signal = startRequest(); busy.value = true;
  try {
    const data = await filterRequest('consulta', signal, query);
    if (signal.aborted) return;
    visible.value = { data, query };
    expanded.value = data.sensores.slice(0, 1).map(s => s.id_instalacion);
    activeMetrics.value = {};
  } catch (e) { if (!signal.aborted) { error.value = e.message; waitAfter(e); } }
  finally { if (!signal.aborted) busy.value = false; }
}
async function download() {
  if (!visible.value || busy.value || exporting.value || waiting.value) return;
  const query = visible.value.query, signal = startRequest();
  exporting.value = true; exportError.value = '';
  try {
    const complete = await filterRequest('exportacion', signal, query);
    if (signal.aborted) return;
    await exportFilterHistory(complete, signal);
  } catch (e) { if (!signal.aborted) { exportError.value = e.status ? e.message : 'No se pudo generar el Excel. Intentá nuevamente.'; waitAfter(e); } }
  finally { if (!signal.aborted) exporting.value = false; }
}
onMounted(loadCatalog);
onBeforeUnmount(() => { request?.abort(); clearInterval(ticker); });
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
.selection-list {list-style:none;padding:0}.selection-list li {display:flex;align-items:center;gap:8px;padding:6px;border-bottom:1px solid var(--history-border)}
.retired {color:var(--history-warning)}.variable {display:grid;gap:4px}.sensor-content {min-width:0;max-width:100%}
</style>
