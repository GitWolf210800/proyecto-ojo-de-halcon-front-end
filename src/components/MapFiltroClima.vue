<template>
    <div class="content" v-zoom>
        <span v-if="loading" class="loading">Cargando Datos...</span>
        
        <Map_fab3_ex8_filtro 
            class="container__map"
            ref="mapFiltro"
            v-if="fab3Ex8Filtro && !loading"
        />

        <Map_fab3_preparacion_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab3PrepFiltro && !loading"
        />

        <Map_fab3_g30_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab3G30Filtro && !loading"
        />

        <Map_fab3_g33_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab3G33Filtro && !loading"
        />

        <Map_fab6_preparacion_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab6PrepFiltro && !loading"
        />

        <Map_fab6_continuas_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab6ContFiltro && !loading"
        />

        <Map_fab6_bobinaje_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab6BobFiltro && !loading"
        />

        <Map_fab9_preparacion_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab9PrepFiltro && !loading"
        />

        <Map_fab9_open_end_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab9OpenEndFiltro && !loading"
        />
    </div>

    <!--<ToolTipChart 
        :position="tooltipPosition"
        :parametros="params"
        v-if="tooltipVisibility.chart"
    />-->
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

/*import ToolTipChart from '@/modules/tooltip/components/ToolTipChart.vue';
import {
  TOOLTIP_CHART_CONFIG,
  TOOLTIP_INFO_TABLE,
} from "@/variables";
import { useTooltip } from "@/modules/tooltip/utils/useTooltip";*/

import Map_fab3_preparacion_filtro from './maps/Map_fab3_preparacion_filtro.vue';
import Map_fab3_ex8_filtro from './maps/Map_fab3_ex8_filtro.vue';
import Map_fab3_g30_filtro from './maps/Map_fab3_g30_filtro.vue';
import Map_fab3_g33_filtro from './maps/Map_fab3_g33_filtro.vue';

import Map_fab6_preparacion_filtro from './maps/Map_fab6_preparacion_filtro.vue';
import Map_fab6_continuas_filtro from './maps/Map_fab6_continuas_filtro.vue';
import Map_fab6_bobinaje_filtro from './maps/Map_fab6_bobinaje_filtro.vue';

import Map_fab9_preparacion_filtro from './maps/Map_fab9_preparacion_filtro.vue';
import Map_fab9_open_end_filtro from './maps/Map_fab9_open_end_filtro.vue';

const mapFiltro = ref(null);
const loading = ref(null);
const route = useRoute();
const router = useRouter();

const {
  tooltipPosition,
  params,
  tooltipVisibility,
  displayTooltip,
  hideTooltip,
} = useTooltip();

const fab3PrepFiltro = ref(null);
const fab3Ex8Filtro = ref(null);
const fab3G30Filtro = ref(null);
const fab3G33Filtro = ref(null);

const fab6PrepFiltro = ref(null);
const fab6ContFiltro = ref(null);
const fab6BobFiltro = ref(null);

const fab9PrepFiltro = ref(null);
const fab9OpenEndFiltro = ref(null);

//let result = Object.values(parametros).join("");

const updateOpciones = () => {
    const parametros = route.query;
    const x = Object.values(parametros).join("");
    if ( x === 'fab3_preparacion_filtro' ) fab3PrepFiltro.value = true;
    else if ( x === 'fab3_ex8_filtro' ) fab3Ex8Filtro.value = true;
    else if ( x === 'fab3_g30_filtro' ) fab3G30Filtro.value = true;
    else if ( x === 'fab3_g33_filtro' ) fab3G33Filtro.value = true;

    if ( x === 'fab6_preparacion_filtro' ) fab6PrepFiltro.value = true;
    else if (  x === 'fab6_continuas_filtro') fab6ContFiltro.value = true;
    else if ( x === 'fab6_bobinaje_filtro' ) fab6BobFiltro.value = true;

    if ( x === 'fab9_preparacion_filtro' ) fab9PrepFiltro.value = true;
    else if ( x === 'fab9_open_end_filtro' ) fab9OpenEndFiltro.value = true;
};

watchEffect(updateOpciones);


</script>

<style scoped>
.loading {
  color: #fff;
  display: flex;
}
</style>