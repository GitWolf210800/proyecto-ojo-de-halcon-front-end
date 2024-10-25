import { defineStore } from "pinia";
import { ref } from "vue";

export const useHomeClimaStore = defineStore('homeClima', () => {
    const datos = ref(null);
    const setDatos = (data) => {
        datos.value = data;
    };
    return {datos, setDatos};
});