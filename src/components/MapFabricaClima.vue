<template>
  <div class="container__map">
    <MapClima ref="mapClimaRef" />
    <ToolTipChart
      :position="tooltipPosition"
      :parametros="params"
      v-if="tooltipVisibility.chart"
    />
    <ToolTipChartInfo
      :position="tooltipPosition"
      :parametros="params"
      v-if="tooltipVisibility.chartInfo"
    />
    <ToolTipInfoTable
      :position="tooltipPosition"
      :parametros="params"
      v-if="tooltipVisibility.infoTable"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MapClima from "./maps/MapClima.vue";
import ToolTipChart from "@/modules/tooltip/components/ToolTipChart.vue";
import ToolTipChartInfo from "@/modules/tooltip/components/ToolTipChartInfo.vue";
import ToolTipInfoTable from "@/modules/tooltip/components/ToolTipInfoTable.vue";
import { useHomeClimaStore } from "@/stores/homeClimaStore";
import {
  TOOLTIP_CHART_CONFIG,
  TOOLTIP_CHART_INFO_CONFIG,
  TOOLTIP_INFO_TABLE,
  elementsConfigTyH,
} from "@/variables.js";
const storeData = useHomeClimaStore().datos;

const mapClimaRef = ref(null);
const tooltipPosition = ref({ x: 0, y: 0 });
const params = ref({});
const tooltipVisibility = ref({
  chart: false,
  chartInfo: false,
  infoTable: false,
});

function calculateTooltipPosition(e, config) {
  let x = e.clientX + config.padding;
  let y = e.clientY + config.padding;
  const adjustedX =
    x + config.width > window.innerWidth
      ? e.clientX - config.width - config.padding
      : x;
  const adjustedY =
    y + config.height > window.innerHeight
      ? e.clientY - config.height - config.padding
      : y;
  return {
    x: Math.max(adjustedX, config.padding),
    y: Math.max(adjustedY, config.padding),
  };
}

function displayTooltip(e, tipo, payload, config) {
  tooltipPosition.value = calculateTooltipPosition(e, config);
  params.value = payload;
  tooltipVisibility.value[tipo] = true;
}

function hideTooltip(tipo) {
  tooltipVisibility.value[tipo] = false;
}

function addTooltipEvents() {
  const svg = mapClimaRef.value?.svgRef;
  if (!svg) return;

  const tooltipConfigs = [
    // Configuración estática de tooltips
    createTooltipConfig(
      "#demanda_agua_fria_text",
      "infoTable",
      { solicitud: "demanda_agua_fria" },
      TOOLTIP_INFO_TABLE
    ),
    createTooltipConfig(
      "#condiciones_marcha_carrier",
      "infoTable",
      { solicitud: "condiciones_marcha_carriers" },
      TOOLTIP_INFO_TABLE
    ),
    // Configuración dinámica de tooltips
    ...storeData.nombresClima.flatMap((nombre) =>
      elementsConfigTyH.map(({ idSuffix, metric }) =>
        createTooltipConfig(
          `#${nombre}_${idSuffix}`,
          "chart",
          { nombre, medicion: metric, tabla: "mediciones_clima_24hs" },
          TOOLTIP_CHART_CONFIG
        )
      )
    ),
    ...storeData.nombresFiltro.map((nombre) =>
      createTooltipConfig(
        `#${nombre}`,
        "chartInfo",
        { nombre, medicion: "filtro_ventilador", tabla: "mediciones_filtros" },
        TOOLTIP_CHART_INFO_CONFIG
      )
    ),
    ...storeData.chiller.map((dato) =>
      createTooltipConfig(
        `#${dato.nombre}Vinf`,
        "chart",
        {
          nombre: dato.nombre,
          medicion: "demanda",
          tabla: "mediciones_carrier",
        },
        TOOLTIP_CHART_CONFIG
      )
    ),
    ...storeData.medicionesCarrier.map((medicion) =>
      createTooltipConfig(
        `#${medicion}`,
        "chart",
        { nombre: "carrier", medicion, tabla: "mediciones_carrier" },
        TOOLTIP_CHART_CONFIG
      )
    ),
  ];

  tooltipConfigs.forEach(({ selector, tooltipType, payload, config }) => {
    const element = svg.querySelector(selector);
    if (element) {
      element.addEventListener("mouseover", (e) =>
        displayTooltip(e, tooltipType, payload, config)
      );
      element.addEventListener("mouseleave", () => hideTooltip(tooltipType));
    }
  });
}

function createTooltipConfig(selector, tooltipType, payload, config) {
  return { selector, tooltipType, payload, config };
}

onMounted(() => {
  addTooltipEvents();
});
</script>

<style scoped>
body {
  background-color: #282c34;
}

.container__map {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
  z-index: 0;
}
</style>

<!--
ref="svgRef"
-->
