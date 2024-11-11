<template>
    <div class="container__map">
        <div class="map">
            <MapChillerOption1 ref="mapCarrier" v-if="opcion1" />
            <MapChillerOption2 ref="mapCarrier" v-else-if="opcion2" />
        </div>
        <!--<ToolTipChart
            :position="tooltipPosition"
            :parametros="params"
            v-if="tooltipVisibility.chart"
        />
        <ToolTipInfoTable />-->
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import axios from 'axios';
import MapChillerOption1 from './maps/MapChillerOption1.vue';
import MapChillerOption2 from './maps/MapChillerOption2.vue';
import { useTooltip } from '@/modules/tooltip/utils/useTooltip';
import ToolTipChart from '@/modules/tooltip/components/ToolTipChart.vue';
import ToolTipInfoTable from '@/modules/tooltip/components/ToolTipInfoTable.vue';
import { onMounted, ref } from 'vue';
import { server, okColor, paroManual, alertColor } from '@/variables';

const route = useRoute();
const parametros = route.query;
const opcion1 = ref(null);
const opcion2 = ref(null);
const mapCarrier = ref(null);
const result = Object.values(parametros).join("");

if (result === 'carrier1' || result === 'carrier2' || result === 'carrier3'){
    opcion1.value = true;
} else if ( result === 'carrier4' || 'carrier5'){
    opcion2.value = true;
}

async function dataAndAccion() {
    try {
        const response = await axios.get(`${server}:1880/carrierNow`, {
            params:{
                carrier:result
            }
        });
        const mediciones = response.data.mediciones;
        const datos = response.data.datos;
        //console.log(datos);
        mediciones.forEach(medicion => {
            const svg = mapCarrier.value.svgRef;
            svg.querySelector('#carrier').textContent = result;
            const element = svg.querySelector(`#${medicion}`);
            //console.log('llego aca');
            if (element){
                if(medicion.startsWith('filtro') 
                || medicion.startsWith('bomba_') 
                || medicion.startsWith('ventilador') 
                || medicion === 'estado'){
                    if(datos[medicion] === 100) element.style.fill = okColor;

                    else if(datos[medicion] === 50) element.style.fill = paroManual;

                    else if(datos[medicion] === 0) element.style.fill = alertColor;

                    else if (medicion === 'bomba_pileta' && datos[x] === 5) svg.style.fill = '#D5A200';
                }

                if( medicion === 'pileta' || medicion.startsWith('valvula_')){
                    /*console.log(medicion);
                    console.log(element);
                    console.log(datos[medicion]);*/
                    if(datos[medicion] === 100) element.style.stroke = okColor;

                    else if(datos[medicion] === 80) element.style.stroke = '#E9EC03'

                    else if(datos[medicion] === 5) element.style.stroke = paroManual;

                    else if(datos[medicion] === 50) element.style.stroke = paroManual;
                }

                if (medicion.includes('temp') 
                    || medicion.includes('delta') 
                    || medicion.includes('entrada') 
                    || medicion.includes('salida')
                    || medicion === 'demanda'){
                    /*console.log(medicion);
                    console.log(datos[medicion]);
                    console.log(element);*/
                    element.textContent = datos[medicion] 
                            ? datos[medicion].toFixed(1)
                            : 'NaN';
                }
                
            }
        });
    } catch{
        console.error('Error en Fetching Carrier');
    }
}


onMounted(() => {
    if(mapCarrier.value){
        const svg = mapCarrier.value.svgRef;
        dataAndAccion();
    }
})

</script>

<style scoped>

</style>