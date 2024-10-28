<template>
  <MapFabrica v-if="dataIsLoaded" />
  <footer>
    <EyeHawkIconVersion v-if="dataIsLoaded" />
    <LogoTipoitiFooter v-if="dataIsLoaded" />
  </footer>
</template>

<script setup>
import { computed, onMounted, nextTick, watchEffect } from 'vue';
import EyeHawkIconVersion from './components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from './components/icons/LogoTipoitiFooter.vue';
import MapFabrica from './components/MapFabrica.vue';
import { useDataHomeClima } from './components/componsables/useHomeClima';
import { useHomeClimaStore } from './stores/homeClimaStore';
import { useSvgStore } from './stores/svgStore';
import { dataColorInfoClima } from './helpers/homeClimaColorManipulator';
import { dataColorInfoFiltro } from './helpers/homeFiltroColorManipulator';
import { dataColorInfoCarrier } from './helpers/homeCarrierColorManipulator';
import { eventsToolTipClima } from './helpers/eventsToolTipChart';

const storeData = useHomeClimaStore();
const storeSvg = useSvgStore();

onMounted(async () => {
  await useDataHomeClima(); // Asegura que los datos iniciales estén cargados
  nextTick(() => {
    // Actualiza el SVG cada minuto para sincronización
    setInterval(() => { useDataHomeClima(); }, 60000);
  });
});

// Computados para verificar carga de datos y svgRef
const dataIsLoaded = computed(() => storeData.datos !== null);
const svgIsLoaded = computed(() => storeSvg.svgRef !== null);

// Ejecuta la función cuando ambos datos estén disponibles
watchEffect(() => {
  if (dataIsLoaded.value && svgIsLoaded.value) {
    dataColorInfoClima(); // Solo se ejecuta cuando ambos están listos
    dataColorInfoFiltro();
    dataColorInfoCarrier();
    //eventsToolTipClima();
  }
});
</script>

<style scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  width: 100%;
}
</style>


<!--
<PruebaData v-if="dataIsLoaded && svgIsLoaded" />
<router-view v-if="dataIsLoaded" />
<template>
  <MapFabrica />
  <footer>
    <EyeHawkIconVersion />
    <LogoTipoitiFooter />
  </footer>
</template>


  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
-->