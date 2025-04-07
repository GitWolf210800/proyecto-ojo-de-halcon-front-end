<template>
    <div class="content" v-zoom>
        <MapMantenimiento :iconos="iconos" ref="mapMantenimientoRef" class="container__map" />
    </div>

    <ToolTipChartInfo 
        :position="tooltipPosition"
        :parametros="params"
        v-if="tooltipVisibility.chartInfo"
    />
</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import MapMantenimiento from '@/components/maps/MapMantenimiento.vue';
import { dataColorInfoMantenimiento } from '@/helpers/homeMantenimientoManipulatorColor';

import { useHomeMantenimientoStore } from '@/stores/homeMantenimientoStore';
import { useReferenceStore } from '@/stores/referencesStore';

import { useTooltip } from "@/modules/tooltip/utils/useTooltip";
import ToolTipChartInfo from "@/modules/tooltip/components/ToolTipChartInfo.vue";

import { createTooltipConfig } from '@/funciones';
import {
  TOOLTIP_CHART_INFO_CONFIG,
} from "@/variables.js";

// Se utiliza el composable `useTooltip`
const { tooltipPosition, params, tooltipVisibility, displayTooltip, hideTooltip } = useTooltip();

const mapMantenimientoRef = ref(null);
const iconos = ref({
    compresores: true
})
//let svg = null;
const storeData = ref(useHomeMantenimientoStore().datos);
const referenceStorage = ref({});

const homeMantenimientoStore = useHomeMantenimientoStore();
const referenceStore = useReferenceStore();

const dataIsLoaded = computed(() => homeMantenimientoStore.datos !== null);
const svgIsLoaded = computed(() => mapMantenimientoRef.value !== null);

  function initializeTooltipEvents(svg){

    const tooltipConfigs = [
        ...storeData.value.compresores.map((dato) => 
            createTooltipConfig(`#${dato.nombre}`, 'chartInfo', { nombre: dato.nombre, medicion: 'presion_salida_compresor', tabla: 'mediciones_compresores' }, TOOLTIP_CHART_INFO_CONFIG)
        )
    ];

    //console.log(tooltipConfigs);

    tooltipConfigs.forEach(({ selector, tooltipType, payload, config }) => {
        const element = svg.querySelector(selector);

        if (element) {
            const handlerON = (e) => displayTooltip(e, tooltipType, payload, config);
            const handlerOff = () => hideTooltip(tooltipType);

            element.addEventListener('mouseover', handlerON);
            element.addEventListener('mouseleave', handlerOff);

            try{
                referenceStorage.value[selector] = referenceStorage.value[selector] || {};
                referenceStorage.value[selector]['mouseover'] = handlerON;
                referenceStorage.value[selector]['mouseleave'] = handlerOff;
            } catch {
                console.log('error en: ', selector);
            }
        }
    });
};


onMounted(async () => {
    if(mapMantenimientoRef.value.svgRef && dataIsLoaded.value){
        //svg = mapMantenimientoRef.value.svgRef;

        initializeTooltipEvents(mapMantenimientoRef.value.svgRef);
        referenceStore.setReference(referenceStorage.value);
    }
});

watchEffect(() => {
    //console.log(mapMantenimientoRef.value);
    if(dataIsLoaded.value && svgIsLoaded.value) {
        //console.log(svgIsLoaded.value);
        dataColorInfoMantenimiento(mapMantenimientoRef.value.svgRef);
    }
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