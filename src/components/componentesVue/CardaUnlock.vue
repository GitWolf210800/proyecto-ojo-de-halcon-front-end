<template>
<CardaUnlockButtom 
    @click = "toggle"

    class="icon-container"

    v-if="show && esRutaEspecifica"
/>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import CardaUnlockButtom from '../icons/CardaUnlockButtom.vue';
import { computed, watch, ref } from 'vue';
import { useDataUserStore } from '@/stores/dataUserStore';
import { useSvgStore } from '@/stores/svgStore';
import { useHomeProduccionStore } from '@/stores/homeProduccionStore';
import { useReferenceStore } from '@/stores/referencesStore';

const route = useRoute();
const router = useRouter();

const esRutaEspecifica = computed(() => route.path === '/produccion');
const dataUserStore = useDataUserStore();
const svgMap = useSvgStore();
const produccionData = useHomeProduccionStore();
const referenceStore = useReferenceStore();

const show = ref(false);
const toggleClick = ref(false);

watch(
    () => dataUserStore.dataUser,
    (newSesion) => {
        //console.log(newSesion);
        if (newSesion !== null) {
            const rol = newSesion.rol;
            show.value = (rol === 'SUPER_USER' || rol === 'JEFE_PRODUCCION');
            //console.log('show: ',show.value);
        } else {
            show.value = false;
        }
    },
    { immediate: true, deep: true }
);

/*watch(
  () => dataUserStore.dataUser,
  (newSesion) => {
    if (newSesion !== null) {
      const rol = newSesion.rol;
      //console.log(rol);
      show.value = (rol === 'SUPER_USER' || rol === 'ADMIN_LIMITES' || rol === 'RESPONSABLE_MANTENIMIENTO_CLIMA');
    } else {
      show.value = false;
    }
  },
  { immediate: true, deep: true }
);*/

const toggle = () => {
    toggleClick.value = !toggleClick.value;
    if(toggleClick.value){
        console.log(true);
    } else {
        console.log(false);
    }
};

</script>

<style scoped>

.icon-container {
  position: relative; /* Necesario para que el hijo posicionado de manera absoluta se base en este contenedor */
  display: inline-block;
  cursor: pointer;
}

</style>