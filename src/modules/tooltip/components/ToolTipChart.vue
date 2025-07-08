<template>
  <div
    class="tooltip"
    :class="{ tooltip__fullscreen: smartphone }"
    :style="smartphone ? {} : { left: `${position.x}px`, top: `${position.y}px` }"
    v-show="tooltip.visibility.chart"
  >
    <button v-if="smartphone" class="close__button" @click="tooltip.close('chart')">
      Cerrar
    </button>

    <Line :data="charData" :options="chartOptions" v-if="charData" />
    <div class="chart__loading" v-else-if="loading">Cargando Datos...</div>
    <div class="offline" v-else-if="offline">offline</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
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
import { useTooltipStore } from "@/stores/tooltipStore";

// Registro de componentes de Chart.js
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

// Props del componente
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

// Store y estado local
const tooltip = useTooltipStore();
const loading = ref(true);
const charData = ref(null);
const offline = ref(false);
const smartphone = isMobile();

const chartOptions = computed(() => getChartOptions(props.parametros));

// Carga inicial al montar
onMounted(() => {
  cargarDatos();
});

// Recarga cuando el tooltip se vuelve visible
watch(
  () => tooltip.visibility.chart,
  (visible) => {
    if (visible) {
      cargarDatos();
    }
  }
);

// Función para cargar los datos del gráfico
async function cargarDatos() {
  loading.value = true;
  offline.value = false;
  try {
    const datasets = await fetchChartData(props.parametros);
    charData.value = { datasets };
  } catch (error) {
    charData.value = null;
    offline.value = true;
  } finally {
    loading.value = false;
  }
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

.tooltip__fullscreen {
  top: 0;
  left: 0;
  width: 92vw;
  height: 58vh;
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
