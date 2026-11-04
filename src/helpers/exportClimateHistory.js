import { limits, metrics } from './climateHistory.js';

export async function exportClimateHistory(result) {
  const { default: ExcelJS } = await import('exceljs');
  const book = new ExcelJS.Workbook();
  const sensors = new Map(result.sensores.map(s => [s.id_instalacion, s]));
  const points = result.puntos;
  if (!points.length) throw new Error('No hay puntos seleccionados para exportar.');
  function sheet(name, headers) {
    const page = book.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
    page.addRow(headers);
    page.getRow(1).font = { bold: true };
    page.columns.forEach((col, i) => { col.width = Math.max(20, headers[i].length + 3); });
    page.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };
    return page;
  }
  const meta = sheet('Consulta', ['Campo', 'Valor', 'ID del sensor', 'Nombre', 'Fábrica', 'Sector', 'Ubicación']);
  meta.addRows([
    ['Contenido', 'Puntos muestreados de la consulta'],
    ['solicitud_id', result.solicitud_id], ['alcance', result.alcance],
    ['fabrica', result.fabrica], ['id_fabrica', result.id_fabrica],
    ['desde', result.desde], ['hasta', result.hasta], ['zona_horaria', result.zona_horaria],
    ['muestreo_segundos', result.muestreo_segundos],
    ['Registros totales informados por el backend', result.resumen.total_registros],
    ['Puntos totales recibidos', result.puntos.length], ['Puntos exportados', points.length],
    ['Sensores presentes en la respuesta', result.sensores.length],
    ['Sensores incluidos en la exportación', result.sensores.length],
  ]);
  meta.getColumn(1).width = 44;
  meta.getColumn(2).width = 50;
  for (const s of result.sensores) meta.addRow(['Sensor en la respuesta', null, s.id_instalacion, s.nombre, s.fabrica, s.id_fabrica, s.descripcion]);
  for (const s of result.sensores) meta.addRow(['Sensor exportado', null, s.id_instalacion, s.nombre, s.fabrica, s.id_fabrica, s.descripcion]);
  const fields = [...Object.keys(metrics), 'estado_temperatura', 'estado_humedad', ...Object.values(limits).flat()];
  const data = sheet('Datos_muestreados', ['fecha (hora de planta)', 'id_medicion', 'id_instalacion', 'nombre', 'fabrica', 'id_fabrica', 'ubicación', ...fields]);
  for (const p of points) {
    const s = sensors.get(p.id_instalacion);
    data.addRow([p.fecha.replace('T', ' '), p.id_medicion, s.id_instalacion, s.nombre, s.fabrica, s.id_fabrica, s.descripcion, ...fields.map(f => p[f] ?? null)]);
  }
  const stats = Object.keys(metrics).flatMap(m => ['minimo', 'promedio', 'maximo'].map(k => [m, k]));
  const summary = sheet('Resumen_por_sensor', ['id_instalacion', 'nombre', 'total_registros', ...stats.map(pair => pair.join('_'))]);
  for (const row of result.resumen_por_sensor) {
    summary.addRow([row.id_instalacion, sensors.get(row.id_instalacion).nombre,
      row.total_registros, ...stats.map(([m, k]) => row[m][k] ?? null)]);
  }
  const bytes = await book.xlsx.writeBuffer();
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const link = document.createElement('a');
  const factory = result.fabrica.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9_-]+/g, '_').slice(0, 80);
  try {
    link.href = url;
    link.download = ['historico_clima', factory, result.desde.slice(0,10), result.hasta.slice(0,10)].join('_') + '.xlsx';
    document.body.append(link);
    link.click();
  } finally {
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
