import { useSvgStore } from "@/stores/svgStore";
import { useHomeClimaStore } from "@/stores/homeClimaStore";
import { alarmColor, offlineColor, okColor } from "@/variables";

export const dataColorInfoFiltro = () => {
    const svgStore = (useSvgStore()).svgRef;
    const storeData = (useHomeClimaStore()).datos;
    const dataFiltro = storeData.filtros;
    const nombresFiltro = storeData.nombresFiltro;

    for (let i = 0; i < nombresFiltro.length; i++) {
        const botonFiltro = svgStore.querySelector(`#${nombresFiltro[i]}`);
        const datos = dataFiltro.find((data) => data.nombre === nombresFiltro[i]);

        try {
            if (botonFiltro){
                if (datos) {
                    const estado = datos.estado
    
                    if (estado === 0) {
                        botonFiltro.style.stroke = alarmColor;
                    } else if (estado === 1) {
                        botonFiltro.style.stroke = okColor;
                    } else if (estado === 3) {
                        botonFiltro.style.stroke = offlineColor
                    }
                } else {
                    botonFiltro.style.stroke = offlineColor;
                }
            }
        } catch {
            console.log(`Error en: ${nombresFiltro[i]}`);
        }
    }
};