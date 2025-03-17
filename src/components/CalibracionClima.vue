<template>
<CalibracionClimaButtom  v-if="show && esRutaEspecifica" />

<div class="body__content" v-if="visibilityForm">
    <form>
      <div class="calibracion__cabezal">
        <button type="submit" class="button__send">Enviar</button>
        <fa class="button_close" icon="square-xmark"></fa>
        <h1>Calibración Clima</h1>
        <h3>{{ tituloInstalacion }}</h3>
        <p v-if="error" class="mensaje">{{  }}</p>
      </div>
      
      <div class="calibracion">
        <div></div>
      </div>
    </form>
</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';

import CalibracionClimaButtom from './icons/CalibracionClimaButtom.vue';

import { useDataAuthUser } from './componsables/useAuth';

const route = useRoute();

const esRutaEspecifica = computed(() => route.path === '/clima');
const dataUserStore = useDataAuthUser();

const show = ref(true);
const tituloInstalacion = ref('');
const visibilityForm = ref(false);
const mensaje = ref('');

watch(
    () => dataUserStore.dataUser,
    (newSesion) => {
        if (newSesion !== null) {
            const rol = newSesion.rol;
            show.value = (rol === 'SUPER_USER' || rol === 'CALIBRACION_CLIMA');
        }
        else {
            show.value = false;
        }
    }
);

</script>

<style scoped>

</style>