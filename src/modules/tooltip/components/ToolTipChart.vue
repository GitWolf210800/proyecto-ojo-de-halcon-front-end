<template>
  <div class="tooltip" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
    <Line :data="charData" :options="chartOptions" v-if="charData" />
    <div class="loading" v-else-if="loading">Cargando Datos...</div>
    <div class="offline" v-else>offline</div>
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
import axios from 'axios';
import { server } from '@/variables.js';

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
      params: this.parametros, // guardar parámetros para la petición
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#FFF'
            }
          },
          title: {
            display: true,
            text: `${this.parametros.nombre} 24Hs`,
            color: 'white',
            font: {
              size: 16
            }
          }
        },
        scales: {
          x: {
      type: 'time',
      time: {
        unit: 'minute', // Ajusta la unidad a 'minute' para mostrar intervalos de minutos
        displayFormats: {
          minute: 'HH:mm' // Solo muestra la hora y minuto, por ejemplo, 14:30
        },
        tooltipFormat: 'HH:mm' // Formato del tooltip (hora:minuto)
      },
      grid: {
        color: '#a0a0a0'
      },
      ticks: {
        color: 'white'
      },
      title: {
        display: true,
        text: 'Hora',
        color: '#D5D5D5'
      }
    },
          y: {
            grid: {
              color: '#a0a0a0'
            },
            ticks: {
              color: 'white'
            },
            title: {
              display: true,
              text: 'Valores',
              color: '#d5d5d5'
            }
          }
        }
      }
    };
  },
  async mounted() {
    try {
      const response = await axios.get(`${server}:1880/datos24hs`, {
        params: {
          nombre: this.params.nombre,
          medicion: this.params.medicion,
          tabla: this.params.tabla
        }
      });

      const data = response.data.datos.datasets;
      //console.log(data);
      this.loading = false;
      this.charData = {
        datasets : data
      };
    } catch (error) {
      console.error('Error fetching chart data', error);
    }
  }
};
</script>

<style>
.tooltip {
  background-color: #626262;
  color: #f0f0f0;
  text-align: justify;
  position: fixed;
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 10px;
  z-index: 555;
  width: 570px;
  height: 265px;
}
</style>

  