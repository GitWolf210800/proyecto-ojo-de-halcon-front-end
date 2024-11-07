<template>
    <nav>
      <HomeButtom />
      <LoginButtom />
    </nav>

    <!-- Mapa principal que se muestra cuando los datos están listos -->
    <MapFabrica v-if="dataIsLoaded" />
  
    <!-- Pie de página con icono y logotipo -->
    <footer>
      <EyeHawkIconVersion v-if="dataIsLoaded" />
      <LogoTipoitiFooter v-if="dataIsLoaded" />
    </footer>
  </template>
  
  <script setup>
  import { computed, onMounted, nextTick, watchEffect } from 'vue';
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
  
  // Función de carga inicial y sincronización de datos
  onMounted(async () => {
    await useDataHomeClima(); // Carga inicial
    nextTick(() => {
      setInterval(() => {
        useDataHomeClima();
      }, 10000); // Actualización cada 10 segundos
    });
  });
  
  // Computados para verificar que los datos y el SVG estén listos
  const dataIsLoaded = computed(() => storeData.datos !== null);
  const svgIsLoaded = computed(() => storeSvg.svgRef !== null);
  
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

  nav{
    display: flex;
    justify-content: space-between
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    width: 100%;
  }
  </style>
  