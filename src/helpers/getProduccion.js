import axios from "axios";
const serverNodeRed = import.meta.env.VITE_SERVER_NODE_RED;

const API_URL = `${serverNodeRed}/datoProduccion`;

export const getDatosProduccion = async ()=> {
    const respuesta = await axios.get(API_URL);
    const newData = respuesta.data;
    return newData;
};
