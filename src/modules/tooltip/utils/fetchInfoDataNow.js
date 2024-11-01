import axios from "axios";
import { server } from "@/variables";

export async function fetchInfoDataNow(parametros) {
    try {
        const response = await axios.get(`${server}:1880/datosNow`, {
            params: {
                nombre: parametros.nombre
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chart data', error);
        throw error;
    }
}