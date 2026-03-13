<template>
    <nav>
        <NavBarUniversal />
    </nav>
    
    <div class="map" v-if="dataIsLoaded">
        <MapProduccion />
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
import NavBarUniversal from '@/components/componentesVue/NavBarUniversal.vue';
import MapProduccion from '@/components/maps/main/MapFabricaProduccion.vue';
import { computed, onMounted, onUnmounted } from 'vue';
import { useDataHomeProduccion } from '@/components/componsables/useProduccion';
import { useHomeProduccionStore } from '@/stores/homeProduccionStore';

const homeProduccionStore = useHomeProduccionStore();

console.log(homeProduccionStore.datos);

const dataIsLoaded = computed(()=> homeProduccionStore.datos !== null);

let intervalId;

onMounted(async ()=> {
    await useDataHomeProduccion();
    document.tittle = 'Ojo de Halcón - Produccion';
    intervalId = setInterval(() => {
        useDataHomeProduccion();
        console.log(homeProduccionStore.datos);
    }, 1000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>

<style scoped>
.login-buttom {
    display: inline-block;
  }

</style>