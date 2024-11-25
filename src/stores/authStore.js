import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const datos = ref(null);
    const setDatos =  (data) => {
        datos.value = data;
    };
    return {datos, setDatos};
});