<template>
    <div class="content" v-zoom>
        <MapProduccion ref="mapProduccionRef" class="container__map" />
    </div>
</template>

<script setup>
import MapProduccion from "@/components/maps/fabrica/MapProduccion.vue";
import { useHomeProduccionStore } from "@/stores/homeProduccionStore";
//import { useReferenceStore } from "@/stores/referencesStore";
import { computed, onMounted, ref } from "vue";

const mapProduccionRef = ref(null);
const storeData = ref(useHomeProduccionStore().datos);
const referenceStorage = ref({});
const eventos = ref({});

const dataIsLoaded = computed(()=> useHomeProduccionStore.datos !== null);
const svgIsLoaded = computed(()=> mapProduccionRef.value !== null);

onMounted(async ()=> {
    if(mapProduccionRef.value.svgRef && dataIsLoaded.value){
        //referenceStorage.setReference(referenceStorage.value);
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