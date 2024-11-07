<template>
  <!-- Monta la vista principal del mapa -->
  <!--<Home class="home" />-->
  <RouterView></RouterView> 
</template>

<script setup>
import Home from './views/Home.vue';
import MainMapClimaView from './views/MainMapClima.vue';
</script>

<style scoped>
/* Estilos globales o específicos para la App */
.home {
  height: 50px;
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