import axios from "axios";
const serverNodeRed = import.meta.env.VITE_SERVER_NODE_RED;

export async function fetchChartDataBar(parametros) {
    try {
        const response = await axios.get(`${serverNodeRed}/datosganttbar24hs`, {
            params: {
                nombre: parametros.nombre,
                medicion: parametros.medicion,
                tabla: parametros.tabla
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching chart data', error);
        throw error;
    }
}