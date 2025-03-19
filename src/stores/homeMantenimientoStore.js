import { defineStore } from "pinia";
import { ref } from "vue";

export const useHomeMantenimientoStore = defineStore('homeMantenimiento', () => {
    const datos = ref(null);
    const setDatos = (data) => {
        datos.value = data;
    };
    return {datos, setDatos};
});