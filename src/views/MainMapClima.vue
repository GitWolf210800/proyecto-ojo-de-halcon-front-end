<template>
  <nav>
    <div class="navbar">
      <RouterLink to="/"> <HomeButtom /> </RouterLink>
      <LoginButtom />
    </div>
  </nav>

  <!-- Mapa y pie de página solo si los datos están listos -->
  <div v-if="dataIsLoaded">
    <MapFabrica />
    <footer>
      <EyeHawkIconVersion />
      <LogoTipoitiFooter />
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, watchEffect, onUnmounted } from 'vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
import LoginButtom from '@/components/icons/LoginButtom.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import MapFabrica from '@/components/MapFabricaClima.vue';

import { useDataHomeClima } from '../components/componsables/useHomeClima';
import { useHomeClimaStore } from '@/stores/homeClimaStore';
import { useSvgStore } from '@/stores/svgStore';

import { dataColorInfoClima } from '@/helpers/homeClimaColorManipulator';
import { dataColorInfoFiltro } from '@/helpers/homeFiltroColorManipulator';
import { dataColorInfoCarrier } from '@/helpers/homeCarrierColorManipulator';

// Estados del store para clima y SVG
const homeClimaStore = useHomeClimaStore();
const svgStore = useSvgStore();

// Computados para verificar que los datos y el SVG estén listos
const dataIsLoaded = computed(() => homeClimaStore.datos !== null);
const svgIsLoaded = computed(() => svgStore.svgRef !== null);

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

// Observa los datos y ejecuta funciones cuando todo esté cargado
watchEffect(() => {
  if (dataIsLoaded.value && svgIsLoaded.value) {
    dataColorInfoClima();
    dataColorInfoFiltro();
    dataColorInfoCarrier();
  }
});
</script>

<style scoped>


</style>

  