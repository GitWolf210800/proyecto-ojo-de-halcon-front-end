<template>
    <EditarEstadoCompresorButtom 
        class="icon-container"
        v-if="show && esRutaEspecifica"
    />
</template>

<script setup>
import EditarEstadoCompresorButtom from '../icons/EditarEstadoCompresorButtom.vue';
import { useDataUserStore } from "@/stores/dataUserStore";
import { useRoute } from "vue-router";
import { ref, computed, watch } from 'vue';

const dataUserStore = useDataUserStore();
const show = ref(false);
const esRutaEspecifica = computed(() => route.path === "/mantenimiento");
const route = useRoute();

const toggle = () => {

};

watch(
  () => dataUserStore.dataUser,
  (newSesion) => {
    if (newSesion !== null) {
      const rol = newSesion.rol;
      show.value = rol === "SUPER_USER" || rol === "RESPONSABLE_MANTENIMIENTO_CLIMA";
    } else {
      show.value = false;
      /*if (toggleClick.value) toggle();*/
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>

.icon-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

</style>