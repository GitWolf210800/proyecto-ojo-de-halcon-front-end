import { useHomeMantenimientoStore } from "@/stores/homeMantenimientoStore";
import { getDatosMantenimiento } from "@/helpers/getMantenimiento";

export const useDataHomeMantenimiento = async () => {
    const datosOnline = await getDatosMantenimiento();
    const homeMantenimientoStore = useHomeMantenimientoStore();
    homeMantenimientoStore.datos = datosOnline;
}