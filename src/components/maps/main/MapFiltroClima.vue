<template>
    <div class="content" v-zoom>
        <span v-if="loading" class="loading">Cargando Datos...</span>

        <Map_fab1_bobinaje_filtro 
            class="container__map"
            ref="mapFiltro"
            v-if="fab1BobFiltro && !loading"
        />

        <Map_fab1_continuas_filtro 
            class="container__map"
            ref="mapFiltro"
            v-if="fab1ContFiltro && !loading"
        />

        <Map_fab1_preparacion_filtro 
            class="container__map"
            ref="mapFiltro"
            v-if="fab1PrepFiltro && !loading"
        />

        <Map_fab1_color_filtro 
            class="contanier__map"
            ref="mapFiltro"
            v-if="fab1Colorfiltro && !loading"
        />
        
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

        <Map_fab3_toyota_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab3ToyotaFiltro && !loading"
        />

        <Map_fab4_clima_filtro 
            class="container__map"
            ref="mapFiltro"
            v-else-if="fab4ClimaFiltro && !loading"
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

    <ToolTipChart 
        :position="tooltipPosition"
        :parametros="params"
        v-if="tooltipVisibility.chart"
    />
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "axios";

import ToolTipChart from '@/modules/tooltip/components/ToolTipChart.vue';
import {
  TOOLTIP_CHART_CONFIG,
  TOOLTIP_INFO_TABLE,
} from "@/variables";
import { useTooltip } from "@/modules/tooltip/utils/useTooltip";

import Map_fab1_bobinaje_filtro from '@/components/maps/filtros/Map_fab1_bobinaje_filtro.vue';
import Map_fab1_continuas_filtro from '@/components/maps/filtros/Map_fab1_continuas_filtro.vue';
import Map_fab1_preparacion_filtro from '@/components/maps/filtros/Map_fab1_preparacion_filtro.vue';
import Map_fab1_color_filtro from '@/components/maps/filtros/Map_fab1_color_filtro.vue';

import Map_fab3_preparacion_filtro from '@/components/maps/filtros/Map_fab3_preparacion_filtro.vue';
import Map_fab3_ex8_filtro from '@/components/maps/filtros/Map_fab3_ex8_filtro.vue';
import Map_fab3_g30_filtro from '@/components/maps/filtros/Map_fab3_g30_filtro.vue';
import Map_fab3_toyota_filtro from '@/components/maps/filtros/Map_fab3_toyota_filtro.vue';

import Map_fab4_clima_filtro from '@/components/maps/filtros/Map_fab4_clima_filtro.vue';

import Map_fab6_preparacion_filtro from '@/components/maps/filtros/Map_fab6_preparacion_filtro.vue';
import Map_fab6_continuas_filtro from '@/components/maps/filtros/Map_fab6_continuas_filtro.vue';
import Map_fab6_bobinaje_filtro from '@/components/maps/filtros/Map_fab6_bobinaje_filtro.vue';

import Map_fab9_preparacion_filtro from '@/components/maps/filtros/Map_fab9_preparacion_filtro.vue';
import Map_fab9_open_end_filtro from '@/components/maps/filtros/Map_fab9_open_end_filtro.vue';
import { dataColorInfoClima } from '@/helpers/homeClimaColorManipulator';
import { alarmColor, alertColor, okColor, paroManual, server } from "@/variables";
import { createTooltipConfig } from '@/funciones';
//import { server } from '@/variables';
//import { response } from 'express';

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

const fab1BobFiltro = ref(null);
const fab1ContFiltro = ref(null);
const fab1PrepFiltro = ref(null);
const fab1Colorfiltro = ref(null);

const fab3PrepFiltro = ref(null);
const fab3Ex8Filtro = ref(null);
const fab3G30Filtro = ref(null);
const fab3ToyotaFiltro = ref(null);

const fab4ClimaFiltro = ref(null);

const fab6PrepFiltro = ref(null);
const fab6ContFiltro = ref(null);
const fab6BobFiltro = ref(null);

const fab9PrepFiltro = ref(null);
const fab9OpenEndFiltro = ref(null);

const parametros = route.query;
const result = Object.values(parametros).join("");
const partes = result.split('_');
partes.pop();
const instalacionFisica = partes.join('_');

let mediciones = [];
const datos = ref(null);
const datosGral = ref(null);
let svg = null;

//let result = Object.values(parametros).join("");

const updateOpciones = () => {

    if( result === 'fab1_bobinaje_filtro' ) fab1BobFiltro.value = true;
    else if ( result === 'fab1_continuas_filtro' ) fab1ContFiltro.value = true;
    else if ( result === 'fab1_preparacion_filtro' ) fab1PrepFiltro.value = true;
    else if ( result === 'fab1_color_filtro' ) fab1Colorfiltro.value = true;
    
    if ( result === 'fab3_preparacion_filtro' ) fab3PrepFiltro.value = true;
    else if ( result === 'fab3_ex8_filtro' ) fab3Ex8Filtro.value = true;
    else if ( result === 'fab3_g30_filtro' ) fab3G30Filtro.value = true;
    else if ( result === 'fab3_toyota_filtro' ) fab3ToyotaFiltro.value = true;

    if ( result === 'fab4_clima_filtro' ) fab4ClimaFiltro.value = true;

    if ( result === 'fab6_preparacion_filtro' ) fab6PrepFiltro.value = true;
    else if (  result === 'fab6_continuas_filtro') fab6ContFiltro.value = true;
    else if ( result === 'fab6_bobinaje_filtro' ) fab6BobFiltro.value = true;

    if ( result === 'fab9_preparacion_filtro' ) fab9PrepFiltro.value = true;
    else if ( result === 'fab9_open_end_filtro' ) fab9OpenEndFiltro.value = true;
};

watchEffect(updateOpciones);

function initializeTooltipEvents() {
    const svg = mapFiltro.value.svgRef;
    const tooltipConfigs = [
        ...datosGral.value.mediciones_intercambiadores_temperaturas.map((dato) => 
            createTooltipConfig(
                `#${dato}`,
                "chart",
                { nombre: instalacionFisica, medicion: dato, tabla: 'mediciones_intercambiadores_temperaturas' },
                TOOLTIP_CHART_CONFIG
            )
        ),
        ...datosGral.value.mediciones_intercambiadores_valvula_bomba.map((dato) => 
            createTooltipConfig(
                `#${dato}`,
                "chart",
                { nombre: instalacionFisica, medicion: dato, tabla: 'mediciones_intercambiadores_valvula_bomba' },
                TOOLTIP_CHART_CONFIG
            )
        ),
        ...datosGral.value.mediciones_filtros.map((dato) => 
            createTooltipConfig(
                `#${dato}`,
                "chart",
                { nombre: result, medicion:dato, tabla: 'mediciones_filtros' },
                TOOLTIP_CHART_CONFIG
            )
        )
    ];
    //console.log(tooltipConfigs);

    tooltipConfigs.forEach(({ selector, tooltipType, payload, config }) => {
        const element = svg.querySelector(selector);
        //console.log(element);
        if(element){
            element.addEventListener('mouseover', (e) =>
                displayTooltip(e, tooltipType, payload, config)
            );
            element.addEventListener('mouseleave', () => hideTooltip(tooltipType));
        }
    } )
}

async function fetchData() {
    try {
        const lastIndex = result.lastIndexOf('_');
        const dato = result.substring(0, lastIndex);
        const response = await axios.get(`${server}:1880/filtroNow`, {
            params: { filtro: dato },
        });
        if (response.data) {
            mediciones = response.data.mediciones;
            datos.value = response.data.datos;
            datosGral.value = response.data;
            loading.value = false;
        }
    } catch (error) {
        console.error('Error fetching Carrier Data: ', error);
        loading.value = false;
    }
}

function interactWithSVG(svg) {
    //await nexTick();
    if (mapFiltro.value && mapFiltro.value.svgRef) {
        const datosOn = datos.value;    //Se toman los datos obtenidos del fetch en una constante
        const paramertrosMediciones = datosGral.value.parametros_mediciones === '""' ? `` : datosGral.value.parametros_mediciones;
        //console.log(datosOn);
        for(let x in datosOn){      // Se recorre los datos 
            if(!x.includes('id_')&& x !== "" && datos[x] !== 0){
                const element = svg.querySelector(`#${x}`); //se busca el elemento de medicion
                if(element){  // Si el elemento existe en el mapa se inserta el dato del servidor, y se ajustan los estilos a partir del estado del elemento medido 
                    const medicion = paramertrosMediciones.find(objeto => objeto.medicion === x);
                    const unidadMedida = medicion.unidad_medida;
                    const colorMedicion = medicion.medicion_color;

                    element.textContent = !Number.isInteger(datosOn[x]) ? `${datosOn[x].toFixed(1)} ${unidadMedida}` : `${datosOn[x]} ${unidadMedida}` ;

                    if ((datosOn[x] < datosOn[`min_${x}`]) && (datosOn[`min_${x}`] !== 0)){ // si la medicion resulta menor al minimo establecido se ejecuta la condicion
                        element.style.fill = alarmColor;
                        element.style.stroke = alarmColor;
                    } else if ((datosOn[x] > datosOn[`max_${x}`]) && (datosOn[`max_${x}`] !== 0)) { // o si la medicion resulta maxor al maximo establecido se ejecuta la condicion
                        element.style.fill = alarmColor;
                        element.style.stroke = alarmColor;
                    } else { // si no se ajusta el color que esta seteado en la base de datos
                        element.style.fill = colorMedicion;
                        element.style.stroke = colorMedicion;
                    }                   
                }
            }
        }
    }
}

onMounted(async () => {
await fetchData();

});

watchEffect (() => {
    if (datosGral.value){           //Una vez que los datos esten listos, empieza a recorrer el grafico
        //console.log(datosGral.value);
        svg = mapFiltro.value.svgRef;
        dataColorInfoClima(svg);    //aqui se llama a la funcion para recorrer los items de seccion de clima que tenga
        interactWithSVG(svg);
        initializeTooltipEvents();
    }
});

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