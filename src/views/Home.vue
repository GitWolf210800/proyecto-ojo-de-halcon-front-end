<template>
  <div class="container">

    <nav>
      <div class="navegacion">
        <span class="version">Ojo de Halcón V4.0.7</span>
        <ButtonLog />
      </div>
    </nav>

    <div class="menu">
      <RouterLink to="/clima">
        <ClimaFabrica class="botones" />
      </RouterLink>

      <RouterLink to="/mantenimiento">
        <MantenimientoFabrica class="botones" />
      </RouterLink>

      <RouterLink to="/produccion">
        <ProduccionFabrica class="botones" />
      </RouterLink>
    </div>

    <div class="logo">
      <IconoOjodeHalcon />
    </div>

  </div>
</template>

  
  <script setup>
  //import { RouterLink } from 'vue-router';
  import ButtonLog from '@/components/componentesVue/ButtonLog.vue';
  import IconoOjodeHalcon from '@/components/icons/IconoOjodeHalcon.vue';
  import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
  import MantenimientoFabrica from '@/components/icons/MantenimientoFabrica.vue';
  import ProduccionFabrica from '@/components/icons/ProduccionFabrica.vue';

  </script>
  
<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* NAV */
.navegacion {
  display: flex;
  margin: 10px;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.version {
  color: #FFF;
  padding: 5px;
}

.botones {
  width: 70%;
  max-width: 220px;
  aspect-ratio: 1 / 1;

  display: flex;
  justify-content: center;
  align-items: center;
}

/* 🔥 esto es la clave */
.botones > * {
  width: 100% !important;
  height: 100% !important;

  display: flex;
  justify-content: center;
  align-items: center;
}

/* forzar contenido interno */
.botones svg,
.botones img {
  width: 90% !important;
  height: 90% !important;
}

/* MENU */
.menu {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

/* BOTONES */
.botones {
  width: 120px;
  height: auto;
}

/* LOGO */
.logo {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

/* 📱 MOBILE */
@media (max-width: 768px) {
  .navegacion {
    flex-direction: column;
    align-items: center;
  }

  .menu {
    flex-direction: column;
    gap: 25px;
  }

  .botones {
    width: 100px;
}
.logo {
  display: none;
}
}
</style>