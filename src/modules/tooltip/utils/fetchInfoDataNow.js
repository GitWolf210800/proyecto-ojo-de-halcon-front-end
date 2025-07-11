import axios from "axios";
//import { server } from "@/variables";
const serverNodeRed = import.meta.env.VITE_SERVER_NODE_RED;

export async function fetchInfoDataNow(parametros) {
    try {
        const response = await axios.get(`${serverNodeRed}/datosNow`, {
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