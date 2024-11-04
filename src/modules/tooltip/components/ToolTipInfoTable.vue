<template>
    <div class="toolTipTable" :style="{ left: `${position.x}px`, top: `${position.y}px` }">
        <h2>{{ props.parametros }}</h2>
        <table>
            <thead>
                <tr>
                    <th v-for="header in headers" :key="header">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in data" :key="index">
                    <td v-for="header in headers" :key="header"> {{  item[header]  }} </td>
                </tr>
            </tbody>
        </table>

    </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from 'vue';
import { fetchInfoTableDatos } from '../utils/fetchInfoTableDatos';

const loading = ref(true);
const offline = ref(true);
//const datosTable = ref(null);

const props = defineProps({
    position : {
        type: Object,
        requiered: true
    },
    data: {
        type: Array,
        requiered: true
    },
    parametros: {
        type: Object,
        required: true
    }
});

//Destructuracion de la prop `data`
const { data } = toRefs(props);

//Computado para obtener los encabezados de la tabla en las claves del primer objeto
const headers = computed(() => {
    return data.value.length > 0 ? Object.keys(data.value[0]) : [];
});


onMounted( async () =>  {
    try {
        const datos = await fetchInfoTableDatos(props.parametros);
        props.data = datos;
    } catch (error) {
        loading = false;
        props.data = null;
    } finally {
        loading = false;
    }
});


</script>

<style>
.toolTipTable {
    display: none;
    background-color: #626262;
    color: #f0f0f0;
    text-align: justify;
    position: fixed;
    border: 1px solid #ccc;
    border-radius: 7px;
    padding: 10px;
    z-index: 999;
    margin: 0 auto;
    width: 215px;
    height: 130px;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
}

body {
    color: #FFF
}
</style>