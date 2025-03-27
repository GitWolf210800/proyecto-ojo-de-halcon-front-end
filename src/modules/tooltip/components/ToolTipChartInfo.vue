<template> 
  <div class="tooltipInfo" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
    <div class="chart">
      <Line :data="chartData" :options="chartOptions" v-if="chartData" />
    </div>
    <div class="info">
      <ul>
        <span v-if="loadingNow">Cargando Datos...</span>
        <span class="offline" v-else-if="offlineNow" :style="{ color: offlineColor }">offline</span>
        <li v-for="(item, index) in dataNow" :key="index" v-if="dataNow">
          <!-- Se recorre de manera segura las claves del objeto -->
          <div v-for="key in Object.keys(item)" :key="key">
            <!-- Solo se procesan las claves que no sean límites -->
            <template v-if="key && !key.startsWith('min_') && !key.startsWith('max_') && !key.startsWith('max_alarma')">
              <div class="measurement">
                <span 
                  :style="{
                    color: (
                      (item['min_' + key] !== undefined && Number(item[key]) < Number(item['min_' + key])) ||
                      (item['max_' + key] !== undefined && Number(item[key]) > Number(item['max_' + key]))
                    ) ? alarmColor : textOkColor
                  }">
                  {{ key }}: {{ formatValue(item[key]) }}
                </span>
              </div>
              <!-- Muestra de los límites asociados (mínimo y máximo) -->
               <div class="limits">
                <span class="limit" v-if="item['min_alarma_' + key] !== undefined && item['min_alarma_' + key] !== 0" style="color: white;">
                * min Alarma : {{ formatValue(item['min_alarma_' + key]) }} 
                </span>
                <span class="limit" v-if="item['min_' + key] !== undefined && item['min_' + key] !== 0" style="color: white;">
                * min: {{ formatValue(item['min_' + key]) }}
                </span>
                <span class="limit" v-if="item['max_' + key] !== undefined && item['max_' + key] !== 0" style="color: white;">
                * max: {{ formatValue(item['max_' + key]) }}
                </span>
                <span class="limit" v-if="item['max_alarma_' + key] !== undefined && item['max_alarma_' + key] !== 0" style="color: white;">
                * max Alarma : {{ formatValue(item['max_alarma_' + key]) }}
                </span>
              </div>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
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
import getChartOptions from '../utils/charOptions';
import { fetchChartData } from '../utils/fetchChartData';
import { fetchInfoDataNow } from '../utils/fetchInfoDataNow';
import { alarmColor, textOkColor, offlineColor } from '@/variables';
import { formatValue } from '@/funciones';

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
const loadingNow = ref(true);
const chartData = ref(null);
const dataNow = ref(null);
const offline = ref(false);
const offlineNow = ref(false);

const chartOptions = getChartOptions(props.parametros);

onMounted(async () => {
  try {
    const datasets = await fetchChartData(props.parametros);
    chartData.value = { datasets };
  } catch (error) {
    chartData.value = null;
    offline.value = true;
  } finally {
    loading.value = false;
  }

  try {
    const fetchedDataNow = await fetchInfoDataNow(props.parametros);
    if (fetchedDataNow.length === 0) {
      dataNow.value = null;
      offlineNow.value = true;
      loadingNow.value = false;
    } else {
      dataNow.value = fetchedDataNow;
      console.log(dataNow.value);
      loadingNow.value = false;
    }
  } catch (error) {
    loadingNow.value = false;
    dataNow.value = null;
    offlineNow.value = true;
  }
});
</script>

<style scoped>
.tooltipInfo {
  background-color: #3b3b3b;
  color: #f0f0f0;
  text-align: justify;
  position: fixed;
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 10px;
  z-index: 1555;
  margin: 0 auto;
  width: 360px;
}

.chart {
  width: 100%;
  height: 235px;
}

.offline {
  font-size: 20px;
}

.info {
  width: 100%;
  max-height: 330px;
  font-size: 16px;
  padding: -5px;
}

.measurement {
  font-size: 12px;
}

.limits {
  font-size: 12px;
  margin-bottom: 2px;
  border-top: 1px solid dashed #aaa;
}

.limit {
  margin-right: 1.5em;
}
</style>

