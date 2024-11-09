<template>
    <div class="container__map">
        <div class="map">
            <MapChillerOption1 ref="mapCarrier" v-if="opcion1" />
            <MapChillerOption2 ref="mapCarrier" v-else-if="opcion2" />
        </div>
        <!--<ToolTipChart />
        <ToolTipInfoTable />-->
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import MapChillerOption1 from './maps/MapChillerOption1.vue';
import MapChillerOption2 from './maps/MapChillerOption2.vue';
import ToolTipChart from '@/modules/tooltip/components/ToolTipChart.vue';
import ToolTipInfoTable from '@/modules/tooltip/components/ToolTipInfoTable.vue';
import { onMounted, ref } from 'vue';

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

onMounted(() => {
    if(mapCarrier.value){
        console.log(mapCarrier.value.svgRef);
    }
})

</script>

<style scoped>

</style>