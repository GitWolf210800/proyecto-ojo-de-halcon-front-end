<template>
  <div class="content" v-zoom>
    <span v-if="loading" class="loading">Cargando Datos...</span>
    <MapChillerOption1
      class="container__map"
      ref="mapCarrier"
      v-if="opcion1 && !loading"
    />
    <MapChillerOption2
      class="container__map"
      ref="mapCarrier"
      v-else-if="opcion2 && !loading"
    />
  </div>
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
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import MapChillerOption1 from "./maps/MapChillerOption1.vue";
import MapChillerOption2 from "./maps/MapChillerOption2.vue";
import ToolTipChart from "@/modules/tooltip/components/ToolTipChart.vue";
import ToolTipChartInfo from "@/modules/tooltip/components/ToolTipChartInfo.vue";
import ToolTipInfoTable from "@/modules/tooltip/components/ToolTipInfoTable.vue";
import {
  TOOLTIP_CHART_CONFIG,
  TOOLTIP_CHART_INFO_CONFIG,
  TOOLTIP_INFO_TABLE,
} from "@/variables";
import { dataColorInfoCarrier } from "@/helpers/homeCarrierColorManipulator";
import { useTooltip } from "@/modules/tooltip/utils/useTooltip";
import { alarmColor, okColor, paroManual } from "@/variables";
import { createRouterConfig, createTooltipConfig } from "@/funciones";
import { onMounted, ref, watch, nextTick, watchEffect } from "vue";
import { server } from "@/variables";

const {
  tooltipPosition,
  params,
  tooltipVisibility,
  displayTooltip,
  hideTooltip,
} = useTooltip();

const route = useRoute();
const router = useRouter();
const parametros = route.query;
const opcion1 = ref(false);
const opcion2 = ref(false);
const loading = ref(true);
const mapCarrier = ref(null);

let result = Object.values(parametros).join("");
let mediciones = [];
let datos = {};
let datosGral = {};

const updateOpciones = () => {
  opcion1.value = ["carrier1", "carrier2", "carrier3"].includes(result);
  opcion2.value = ["carrier4", "carrier5"].includes(result);
};

watchEffect(updateOpciones);

function initializeTooltipEvents() {
  const svg = mapCarrier.value.svgRef;
  const tooltipConfigs = [
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
    ...datosGral.nombresChiller.map((dato) =>
      createTooltipConfig(
        `#${dato}Vinf`,
        "chart",
        { nombre: dato, medicion: "demanda", tabla: "mediciones_carrier" },
        TOOLTIP_CHART_CONFIG
      )
    ),
    ...datosGral.mediciones.map((dato) =>
      createTooltipConfig(
        `#${dato}`,
        "chart",
        { nombre: result, medicion: dato, tabla: "mediciones_carrier" },
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

function setElementColor(element, medicion, value) {
  const fillColor =
    value === 100
      ? okColor
      : value === 50
      ? paroManual
      : value === 0
      ? alarmColor
      : "#D5A200";
  const strokeColor =
    value === 100
      ? okColor
      : value === 80
      ? "#E9EC03"
      : value === 5 || value === 50
      ? paroManual
      : null;

  if (
    ["filtro", "bomba_", "ventilador", "estado"].some((prefix) =>
      medicion.startsWith(prefix)
    )
  ) {
    element.style.fill = fillColor;
  }

  if (["pileta", "valvula_"].some((prefix) => medicion.startsWith(prefix))) {
    element.style.stroke = strokeColor;
  }

  if (
    [
      "temp",
      "delta",
      "entrada",
      "salida",
      "tanque_agua_fria_carrier",
      "demanda",
    ].some((prefix) => medicion.includes(prefix))
  ) {
    element.textContent = value ? value.toFixed(1) : 0;
  }
}

async function fetchData() {
  try {
    const response = await axios.get(`${server}:1880/carrierNow`, {
      params: { carrier: result },
    });
    if (response.data) {
      mediciones = response.data.mediciones;
      datos = response.data.datos;
      datosGral = response.data;
      loading.value = false;
    }
  } catch (error) {
    console.error("Error fetching Carrier data:", error);
    loading.value = false;
  }
}

async function interactWithSVG() {
  await nextTick();
  if (mapCarrier.value && mapCarrier.value.svgRef) {
    const svg = mapCarrier.value.svgRef;
    svg.querySelector("#carrier").textContent = result;

    mediciones.forEach((medicion) => {
      const element = svg.querySelector(`#${medicion}`);
      if (element) {
        setElementColor(element, medicion, datos[medicion]);
      }
    });
  }
}

async function routesDireccion() {
  await nextTick();
  const svg = mapCarrier.value.svgRef;
  const routesMap = datosGral.nombresChiller.map((dato) =>
    createRouterConfig(`#${dato}Vinf`, "/carrier", dato)
  );

  routesMap.forEach(({ selector, params, path }) => {
    const element = svg.querySelector(selector);
    if (element) {
      element.addEventListener("click", () => {
        router.push({ path, query: params });
        result = params;
        tooltipVisibility.value.chart = false;
      });
    }
  });
}

onMounted(async () => {
  await fetchData();
  dataColorInfoCarrier(mapCarrier.value.svgRef);
  interactWithSVG();
  routesDireccion();
  initializeTooltipEvents();

  // Actualizar los datos cada minuto
  setInterval(async () => {
    await fetchData();
    interactWithSVG();
    if (mapCarrier.value.svgRef) dataColorInfoCarrier(mapCarrier.value.svgRef);
  }, 60000); // 60000 ms = 1 minuto
});

watch(
  () => route.query,
  async () => {
    updateOpciones();
    loading.value = true;
    await fetchData();
    interactWithSVG();
    dataColorInfoCarrier(mapCarrier.value.svgRef);
    routesDireccion();
    initializeTooltipEvents();
    loading.value = false;
  }
);
</script>

<style scoped>
.loading {
  color: #fff;
  display: flex;
}

.container__map {
  padding-top: 4vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 100%;
}
</style>
