<template>
<div class="container__map">
  
    <MapClima ref="mapClimaRef" />

    <ToolTipChart
      :position="tooltipPosition"
      :parametros="params"
      v-if="showTooltip"
    />
    <ToolTipChartInfo
      :position="tooltipPosition"
      :parametros="params"
      v-if="showTooltipInfo"
    />
    <ToolTipInfoTable
      :position="tooltipPosition"
      :parametros="params"
      v-if="showTooltipInfoTable"
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
const showTooltip = ref(false);
const showTooltipInfo = ref(false);
const showTooltipInfoTable = ref(false);

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
  if (tipo === "chart") showTooltip.value = true;
  else if (tipo === "chartInfo") showTooltipInfo.value = true;
  else if (tipo === "infoTable") showTooltipInfoTable.value = true;
}

function hideTooltip(tipo) {
  if (tipo === "chart") showTooltip.value = false;
  else if (tipo === "chartInfo") showTooltipInfo.value = false;
  else if (tipo === "infoTable") showTooltipInfoTable.value = false;
}

function addTooltipEvents() {
  const svg = mapClimaRef.value?.svgRef; // Accede a `svgRef` expuesto en `MapClima`
  if (!svg) return;

  const tooltipConfigs = [
    {
      selector: `#demanda_agua_fria_text`,
      tooltipType: "infoTable",
      payload: { solicitud: "demanda_agua_fria" },
      config: TOOLTIP_INFO_TABLE,
    },
    {
      selector: `#condiciones_marcha_carrier`,
      tooltipType: "infoTable",
      payload: { solicitud: "condiciones_marcha_carriers" },
      config: TOOLTIP_INFO_TABLE,
    },
  ];

  storeData.nombresClima.forEach((nombre) => {
    elementsConfigTyH.forEach(({ idSuffix, metric }) => {
      tooltipConfigs.push({
        selector: `#${nombre}_${idSuffix}`,
        tooltipType: "chart",
        payload: { nombre, medicion: metric, tabla: "mediciones_clima_24hs" },
        config: TOOLTIP_CHART_CONFIG,
      });
    });
  });

  storeData.nombresFiltro.forEach((nombre) => {
    tooltipConfigs.push({
      selector: `#${nombre}`,
      tooltipType: "chartInfo",
      payload: {
        nombre,
        medicion: "filtro_ventilador",
        tabla: "mediciones_filtros",
      },
      config: TOOLTIP_CHART_INFO_CONFIG,
    });
  });

  storeData.chiller.forEach((dato) => {
    tooltipConfigs.push({
      selector: `#${dato.nombre}Vinf`,
      tooltipType: "chart",
      payload: {
        nombre: dato.nombre,
        medicion: "demanda",
        tabla: "mediciones_carrier",
      },
      config: TOOLTIP_CHART_CONFIG,
    });
  });
  storeData.medicionesCarrier.forEach((medicion) => {
    tooltipConfigs.push({
      selector: `#${medicion}`,
      tooltipType: "chart",
      payload: { nombre: "carrier", medicion, tabla: "mediciones_carrier" },
      config: TOOLTIP_CHART_CONFIG,
    });
  });

  tooltipConfigs.forEach(({ selector, tooltipType, payload, config }) => {
    const element = svg.querySelector(selector);
    if (element) {
      element.addEventListener("mouseover", (e) => displayTooltip(e, tooltipType, payload, config));
      element.addEventListener("mouseleave", () => hideTooltip(tooltipType));
    }
  });
}

onMounted(() => {
  addTooltipEvents();
});
</script>

<style>
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

rect {
  transition: fill 1.8s, stroke 1.5s;
}

text {
  user-select: none;
}
</style>

<!--
ref="svgRef"
-->
