//import { server } from "@/variables";
import axios from "axios";
const serverNodeRed = import.meta.env.VITE_SERVER_NODE_RED;

export async function fetchInfoTableDatos(parametros) {
    try {
        const response = await axios.get(`${serverNodeRed}/datosTabla`, {
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