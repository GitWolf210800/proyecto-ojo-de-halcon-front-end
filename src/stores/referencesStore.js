import { defineStore } from "pinia";
import { ref } from "vue";

export const useReferenceStore = defineStore('dataReferences', () => {
    const reference = ref({}); //Aqui se almacenaran las referencias de los eventos que se vayan a crear

    const setReference = (referenceElement) => {
        reference.value = referenceElement;
    }

    return {
        reference,
        setReference
    }
});