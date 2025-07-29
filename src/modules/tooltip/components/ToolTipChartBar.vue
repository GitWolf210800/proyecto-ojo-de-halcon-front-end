<template>
    <div
        v-show="tooltip.visibility.chartBar" 
        class="tooltipInfo"
        :class="{ tooltip__fullscreen: smartphone }"
        :style="smartphone ? {} : { left: `${position.x}px`, top: `${position.y}px` }"
    >
      <button v-if="smartphone" class="close__button" @click="tooltip.close('chartInfo')">
        Cerrar
        </button>
        <div class="chart">
            <g-gantt-chart
                :chart-start="chartStart"
                :chart-end="chartEnd"
                precision="hour"
                bar-start="beginDate"
                bar-end="endDate"
            >
            <g-gantt-row  :bars="maquinaDatos" />
            </g-gantt-chart>
        </div>  
    </div>
</template>

<script setup>
import {ref, onMounted, watch, computed} from "vue";
import { isMobile } from "@/funciones";
import { fetchChartDataBar } from "../utils/fetchChartDataBar";
import { alarmColor, textOkColor, offlineColor } from '@/variables';
import { useTooltipStore } from '@/stores/tooltipStore';

const props = defineProps({
    position: Object,
    parametros: Object
});

const tooltip = useTooltipStore();

const chartStart = ref('');
const chartEnd = ref('');

const labelText = ref('');
const maquinaDatos = ref([]);

const loading = ref(true);
const offline = ref(false);
const smartphone = isMobile();

watch(
    () => tooltip.visibility.chartBar,
    (visible) => {
        if (visible) cargarDatos();
        else {
            maquinaDatos.value = [];
            labelText.value = '';
        }
    },
    { immediate: true }
);

async function cargarDatos() {
    loading.value = true;
    offline.value = false;

    try {
        const datos = await fetchChartDataBar(props.parametros);
        maquinaDatos.value = datos.arraySend;
        chartStart.value = datos.chartStart;
        chartEnd.value = datos.chartEnd;
        labelText.value = props.parametros.nombre;
    } catch (error) {
        maquinaDatos.value = [null];
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