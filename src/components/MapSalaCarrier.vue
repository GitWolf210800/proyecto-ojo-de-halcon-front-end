<template>
  <div class="content" v-zoom>
    <span v-if="loading" class="loading">Cargando Datos...</span>
    <MapChillerOption1
      class="map"
      ref="mapCarrier"
      v-if="opcion1 && !loading"
    />
    <MapChillerOption2
      class="map"
      ref="mapCarrier"
      v-else-if="opcion2 && !loading"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import MapChillerOption1 from "./maps/MapChillerOption1.vue";
import MapChillerOption2 from "./maps/MapChillerOption2.vue";
import { useTooltip } from "@/modules/tooltip/utils/useTooltip";
import { alarmColor, okColor, paroManual } from "@/variables";
import { createRouterConfig } from "@/funciones";
import { onMounted, ref, watch, watchEffect, nextTick } from "vue";
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

watchEffect(() => {
  opcion1.value = ["carrier1", "carrier2", "carrier3"].includes(result);
  opcion2.value = ["carrier4", "carrier5"].includes(result);
});

// Función para determinar el color de `fill` y `stroke`
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

async function routesDireccion() {
  await nextTick();
  const svg = mapCarrier.value.svgRef;
  const routesMap = datosGral.nombresChiller.map((dato) =>
    createRouterConfig(`#${dato}Vinf`, "/carrier", dato)
  );

  routesMap.forEach((datos) => {
    const element = svg.querySelector(datos.selector);
    if (element) {
      element.addEventListener("click", () => navigateTo(datos));
    }
  });
}

const navigateTo = (routeInfo) => {
  router.push({ path: routeInfo.path, query: routeInfo.params });
  result = routeInfo.params;
};

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

onMounted(async () => {
  await fetchData();
  interactWithSVG();
  routesDireccion();
});

watch(
  () => route.query,
  async () => {
    opcion1.value = ["carrier1", "carrier2", "carrier3"].includes(result);
    opcion2.value = ["carrier4", "carrier5"].includes(result);
    loading.value = true;
    await fetchData();
    interactWithSVG();
    routesDireccion();
    loading.value = false;
  }
);
</script>

<style scoped>
.loading {
  color: #fff;
}
</style>
