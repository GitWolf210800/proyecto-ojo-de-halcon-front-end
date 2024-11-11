<template>
  <nav>
    <div class="navbar">
      <div class="navbar__navegacion">
        <RouterLink to="/"> <HomeButtom /> </RouterLink>
      </div>
      <ClimaExterior />
      <LoginButtom />
    </div>
  </nav>

  <div class="content">
    <!-- Mapa y pie de página solo si los datos están listos -->
  
    <div v-if="dataIsLoaded">
      <MapFabrica />  
    </div>
  </div>
  <footer>
    <div class="footer__nav">
      <EyeHawkIconVersion />
      <LogoTipoitiFooter />
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import ClimaExterior from '@/components/ClimaExterior.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import LoginButtom from '@/components/icons/LoginButtom.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import MapFabrica from '@/components/MapFabricaClima.vue';

import { useDataHomeClima } from '../components/componsables/useHomeClima';
import { useHomeClimaStore } from '@/stores/homeClimaStore';

// Estados del store para clima y SVG
const homeClimaStore = useHomeClimaStore();

// Computados para verificar que los datos y el SVG estén listos
const dataIsLoaded = computed(() => homeClimaStore.datos !== null);

// Función de carga inicial y sincronización de datos
let intervalId;
onMounted(async () => {
  await useDataHomeClima(); // Carga inicial
  intervalId = setInterval(() => {
    useDataHomeClima();
  }, 10000); // Actualización cada 10 segundos
});

onUnmounted(() => {
  clearInterval(intervalId); // Limpieza del intervalo al desmontar el componente
});
</script>

<style >


</style>

  