import { server } from "@/variables";
import axios from "axios";

const API_URL = `${server}:1880/datoMantenimiento`;

export const getDatosMantenimiento = async () => {
    const respuesta = await axios.get(API_URL);
    const newData = respuesta.data;
    return newData;
};