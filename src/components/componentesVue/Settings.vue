<template>
  <SettingsButtom 
    v-if="show"
  />
</template>

<script setup>
import SettingsButtom from "@/components/icons/SettingsButtom.vue";
import { ref, watch } from "vue";


import { useDataUserStore } from "@/stores/dataUserStore";

const dataUserStore = useDataUserStore();

const show = ref(false);



watch(
  () => dataUserStore.dataUser,
  (newSesion) => {
    if (newSesion !== null) {
      const rol = newSesion.rol;
      show.value = rol === "SUPER_USER";
    } else {
      show.value = false;
      //if (toggleClick.value) toggle();
    }
  },
  { immediate: true, deep: true }
);

</script>

<style>
    .icon-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}
</style>
