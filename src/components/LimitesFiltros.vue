<template>
    <LimitesFiltrosButton  class="icon-container" @click = "toggle" v-if="show && esRutaEspecifica" />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import LimitesFiltrosButton from './icons/LimitesFiltrosButton.vue';
import { createRouterConfig } from '@/funciones';
import { useSvgStore } from '@/stores/svgStore';
import { useDataUserStore } from '@/stores/dataUserStore';
import { useHomeClimaStore } from '@/stores/homeClimaStore';
import { useReferenceStore } from '@/stores/referencesStore';

const route = useRoute();
const router = useRouter();

const esRutaEspecifica = computed(() => route.path === '/clima');
const dataUserStore = useDataUserStore();
const svgMap = useSvgStore();
const climaData = useHomeClimaStore();
const referenceStore = useReferenceStore();
const show = ref(false);
const toggleClick = ref(false);

//Se prepara los datos para la navegacion
const navigateTo = (routeInfo) => {
  router.push({
    path: routeInfo.path,
    query: routeInfo.params
  });
}

//console.log(referenceStore.reference);

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

        for(let i = 0; i < salas.length; i++) {
            const element = map.querySelector(`#${salas[i]}`);
            const storeHandler = referenceStore.reference[`#${salas[i]}`]['click'];
            if (element){
                element.removeEventListener('click', storeHandler);
            }
        }

        for(let i = 0; i < filtros.length; i++) {
            const element = map.querySelector(`#${filtros[i]}`);
            const handler = () => { console.log('hizo click en: ', filtros[i]) };
            
            if (element) {
                element.addEventListener('click', handler );
                try {
                    referenceStore.reference[`#${filtros[i]}`] = referenceStore.reference[`#${filtros[i]}`] || {};
                    referenceStore.reference[`#${filtros[i]}`]['click'] = handler;
                } catch { console.log('error en: ', filtros[i]); }
            }
        }
    } else {
        const filtros = climaData.datos.nombresFiltro;
        const salas = climaData.datos.salasClima;
        const map = svgMap.svgRef;
        console.log(toggleClick.value);

        for (let i = 0; i < filtros.length; i++) {
            const element = map.querySelector(`#${filtros[i]}`);

            if (element) {
                const storeHandler =  referenceStore.reference[`#${filtros[i]}`]['click'];
                element.removeEventListener('click', storeHandler);
            }
        }

        const routesMap = [
            ...climaData.datos.salasClima.map((dato) => createRouterConfig(`#${dato}`, '/salaFiltro', dato))
        ];

        routesMap.forEach((datos) => {
            const element = map.querySelector(datos.selector);

            if(element){
                const handler = () => navigateTo(datos);

                element.addEventListener('click', handler);

                try {
                    referenceStore.reference[datos.selector] = referenceStore.reference[datos.selector] || {};
                    referenceStore.reference[datos.selector]['click'] = handler; 
                } catch { console.log('error en:  ', datos); }
            }
        });

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