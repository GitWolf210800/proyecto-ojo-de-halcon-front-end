<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import EyeHawkIconVersion from './components/icons/EyeHawkIconVersion.vue';
//import FooterApp from './components/icons/FooterApp.vue';
import LogoTipoitiFooter from './components/icons/LogoTipoitiFooter.vue';
import MapFabrica from './components/mapFabrica.vue';
</script>

<template>
  <MapFabrica />
  <footer>
    <EyeHawkIconVersion />
    <LogoTipoitiFooter />
  </footer>
</template>

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