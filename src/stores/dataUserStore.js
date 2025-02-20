import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataUserStore = defineStore('dataUserStore', ()=> {
    const dataUser = ref(null); //Aqui se almacenan los datos del usuario

    const setDataUser = (dataUserElement) => {
        dataUser.value = dataUserElement;
    };

    return {
        dataUser,
        setDataUser
    }
});