<template>
  <div
    v-show="tooltip.visibility.infoTable"
    class="toolTipTable"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    v-if="data && headers.length > 0"
  >
    <h2>{{ formatHeader(parametros.solicitud) }}</h2>
    <table>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ formatHeader(header) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index">
          <td v-for="header in headers" :key="header">
            {{ formatValue(item[header]) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { fetchInfoTableDatos } from '../utils/fetchInfoTableDatos';
import { formatValue, formatoTextoSinGion as formatHeader } from '@/funciones';
import { useTooltipStore } from '@/stores/tooltipStore';

const props = defineProps({
  position: {
    type: Object,
    required: true
  },
  parametros: {
    type: Object,
    required: true
  }
});

const tooltip = useTooltipStore();
const loading = ref(false);
const data = ref(null);
const headers = ref([]);

// Cuando el tooltip se abre, carga los datos
watch(
  () => tooltip.visibility.infoTable,
  async (visible) => {
    if (!visible) return;

    loading.value = true;
    try {
      const datos = await fetchInfoTableDatos(props.parametros);
      data.value = datos;

      headers.value = data.value.length > 0
        ? Object.keys(data.value[0]).filter(key => !key.startsWith('id'))
        : [];
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      data.value = null;
      headers.value = [];
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.toolTipTable {
  display: flex;
  flex-direction: column;
  background-color: #3b3b3b;
  color: #f0f0f0;
  text-align: justify;
  position: fixed;
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 10px;
  z-index: 1555;
  margin: 0 auto;
  max-width: 400px;
  max-height: 500px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1em;
}

th {
  color: aqua;
}

th, td {
  padding: 0.5em;
  border: 1px solid #ddd;
  text-align: left;
}

h2 {
  color: #00c51e;
  margin: 0;
  padding-bottom: 0.5em;
}
</style>
