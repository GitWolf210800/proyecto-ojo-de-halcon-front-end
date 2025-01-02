<template>
  <div class="content" v-zoom>
    <MapClima ref="mapClimaRef" class="container__map" />
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
import { computed, onMounted, ref, watchEffect, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useHomeClimaStore } from '@/stores/homeClimaStore';
import { useSvgStore } from "@/stores/svgStore";
import MapClima from "./maps/MapClima.vue";
import { useTooltip } from "@/modules/tooltip/utils/useTooltip";
import ToolTipChart from "@/modules/tooltip/components/ToolTipChart.vue";
import ToolTipChartInfo from "@/modules/tooltip/components/ToolTipChartInfo.vue";
import ToolTipInfoTable from "@/modules/tooltip/components/ToolTipInfoTable.vue";
import { dataColorInfoClima } from '@/helpers/homeClimaColorManipulator';
import { dataColorInfoFiltro } from '@/helpers/homeFiltroColorManipulator';
import { dataColorInfoCarrier } from '@/helpers/homeCarrierColorManipulator';
import { createTooltipConfig, createRouterConfig } from "@/funciones";
import {
  TOOLTIP_CHART_CONFIG,
  TOOLTIP_CHART_INFO_CONFIG,
  TOOLTIP_INFO_TABLE,
  elementsConfigTyH,
} from "@/variables.js";

// Se utiliza el composable `useTooltip`
const { tooltipPosition, params, tooltipVisibility, displayTooltip, hideTooltip } = useTooltip();

const storeData = ref(useHomeClimaStore().datos);
const mapClimaRef = ref(null);
let svg = null; 

const router = useRouter();

// Estados del store para clima y SVG
const homeClimaStore = useHomeClimaStore();
const svgStore = useSvgStore();

// Computados para verificar que los datos y el SVG estén listos
const dataIsLoaded = computed(() => homeClimaStore.datos !== null);
const svgIsLoaded = computed(() => svgStore.svgRef !== null);

//console.log(storeData.value);

// Inicializacion de eventos para rutas
function routesDireccion(svg) {
  const routesMap = [
    ...storeData.value.chiller.map((dato) => 
    createRouterConfig(`#${dato.nombre}Vinf`, '/carrier', dato.nombre)
  ),

  ...storeData.value.salasClima.map((dato) => createRouterConfig(`#${dato}`, '/salaFiltro', dato)) 
  //.filter((dato) => dato.id_fabrica && dato.id_fabrica.includes('_filtro_clima'))
  ];

 // console.log(routesMap);

  /**
   * // Filtramos el array para obtener solo los objetos donde `id_fabrica` incluya "_filtro_clima"
const resultado = array.filter(obj => obj.id_fabrica.includes('_filtro_clima'));

console.log(resultado);
   */

  routesMap.forEach((datos) => {
    const element = svg.querySelector(datos.selector);

    if(element){
      element.addEventListener('click', () => navigateTo(datos))
    }

  });

};

// Inicialización de eventos de tooltip
function initializeTooltipEvents(svg) {
  const tooltipConfigs = [
    createTooltipConfig("#demanda_agua_fria_text", "infoTable", { solicitud: "demanda_agua_fria" }, TOOLTIP_INFO_TABLE),
    createTooltipConfig("#condiciones_marcha_carrier", "infoTable", { solicitud: "condiciones_marcha_carriers" }, TOOLTIP_INFO_TABLE),
    
    ...storeData.value.nombresClima.flatMap((nombre) =>
      elementsConfigTyH.map(({ idSuffix, metric }) =>
        createTooltipConfig(`#${nombre}_${idSuffix}`, "chart", { nombre, medicion: metric, tabla: "mediciones_clima_24hs" }, TOOLTIP_CHART_CONFIG)
      )
    ),
    ...storeData.value.nombresFiltro.map((nombre) =>
      createTooltipConfig(`#${nombre}`, "chartInfo", { nombre, medicion: "filtro_ventilador", tabla: "mediciones_filtros" }, TOOLTIP_CHART_INFO_CONFIG)
    ),
    ...storeData.value.chiller.map((dato) =>
      createTooltipConfig(`#${dato.nombre}Vinf`, "chart", { nombre: dato.nombre, medicion: "demanda", tabla: "mediciones_carrier" }, TOOLTIP_CHART_CONFIG)
    ),
    ...storeData.value.medicionesCarrier.map((medicion) =>
      createTooltipConfig(`#${medicion}`, "chart", { nombre: "carrier", medicion, tabla: "mediciones_carrier" }, TOOLTIP_CHART_CONFIG)
    ),
  ];

  tooltipConfigs.forEach(({ selector, tooltipType, payload, config }) => {
    const element = svg.querySelector(selector);
    if (element) {
      element.addEventListener("mouseover", (e) => displayTooltip(e, tooltipType, payload, config));
      element.addEventListener("mouseleave", () => hideTooltip(tooltipType));
    }
  });
}

//Se prepara los datos para la navegacion
const navigateTo = (routeInfo) => {
  router.push({
    path: routeInfo.path,
    query: routeInfo.params
  });
}

// Agrega los eventos de tooltip una vez montado el componente
onMounted(() => {
  if (mapClimaRef.value && mapClimaRef.value.svgRef) {
    svg = mapClimaRef.value.svgRef;
    initializeTooltipEvents(mapClimaRef.value.svgRef);
    routesDireccion(mapClimaRef.value.svgRef);
  }

  watchEffect(() => {
  if (dataIsLoaded.value) {
    dataColorInfoClima(svg);
    dataColorInfoFiltro(svg);
    dataColorInfoCarrier(svg);
  }
});

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
