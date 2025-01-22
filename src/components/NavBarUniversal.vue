<template>
    <nav>
        <div class="navbar">
            <div class="navbar__navegacion">
                <RouterLink to="/"> <HomeButtom class="botones__navegacion" /> </RouterLink>
            </div>
            <ClimaExterior />

            <ButtonLog />
        </div>
    </nav>
</template>

<script setup>
//import { RouterLink } from 'vue-router';
import ButtonLog from '@/components/ButtonLog.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaExterior from '@/components/ClimaExterior.vue';

</script>

<style scoped>

nav {
  transform: none !important;
  background: linear-gradient(to bottom, rgba(30, 48, 85, 0.9) 20%, rgba(47, 61, 90, 0) 65%);
  border-top: none;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 8.5vh;
  padding: 10px 0;
  text-align: center;
  z-index: 1000; /* Asegura que el nav esté encima del contenido */
}

.navbar {
  padding-top: 0px;
  display: flex;
  justify-content: space-between;
}

.navbar__navegacion {
  justify-content: space-between;
  margin: 2px;
}

.botones__navegacion {
  display: inline;
  margin: .5px;
  width: 6.5vw;
  height: 6.5vh;
}

.login-buttom {
    display: inline-block;
  }
</style>