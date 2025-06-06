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
        <h4 class="nombre">{{ tituloInstalacion }}</h4>
        <pre v-if="mensajeShow" class="mensaje">{{ mensaje }}</pre>
        <input
          class="inputDatos"
          :id="key"
          v-model="datos['valor_calibracion_temperatura']"
          placeholder="insertar temperatura real"
          type="number"
          min="0.1"
          step="any"
          required
        />
        <input
          class="inputDatos"
          :id="key"
          v-model="datos['valor_calibracion_humedad']"
          placeholder="insertar humedad real"
          type="number"
          min="0.1"
          step="any"
          required
        />
        <label>Motivo: </label>
        <select v-model="datos['motivo']" id="motivo" required>
          <option
            v-for="(valor, clave) in opciones"
            :key="clave"
            :value="clave"
          >
            {{ valor.motivo }}
          </option>
        </select>
      </div>

      <div class="calibracion">
        <label class="date">Ultima Vez: {{ datos["fecha"] }}</label>
        <div v-for="(value, key) in datos" :key="key">
          <template
            v-if="
              !key.startsWith('id') &&
              key !== 'nombre' &&
              key !== 'fecha' &&
              !key.includes('calibracion') &&
              !key.includes('motivo') &&
              !key.startsWith('factor')
            "
          >
            <label class="datos" :for="key">{{ key }}, {{ value }}</label>
          </template>
        </div>
        
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
import { isMobile, quitarTerminacionAj } from "@/funciones";
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
const mensajeShow = ref(false);
const mensaje = ref("");
const toggleClick = ref(false);
const datos = ref({});

const toggleForm = () => {
  visibilityForm.value = !visibilityForm.value;
  mensajeShow.value = false;

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
        const nombreFabrica = quitarTerminacionAj(datos.value.id_fabrica);
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
        //console.log(datos.value);


        tituloInstalacion.value = nombreFabrica;
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
    mensajeShow.value = false;

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
  console.log(resJson);
  if (resJson.message){
    mensajeShow.value = !mensajeShow.value;
    mensaje.value = resJson.message;

    /*const res = await fetch(`${server}:4000/api/formCalClima`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instalacion,
          }),
        });

    const resJson = await res.json();

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
        )?.humedad;*/
    
  }
  //visibilityForm.value = false;
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
/* Asegura que todos los elementos respeten el box-sizing */
* {
  box-sizing: border-box;
}

.nombre {
  margin-bottom: 0;
}

.mensaje {
  color: #01a801;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

input[type="number"] {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  outline: none;
  margin-bottom: 12px; /* espacio entre inputs */
}

/* Efecto al enfocar el input */
input[type="number"]:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.3);
}

.date {
  margin-bottom: -30px;
}

.datos {
  display: block;
  font-size: 14px;
  color: #264e86;
  margin-bottom: -3px;
  line-height: 0.8;
}

.body__content {
  width: 400px;
  max-height: 450px;
  background-color: #fff;
  box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1600;
  padding: 16px; /* nuevo: para que el contenido no toque los bordes */
}

.body__content,
.calibracion {
  text-align: center;
}

.icon-container {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.calibracion {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
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

