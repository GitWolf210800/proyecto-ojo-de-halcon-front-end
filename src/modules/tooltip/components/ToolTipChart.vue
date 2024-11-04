<template>
  <div class="tooltip" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
    <Line :data="charData" :options="chartOptions" v-if="charData" />
    <div class="chart-loading" v-else-if="loading">Cargando Datos...</div>
    <div class="offline" v-else-if="offline">offline</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'vue-chartjs';
import getChartOptions from '../utils/charOptions';
import { fetchChartData } from '../utils/fetchChartData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

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

const loading = ref(true);
const charData = ref(null);
const offline = ref(false);

const chartOptions = getChartOptions(props.parametros);

onMounted(async () => {
  try {
    const datasets = await fetchChartData(props.parametros);
    charData.value = { datasets };
  } catch (error) {
    charData.value = null;
    offline.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<style>
.tooltip {
  background-color: #3b3b3b;
  color: #f0f0f0;
  text-align: justify;
  position: fixed;
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 10px;
  z-index: 555;
  width: 575px;
  height: 272px;
}

.chart-loading {
  color: #f0f0f0;
  text-align: center;
  padding: 10px;
}
</style>
