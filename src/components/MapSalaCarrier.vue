<template>
  <div class="container__map">
    <div class="map">
      <span v-if="loading" class="loading">Cargando Datos...</span>
      <MapChillerOption1 ref="mapCarrier" v-if="opcion1 && !loading" />
      <MapChillerOption2 ref="mapCarrier" v-else-if="opcion2 && !loading" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import axios from "axios";
import MapChillerOption1 from "./maps/MapChillerOption1.vue";
import MapChillerOption2 from "./maps/MapChillerOption2.vue";
import { onMounted, ref, watchEffect, nextTick } from "vue";
import { setElementColor } from "@/funciones";
import { server, okColor, paroManual, alertColor } from "@/variables";

const route = useRoute();
const parametros = route.query;
const opcion1 = ref(false);
const opcion2 = ref(false);
const loading = ref(true);
const mapCarrier = ref(null);
const result = Object.values(parametros).join("");
let mediciones = [];
let datos = {};

// Definir valores de opción según `result`
watchEffect(() => {
  opcion1.value = ["carrier1", "carrier2", "carrier3"].includes(result);
  opcion2.value = ["carrier4", "carrier5"].includes(result);
});

async function fetchData() {
  try {
    const response = await axios.get(`${server}:1880/carrierNow`, {
      params: { carrier: result },
    });
    if (response.data) {
      mediciones = response.data.mediciones;
      datos = response.data.datos;
      loading.value = false; // Cambia el estado a "listo para montar el componente"
    }
  } catch (error) {
    console.error("Error fetching Carrier data:", error);
    loading.value = false; // Asegura que se muestre la interfaz aunque haya fallado
  }
}

// Función para manipular el SVG una vez montado
async function interactWithSVG() {
  await nextTick(); // Asegura que el DOM esté actualizado
  if (mapCarrier.value && mapCarrier.value.svgRef) {
    const svg = mapCarrier.value.svgRef;
    svg.querySelector("#carrier").textContent = result;

    mediciones.forEach((medicion) => {
      const element = svg.querySelector(`#${medicion}`);
      if (element) {
        setElementColor(element, medicion, datos[medicion]);
      }
    });
  }
}

// Llama a fetchData al montar y después manipula el SVG
onMounted(async () => {
  await fetchData(); // Espera a que los datos estén cargados
  interactWithSVG(); // Manipula el SVG una vez montado
});
</script>

<style scoped>
.loading {
  color: #fff;
}
</style>
