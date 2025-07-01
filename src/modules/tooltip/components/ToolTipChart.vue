<template>
  <div
    class="tooltip"
    :class="{ tooltip__fullscreen: smartphone }"
    :style="
      smartphone ? {} : { left: `${position.x}px`, top: `${position.y}px` }
    "
    v-show="visibility"
  >
    <button v-if="smartphone" class="close__button" @click="closeTooltip">
      Cerrar
    </button>
    <Line :data="charData" :options="chartOptions" v-if="charData" /> <!-- Se Incluye el componente Line de chart.js -->
    <div class="chart__loading" v-else-if="loading">Cargando Datos...</div>
    <div class="offline" v-else-if="offline">offline</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { Line } from "vue-chartjs";
import { isMobile } from "@/funciones";
import getChartOptions from "../utils/charOptions";
import { fetchChartData } from "../utils/fetchChartData";
import { useTooltip } from "../utils/useTooltip";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const props = defineProps({
  position: {
    type: Object,
    required: true,
  },
  parametros: {
    type: Object,
    required: true,
  },
});

const loading = ref(true);
const charData = ref(null);
const offline = ref(false);
const visibility = ref(true);
//const {tooltipVisibility} = useTooltip()
const smartphone = isMobile();

const chartOptions = getChartOptions(props.parametros);
//visibility.value = true;

onMounted(async () => {
  try {
    const datasets = await fetchChartData(props.parametros);
    charData.value = { datasets };
    visibility.value = true;
  } catch (error) {
    charData.value = null;
    visibility.value = false;
    offline.value = true;
  } finally {
    loading.value = false;
  }
});

function closeTooltip() {
  visibility.value = false;
}
</script>

<style scoped>
.tooltip {
  background-color: #3b3b3b;
  color: #f0f0f0;
  text-align: justify;
  position: fixed;
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 10px;
  z-index: 1555;
  width: 575px;
  height: 272px;
}

/* Estilos para el tooltip en modo pantalla completa */
.tooltip__fullscreen {
  top: 0;
  left: 0;
  width: 88vw;
  height: 55vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 0;
}

.close__button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff5c5c;
  color: #fff;
  border: none;
  /* border-radius: 50%;*/
  width: 60px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
}

.chart__loading {
  color: #f0f0f0;
  text-align: center;
  padding: 10px;
}
</style>
