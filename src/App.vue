<template>
  <MapFabrica />
  <footer>
    <EyeHawkIconVersion />
    <PruebaData></PruebaData>
    <LogoTipoitiFooter />
  </footer>
</template>

<script setup >
//import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue';
import EyeHawkIconVersion from './components/icons/EyeHawkIconVersion.vue';
//import FooterApp from './components/icons/FooterApp.vue';
import LogoTipoitiFooter from './components/icons/LogoTipoitiFooter.vue';
import MapFabrica from './components/mapFabrica.vue';
import PruebaData from './components/PruebaData.vue';
import { useDataStore } from './stores/dataHome';

const storeHome = useDataStore();

 onMounted(() => {
  storeHome.startAutoRefresh();
});

/*export default {
  components: {
    MapFabrica,
    EyeHawkIconVersion,
    LogoTipoitiFooter,
    PruebaData
  }
};*/

</script>

<style scoped>
  footer {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Para alinear verticalmente si es necesario */
  padding: 10px; /* Ajusta el espacio alrededor del footer */
  }

  /*.logoTipoiti {
    position: absolute;
    margin-right: 0;
  }*/
</style>


<!--


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