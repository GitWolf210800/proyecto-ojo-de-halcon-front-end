<template>
  <div class="tooltip" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
    <Line :data="charData" :options="chartOptions" v-if="charData" />
    <div class="chart-loading" v-else-if="loading">Cargando Datos...</div>
    <div class="offline" v-else-if="offline">offline</div>
  </div>
</template>

<script>
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
import 'chartjs-adapter-date-fns'; // Importa el adaptador de fechas
import { Line } from 'vue-chartjs';
import getChartOptions from '../utils/charOptions';
import { fetchChartData } from '../utils/fetchChartData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default {
  name: 'ToolTipChart',
  components: {
    Line
  },
  props: {
    position: {
      type: Object,
      required: true
    },
    parametros: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      charData: null,
      offline : false,
      params: this.parametros, // guardar parámetros para la petición
      chartOptions: getChartOptions(this.parametros)
    };
  },
  async mounted() {
    try {
      const datasets = await fetchChartData(this.parametros);
      this.charData = {datasets};
    } catch (error) {
      this.charData = null;
      this.offline = true;
    } finally {
      this.loading = false;
    }
  }
};
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
