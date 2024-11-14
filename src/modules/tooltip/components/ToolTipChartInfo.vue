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
            <div v-for="(value, key) in item" :key="key">
              <!-- Si el valor corresponde a un límite (min o max), se imprime en blanco -->
              <span v-if="key.startsWith('min_') || key.startsWith('max_')" :style="{ color: 'white' }">
                {{ key }}: {{ formatValue(value) }}
              </span>
              <!-- Si es un valor de medición y tiene límites asociados -->
              <span v-else-if="item['min_' + key] !== 0 && item['max_' + key] !== 0"
                :style="{ color: (value < item['min_' + key] || value > item['max_' + key]) ? alarmColor : textOkColor }">
                {{ key }}: {{ formatValue(value) }}
              </span>
              <!-- Si es un valor de medición sin límites asociados -->
              <span v-else>
                {{ key }}: {{ formatValue(value) }}
              </span>
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
      //console.log(fetchedDataNow);
      if (fetchedDataNow.length === 0) {
        dataNow.value = null;
        offlineNow.value = true;
        loadingNow.value = false;
      } else {
        dataNow.value = fetchedDataNow;
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
  </style>
  