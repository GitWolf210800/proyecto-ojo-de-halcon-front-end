<template>
    <LimitesFiltrosButton class="icon-container" v-if="show" />
        <!-- SVG de la tilde o check, se muestra solo si showMark es true -->
        <svg v-if="show" class="tilde" width="50" height="50" viewBox="0 0 50 50">
      <!-- Puedes personalizar la tilde según tus necesidades -->
      <text x="15" y="30" font-size="20" fill="green">✔</text>
    </svg>
</template>

<script setup>
import { ref, watch } from 'vue';
import LimitesFiltrosButton from './icons/LimitesFiltrosButton.vue';
import { useDataUserStore } from '@/stores/dataUserStore';

const dataUserStore = useDataUserStore();
const show = ref(false);

watch(
  () => dataUserStore.dataUser,
  (newSesion) => {
    if (newSesion !== null) {
      const rol = newSesion.rol;
      console.log(rol);
      show.value = (rol === 'SUPER_USER' || rol === 'ADMIN_LIMITES');
    } else {
      show.value = false;
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>

.icon-container {
  position: relative; /* Necesario para que el hijo posicionado de manera absoluta se base en este contenedor */
  display: inline-block;
  cursor: pointer;
}

/*.tilde {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  z-index: 1; 
}*/
</style>