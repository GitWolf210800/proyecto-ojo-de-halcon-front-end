import { server } from "@/variables";
import axios from "axios";

export async function fetchInfoTableDatos(parametros) {
    try {
        const response = await axios.get(`${server}:1880/datos`, {
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