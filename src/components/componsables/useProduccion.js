import { useHomeProduccionStore } from "@/stores/homeProduccionStore";
import { getDatosProduccion } from "@/helpers/getProduccion";

export const useDataHomeProduccion = async ()=> {
    const datosOnline = await getDatosProduccion();
    const homeProduccionStore = useHomeProduccionStore();
    homeProduccionStore.datos = datosOnline;
};