import axios from "axios";
import { server } from "@/variables";

const API_URL = `${server}:1880/datoClima`;

export const getDatosHomeClima = async () => {
    const respuesta = await axios.get(API_URL);
    const newData = respuesta.data;
    return newData;
};