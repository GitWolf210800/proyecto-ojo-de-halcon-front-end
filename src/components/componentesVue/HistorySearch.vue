<template>
  <div ref="root" class="search" @focusout="onBlur">
    <label for="history-search">Buscar fábrica, sector, sensor o ubicación</label>
    <div class="field"><svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 5 5"/></svg>
    <input ref="input" placeholder="Buscar fábrica, sector, sensor o ubicación…" id="history-search" v-model="query" role="combobox" autocomplete="off" aria-autocomplete="list"
      aria-controls="history-options" :aria-expanded="open" :aria-activedescendant="active >= 0 && open ? 'history-opt-' + active : undefined"
      @input="open = true; active = -1" @focus="open = true" @keydown="onKey">
    <button v-if="query" type="button" aria-label="Limpiar búsqueda" @click="query = ''; active = -1; input.focus()">×</button></div>
    <div v-show="open" class="menu">
      <div role="listbox" id="history-options" aria-label="Sugerencias">
        <div v-for="category in categories" :key="category.name" role="group" :aria-label="category.name">
          <strong>{{ category.name }}</strong>
          <div v-for="item in category.items" :id="'history-opt-' + item.index" :key="item.key"
            role="option" :aria-selected="item.index === active" @mousedown.prevent @click="choose(item)"><b>{{ item.sensor?.nombre || item.sector || item.factory }}</b><small>{{ item.sensor ? [item.sensor.descripcion, item.factory, item.sector, '#' + item.sensor.id_instalacion].filter(Boolean).join(' · ') : item.sector ? item.factory : 'Fábrica' }}</small></div>
        </div>
      </div>
      <small v-if="!items.length">Sin coincidencias.</small>
    </div>
  </div>
</template>
<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { sensorLabel } from '@/helpers/climateHistory';
const props = defineProps({ factories: Array });

const emit = defineEmits(['choose']);
const input = ref(null);
const root = ref(null), query = ref(''), open = ref(false), active = ref(-1);
const fold = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const entries = computed(() => {
  const factories = [], sectors = [], sensors = [];
  for (const f of props.factories) {
    factories.push({ type: 'Fábricas', factory: f.label, sector: null, label: f.label });
    for (const sector of f.sectors.values()) {
      const label = f.label + ' · ' + (sector.id || 'Sin sector');
      sectors.push({ type: 'Sectores', factory: f.label, sector: sector.id, label });
      for (const sensor of sector.sensors) sensors.push({ type: 'Sensores', factory: f.label,
        sector: sector.id, sensor, label: sensorLabel(sensor) + ' · ' + label + ' · #' + sensor.id_instalacion });
    }
  }
  return [...factories, ...sectors, ...sensors].map((item, key) => ({ ...item, key,
    text: fold([item.label, item.sensor?.etiqueta, item.sensor?.id_instalacion_fisica].join(' ')) }));
});
const items = computed(() => {
  const terms = fold(query.value).trim().split(/\s+/);
  return entries.value.filter(item => terms.every(term => item.text.includes(term)))
    .map((item, index) => ({ ...item, index }));
});
const categories = computed(() => ['Fábricas', 'Sectores', 'Sensores']
  .map(name => ({ name, items: items.value.filter(item => item.type === name) })).filter(c => c.items.length));
function close() { open.value = false; active.value = -1; }
function choose(item) { emit('choose', item); query.value = ''; close(); }
function onBlur(e) { if (!root.value.contains(e.relatedTarget)) close(); }
function outside(e) { if (!root.value.contains(e.target)) close(); }
function onKey(e) {
  if (open.value && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
  if (e.key === 'Enter' && open.value) {
    e.preventDefault();
    if (items.value[active.value]) choose(items.value[active.value]);
  }
  if (['ArrowDown','ArrowUp'].includes(e.key) && items.value.length) {
    e.preventDefault(); open.value = true;
    active.value = e.key === 'ArrowDown' ? (active.value + 1) % items.value.length
      : (active.value <= 0 ? items.value.length - 1 : active.value - 1);
    nextTick(() => document.getElementById('history-opt-' + active.value)?.scrollIntoView({ block: 'nearest' }));
  }
}
onMounted(() => document.addEventListener('pointerdown', outside));
onBeforeUnmount(() => document.removeEventListener('pointerdown', outside));
</script>
<style scoped>
.search {position:relative;display:grid;gap:4px;color:var(--history-text)}
label,.menu strong {font-size:.8rem;font-weight:650;color:var(--history-muted)}
.field {display:flex;align-items:center;gap:9px;background:var(--history-bg);border:1px solid var(--history-border);border-radius:8px;padding:0 12px}
.field:focus-within {border-color:var(--history-accent);box-shadow:0 0 0 3px #38bdf820}
.field svg {width:18px;fill:none;stroke:var(--history-accent);stroke-width:1.7;flex:none}
.field input#history-search {flex:1;min-width:0;border:0;outline:0;background:transparent;padding:10px 0}
.field input::placeholder {color:var(--history-muted)}
.field button {padding:1px 6px}
.menu {position:absolute;top:calc(100% + 4px);inset-inline:0;z-index:5;background:var(--history-surface-raised);border:1px solid var(--history-border);border-radius:8px;padding:8px;max-height:min(34dvh,280px);overflow:auto;box-shadow:0 8px 24px #0006;scrollbar-color:var(--history-border) transparent}
.menu strong {display:block;padding:5px 8px;letter-spacing:.06em;text-transform:uppercase}
[role=option] {cursor:pointer;padding:6px 8px;border-radius:4px;display:grid;overflow-wrap:anywhere}
[role=option] small {color:var(--history-muted)}
[role=option]:hover,[role=option][aria-selected=true] {background:var(--history-primary)}
</style>
