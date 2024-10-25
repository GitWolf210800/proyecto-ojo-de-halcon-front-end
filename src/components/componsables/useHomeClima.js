import { useHomeClimaStore } from "@/stores/homeClimaStore";
import { getDatosHomeClima } from "@/helpers/getHomeClima";

export const useDataHomeClima = async () => {
    const datosOnline = await getDatosHomeClima();
    const homeClimaStore = useHomeClimaStore();
    homeClimaStore.datos = datosOnline;
};