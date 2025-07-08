<template> 
  <div
    v-show="tooltip.visibility.chartInfo" 
    class="tooltipInfo"
    :class="{ tooltip__fullscreen: smartphone }"
    :style="smartphone ? {} : { left: `${position.x}px`, top: `${position.y}px` }"
  >
    <button v-if="smartphone" class="close__button" @click="tooltip.close('chartInfo')">
      Cerrar
    </button>
    <div class="chart">
      <Line :data="chartData" :options="chartOptions" v-if="chartData" />
    </div>

    <div class="info">
      <ul>
        <span v-if="loadingNow">Cargando Datos...</span>
        <span class="offline" v-else-if="offlineNow" :style="{ color: offlineColor }">offline</span>
        <li v-for="(item, index) in dataNow" :key="index" v-if="dataNow">
          <div v-for="key in Object.keys(item)" :key="key">
            <template v-if="key && !key.startsWith('min_') && !key.startsWith('max_') && !key.startsWith('max_alarma')">
              <div class="measurement">
                <span 
                  :style="{
                    color: (
                      (item['min_' + key] !== undefined && Number(item[key]) < Number(item['min_' + key])) ||
                      (item['max_' + key] !== undefined && Number(item[key]) > Number(item['max_' + key]))
                    ) ? alarmColor : textOkColor
                  }">
                  {{ key }}: {{ formatValue(item[key]) }} {{ setsNow[key]['unidad_medida'] }}
                </span>
              </div>
              <div class="limits">
                <span class="limit" v-if="item['min_alarma_' + key] !== undefined && item['min_alarma_' + key] !== 0">
                  * min Alarma : {{ formatValue(item['min_alarma_' + key]) }} {{ setsNow[key]['unidad_medida'] }}
                </span>
                <span class="limit" v-if="item['min_' + key] !== undefined && item['min_' + key] !== 0">
                  * min: {{ formatValue(item['min_' + key]) }} {{ setsNow[key]['unidad_medida'] }}
                </span>
                <span class="limit" v-if="item['max_' + key] !== undefined && item['max_' + key] !== 0">
                  * max: {{ formatValue(item['max_' + key]) }} {{ setsNow[key]['unidad_medida'] }}
                </span>
                <span class="limit" v-if="item['max_alarma_' + key] !== undefined && item['max_alarma_' + key] !== 0">
                  * max Alarma : {{ formatValue(item['max_alarma_' + key]) }} {{ setsNow[key]['unidad_medida'] }}
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
import { ref, watch, computed } from 'vue';
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
import { useTooltipStore } from '@/stores/tooltipStore';
import { formatValue, isMobile } from '@/funciones';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const props = defineProps({
  position: Object,
  parametros: Object
});

const tooltip = useTooltipStore();

const loading = ref(true);
const loadingNow = ref(true);
const chartData = ref(null);
const dataNow = ref(null);
const setsNow = ref(null);
const offline = ref(false);
const offlineNow = ref(false);
const smartphone = isMobile();

// Chart options reactivo para actualizar título dinámicamente
const chartOptions = computed(() => getChartOptions(props.parametros));

// Carga los datos al activarse el tooltip
watch(
  () => tooltip.visibility.chartInfo,
  (visible) => {
    if (visible) cargarDatos();
  },
  { immediate: true }
);

async function cargarDatos() {
  loading.value = true;
  loadingNow.value = true;
  offline.value = false;
  offlineNow.value = false;

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
      setsNow.value = null;
      offlineNow.value = true;
    } else {
      dataNow.value = fetchedDataNow.resultado;
      setsNow.value = fetchedDataNow.setsMedicion;
    }
  } catch (error) {
    dataNow.value = null;
    setsNow.value = null;
    offlineNow.value = true;
  } finally {
    loadingNow.value = false;
  }
}
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

.tooltip__fullscreen {
  top: 0;
  left: 0;
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 0;
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
}

.measurement {
  font-size: 12px;
}

.limits {
  font-size: 11px;
  margin-bottom: 2px;
  border-top: 1px solid dashed #aaa;
}

.limit {
  margin-right: 1em;
}

.close__button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff5c5c;
  color: #fff;
  border: none;
  width: 60px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
}
</style>
