<template>
    <LimitesFiltrosButton class="icon-container" v-if="show" />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
//import { useRoute } from 'vue-router';

import LimitesFiltrosButton from './icons/LimitesFiltrosButton.vue';
import { useDataUserStore } from '@/stores/dataUserStore';

//const route = useRoute();

//const esRutaEspecifica = computed(() => route.path === '/clima')
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