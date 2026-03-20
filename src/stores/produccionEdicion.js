import { defineStore } from "pinia";
import { ref } from "vue";

export const useProduccionEdicion = defineStore('produccionEdicion', {
    state: () => ({
        edicion: {
            cardasLock: {}
        },
        acciones: {
            cardaLock: false
        }
    })
});