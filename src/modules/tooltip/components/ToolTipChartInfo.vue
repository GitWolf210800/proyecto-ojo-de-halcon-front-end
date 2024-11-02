<template>
    <div class="tooltipInfo" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
        <div class="chart">
            <Line :data="chartData" :options="chartOptions" v-if="chartData" />
        </div>
        <div class="info">
            <ul>
                <li v-for="(item, index) in dataNow" :key="index" v-if="dataNow">
                    <div v-for="(value, key) in item" :key="key">
                        <!-- Si el valor corresponde a un límite (min o max), se imprime en blanco -->
                        <span v-if="key.startsWith('min_') || key.startsWith('max_')" :style="{ color: 'white' }">
                            {{ key }}: {{ value }}
                        </span>

                        <!-- Si es un valor de medición y tiene límites asociados -->
                        <span v-else-if="item['min_' + key] !== 0 && item['max_' + key] !== 0"
                            :style="{ color: (value < item['min_' + key] || value > item['max_' + key]) ? 'red' : 'green' }">
                            {{ key }}: {{ value }}
                        </span>

                        <!-- Si es un valor de medición sin límites asociados -->
                        <span v-else>
                            {{ key }}: {{ value }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
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
import 'chartjs-adapter-date-fns'; // Importa el adaptador de fechas
import getChartOptions from '../utils/charOptions';
import { fetchChartData } from '../utils/fetchChartData';
import { fetchInfoDataNow } from '../utils/fetchInfoDataNow';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

export default {
    name: 'ToolTipChartInfo',
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
            chartData: null,
            dataNow: null,
            offline: false,
            params: this.parametros,
            chartOptions: getChartOptions(this.parametros)
        };
    },
    async mounted() {
        try {
            const datasets = await fetchChartData(this.parametros);
            const dataNow = await fetchInfoDataNow(this.parametros);
            this.chartData = { datasets };
            this.dataNow = dataNow;
        } catch (error) {
            this.chartData = null;
            this.offline = true;
        } finally {
            this.loading = false;
        }
    } 
};
</script>

<style>
.tooltipInfo {
    background-color: #626262;
    color: #f0f0f0;
    text-align: justify;
    position: fixed;
    border: 1px solid #ccc;
    border-radius: 7px;
    padding: 10px;
    z-index: 1;
    margin: 0 auto;
    width: 360px;
}

.chart {
    width: 100%;
    height: 200px;
}

.info {
    max-height: 300px; /* Ajusta el máximo de altura aquí */
    overflow-y: auto;  /* Activa el desplazamiento si se excede la altura */
    padding: 5px;
}
</style>
