<template>
  <div class="navbar">
    <div class="navbar__navegacion">
      <RouterLink to="/">
        <HomeButtom class="botones__navegacion" />
      </RouterLink>
    </div>

    <Settings />
    <CardaUnlock />
    <button v-if="route.name === 'produccion'" type="button" class="history-button botones__navegacion" aria-label="Historial de desbloqueos" title="Historial de desbloqueos" @click="historyOpen = true">
      <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 29V18a11 11 0 0 1 22 0" />
        <rect x="9" y="29" width="32" height="27" rx="4" />
        <path d="M24 40v6" />
        <circle cx="46" cy="22" r="14" fill="#282c34" />
        <path d="M46 13v9l6 4" />
      </svg>
    </button>
    <UnlockHistoryModal v-if="historyOpen && route.name === 'produccion'" @close="historyOpen = false" />
    <CalibracionClima />
    <LimitesFiltros />
    <EstadoCompresor />
    <ClimaExterior />
    <ButtonLog />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import UnlockHistoryModal from './UnlockHistoryModal.vue';
const route = useRoute();
const historyOpen = ref(false);
watch(() => route.name, () => { historyOpen.value = false; });
import Settings from './Settings.vue';
import CardaUnlock from './CardaUnlock.vue';
import CalibracionClima from '@/components/componentesVue/CalibracionClima.vue';
import LimitesFiltros from '@/components/componentesVue/LimitesFiltros.vue';
import EstadoCompresor from './EstadoCompresor.vue';
import ButtonLog from '@/components/componentesVue/ButtonLog.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaExterior from '@/components/componentesVue/ClimaExterior.vue';
</script>

<style scoped>
.history-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #fff;
  cursor: pointer;
}
.history-button svg { width: 100%; height: 100%; }
.history-button:hover { opacity: 0.8; }
.history-button:focus-visible { outline: 2px solid #bcbcbc; outline-offset: 2px; }
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
