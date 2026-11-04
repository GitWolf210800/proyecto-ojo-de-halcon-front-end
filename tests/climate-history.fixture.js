// Browser fixture: serve this module through Vite on a blank page; all API traffic is mocked.
import { createApp, nextTick } from 'vue';
import { Chart } from 'chart.js';
import Panel from '../src/components/componentesVue/ClimateHistoryPanel.vue';
import { measurementSummary, chronologicalPoints, applyQuickPeriod, civilMillis, classifyClimateValue, plantNowInputValue } from '../src/helpers/climateHistory.js';

async function verify() {
  const ok = (condition, message) => { if (!condition) throw new Error(message); };
  const sensors = ['A', 'B', 'C', 'D'].map((nombre, i) => ({
    nombre, descripcion: 'Sala ' + nombre, id_instalacion: i + 1, id_fabrica: i === 2 ? 'F2' : i === 3 ? 'GS-603' : 'F1', fabrica: i === 2 ? 'Dos' : 'Uno',
  }));
  const large = Array.from({length: 100}, (_, i) => ({ id_instalacion: 1000 + i, nombre: 'Extra ' + i,
    descripcion: 'Sala grande', fabrica: 'Grande', id_fabrica: 'G' }));
  const thresholds = { min_A_temperatura: 29, min_temperatura: 30, max_temperatura: 32, max_A_temperatura: 33 };
  const values = [28.8, 29.5, 31, 32.5, 33.2, null, 29, 30, 32, 33, 31, 31, 32.5, 33.2, 31, 31];
  const points = values.map((temperatura, i) => ({ id_instalacion: 1, fecha: i === 15 ? '2001-01-01T00:04:00' : '2001-01-01T00:00:' + String(i).padStart(2,'0'),
    ...thresholds, ...(i === 10 && { max_temperatura: 29, max_A_temperatura: 30 }), temperatura }));
  const response = { alcance: 'seleccion', fabrica: 'Varias fábricas', desde: '2001-01-01 00:00:00', hasta: '2001-01-02 00:00:00', sensores: [sensors[0], sensors[2]], resumen: { total_registros: 50, puntos_mostrados: points.length },
    muestreo_segundos: 60, puntos: points, resumen_por_sensor: [sensors[0], sensors[2]].map(s => ({ ...s, temperatura: { minimo: 28.8, promedio: 31, maximo: 33.2 } })) };
  for (const row of response.resumen_por_sensor) {
    for (const field of ['humedad','humedad_absoluta','entalpia']) row[field] = { minimo: null, promedio: null, maximo: null };
  }
  let body, finish;
  window.fetch = async (url, options) => {
    if (url.endsWith('/catalogo')) return { ok: true, json: async () => ({ sensores: [...sensors, ...large] }) };
    ok(url.endsWith('/consulta'), 'URL inesperada');
    body = JSON.parse(options.body);
    await new Promise(resolve => { finish = resolve; });
    return { ok: true, json: async () => response };
  };
  const root = document.body.appendChild(document.createElement('main'));
  createApp(Panel).mount(root);
  const settle = () => new Promise(resolve => setTimeout(resolve, 10));
  await settle();
  const all = selector => [...root.querySelectorAll(selector)];
  const click = async element => { element.click(); await nextTick(); };
  const button = text => all('button').find(el => el.textContent.trim() === text);
  const boxes = () => all('.sensors input');
  const count = n => ok(root.textContent.includes(n + ' / 100'), 'contador ' + n);
  const explore = async (i,value) => {
    const picker = all('form select')[i]; picker.value = value; picker.dispatchEvent(new Event('change')); await nextTick();
  };
  await explore(1, 'F1');
  await click(boxes()[0]); await click(boxes()[1]); count(2);
  await click(boxes()[1]); count(1);
  const search = root.querySelector('[role=combobox]');
  async function chooseSensor(name) {
    search.focus(); search.value = 'Sala ' + name; search.dispatchEvent(new Event('input')); await nextTick();
    await click(all('[role=option]').find(e => e.textContent.includes('Sala ' + name)));
  }
  await chooseSensor('C'); await chooseSensor('C'); count(2);
  await explore(0, 'Uno'); await click(button('Agregar fábrica completa')); count(4);
  await click(button('Quitar sector de la selección')); count(2); // C and D remain
  await explore(1, 'F1'); await click(button('Agregar sector completo')); count(4);
  await explore(0, 'Grande'); await click(button('Agregar fábrica completa')); count(4);
  ok(root.textContent.includes('Se conservó la selección anterior'), 'límite atómico');
  await click(button('Limpiar selección')); await click(button('Agregar fábrica completa')); count(100);
  await click(button('Quitar fábrica de la selección')); count(0);
  await chooseSensor('A'); await chooseSensor('C');
  const dates = all('[type=datetime-local]');
  for (const [label,hours] of [['6 horas',6],['24 horas',24],['7 días',168],['30 días',720]]) {
    await click(button(label));
    ok(civilMillis(dates[1].value) - civilMillis(dates[0].value) === hours * 3600000 && button(label).getAttribute('aria-pressed') === 'true', label);
  }
  dates[0].dispatchEvent(new Event('input')); await nextTick();
  ok(!body && button('30 días').getAttribute('aria-pressed') === 'false', 'edición manual sin consulta');
  const instant = new Date('2026-01-01T01:00:00Z');
  ok(plantNowInputValue(instant) === '2025-12-31T22:00:00' && applyQuickPeriod(86400000, instant).from === '2025-12-30T22:00:00', 'hora civil');
  await click(button('Consultar histórico'));
  ok(JSON.stringify(body.id_instalaciones) === '[1,3]' && body.alcance === 'seleccion' &&
    Object.keys(body).sort().join() === 'alcance,desde,hasta,id_instalaciones', 'body exacto');
  await click(button('Limpiar selección')); finish(); await settle();
  ok(all('.sensor-heading').length === 2 && all('canvas').length === 1, 'selección estable y montaje diferido');
  ok(root.textContent.includes('La selección cambió.') && root.textContent.includes('Esta respuesta corresponde a 2 sensores.'), 'snapshot');
  const { default: ExcelJS } = await import('exceljs');
  let receive;
  const download = new Promise(resolve => { receive = resolve; });
  const makeUrl = URL.createObjectURL, activate = HTMLAnchorElement.prototype.click;
  URL.createObjectURL = blob => { receive(blob); return makeUrl.call(URL, blob); };
  HTMLAnchorElement.prototype.click = () => {};
  try {
    await click(button('Descargar Excel'));
    const book = new ExcelJS.Workbook();
    await book.xlsx.load(await (await download).arrayBuffer());
    const [info, data, summary] = book.worksheets;
    ok(info.getSheetValues().some(r => r?.[2] === 'Varias fábricas'), 'metadatos Excel');
    ok(summary.rowCount === 3 && summary.getCell('A2').value === 1 && summary.getCell('A3').value === 3, 'snapshot Excel');
    ok(data.rowCount === points.length + 1 && data.getCell('F2').value === 'F1', 'puntos y sector Excel');
  } finally { URL.createObjectURL = makeUrl; HTMLAnchorElement.prototype.click = activate; }
  const chart = Chart.getChart(all('canvas')[0]);
  const measured = chart.data.datasets[0];
  ok(measured.data.map(p => p.severity).join() === ['alarma','aviso','normal','aviso','alarma',null,'aviso','normal','normal','aviso','alarma','normal','aviso','alarma','normal','normal'].join(), 'estados, igualdad y cambio histórico');
  ok(measured.data[5].y === null && measured.spanGaps === false && chart.data.datasets.length === 5, 'hueco y cuatro límites');
  ok(measured.segment.borderColor({p0:{raw:measured.data[0]},p1:{raw:measured.data[1]}}) === '#ef3b2f', 'peor extremo');
  ok(measured.showLine && measured.borderWidth === 2 && !measured.fill && measured.tension === 0, 'línea visible');
  chart.update('none');
  const meta = chart.getDatasetMeta(0);
  ok(meta.dataset.options.borderWidth === 2 && meta.data[5].skip, 'línea y hueco renderizados');
  for (let i = 0; i < 4; i++) {
    const segments = meta.dataset.segments.filter(s => s.start <= i && s.end >= i + 1);
    ok(segments.some(s => s.style.borderColor === ['#ef3b2f','#f59e0b','#f59e0b','#ef3b2f'][i]), 'tramo continuo ' + i);
    ok(meta.data[i].options.backgroundColor === ['#ef3b2f','#f59e0b','#60a5fa','#f59e0b'][i], 'color del punto');
  }
  for (const [i,color] of [[11,'#f59e0b'],[12,'#ef3b2f'],[13,'#ef3b2f']]) {
    ok(meta.dataset.segments.some(s => s.start <= i && s.end >= i+1 && s.style.borderColor === color), 'normal → aviso → alarma → normal');
  }
  ok(!meta.data[15].skip && measured.data.length === values.length, 'no se crean huecos entre bloques');
  ok(!meta.dataset.segments.some(s => s.start < 5 && s.end > 5), 'sin puente sobre el null');
  ok(chart.data.datasets.slice(1).every(s => s.showLine && s.stepped === 'before' && s.borderDash.join() === '5,5' && s.borderWidth === 1.35 && s.pointRadius === 0), 'límites discretos');
  ok(classifyClimateValue('humedad_absoluta',2,{min_humedad_absoluta:3}) === 'alarma' &&
    classifyClimateValue('temperatura',0,{min_temperatura:0,min_A_temperatura:null}) === 'normal' &&
    classifyClimateValue('entalpia',0,{}) === 'normal', 'humedad absoluta, cero, entalpía');
  await click(all('.sensor-heading')[0]); ok(all('canvas').length === 0, 'gráfico desmontado');
  await click(all('.sensor-heading')[1]); ok(!all('canvas').length && root.textContent.includes('Este sensor no tiene mediciones válidas'), 'sin registros');

  // Same interleaved, deliberately unordered response on all three requests.
  const row = (id, minute, value) => ({ ...thresholds, id_instalacion: id,
    fecha: '2001-01-01T00:' + String(minute).padStart(2, '0') + ':00', temperatura: value });
  const mixed = [row(3,30,33), row(1,24,31), row(1,0,31), row(3,0,31), row(1,8,32.5),
    row(1,16,34), row(3,15,32), row(1,32,null), row(1,40,31), row(1,48,31), row(1,48,31)];
  mixed[1].max_temperatura = 31.5;
  response.puntos = mixed;
  response.resumen.puntos_mostrados = mixed.length;
  await chooseSensor('A'); await chooseSensor('C');
  const query = async () => { await click(button('Consultar histórico')); finish(); await settle(); };
  let reference;
  for (const seconds of [300, 600, 1800]) {
    response.muestreo_segundos = seconds;
    await query();
    await click(all('.sensor-heading')[1]);
    const snapshots = all('canvas').map(canvas => {
      const instance = Chart.getChart(canvas);
      instance.update('none');
      return instance.data.datasets.map((line,i) => ({
        points: line.data.map(p => [p.x,p.y]),
        segments: instance.getDatasetMeta(i).dataset.segments.map(s => [s.start,s.end,s.style?.borderColor]),
      }));
    });
    const [fast, slow] = snapshots;
    ok(fast[0].points.map(p => p[1]).join() === '31,32.5,34,31,,31,31,31', 'cada 8 minutos, orden y repetidos');
    ok(fast[0].points.filter(p => p[1] === null).length === 1 && !fast[0].segments.some(([a,b]) => a < 4 && b > 4), 'solo un hueco real');
    for (const [i,color] of [[0,'#f59e0b'],[1,'#ef3b2f'],[2,'#ef3b2f']]) {
      ok(fast[0].segments.some(([a,b,c]) => a <= i && b >= i+1 && c === color), 'transición sin corte');
    }
    ok(slow[0].points.length === 3 && slow[0].segments.some(([a,b]) => a === 0 && b >= 1) &&
      slow[0].segments.some(([a,b]) => a <= 1 && b === 2), 'sensor independiente cada 15 minutos');
    ok(fast[1].points.every(p => p[1] === 29) && fast[1].segments.some(([a,b]) => a === 0 && b === 7), 'límite constante continuo');
    ok(fast[3].points.map(p => p[1]).join() === '32,32,32,31.5,32,32,32,32', 'límite histórico cambiante');
    if (reference) ok(JSON.stringify(snapshots) === reference, 'mismas líneas con distinto muestreo');
    reference = JSON.stringify(snapshots);
    ok(root.querySelector('.result-heading').textContent.includes(seconds + ' s'), 'metadato visible');
  }
  response.puntos = [row(1,8,31), row(3,0,null), row(1,0,null), row(3,15,undefined), row(3,30,'inválido')];
  await query(); await click(all('.sensor-heading')[1]);
  ok(all('canvas').length === 1 && root.textContent.includes('Solo existe una medición; no es posible formar una línea') &&
    root.textContent.includes('Este sensor no tiene mediciones válidas de esta variable en el período'), 'un valor y ningún valor');
  const only = Chart.getChart(all('canvas')[0]).getDatasetMeta(0);
  ok(only.data.filter(p => !p.skip).length === 1 && !only.dataset.segments.some(s => s.end > s.start), 'punto aislado');
  const summary = measurementSummary(chronologicalPoints(response.puntos.filter(p => p.id_instalacion === 1)), 'temperatura');
  ok(summary.total === 2 && summary.validCount === 1 && summary.nullCount === 1 &&
    summary.firstTimestamp.endsWith('00:00:00') && summary.lastTimestamp.endsWith('00:08:00'), 'diagnóstico por sensor');
}
verify().then(() => document.body.dataset.verdict = 'OK').catch(error => {
  document.body.dataset.verdict = 'FAIL'; document.body.append(String(error.stack));
});
