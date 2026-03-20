import { useHomeProduccionStore } from "@/stores/homeProduccionStore";
import { useDataHomeProduccion } from "@/components/componsables/useProduccion";
import { alarmColor, alertColor, averia, descarga, offlineColor, okColor, paroManual } from "@/variables";
import { useProduccionEdicion } from "@/stores/produccionEdicion";


const estadoColors = {
    "MARCHA": okColor,
    "PARO": paroManual,
    "AVERIA": averia,
    "BLOQUEO": averia,
    "PUNTOS_GRUESOS": "#FAFA00"
};

export const dataColorInfoProduccion = async (svg) => {

    const svgStore = svg;
    const homeStore = useHomeProduccionStore();
    let storeData = (useHomeProduccionStore()).datos;
    let edicion = useProduccionEdicion();

    if(!storeData){
        await useDataHomeProduccion();
        storeData = (useHomeProduccionStore()).datos;
    }

    const applyColor = (element, color) => {
        if (element) element.style.stroke = color;
    };

    const applyColorText = (element, color) => {
        //console.log(element);
        if (element) element.style.fill = color;
        //if(color === '#FFFFFF') element.style.stroke = '#000';
    };

    const dataPuntosGruesos = storeData.puntos_gruesos;
    const nombresPuntosGruesos = storeData.nombres_puntos_gruesos;

    if(edicion.acciones.cardaLock){
        const edicionCardasLock = edicion.edicion.cardasLock;

        for(let x in edicionCardasLock){
            const nombre = x;
            const colorCarda = svgStore.querySelector(`#${nombre}_estado_color_maquina`);
            const candado = svgStore.querySelector(`#${nombre}_bloqueo`);

            const estadoCardatext = svgStore.querySelector(`#${nombre}_estado_text`);
            const produccionText = svgStore.querySelector(`#${nombre}_produccion_text`);
            const puntosGruesosText = svgStore.querySelector(`#${nombre}_text`);

            
        }

    } else {
        for(let i = 0; i < nombresPuntosGruesos.length; i++){
        const colorCarda = svgStore.querySelector(`#${nombresPuntosGruesos[i]}_estado_color_maquina`);
        const candado = svgStore.querySelector(`#${nombresPuntosGruesos[i]}_bloqueo`);

        const estadoCardaText = svgStore.querySelector(`#${nombresPuntosGruesos[i]}_estado_text`);
        const produccionText = svgStore.querySelector(`#${nombresPuntosGruesos[i]}_produccion_text`);
        const puntosGruesosText = svgStore.querySelector(`#${nombresPuntosGruesos[i]}_text`);

        const datos = dataPuntosGruesos.find((data) => data.nombre === nombresPuntosGruesos[i]);

        try{
            if(datos){
                const estadoMaquina = datos.estado_maquina;
                const produccion = datos.produccion;
                const puntosGruesos = datos.puntos_gruesos;
                
                if(colorCarda){
                    if(estadoMaquina !== 'PUNTOS_GRUESOS' && estadoMaquina !== 'BLOQUEO'){
                        candado.style.display = 'none';
                        colorCarda.classList.remove("blink-yellow");
                        colorCarda.classList.remove("blink-red");
                        applyColor(colorCarda, estadoColors[estadoMaquina]) || offlineColor;
                    }
                    else if(estadoMaquina == 'PUNTOS_GRUESOS') {
                        colorCarda.style.stroke = ""
                        candado.style.display = 'none';
                        colorCarda.classList.remove("blink-red");
                        colorCarda.classList.add("blink-yellow");
                    }
                    else if(estadoMaquina == 'BLOQUEO') {
                        colorCarda.style.stroke = "";
                        candado.style.display = 'block';
                        colorCarda.classList.remove("blink-yellow");
                        colorCarda.classList.add("blink-red");
                    }
                }

                if(estadoCardaText){
                    estadoCardaText.textContent =  `${estadoMaquina}`;
                }

                if(produccionText){
                    produccionText.textContent =  `${produccion} KG/H`;
                }

                if(puntosGruesosText){
                    puntosGruesosText.textContent = `P-gruesos: ${puntosGruesos}`;
                }
            }
        } catch{

        }

    } 
    }

};