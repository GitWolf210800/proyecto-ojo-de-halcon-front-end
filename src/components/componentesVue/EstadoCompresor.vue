<template>
    <EditarEstadoCompresorButtom 
        class="icon-container"
        v-if="show && esRutaEspecifica"
    />
</template>

<script setup>
import EditarEstadoCompresorButtom from '../icons/EditarEstadoCompresorButtom.vue';
import { ref, computed } from 'vue';

const show = ref(false);
const esRutaEspecifica = computed(() => route.path === "/mantenimiento");

const toggle = () => {

};
</script>

<style scoped>

.icon-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

</style>