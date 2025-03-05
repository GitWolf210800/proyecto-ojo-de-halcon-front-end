<template>
    <LimitesFiltrosButton v-if="show" />
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

</style>