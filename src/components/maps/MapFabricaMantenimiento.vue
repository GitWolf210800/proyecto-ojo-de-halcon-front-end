<template>
    <div class="content" v-zoom>
        <MapMantenimiento ref="mapMantenimientoRef" class="container__map" />
    </div>

</template>

<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue';
import MapMantenimiento from './MapMantenimiento.vue';
import { useHomeMantenimientoStore } from '@/stores/homeMantenimientoStore';
import { dataColorInfoMantenimiento } from '@/helpers/homeMantenimientoManipulatorColor';

const mapMantenimientoRef = ref(null);
let svg = null;
const storeData = ref(useHomeMantenimientoStore().datos);

const homeMantenimientoStore = useHomeMantenimientoStore();

const dataIsLoaded = computed(() => homeMantenimientoStore.datos !== null);

onMounted(() => {
    if(mapMantenimientoRef.value.svgRef){
        svg = mapMantenimientoRef.value.svgRef;
    }
});

watchEffect(() => {
    if(dataIsLoaded.value) {
        dataColorInfoMantenimiento(svg);
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