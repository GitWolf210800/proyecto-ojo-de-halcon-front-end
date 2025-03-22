<template>

<nav>
    <NavBarUniversal />
</nav>

<div class="map" v-if="dataIsLoaded">
    <MapFabrica />
</div>

<footer>
    <div class="footer__nav">
        <EyeHawkIconVersion />
        <LogoTipoitiFooter />
    </div>
</footer>

</template>

<script setup>
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import NavBarUniversal from '@/components/NavBarUniversal.vue';
import MapFabrica from '@/components/maps/MapFabricaMantenimiento.vue';
import { computed, onMounted, onUnmounted } from 'vue';
import { useDataHomeMantenimiento } from '@/components/componsables/useMantenimiento';
import { useHomeMantenimientoStore } from '@/stores/homeMantenimientoStore';

const homeMantenimientoStore = useHomeMantenimientoStore();

const dataIsLoaded = computed(() => homeMantenimientoStore.datos !== null);

let intervalId;

onMounted(async () => {
    await useDataHomeMantenimiento();
    document.title = 'Ojo de Halcón - Mantenimiento';
    intervalId = setInterval(() =>  {
        useDataHomeMantenimiento();
    }, 1000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>