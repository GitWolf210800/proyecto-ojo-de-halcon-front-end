import { useHomeMantenimientoStore } from "@/stores/homeMantenimientoStore";
import { useDataHomeMantenimiento } from "@/components/componsables/useMantenimiento";
import { alarmColor, alertColor, averia, descarga, offlineColor, okColor, paroManual } from "@/variables";

const estadoColors = {
    "CARGA": okColor,
    "PARO": paroManual,
    "AVERIA":  averia,
    "DESCARGA": descarga
};

const textColors = {
  1: '#000',
  0: '#FFF',
  2: '#000'  
};

export const dataColorInfoMantenimiento = async (svg) => {
    const svgStore = svg;
    //console.log(svg);
    let storeData = useHomeMantenimientoStore().datos;

    if (!storeData){
        await useDataHomeMantenimiento();
        storeData = useHomeMantenimientoStore().datos;
    }

    const {compresores} = storeData;
    const {marchaCompresores} = storeData;

    //Función para asignar color segun el estado
    const applyColor = (element, color) => {
        if(element) element.style.fill = color;
    }

    const applyColorText = (element, color) => {
        if(element) element.style.stroke = color;
    }

    compresores.forEach(({ nombre, estado_compresor  }) => {
        const colorButtom = svgStore.querySelector(`#${nombre}`);
        const colorText = svgStore.querySelector(`#${nombre}_text`);
        //console.log(nombre, estado);
        if (colorButtom){
            //console.log(colorText);
            applyColor(colorButtom, estadoColors[estado_compresor] || offlineColor);
            applyColorText(colorText, textColors[estado_compresor] || '#FFF');
        }
    });

    for(let x in marchaCompresores) {
        const status = svgStore.querySelector(`#${x}`);

        if(status){
            if(marchaCompresores[x] === 'ACTIVO'){
                status.style.fill = '#29B32E';
            } else if (marchaCompresores[x] === 'INACTIVO') {
                status.style.fill = '#e81b06';
            }
        }
    }
}