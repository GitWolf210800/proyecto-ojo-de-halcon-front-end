<template>
    <div class="content" v-zoom>
        <MapMantenimiento :iconos="iconos" ref="mapMantenimientoRef" class="container__map" />
    </div>

    <ToolTipChartBarInfo 
        :position="tooltipPosition"
        :parametros="params"
    />

    <ToolTipInfoTable
      :position="tooltipPosition"
      :parametros="params"  
    />
</template>

<script setup>
import { computed, onMounted, ref, watchEffect, watch } from 'vue';
import MapMantenimiento from '@/components/maps/fabrica/MapMantenimiento.vue';
import { dataColorInfoMantenimiento } from '@/helpers/homeMantenimientoManipulatorColor';
import { storeToRefs } from "pinia";

import { useHomeMantenimientoStore } from '@/stores/homeMantenimientoStore';
import { useReferenceStore } from '@/stores/referencesStore';

import { useTooltip } from "@/modules/tooltip/utils/useTooltip";
import { useTooltipStore } from "@/stores/tooltipStore";
import ToolTipChartBarInfo from '@/modules/tooltip/components/ToolTipChartBarInfo.vue';
import ToolTipInfoTable from "@/modules/tooltip/components/ToolTipInfoTable.vue";

import { createTooltipConfig } from '@/funciones';
import {
  TOOLTIP_CHART_INFO_CONFIG,
  TOOLTIP_INFO_TABLE,
} from "@/variables.js";

const tooltip = useTooltipStore();
// Se utiliza el composable `useTooltip`
const { tooltipPosition, params, tooltipVisibility, displayTooltip, hideTooltip } = useTooltip();
//const tooltip = useTooltipStore();

const mapMantenimientoRef = ref(null);
const iconos = ref({
    compresores: true,
    warningCompresores: false
})
//let svg = null;
const storeData = ref(useHomeMantenimientoStore().datos);
const referenceStorage = ref({});
const eventos = ref({
    warningCompresor: false
});

const homeMantenimientoStore = useHomeMantenimientoStore();
const { datos } = storeToRefs(homeMantenimientoStore);
const referenceStore = useReferenceStore();

const dataIsLoaded = computed(() => homeMantenimientoStore.datos !== null);
const svgIsLoaded = computed(() => mapMantenimientoRef.value !== null);
const warningCompresor = computed(() =>
  mapMantenimientoRef.value ? datos.value.warningCompresores || [] : []
);

  function initializeTooltipEvents(svg){

    const tooltipConfigs = [
        ...storeData.value.compresores.map((dato) => 
            createTooltipConfig(`#${dato.nombre}`, 'chartBarInfo', { nombre: dato.nombre, medicion: 'estado', tabla: 'mediciones_compresores' }, TOOLTIP_CHART_INFO_CONFIG),
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

watch(
  () => warningCompresor.value,
  (listo) => {
    //console.log(mapMantenimientoRef.value.svgRef);
    iconos.value.warningCompresores = datos.value.warningCompresores.length !== 0;
    //console.log(iconos.value.warningCompresores);
    if(mapMantenimientoRef.value && iconos.value.warningCompresores){
        const svg = mapMantenimientoRef.value.svgRef;
        //console.log("svgRef:", mapMantenimientoRef.value.svgRef);
        if(!eventos.value.warningCompresor){
            const tooltipConfigs = [
                createTooltipConfig("#compresorWarning", "infoTable", { solicitud: "alerta_compresores" }, TOOLTIP_INFO_TABLE),
            ];

            tooltipConfigs.forEach(({ selector, tooltipType, payload, config }) => {
                const element = svg.querySelector(selector);

                //console.log(element);

                if (element) {
                    const handlerON = (e) => displayTooltip(e, tooltipType, payload, config);
                    const handlerOff = () => hideTooltip(tooltipType);

                    element.addEventListener('mouseover', handlerON);
                    element.addEventListener('mouseleave', handlerOff);

                    try{
                        if (!referenceStore.reference[`${selector}`]) {
                            referenceStore.$patch((state) => {
                                state.reference[`${selector}`] = {}; // crea el objeto vacío reactivamente
                            });
                        }
                        referenceStore.reference[`${selector}`]["mouseover"] = handlerON;
                        referenceStore.reference[`${selector}`]["mouseleave"] = handlerOff;
                    } catch {
                        console.log('error en: ', selector);
                    }
                }
            });

        } else {
            if(eventos.value.warningCompresor){
                const elemento = svg.querySelector('#compresorWarning');
                if(elemento){
                    const reference1 = referenceStore.reference[`#compresorWarning`]["mouseover"];
                    const reference2 = referenceStore.reference[`#compresorWarning`]["mouseleave"];
                    elemento.removeEventListener("mouseover", reference1);
                    elemento.removeEventListener("mouseleave", reference2);

                    referenceStore.reference[`#compresorWarning`]["mouseover"] = "";
                    referenceStore.reference[`#compresorWarning`]["mouseleave"] = "";
                }
            }
        }

    }
    
  },
  { immediate: true, deep: true }
);


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