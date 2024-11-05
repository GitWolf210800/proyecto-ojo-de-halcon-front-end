<template>
    <div class="toolTipTable" :style="{ left: `${position.x}px`, top: `${position.y}px` }" v-if="data && headers.length > 0">
        <h2>{{ parametros.solicitud }}</h2>
        <table>
            <tbody>
                <tr v-for="(item, index) in data" :key="index">
                    <td v-for="header in headers" :key="header"> {{ item[header] }} </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue';
import { fetchInfoTableDatos } from '../utils/fetchInfoTableDatos';

const loading = ref(true);
const data = ref(null); // Almacena los datos obtenidos
const headers = ref([]); // Almacena los encabezados de las columnas

const props = defineProps({
    position: {
        type: Object,
        required: true
    },
    parametros: {
        type: Object,
        required: true
    }
});

const { parametros } = toRefs(props); // Accede a `parametros` para facilitar su uso en `fetchInfoTableDatos`

onMounted(async () => {
    try {
        // Obtiene los datos usando la función de utilidad `fetchInfoTableDatos`
        const datos = await fetchInfoTableDatos(parametros.value);
        data.value = datos;
        
        // Calcula los encabezados de la tabla usando las claves del primer objeto
        headers.value = data.value.length > 0 ? Object.keys(data.value[0]) : [];
        
        loading.value = false;
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        loading.value = false;
        data.value = null;
    }
});
</script>

<style scoped>
.toolTipTable {
    display: flex;
    flex-direction: column;
    background-color: #626262;
    color: #f0f0f0;
    text-align: justify;
    position: fixed;
    border: 1px solid #ccc;
    border-radius: 7px;
    padding: 10px;
    z-index: 999;
    margin: 0 auto;
    max-width: 400px;
    max-height: 500px;
    /*overflow: auto;*/
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1em;
}

th, td {
    padding: 0.5em;
    border: 1px solid #ddd;
    text-align: left;
}

h2 {
    margin: 0;
    padding-bottom: 0.5em;
}
</style>
