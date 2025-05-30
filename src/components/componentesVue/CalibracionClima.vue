<template>
  <CalibracionClimaButtom
    class="icon-container"
    @click="toggle"
    v-if="show && esRutaEspecifica"
  />

  <div class="body__content" v-if="visibilityForm">
    <form @submit.prevent="handleSubmit">
      <div class="calibracion__cabezal">
        <button type="submit" class="button__send">Enviar</button>
        <fa @click="toggleForm" class="button__close" icon="square-xmark"></fa>
        <h3>Calibración Clima</h3>
        <h5>{{ tituloInstalacion }}</h5>
        <label>Motivo: </label>
        <select v-model="motivoSelect" id="motivo">
          <option
            v-for="(valor, clave) in opciones"
            :key="clave"
            :value="clave"
          >
            {{ valor.motivo }}
          </option>
        </select>
        <p v-if="error" class="mensaje">{{ mensaje }}</p>
      </div>

      <div class="calibracion">
        <label class="date">fecha: {{ datos["fecha"] }}</label>
        <div v-for="(value, key) in datos" :key="key">
          <template
            v-if="
              !key.startsWith('id') &&
              key !== 'nombre' &&
              key !== 'fecha' &&
              !key.includes('calibracion') &&
              !key.startsWith('factor')
            "
          >
            <label class="datos" :for="key">{{ key }}, {{ value }}</label>
          </template>
        </div>
        <input
          class="inputDatos"
          :id="key"
          v-model="datos['valor_calibracion_temperatura']"
          placeholder="temperatura real"
          type="number"
          min="0.1"
          step="any"
        />
        <input
          class="inputDatos"
          :id="key"
          v-model="datos['valor_calibracion_humedad']"
          placeholder="humedad real"
          type="number"
          min="0.1"
          step="any"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, ref, watch } from "vue";

import CalibracionClimaButtom from "@/components/icons/CalibracionClimaButtom.vue";

import { useDataUserStore } from "@/stores/dataUserStore";
import { useHomeClimaStore } from "@/stores/homeClimaStore";
import { useSvgStore } from "@/stores/svgStore";
import { useReferenceStore } from "@/stores/referencesStore";
import { isMobile } from "@/funciones";
import { server } from "@/variables";

const route = useRoute();

const esRutaEspecifica = computed(() => route.path === "/clima");

const dataUserStore = useDataUserStore();
const dataClima = useHomeClimaStore();
const mapa = useSvgStore();
const referenceStore = useReferenceStore();

const show = ref(false);
const tituloInstalacion = ref("");
const motivoSelect = ref("1");
const opciones = ref({});
const visibilityForm = ref(false);
const mensaje = ref("");
const toggleClick = ref(false);
const datos = ref({});

const toggleForm = () => {
  visibilityForm.value = !visibilityForm.value;
};

const toggle = () => {
  toggleClick.value = !toggleClick.value;
  const nombres = dataClima.datos.nombresClima;
  const map = mapa.svgRef;

  if (toggleClick.value) {
    //console.log(referenceStore.reference);

    for (let i = 0; i < nombres.length; i++) {
      const temperatura = map.querySelector(`#${nombres[i]}_temp_g`);
      const humedad = map.querySelector(`#${nombres[i]}_hum_g`);

      const handler = async () => {
        const instalacion = nombres[i];
        const res = await fetch(`${server}:4000/api/formCalClima`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instalacion,
          }),
        });

        const res2 = await fetch(`${server}:1880/motivos`, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: "LABORATORIO",
        });

        const resJson = await res.json();

        opciones.value = await res2.json();

        datos.value = resJson[0];
        datos.value.fecha = new Date(datos.value.fecha).toLocaleString("es-AR");
        datos.value["factor_calibracion_temperatura"] =
          datos.value["temperatura"];
        datos.value["factor_calibracion_humedad"] = datos.value["humedad"];
        datos.value["valor_sala_temperatura"] = dataClima.datos.clima.find(
          (obj) => obj.nombre === nombres[i]
        )?.temperatura;
        datos.value["valor_sala_humedad"] = dataClima.datos.clima.find(
          (obj) => obj.nombre === nombres[i]
        )?.humedad;
        console.log(datos.value);

        tituloInstalacion.value = instalacion;
        visibilityForm.value = true;
      };

      /*const handlerHumedad = async () => {
                const instalacion = nombres[i];
                const res = await fetch(`${server}:4000/api/formCalClimaHumedad`, {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        instalacion
                    })
                });

                const resJson = await res.json();

                datos.value = resJson[0];
                console.log(datos.value);
                datos.value.fecha = new Date(datos.value.fecha).toLocaleString('es-AR');
                datos.value['factor_calibracion'] = datos.value['humedad'];
                datos.value['valor_sala'] = dataClima.datos.clima.find(obj => obj.nombre === nombres[i])?.humedad;
                tituloInstalacion.value = instalacion;
                visibilityForm.value = true;
            };*/

      if (temperatura) {
        temperatura.addEventListener("click", handler);
        referenceStore.reference[`#${nombres[i]}_temp_g`]["click"] = handler;
      }

      if (humedad) {
        humedad.addEventListener("click", handler);
        referenceStore.reference[`#${nombres[i]}_hum_g`]["click"] = handler;
      }
    }
  } else {
    visibilityForm.value = false;

    for (let i = 0; i < nombres.length; i++) {
      const temperatura = map.querySelector(`#${nombres[i]}_temp_g`);
      const humedad = map.querySelector(`#${nombres[i]}_hum_g`);

      if (temperatura) {
        const storeHandler =
          referenceStore.reference[`#${nombres[i]}_temp_g`]["click"];
        temperatura.removeEventListener("click", storeHandler);
        referenceStore.reference[`#${nombres[i]}_temp_g`]["click"] = "";
      }

      if (humedad) {
        const storeHandler =
          referenceStore.reference[`#${nombres[i]}_hum_g`]["click"];
        humedad.removeEventListener("click", storeHandler);
        referenceStore.reference[`#${nombres[i]}_hum_g`]["click"] = "";
      }
    }
  }

  //visibilityForm.value = !visibilityForm.value;
};

const handleSubmit = async () => {
  const res = await fetch(`${server}:4000/api/formCalSent`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datos.value),
  });

  const resJson = await res.json();
  if (res.message) mensaje.value = resJson.message;
  visibilityForm.value = false;
};

watch(
  () => dataUserStore.dataUser,
  (newSesion) => {
    if (newSesion !== null) {
      const rol = newSesion.rol;
      show.value = rol === "SUPER_USER" || rol === "CALIBRACION_CLIMA";
    } else {
      show.value = false;
      if (toggleClick.value) toggle();
    }
  },
  { immediate: true, deep: true }
);
</script>

<style scoped>
.inputDatos {
  width: 100%;
  height: 10px;
  border: none;
  border-bottom: 4px solid transparent;
  background: linear-gradient(to top, #4a90e2, transparent 80%) no-repeat;
  background-size: 100% 4px;
  background-position: bottom;
  background-repeat: no-repeat;
  outline: none;
  padding: 0;
  font-size: 14px;
  color: #111;
  background-color: transparent;
  box-shadow: 0 2px 6px #4a90e27a;
  margin: 10px auto; /* Centrado vertical entre inputs */
  display: block; /* Asegura que margin auto funcione */
  transition: all 0.3s ease;
}

.inputDatos:hover {
  background: linear-gradient(to top, #ff00ff, transparent 80%) no-repeat;
  box-shadow: 0 2px 12px #ff00ff;
}

.inputDatos:focus {
  background: linear-gradient(to top, #39ff14, transparent 80%) no-repeat;
  box-shadow: 0 2px 14px #39ff14;
}

.date {
  margin-bottom: -16px;
}

.datos {
  display: block;
  font-size: 16px;
  color: #264e86;
  /*margin-bottom: -3px;*/
  line-height: 0.8;
}

.body__content {
  width: 400px;
  max-height: 450px;
  background-color: #ffff;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1600;
}

.body__content,
.calibracion {
  text-align: center;
}

.body__content,
.calibracion input {
  display: inline-block;
}

.icon-container {
  position: relative; /* Necesario para que el hijo posicionado de manera absoluta se base en este contenedor */
  display: inline-block;
  cursor: pointer;
}

.calibracion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  /*padding: 10px;*/
}

.calibracion__cabezal {
  width: 100%;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 10;
  padding: 1px;
  border-bottom: 1px solid #ccc;
}

.calibracion__cabezal h1 {
  text-align: center;
  color: #5b6574;
  font-size: 24px;
  padding: 20px 0;
  margin: 0;
  border-bottom: 1px solid #dee0e4;
  background-color: #f9f9f9;
  width: 100%;
}

.calibracion__cabezal h3,
p {
  text-align: center;
  color: #4c545f;
  font-size: 16px;
  padding: 10px 0;
  margin: 0;
  border-bottom: 1px solid #dee0e4;
  background-color: #f9f9f9;
  width: 100%;
}

form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 20px;
}

.calibracion label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  padding: 5px;
  color: #575656;
}

.button__send {
  background-color: #0eafe3;
  color: #fff;
  border: none;
  border-radius: 5px;
  width: 55px;
  height: 35px;
  font-size: 16px;
  padding: 5px;
  position: absolute;
  left: 0;
  top: 0;
  margin: 3px;
}

.button__close {
  color: red;
  width: 35px;
  height: 35px;
  padding: 0;
  position: absolute;
  right: 0;
  top: 0;
}
</style>
