<template>
  <nav>
    <NavBarUniversal />
  </nav>

  <div class="map">
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
import { computed, onMounted, onUnmounted, ref } from 'vue';
import NavBarUniversal from '@/components/NavBarUniversal.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
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
  document.title = 'Ojo de Halcón - clima';
  intervalId = setInterval(() => {
    useDataHomeClima();
  }, 1000); // Actualización cada 10 segundos
});

onUnmounted(() => {
  clearInterval(intervalId); // Limpieza del intervalo al desmontar el componente
});
</script>

<style scoped >

.login-buttom {
    display: inline-block;
  }

</style>

  