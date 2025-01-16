<template>
  <nav>
    <div class="navbar">
      <div class="navbar__navegacion">
        <RouterLink to="/"> <HomeButtom class="botones__navegacion" /> </RouterLink>
      </div>
      <ClimaExterior />
      <LoginButtom class="login-buttom" @click = "clickLogin" />
      <!--<ButtonLog></ButtonLog> -->
    </div>
  </nav>

  <div class="map">
    <!-- Mapa y pie de página solo si los datos están listos -->
  
    <div v-if="dataIsLoaded">
      <MapFabrica />  
    </div>
  </div>

  <Login v-if="visibilityLogin" />

  <footer>
    <div class="footer__nav">
      <EyeHawkIconVersion />
      <LogoTipoitiFooter />
    </div>
  </footer>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ClimaExterior from '@/components/ClimaExterior.vue';
import EyeHawkIconVersion from '@/components/icons/EyeHawkIconVersion.vue';
import LogoTipoitiFooter from '@/components/icons/LogoTipoitiFooter.vue';
//import ButtonLog from '@/components/ButtonLog.vue';
import LoginButtom from '@/components/icons/LoginButtom.vue';
import Login from '@/components/Login.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import MapFabrica from '@/components/MapFabricaClima.vue';

import { useDataHomeClima } from '../components/componsables/useHomeClima';
import { useHomeClimaStore } from '@/stores/homeClimaStore';


const visibilityLogin = ref(null);

  const clickLogin = () => {

    if (!visibilityLogin.value){
      visibilityLogin.value = true;
    } else {
      visibilityLogin.value = false;
    }
  
  };

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

  