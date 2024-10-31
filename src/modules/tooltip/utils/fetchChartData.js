import axios from "axios";
import { server } from "@/variables";

export async function fetchChartData(parametros) {
    try {
        const response = await axios.get(`${server}:1880/datos24hs`, {
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