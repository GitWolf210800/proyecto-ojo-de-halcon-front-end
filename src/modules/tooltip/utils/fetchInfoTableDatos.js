import { server } from "@/variables";
import axios from "axios";

export async function fetchInfoTableDatos(parametros) {
    try {
        console.log(parametros);
        const response = await axios.get(`${server}:1880/datosTabla`, {
            params: {
                solicitud: parametros.solicitud
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error de Fetching chart data', error);
        throw error;
    }
}