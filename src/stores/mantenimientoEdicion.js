import { defineStore } from "pinia";
import { ref } from "vue";

export const useMantenimientoEdicion = defineStore('mantenimientoEdicion', {
    state: () => ({
        edicion: {
            marchaCompresores: {}
        },
        acciones: {
            marchaCompresores: false
        }
    })
});