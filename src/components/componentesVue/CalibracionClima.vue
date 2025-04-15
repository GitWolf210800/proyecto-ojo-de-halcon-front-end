<template>
<CalibracionClimaButtom @click="toggle" v-if="show && esRutaEspecifica" />

<div class="body__content" v-if="visibilityForm">
    <form>
      <div class="calibracion__cabezal">
        <button type="submit" class="button__send">Enviar</button>
        <fa @click="toggleForm" class="button__close" icon="square-xmark"></fa>
        <h1>Calibración Clima</h1>
        <h3>{{ tituloInstalacion }}</h3>
        <p v-if="error" class="mensaje">{{ mensaje }}</p>
      </div>
      
      <div class="calibracion">
        <label>fecha: {{ datos['fecha'] }}</label>
        <div v-for="(value, key) in datos" :key="key">
            <template v-if="!key.startsWith('id') && key !== 'nombre' && key !== 'fecha'">
                <label :for="key">{{ key }}, {{ value }}</label>
                <input :id="key" v-model="datos[key]" type="number"/>
            </template>
        </div>
      </div>
    </form>
</div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';

import CalibracionClimaButtom from '@/components/icons/CalibracionClimaButtom.vue';

import { useDataUserStore } from '@/stores/dataUserStore';
import { useHomeClimaStore } from '@/stores/homeClimaStore';
import { useSvgStore } from '@/stores/svgStore';
import { server } from '@/variables';

const route = useRoute();

const esRutaEspecifica = computed(() => route.path === '/clima');

const dataUserStore = useDataUserStore();
const dataClima = useHomeClimaStore();
const mapa = useSvgStore();

const show = ref(false);
const tituloInstalacion = ref('');
const visibilityForm = ref(false);
const mensaje = ref('');
const toggleClick = ref(false);
const datos = ref({});

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
    },
    {immediate: true, deep: true}
);

const toggleForm = () => {
    visibilityForm.value = !visibilityForm.value;
};

const toggle = () => {
    toggleClick.value = !toggleClick.value;
    if(toggleClick.value){
        const nombres = dataClima.datos.nombresClima;
        const map = mapa.svgRef;

        for(let i = 0; i < nombres.length; i++){
            const temperatura = map.querySelector(`#${nombres[i]}_temp_g`);
            const humedad = map.querySelector(`#${nombres[i]}_hum_g`);

            const handlerTemperatura = async () => {
                const instalacion = nombres[i];
                const res = await fetch(`${server}:4000/api/formCalClimaTemper`, {
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
                datos.value.fecha = new Date(datos.value.fecha).toLocaleString('es-AR'); 
                console.log(datos.value);

                tituloInstalacion.value = instalacion;
                visibilityForm.value = true;
            };

            const handlerHumedad = async () => {
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
                tituloInstalacion.value = instalacion;
                visibilityForm.value = true;
            };

            if(temperatura){
                temperatura.addEventListener('click', handlerTemperatura);
            }

            if(humedad){
                humedad.addEventListener('click', handlerHumedad);
            }
            
        }

        //console.log(nombres);
    } else {
        visibilityForm.value = false;
    }

    //visibilityForm.value = !visibilityForm.value;
};

</script>

<style scoped>

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

    .body__content, .calibracion {
        text-align: center;
    }

    .body__content, .calibracion input{
        display: inline-block;
    }


    .calibracion {
        flex: 1;
        width: 100%;
        max-height: 250px;
        overflow-y: scroll;
    }

    .calibracion__cabezal {
        width: 100%;
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 10;
        padding: 10px;
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

    .calibracion__cabezal h3, p {
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