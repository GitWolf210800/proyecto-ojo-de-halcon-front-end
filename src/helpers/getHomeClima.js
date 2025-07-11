import axios from "axios";
//import { server } from "@/variables";

const serverNodeRed = import.meta.env.VITE_SERVER_NODE_RED;

const API_URL = `${serverNodeRed}/datoClima`;

export const getDatosHomeClima = async () => {
    const respuesta = await axios.get(API_URL);
    const newData = respuesta.data;
    return newData;
};