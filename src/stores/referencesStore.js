import { defineStore } from "pinia";
import { ref } from "vue";

export const useReferenceStore = defineStore('dataUserStore', () => {
    const reference = ref(null); //Aqui se almacenaran las referencias de los eventos que se vayan a crear

    const setReference = (referenceElement) => {
        reference.value = referenceElement;
    }

    return {
        reference,
        setReference
    }
});