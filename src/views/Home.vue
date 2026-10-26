<template>
  <div class="container">

    <nav>
      <div class="navegacion">
        <span class="version">Ojo de Halcón V4.1</span>
        <ButtonLog />
      </div>
    </nav>

    <div class="menu" aria-label="Módulos de Ojo de Halcón">
      <RouterLink class="modulo-link" to="/clima" aria-label="Abrir módulo de Clima">
        <ModuloFabricaCard
          titulo="Clima"
          icono="temperature-half"
          variante="clima"
        />
      </RouterLink>

      <RouterLink
        class="modulo-link"
        to="/mantenimiento"
        aria-label="Abrir módulo de Mantenimiento"
      >
        <ModuloFabricaCard
          titulo="Mantenimiento"
          icono="screwdriver-wrench"
          variante="mantenimiento"
        />
      </RouterLink>

      <RouterLink
        class="modulo-link"
        to="/produccion"
        aria-label="Abrir módulo de Producción"
      >
        <ModuloFabricaCard
          titulo="Producción"
          icono="industry"
          variante="produccion"
        />
      </RouterLink>

      <RouterLink
        class="modulo-link"
        to="/montacargas"
        aria-label="Abrir módulo de Montacargas"
      >
        <ModuloFabricaCard
          titulo="Montacargas"
          icono="truck-moving"
          variante="montacargas"
        />
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
  import ModuloFabricaCard from '@/components/icons/ModuloFabricaCard.vue';

  document.title = 'Ojo de Halcón - Home';

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

/* MENU */
.menu {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 170px));
  place-content: center;
  gap: 22px;
  width: min(100%, 820px);
  margin: 0 auto;
  padding: 90px 24px 24px;
  box-sizing: border-box;
}

.modulo-link {
  display: block;
  color: inherit;
  text-decoration: none;
  border-radius: 18px;
}

.modulo-link:focus-visible {
  outline: 3px solid rgba(125, 211, 252, 0.85);
  outline-offset: 5px;
}

/* LOGO */
.logo {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

@media (max-width: 820px) {
  .navegacion {
    flex-direction: column;
    align-items: center;
  }

  .menu {
    grid-template-columns: repeat(2, minmax(130px, 165px));
    gap: 18px;
    padding-top: 105px;
  }

  .logo {
    display: none;
  }
}

@media (max-width: 390px) {
  .menu {
    grid-template-columns: minmax(145px, 180px);
    justify-content: center;
    overflow-y: auto;
    padding-bottom: 32px;
  }
}
</style>
