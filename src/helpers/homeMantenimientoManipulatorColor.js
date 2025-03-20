import { useHomeMantenimientoStore } from "@/stores/homeMantenimientoStore";
import { useDataHomeMantenimiento } from "@/components/componsables/useMantenimiento";
import { alarmColor, alertColor, offlineColor, okColor } from "@/variables";

const estadoColors = {
    1: okColor,
    0: alarmColor,
    2: alertColor
};

const textColors = {
  1: '#000',
  0: '#FFF',
  2: '#000'  
};

export const dataColorInfoMantenimiento = async (svg) => {
    const svgStore = svg;
    let storeData = useHomeMantenimientoStore().datos;

    if (!storeData){
        await useDataHomeMantenimiento();
        storeData = useHomeMantenimientoStore().datos;
    }

    const {compresores} = storeData;

    //Función para asignar color segun el estado
    const applyColor = (element, color) => {
        if(element) element.style.fill = color;
    }

    const applyColorText = (element, color) => {
        if(element) element.style.stroke = color;
    }

    compresores.forEach(({ nombre, estado  }) => {
        const colorButtom = svgStore.querySelector(`#${nombre}`);
        const colorText = svgStore.querySelector(`#${nombre}_text`);
        if (colorButtom){
            //console.log(colorText);
            applyColor(colorButtom, estadoColors[estado] || offlineColor);
            applyColorText(colorText, textColors[estado] || '#FFF');
        }
    });
}