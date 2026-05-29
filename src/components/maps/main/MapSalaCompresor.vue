<template>
  <div class="content" v-zoom>
      <Map_Sala_fab9_atlas 
          class="container_map"
          ref="mapSala"
      />
  </div>
</template>

<script setup>

import { ref, watchEffect } from 'vue';
import Map_Sala_fab9_atlas from '../salas_compresores/Map_Sala_fab9_atlas.vue';
import { useRoute } from 'vue-router';

const mapSala = ref(null);
const loading = ref(null);
const route = useRoute();

const fab9SalaCompresor = ref(null);

const serverNodeREd = import.meta.env.VITE_SERVER_NODE_RED;
const parametros = route.query;
const result = Object.values(parametros).join("");
const partes = result.split('_');
partes.pop();
const instalacionFisica = partes.join('_');

const datos = ref(null);
const datosGral = ref(null);
let svg = null;

const updateOpciones = () => {
  if(result === 'fab9_atlas_sala_compresor') fab9SalaCompresor.value = true;
};

watchEffect(updateOpciones);

</script>

<style scoped>
  .loading {
    color: #fff;
    display: flex;
  }

  .container__map {
    padding-top: 4vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
  }
</style>