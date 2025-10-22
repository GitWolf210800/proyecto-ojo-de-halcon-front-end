<template>
  <div class="navbar">
    <div class="navbar__navegacion">
      <RouterLink to="/">
        <HomeButtom class="botones__navegacion" />
      </RouterLink>
    </div>

    <CalibracionClima />
    <LimitesFiltros />
    <EstadoCompresor />
    <ClimaExterior />
    <ButtonLog />
  </div>
</template>

<script setup>
import CalibracionClima from '@/components/componentesVue/CalibracionClima.vue';
import LimitesFiltros from '@/components/componentesVue/LimitesFiltros.vue';
import EstadoCompresor from './EstadoCompresor.vue';
import ButtonLog from '@/components/componentesVue/ButtonLog.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaExterior from '@/components/componentesVue/ClimaExterior.vue';
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  align-items: center;
  flex-wrap: nowrap;
  transition: all 0.3s ease-in-out;
}

/* Botón de navegación */
.botones__navegacion {
  margin: 0.5px;
  width: 6.5vw;
  height: 6.5vh;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.botones__navegacion:hover {
  transform: scale(1.05);
}

.login-buttom {
  display: inline-block;
}

/* Responsive: rueda horizontal en modo retrato */
@media (max-aspect-ratio: 1/1) {
  .navbar {
    overflow-x: auto;
    flex-direction: row;
    white-space: nowrap;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    padding: 16px 12px;
    gap: 16px;

    background: none;
  }

  .navbar > * {
    flex: 0 0 auto;
    scroll-snap-align: center;
    transition: transform 0.3s ease;
  }

  .navbar::-webkit-scrollbar {
    display: none;
  }

  .navbar {
    scrollbar-width: none;
  }
}
</style>
