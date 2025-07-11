import axios from "axios";
//import { server } from "@/variables";
const serverNodeRed = import.meta.env.VITE_SERVER_NODE_RED;

export async function fetchChartData(parametros) {
    try {
        const response = await axios.get(`${serverNodeRed}/datos24hs`, {
            params: {
                nombre: parametros.nombre,
                medicion: parametros.medicion,
                tabla: parametros.tabla
            }
        });
        return response.data.datos.datasets;
    } catch (error) {
        console.error('Error fetching chart data', error);
        throw error;
    }
}