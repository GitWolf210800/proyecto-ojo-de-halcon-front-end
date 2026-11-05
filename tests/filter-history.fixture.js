// Offline browser fixture. Every fetch is replaced before mounting the real modal.
import { createApp, h, nextTick, ref } from 'vue';
import { Chart } from 'chart.js';
import Modal from '../src/components/componentesVue/HistoriesModal.vue';
import { addFilterIds, classifyFilterValue, filterQuery, retryAfterTime } from '../src/helpers/filterHistory.js';
import { civilMillis } from '../src/helpers/climateHistory.js';
import '../src/assets/main.css';

const metrics = [
  { campo: 'filtro_ventilador', etiqueta: 'Filtro – ventilador', unidad: 'Pa', limites: [
    { campo: 'min_filtro_ventilador', tipo: 'min' }, { campo: 'max_filtro_ventilador', tipo: 'max' },
    { campo: 'max_alarma_filtro_ventilador', tipo: 'alarmaMax' }] },
  { campo: 'desperdicio', etiqueta: 'Desperdicio', unidad: 'Pa', limites: [{ campo: 'min_desperdicio', tipo: 'min' }] },
  { campo: 'carro', etiqueta: 'Carro', unidad: '%', limites: [{ campo: 'min_carro', tipo: 'min' }, { campo: 'max_carro', tipo: 'max' }] },
];
const sensor = (id, nombre, fabrica, descripcion, situacion_catalogo = 'activo') => ({
  id_instalacion: id, nombre, etiqueta: nombre, fabrica, descripcion, id_fabrica: 'ID no agrupable',
  id_instalacion_fisica: id * 10, estado_instalacion: situacion_catalogo === 'activo' ? 'ACTIVO' : null,
  tiene_configuracion_actual: situacion_catalogo !== 'historico', situacion_catalogo,
});
const sensors = [
  sensor(1, 'Filtro preparación', 'Fábrica Norte', 'Preparación'),
  sensor(2, 'Filtro retirado', 'Fábrica Sur', 'Hilatura', 'historico'),
  { ...sensor(3, 'Filtro #3', null, null, 'historico'), id_instalacion_fisica: null },
  sensor(4, 'Filtro detenido', 'Fábrica Norte', 'Continuas', 'inactivo'),
  ...Array.from({ length: 100 }, (_, i) => sensor(1000 + i, 'Extra ' + i, 'Grupo grande', 'Grupo completo')),
];
const values = [0, 15, 22, 35, null, 12, 32, 20];
const graphRows = values.map((value, i) => ({
  id_medicion: i + 1, id_instalacion: 1, fecha: '2020-01-01T00:' + String(i * 8).padStart(2, '0') + ':00',
  estado: i % 2, filtro_ventilador: value, min_filtro_ventilador: 10,
  max_filtro_ventilador: i < 5 ? 20 : 25, max_alarma_filtro_ventilador: 30,
  desperdicio: i === 4 ? 5 : null, min_desperdicio: i === 4 ? 10 : null, carro: null, min_carro: null, max_carro: null,
}));
graphRows.push({ id_medicion: 20, id_instalacion: 2, fecha: '2020-01-01T00:01:00', estado: null,
  filtro_ventilador: null, min_filtro_ventilador: null, max_filtro_ventilador: null, max_alarma_filtro_ventilador: null,
  desperdicio: null, min_desperdicio: null, carro: 0, min_carro: 0, max_carro: 90 });
const fullRows = [...graphRows, { ...graphRows[1], id_medicion: 900, fecha: '2020-01-01T00:59:00', filtro_ventilador: 12.3 }]
  .sort((a, b) => a.fecha.localeCompare(b.fecha));
let failStatus = 0, finish, hold = false;
const calls = [];
const ok = (condition, message) => { if (!condition) throw new Error(message); };
function payload(query, exporting) {
  const chosen = query.id_instalaciones.map(id => sensors.find(s => s.id_instalacion === id));
  const rows = (exporting ? fullRows : graphRows).filter(p => query.id_instalaciones.includes(p.id_instalacion));
  const common = { alcance: 'seleccion', entidad: 'Selección de ' + chosen.length + ' filtros', solicitud_id: exporting ? 'export-fixture' : 'graph-fixture',
    desde: query.desde, hasta: query.hasta, zona_horaria: 'America/Argentina/Buenos_Aires', sensores: chosen, metricas: metrics };
  if (exporting) return { ...common, muestreado: false, filas: rows, total_exportado: rows.length, columnas: 17, limite_filas: 60000 };
  return { ...common, muestreado: true, muestreo_segundos: 60, puntos: rows,
    resumen: { total_registros: rows.length, puntos_mostrados: rows.length },
    resumen_por_sensor: chosen.map(s => ({ id_instalacion: s.id_instalacion,
      total_registros: rows.filter(r => r.id_instalacion === s.id_instalacion).length,
      metricas: Object.fromEntries(metrics.map(m => {
        const values = rows.filter(r => r.id_instalacion === s.id_instalacion).map(r => r[m.campo]).filter(Number.isFinite);
        return [m.campo, { minimo: values.length ? Math.min(...values) : null,
          promedio: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null, maximo: values.length ? Math.max(...values) : null }];
      })) })),
  };
}
window.fetch = async (url, options) => {
  ok(url.includes('/api/historico-filtros/'), 'URL fuera de Filtros');
  ok(options.credentials === 'include' && options.signal, 'credenciales y cancelación');
  const body = options.body ? JSON.parse(options.body) : null;
  calls.push({ url, body, signal: options.signal });
  if (url.endsWith('/catalogo')) return { ok: true, json: async () => ({ sensores: sensors, metricas: metrics }) };
  ok(options.method === 'POST', 'POST');
  if (hold) await new Promise(resolve => { finish = resolve; });
  if (failStatus) return { ok: false, status: failStatus, headers: new Headers({ 'Retry-After': failStatus === 429 ? '1' : '' }) };
  return { ok: true, json: async () => payload(body, url.endsWith('/exportacion')) };
};
const opener = document.body.appendChild(document.createElement('button')); opener.textContent = 'Abrir fixture'; opener.focus();
const host = document.body.appendChild(document.createElement('div'));
const open = ref(true), app = createApp({ render: () => open.value ? h(Modal, { initialSection: 'filtros', onClose: () => { open.value = false; } }) : null });
app.mount(host);
const all = selector => [...document.querySelectorAll(selector)], q = selector => document.querySelector(selector);
const button = text => all('button').find(el => el.textContent.trim() === text);
const settle = () => new Promise(resolve => setTimeout(resolve, 30));
const click = async el => { ok(!!el, 'botón inexistente'); el.click(); await nextTick(); };
async function choose(id) {
  const search = q('[role=combobox]'); search.value = '#' + id; search.dispatchEvent(new Event('input')); await nextTick();
  await click(all('[role=option]').find(el => el.textContent.endsWith('#' + id)));
}
async function explore(value) {
  const select = q('.pickers select'); select.value = value; select.dispatchEvent(new Event('change')); await nextTick();
}
async function dates() {
  for (const [i, value] of ['2020-01-01T00:00:00', '2020-01-02T00:00:00'].entries()) {
    const input = all('[type=datetime-local]')[i]; input.value = value; input.dispatchEvent(new Event('input'));
  }
  await nextTick();
}
async function verify() {
  await settle();
  if (location.search.includes('visual')) {
    await choose(1);
    if (!location.search.includes('single')) { await choose(2); await choose(3); }
    await dates(); await click(button('Consultar histórico')); await settle();
    q('article').scrollIntoView({ block: 'start' }); await settle();
    window.Chart = Chart; window.ready = true; return;
  }
  ok(q('dialog').open && document.body.style.overflow === 'hidden', 'dialog y scroll');
  ok(all('.history-sections button').map(b => b.textContent).join() === 'Clima,Filtros', 'secciones');
  ok(q('.sensors').textContent.includes('Inactivo'), 'filtro inactivo');
  await choose(1); await choose(2); await choose(3); await choose(1);
  ok(q('.counter').textContent === '3 / 100' && q('.selection-list').textContent.includes('Histórico'), 'selección global, dedup y retirados');
  await explore('Grupo grande'); await click(button('Agregar fábrica completa'));
  ok(q('.counter').textContent === '3 / 100' && q('[role=alert]').textContent.includes('Se conservó'), 'máximo atómico');
  await click(button('Limpiar selección')); await click(button('Agregar fábrica completa'));
  ok(q('.counter').textContent === '100 / 100', '100 IDs');
  await click(q('[aria-label="Quitar filtro 1000"]')); ok(q('.counter').textContent === '99 / 100', 'quitar individual');
  await click(button('Limpiar selección')); await choose(1); await choose(2); await choose(3);
  for (const [label, hours] of [['6 horas', 6], ['24 horas', 24], ['7 días', 168], ['30 días', 720]]) {
    await click(button(label)); const inputs = all('[type=datetime-local]');
    ok(civilMillis(inputs[1].value) - civilMillis(inputs[0].value) === hours * 3600000, label);
  }
  ok(filterQuery([1], '2000-01-01T00:00:00', '2000-07-03T00:00:00').desde === '2000-01-01 00:00:00', '184 días antiguos');
  let rejected = false; try { filterQuery([1], '2000-01-01T00:00:00', '2000-07-04T00:00:00'); } catch { rejected = true; }
  ok(rejected, '185 días');
  ok(addFilterIds([2, 1], [1, 3], sensors).join() === '2,1,3', 'orden');
  await dates(); hold = true; await click(button('Consultar histórico'));
  const snapshot = calls.at(-1).body, count = calls.length;
  q('form').dispatchEvent(new Event('submit', { cancelable: true })); await nextTick();
  ok(calls.length === count && q('.submit').disabled, 'sin consultas duplicadas');
  await click(button('Limpiar selección')); hold = false; finish(); await settle();
  ok(snapshot.id_instalaciones.join() === '1,2,3' && Object.keys(snapshot).sort().join() === 'alcance,desde,hasta,id_instalaciones', 'contrato exacto');
  ok(all('.sensor-heading').length === 3 && q('.results').textContent.includes('formulario cambió'), 'instantánea');
  let chart = Chart.getChart(q('canvas'));
  const ds = chart.data.datasets[0];
  ok(ds.data.length === 8 && ds.data[4].y === null && ds.data[0].y === 0, 'nulo real y cero válido');
  ok(ds.data[1].severity === 'normal' && ds.data[2].severity === 'aviso' && ds.data[3].severity === 'alarma', 'colores');
  ok(ds.segment.borderColor({ p0: { raw: ds.data[1] }, p1: { raw: ds.data[2] } }) === '#f59e0b', 'segmento aviso');
  ok(ds.segment.borderColor({ p0: { raw: ds.data[2] }, p1: { raw: ds.data[3] } }) === '#ef3b2f', 'segmento alarma');
  const segments = chart.getDatasetMeta(0).dataset.segments;
  ok([0, 1, 2, 5, 6].every(i => segments.some(s => s.start <= i && s.end >= i + 1)) &&
    !segments.some(s => s.start < 4 && s.end > 4), 'continuidad entre muestras y corte nulo');
  const limit = chart.data.datasets.find(d => d.key === 'max_filtro_ventilador');
  ok(limit.stepped === 'before' && limit.borderDash.length && limit.data[4].y === 20 && limit.data[5].y === 25, 'límites históricos cambiantes');
  const label = chart.options.plugins.tooltip.callbacks.afterLabel({ raw: ds.data[2] });
  ok(label.some(s => s.includes('Máximo: 20')), 'tooltip límites');
  for (const [value, expected] of [[10, 'normal'], [20, 'normal'], [30, 'aviso'], [31, 'alarma'], [0, 'alarma']]) {
    ok(classifyFilterValue(metrics[0], { ...graphRows[0], filtro_ventilador: value, estado: 999 }) === expected, 'frontera ' + value);
  }
  ok(classifyFilterValue(metrics[1], { desperdicio: 5, min_desperdicio: 10 }) === 'alarma', 'mínimo sin alarma');
  ok(classifyFilterValue(metrics[1], { desperdicio: 0, min_desperdicio: 0 }) === 'normal', 'límite cero inactivo');
  await click(all('.sensor-heading')[1]); await click(all('.sensor-heading')[2]);
  ok(all('.variable select')[1].options.length === 1 && all('.variable select')[1].value === 'carro', 'métricas diferentes');
  ok(all('.sensor-content')[2].textContent.includes('no tiene mediciones'), 'filtro sin registros');
  const second = Chart.getChart(all('canvas')[1]);
  ok(second.data.datasets.length === 2 && second.data.datasets[0].data[0].y === 0, 'límite inexistente oculto');
  const { default: ExcelJS } = await import('exceljs');
  let receive; const downloaded = new Promise(resolve => { receive = resolve; });
  const makeUrl = URL.createObjectURL, activate = HTMLAnchorElement.prototype.click;
  URL.createObjectURL = blob => { receive(blob); return makeUrl.call(URL, blob); };
  HTMLAnchorElement.prototype.click = () => {};
  try {
    await click(button('Descargar Excel'));
    const book = new ExcelJS.Workbook(); await book.xlsx.load(await (await downloaded).arrayBuffer()); await settle();
    ok(calls.at(-1).url.endsWith('/exportacion') && JSON.stringify(calls.at(-1).body) === JSON.stringify(snapshot), 'endpoint completo e instantánea Excel');
    const [meta, data, summary] = book.worksheets;
    ok(data.name === 'Datos_completos' && data.rowCount === fullRows.length + 1, 'todas las filas, no puntos');
    ok(data.getSheetValues().some(r => r?.[1] === 900 && r?.[9] === 12.3), 'fila exclusiva de exportación, número');
    ok(data.getCell('I2').value === 0 && data.getCell('L2').value === 30, 'valores/límites numéricos');
    ok(data.getSheetValues().some(r => r?.[8] === null || r?.[8] === undefined), 'NULL vacío');
    ok(book.worksheets.every(s => s.views[0].ySplit === 1 && s.autoFilter), 'cabeceras y filtros');
    ok(meta.getSheetValues().some(r => r?.[2] === 'export-fixture'), 'metadatos de exportación');
    ok(summary.getSheetValues().some(r => r?.[1] === 3 && r?.[5] === 0), 'sin datos en Excel');
  } finally { URL.createObjectURL = makeUrl; HTMLAnchorElement.prototype.click = activate; }
  failStatus = 422; await click(button('Descargar Excel')); await settle();
  ok(q('.results').textContent.includes('demasiado grande') && all('.sensor-heading').length === 3, '422 export sin perder resultado');
  await choose(1);
  for (const status of [400, 500, 429]) {
    failStatus = status; await click(button('Consultar histórico')); await settle();
    ok(all('.sensor-heading').length === 3 && all('[role=alert]').length, 'resultado conservado ante ' + status);
  }
  ok(q('.submit').disabled && button('Descargar Excel').disabled, 'Retry-After bloquea reintento');
  const beforeRetry = calls.length; q('form').dispatchEvent(new Event('submit', { cancelable: true })); await nextTick();
  ok(calls.length === beforeRetry, 'guard Retry-After');
  await new Promise(resolve => setTimeout(resolve, 1200)); ok(!q('.submit').disabled, 'fin Retry-After');
  ok(retryAfterTime('2', 1000) === 3000 && retryAfterTime('Thu, 01 Jan 1970 00:00:05 GMT', 1000) === 5000, 'Retry-After segundos y fecha');
  failStatus = 0; hold = true; await click(button('Consultar histórico'));
  const pending = calls.at(-1); await click(q('[aria-label="Cerrar"]')); await nextTick();
  ok(pending.signal.aborted && !q('dialog') && document.body.style.overflow !== 'hidden', 'cierre cancela y restaura scroll');
  ok(document.activeElement === opener, 'foco restaurado'); finish();
  app.unmount();
}
verify().then(() => { document.body.dataset.verdict = 'OK'; }).catch(error => {
  document.body.dataset.verdict = 'FAIL'; document.body.append(String(error.stack)); window.qaError = String(error.stack);
});
