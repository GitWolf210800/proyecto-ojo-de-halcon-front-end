import { useSvgStore } from "@/stores/svgStore";
import { useHomeClimaStore } from "@/stores/homeClimaStore";

export const eventsToolTipClima = () => {
    const storeData = (useHomeClimaStore()).datos;
    const svgStore = (useSvgStore()).svgRef;
    const nombres = storeData.nombresClima;

    const handleMouseOver = (e, nombre, medicion) => {
        console.log(`Las coordenadas: X: ${e.clientX}, Y: ${e.clientY}`);
        console.log(`Es la instalacion: ${nombre}`);
        console.log(`y mide: ${medicion}`);
    };

    const createEventHandler = (nombre, medicion) => (e) => handleMouseOver(e, nombre, medicion);

    const miFuncion = (x, y) => {
        console.log('Coordenadas: ', x, y);
    }; 

    for (let i = 0; i < nombres.length; i++) {
        const temp = svgStore.querySelector(`#${nombres[i]}_temp_g`);
        const hum = svgStore.querySelector(`#${nombres[i]}_hum_g`);
        const humAbs = svgStore.querySelector(`#${nombres[i]}_humAbs_g`);

        if (temp) {
            temp.removeEventListener('mouseover', createEventHandler(nombres[i], 'temperatura'));

            temp.addEventListener('mouseover', createEventHandler(nombres[i], 'temperatura'));
        } else {
            console.log(`no existe el elemento: ${nombres[i]}_temp_g`);
        }
        
    }

    /*const beforeDestroy = () => {
        for (let i = 0; i < nombres.length; i++) {
            const temp = svgStore.querySelector(`#${nombres[i]}_temp_g`);
            const hum = svgStore.querySelector(`#${nombres[i]}_hum_g`);
            const humAbs = svgStore.querySelector(`#${nombres[i]}_humAbs_g`);
            
            svgStore.removeEventListener('mouseover', this.handleMouseOver);
            
        }
    }*/
};