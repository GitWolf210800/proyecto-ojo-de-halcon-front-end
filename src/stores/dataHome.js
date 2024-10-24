import { defineStore } from "pinia";
import axios from 'axios';

export const useDataStore = defineStore('dataStore', {
    state: () => ({
        data: [], //Aqui se almacena los datos
        loading: false, //Estado de carga
        error: null, //Estado de error
    }),
    actions: {
        async fetchData() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get('http://192.168.3.122:1880/datoClima');
                this.data = response.data; // Aqui se almacena los datos de el estado
            } catch (err) {
                this.error = err.message;
            } finally {
                this.loading = false;
            }
        },
        startAutoRefresh() {
            this.fetchData();
            setInterval(()=> {
                this.fetchData();
            }, 60000);
        }
    }
});