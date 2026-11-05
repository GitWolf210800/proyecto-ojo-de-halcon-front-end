import { filterLimitLabel } from './filterHistory.js';

// Receives only the full export response, never graph points or graph statistics.
export async function exportFilterHistory(result, signal) {
  const { default: ExcelJS } = await import('exceljs');
  if (signal?.aborted) return;
  const book = new ExcelJS.Workbook();
  const sensors = new Map(result.sensores.map(sensor => [sensor.id_instalacion, sensor]));
  function sheet(name, headers) {
    const page = book.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
    page.addRow(headers);
    page.getRow(1).font = { bold: true };
    page.columns.forEach((col, i) => { col.width = Math.min(50, Math.max(18, headers[i].length + 2)); });
    page.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: headers.length } };
    return page;
  }
  const meta = sheet('Consulta', ['Campo', 'Valor', 'ID instalación', 'Nombre', 'Fábrica', 'ID fábrica',
    'Sector / ubicación', 'ID instalación física', 'Estado instalación', 'Situación catálogo']);
  meta.addRows([
    ['Contenido', 'Todas las filas elegibles recibidas del endpoint de exportación; sin muestreo'],
    ['Advertencia', 'Lectura independiente de la gráfica; los datos pueden cambiar entre ambas operaciones.'],
    ...['solicitud_id', 'alcance', 'entidad', 'desde', 'hasta', 'zona_horaria', 'total_exportado', 'columnas', 'limite_filas'].map(k => [k, result[k]]),
    ['muestreado', false], ['Filas recibidas', result.filas.length], ['Filtros incluidos', result.sensores.length],
    ['estado histórico', 'Entero o vacío; sin interpretación industrial'],
  ]);
  for (const s of result.sensores) meta.addRow(['Filtro', null, s.id_instalacion, s.nombre, s.fabrica,
    s.id_fabrica, s.descripcion, s.id_instalacion_fisica, s.estado_instalacion, s.situacion_catalogo]);
  for (const m of result.metricas) {
    meta.addRow(['Métrica', m.campo + ' · ' + m.etiqueta + ' · ' + m.unidad]);
    for (const l of m.limites) meta.addRow(['Límite', l.campo + ' · ' + filterLimitLabel(l)]);
  }
  const fields = result.metricas.flatMap(m => [m.campo, ...m.limites.map(l => l.campo)]);
  const data = sheet('Datos_completos', ['id_medicion', 'fecha (hora de planta)', 'id_instalacion', 'nombre',
    'fabrica', 'id_fabrica', 'sector / ubicación', 'estado histórico', ...fields]);
  const stats = new Map(result.sensores.map(s => [s.id_instalacion,
    new Map(result.metricas.map(m => [m.campo, { count: 0, sum: 0, min: null, max: null }]))]));
  for (const row of result.filas) {
    const s = sensors.get(row.id_instalacion);
    data.addRow([row.id_medicion, row.fecha.replace('T', ' '), s.id_instalacion, s.nombre, s.fabrica,
      s.id_fabrica, s.descripcion, row.estado ?? null, ...fields.map(f => row[f] ?? null)]);
    for (const m of result.metricas) {
      const value = row[m.campo];
      if (!Number.isFinite(value)) continue;
      const stat = stats.get(s.id_instalacion).get(m.campo);
      stat.count++; stat.sum += value;
      stat.min = stat.min === null ? value : Math.min(stat.min, value);
      stat.max = stat.max === null ? value : Math.max(stat.max, value);
    }
  }
  const summary = sheet('Resumen_por_filtro', ['id_instalacion', 'nombre', 'métrica', 'unidad',
    'mediciones válidas en exportación', 'mínimo', 'promedio', 'máximo']);
  for (const s of result.sensores) {
    if (!result.metricas.length) summary.addRow([s.id_instalacion, s.nombre, null, null, 0, null, null, null]);
    for (const m of result.metricas) {
      const stat = stats.get(s.id_instalacion).get(m.campo);
      summary.addRow([s.id_instalacion, s.nombre, m.etiqueta, m.unidad, stat.count,
        stat.min, stat.count ? stat.sum / stat.count : null, stat.max]);
    }
  }
  const bytes = await book.xlsx.writeBuffer();
  if (signal?.aborted) return;
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
  const link = document.createElement('a');
  try {
    link.href = url;
    link.download = ['historico_filtros', result.desde.slice(0, 10), result.hasta.slice(0, 10)].join('_') + '.xlsx';
    document.body.append(link); link.click();
  } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
}
