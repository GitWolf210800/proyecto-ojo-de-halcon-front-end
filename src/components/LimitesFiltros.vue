<template>
    <LimitesFiltrosButton v-if="show" />
</template>

<script setup>
import { ref } from 'vue';
import LimitesFiltrosButton from './icons/LimitesFiltrosButton.vue';
const show = ref(false);
const sesion = ref (localStorage.getItem('sesion'));
const sesionValue = localStorage.getItem('sesion');

if (sesionValue) {
    const sesionJson = JSON.parse(sesion.value);
    if (sesionJson.rol === 'SUPER_USER'){
        show.value = true;
    }
    else if (sesionJson.rol === 'ADMIN_LIMITES' ){
        show.value = true;
    }
    else {
        show.value = false;
    }
} else show.value = false;

</script>

<style scoped>

</style>