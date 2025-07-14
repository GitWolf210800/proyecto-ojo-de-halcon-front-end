import axios from "axios";
const serverNodeRed = import.meta.env.VITE_SERVER_NODE_RED;

export async function fetchChartData(parametros) {
    try {
        const response = await axios.get(`${serverNodeRed}/`)
    } catch {

    }
}