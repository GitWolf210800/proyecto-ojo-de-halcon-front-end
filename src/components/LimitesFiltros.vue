<template>
    <LimitesFiltrosButton  class="icon-container" @click = "toggle" v-if="show && esRutaEspecifica" />

    <div class="body__content" v-if="visibilityForm">
        <form @submit.prevent="handleSubmit">
        <div class="limites__cabezal">
            <button type="submit" class="button__send">Enviar</button>
            <fa class="button__close" icon="square-xmark" @click="toggleForm" />
            <h1>Edición de Limites</h1>
            <h3>{{ tituloInstalacion }}</h3>
            <p v-if="error" class="mensaje">{{ mensaje }}</p>
        </div>
        <!--<div id="parametros" class="limites" v-for="(value, key) in datos" :key="key">
            <label :for="key">{{ key }}, {{ value }}</label>
            <input :id="key" v-model="datos[key]" />
        </div>-->
        <div class="limites" >
            <div v-for="(value, key) in datos" :key="key">
                <template v-if="!key.startsWith('id') && !key.startsWith('nombre') && key !== 'motivo'">
                    <label :for="key">{{ key }}, {{ value }}</label>
                    <input :id="key" v-model="datos[key]" type="number" />
                </template>
            </div>
            <label>Indique el Motivo:</label>
            <input :id="'motivo'" v-model="datos['motivo']" type="text">
        </div>
    </form>
    </div>
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
import { server } from '@/variables';

const route = useRoute();
const router = useRouter();

const esRutaEspecifica = computed(() => route.path === '/clima');
const dataUserStore = useDataUserStore();
const svgMap = useSvgStore();
const climaData = useHomeClimaStore();
const referenceStore = useReferenceStore();

const tituloInstalacion = ref('');
const datos = ref({});
const show = ref(false);
const visibilityForm = ref(false);
const toggleClick = ref(false);
const error =  ref(false);
const mensaje = ref('');

//Se prepara los datos para la navegacion
const navigateTo = (routeInfo) => {
  router.push({
    path: routeInfo.path,
    query: routeInfo.params
  });
};

const handleSubmit = async () => {

    //console.log(datos.value);
    //console.log(JSON.stringify(datos.value));
    const res = await fetch(`${server}:4000/api/formlimsent`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(datos.value)
    });

    const resJson = await res.json();
    if(res.message) mensaje.value = resJson.message;

    const response = await fetch(`${server}:1880/updateLim`, {method: 'GET'})
    .then(() => console.log('node-red Actualizado'))
    .catch(error => console.error('Error al actualizar node-red', error));

};

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
      toggle();
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
            const handler = async () => { 
                const instalacion = filtros[i];
                const res = await fetch(`${server}:4000/api/formlimfil`, {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        instalacion : instalacion 
                    })
                });
                const resJson = await res.json();
                datos.value = resJson[0];
                console.log('hizo click en: ', instalacion); 
                console.log(datos.value);
                tituloInstalacion.value = instalacion;
                visibilityForm.value = true;
            };
            
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
        visibilityForm.value = false;
        console.log(`formulario: ${visibilityForm.value}`);
        console.log(toggleClick.value);

        for (let i = 0; i < filtros.length; i++) {
            const element = map.querySelector(`#${filtros[i]}`);

            if (element) {
                const storeHandler =  referenceStore.reference[`#${filtros[i]}`]['click'];
                element.removeEventListener('click', storeHandler);
            }
        }

        const routesMap = [
            ...salas.map((dato) => createRouterConfig(`#${dato}`, '/salaFiltro', dato))
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

const toggleForm = () => {
    visibilityForm.value = !visibilityForm.value;
};
</script>

<style scoped>

.icon-container {
  position: relative; /* Necesario para que el hijo posicionado de manera absoluta se base en este contenedor */
  display: inline-block;
  cursor: pointer;
}

.button__send{
    background-color: #0eafe3;
    color: #FFF;
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
    padding: 0px;
    position: absolute;
    right: 0;
    top: 0;
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
    /*overflow: hidden;*/
}

.limites {
    flex: 1;
    width: 100%;
    /*gap: 10px;*/
    max-height: 250px;
    overflow-y: scroll;
    /*padding: 10px;*/
}

/*form {
    overflow-y: scroll;
}*/

.limites__cabezal{
    width: 100%;
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

.limites__cabezal h1 {
    text-align: center;
    color: #5b6574;
    font-size: 24px;
    padding: 20px 0;
    margin: 0;
    border-bottom: 1px solid #dee0e4;
    background-color: #f9f9f9;
    width: 100%;
}

.limites__cabezal h3, p {
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

.limites label {
    display: flex;
    justify-content: center;
    align-items: center;/**/
    width: 100%;
    height: auto;
    padding: 5px;
    /*background-color: #1984bc;*/
    color: #575656;
}

/*.tilde {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  z-index: 1; 
}*/

.body__content, .limites {
    text-align: center;
}

.body__content, .limites input{
    display: inline-block;
}

input{
    border: none;
    border-bottom: 2px solid #333;
    color: #0b42ba;
}

.mensaje {
    color: #da2506;
}
</style>