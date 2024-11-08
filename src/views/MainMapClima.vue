<template>
  <nav>
    <div class="navbar">
      <RouterLink to="/"> <HomeButtom /> </RouterLink>
      <LoginButtom />
    </div>
  </nav>

  <!-- Mapa principal que se muestra cuando los datos están listos -->
  <MapFabrica v-if="isReady" />
  
  <!-- Pie de página con icono y logotipo -->
  <footer v-if="isReady">
    <EyeHawkIconVersion />
    <LogoTipoitiFooter />
  </footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue';
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
const storeData = useHomeClimaStore();
const storeSvg = useSvgStore();

// Ref para manejar el intervalo de actualización
const refreshInterval = ref(null);

// Computado que indica si los datos y el SVG están listos
const isReady = computed(() => storeData.datos !== null && storeSvg.svgRef !== null);

// Función de carga inicial y sincronización de datos
onMounted(() => {
  useDataHomeClima(); // Carga inicial

  refreshInterval.value = setInterval(() => {
    useDataHomeClima();
  }, 10000); // Actualización cada 10 segundos
});

// Limpieza del intervalo cuando el componente se destruye
onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value); // Limpia el intervalo
  }
});

// Función para actualizar la información de colores
function updateColorInfo() {
  dataColorInfoClima();
  dataColorInfoFiltro();
  dataColorInfoCarrier();
}

// Observa cuando los datos y el SVG están listos y ejecuta la actualización
watchEffect(() => {
  if (isReady.value) {
    updateColorInfo();
  }
});
</script>

<style scoped>
/* Mejora de estilos, usando clases más específicas */
.navbar {
  display: flex;
  justify-content: space-between;
}

footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
}
</style>

  