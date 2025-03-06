<template>
    <LimitesFiltrosButton  class="icon-container" @click = "toggle" v-if="show && esRutaEspecifica" />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

import LimitesFiltrosButton from './icons/LimitesFiltrosButton.vue';
import { useSvgStore } from '@/stores/svgStore';
import { useDataUserStore } from '@/stores/dataUserStore';
import { useHomeClimaStore } from '@/stores/homeClimaStore';

const route = useRoute();

const esRutaEspecifica = computed(() => route.path === '/clima');
const dataUserStore = useDataUserStore();
const svgMap = useSvgStore();
const climaData = useHomeClimaStore();
const show = ref(false);
const toggleClick = ref(false);

watch(
  () => dataUserStore.dataUser,
  (newSesion) => {
    if (newSesion !== null) {
      const rol = newSesion.rol;
      //console.log(rol);
      show.value = (rol === 'SUPER_USER' || rol === 'ADMIN_LIMITES');
    } else {
      show.value = false;
    }
  },
  { immediate: true, deep: true }
);

const toggle = () => {
    toggleClick.value = !toggleClick.value;
    if(toggleClick.value){
        const filtros = climaData.datos.nombresFiltro;
        const salas = climaData.datos.salasClima;
        const map = svgMap.svgRef;

        /*for(let i = 0; i < salas.length; i++) {

        }*/

        for(let i = 0; i < filtros.length; i++) {
            const element = map.querySelector(`#${filtros[i]}`);
            /*if (element) {
                element.addEventListener('click', () => console.log('hizo click en: ', filtros[i]) );
            }*/
        }
    } else {
        console.log(toggleClick.value);
    }
};
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