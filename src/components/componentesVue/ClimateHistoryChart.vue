<template>
  <div class="chart">
    <label v-if="limits[metric].length"><input v-model="showLimits" type="checkbox"> Mostrar límites</label>
    <div class="chart-scroll"><div class="chart-stage"><Line dataset-id-key="key" :data="data" :options="options" :aria-label="label" /></div></div>
    <small class="scroll-hint"><svg viewBox="0 0 24 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 8h20M7 3 2 8l5 5m10-10 5 5-5 5"/></svg>Deslizá horizontalmente para recorrer la gráfica</small>
    <div class="legend" aria-label="Series del gráfico">
      <button v-for="line in data.datasets" :key="line.key" type="button" :aria-pressed="!line.hidden"
        @click="toggle(line.key)"><i :style="{ borderColor: line.borderColor, borderStyle: line.borderDash ? 'dashed' : 'solid' }"></i>{{ line.label }}</button>
    </div>
    <small><b>●</b> Normal · <b>●</b> Aviso · <b>●</b> Alarma</small>
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { Chart, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { Line } from 'vue-chartjs';
import { civilMillis, classifyClimateValue, usableLimit, limits, metrics } from '@/helpers/climateHistory';
Chart.register(LinearScale, LineElement, PointElement, Tooltip);
const props = defineProps({ points: Array, metric: String });
const label = computed(() => metrics[props.metric].join(' · '));
const showLimits = ref(true), hidden = ref([]);
const colors = { normal: '#60a5fa', aviso: '#f59e0b', alarma: '#ef3b2f' };
function segmentColor(a, b) {
  if (![a, b].every(state => Object.hasOwn(colors, state))) return colors.normal;
  if (a === 'alarma' || b === 'alarma') return colors.alarma;
  return a === 'aviso' || b === 'aviso' ? colors.aviso : colors.normal;
}
const clock = new Intl.DateTimeFormat('es-AR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' });
function toggle(key) {
  hidden.value = hidden.value.includes(key) ? hidden.value.filter(k => k !== key) : [...hidden.value, key];
}
function limitName(key) {
  if (key.startsWith('min_A_')) return 'Alarma mínima';
  if (key.startsWith('max_A_')) return 'Alarma máxima';
  return key.startsWith('min_') ? 'Mínimo' : 'Máximo';
}
const samples = computed(() => props.points.map(point => ({ x: civilMillis(point.fecha), point })));
const data = computed(() => {
  const metric = props.metric;
  const values = samples.value.map(({ x, point }) => {
    const severity = classifyClimateValue(metric, point[metric], point);
    return { x, y: severity ? point[metric] : null, severity, point };
  });
  const pointColor = ctx => colors[ctx.raw?.severity] ?? colors.normal;
  const datasets = [{ key: metric, label: 'Línea de medición', data: values, hidden: hidden.value.includes(metric),
    showLine: true, fill: false, tension: 0, borderColor: colors.normal, borderWidth: 2, spanGaps: false, pointHitRadius: 5,
    pointBackgroundColor: pointColor, pointBorderColor: pointColor,
    pointRadius: ctx => ctx.raw?.severity === 'normal' ? 1.75 : 3,
    segment: { borderColor: ({ p0, p1 }) => segmentColor(p0.raw?.severity, p1.raw?.severity) },
  }];
  if (showLimits.value) for (const key of limits[metric]) {
    const line = samples.value.map(({ x, point }) => ({ x, y: usableLimit(point?.[key]), point }));
    if (line.some(p => p.y !== null)) datasets.push({ key, label: limitName(key), data: line,
      hidden: hidden.value.includes(key), borderColor: key.includes('_A_') ? 'rgba(239,59,47,.65)' : 'rgba(245,158,11,.65)',
      showLine: true, fill: false, order: 1, borderWidth: 1.35, borderDash: [5, 5], pointRadius: 0, pointHoverRadius: 0, spanGaps: false, stepped: 'before' });
  }
  return { datasets };
});
const mobileQuery = window.matchMedia('(max-width: 600px)');
const compact = ref(mobileQuery.matches);
const updateLayout = event => { compact.value = event.matches; };
mobileQuery.addEventListener('change', updateLayout);
onBeforeUnmount(() => mobileQuery.removeEventListener('change', updateLayout));
const axis = { ticks: { color: '#e2e8f0' }, grid: { color: '#ffffff22' } };
const options = computed(() => ({
  responsive: true, maintainAspectRatio: false, animation: false, parsing: false,
  interaction: { mode: 'nearest', intersect: false },
  scales: {
    x: { ...axis, type: 'linear', ticks: { ...axis.ticks, maxTicksLimit: compact.value ? 6 : 5,
      ...(compact.value && { autoSkip: true, minRotation: 0, maxRotation: 0 }), callback: value => clock.format(value) } },
    y: { ...axis, title: { display: true, text: label.value, color: '#e2e8f0' } },
  },
  plugins: { legend: { display: false }, tooltip: { callbacks: {
    title: items => clock.format(items[0].parsed.x),
    label: item => item.dataset.label + ': ' + item.parsed.y + ' ' + metrics[props.metric][1],
    afterLabel: item => {
      const p = item.raw.point;
      if (!p) return [];
      const severity = classifyClimateValue(props.metric, p[props.metric], p);
      return ['Estado: ' + (severity ?? 'sin medición'), ...limits[props.metric]
        .filter(k => usableLimit(p[k]) !== null).map(k => limitName(k) + ': ' + p[k])];
    },
  } } },
}));
</script>
<style scoped>
.chart { min-width: 0; max-width: 100%; padding: .7rem; background: #102338; color: #edf4ff; border-radius: .5rem; }
.chart-scroll { width: 100%; min-width: 0; max-width: 100%; }
.scroll-hint { display: none; }
.chart-stage { width: 100%; height: clamp(230px, 40vh, 430px); position: relative; }
.legend { display: flex; flex-wrap: wrap; gap: .4rem; margin: .4rem 0; }
.legend button { cursor: pointer; color: inherit; background: #203951; border: 1px solid #52718a; border-radius: .3rem; }
.legend i { display: inline-block; width: 1rem; border-width: 1px 0 0; margin-right: .35rem; vertical-align: middle; }
.legend button[aria-pressed=false] { text-decoration: line-through; opacity: .6; }
b { color: #60a5fa; } b:nth-of-type(2) { color: #f59e0b; } b:nth-of-type(3) { color: #ef3b2f; }
@media (max-width: 600px) {
  .chart { padding-inline: .45rem; }
  .chart-scroll {
    overflow-x: auto; overflow-y: hidden; overscroll-behavior-inline: contain;
    touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch;
    scrollbar-width: thin; scrollbar-color: var(--history-border) transparent;
  }
  .chart-stage { min-width: 700px; height: 260px; }
  .scroll-hint { display: flex; align-items: center; gap: .4rem; margin-top: .35rem; color: var(--history-muted); }
  .scroll-hint svg { width: 1rem; flex: none; }
}
</style>
