import { useHomeMantenimientoStore } from "@/stores/homeMantenimientoStore";
import { useDataHomeMantenimiento } from "@/components/componsables/useMantenimiento";
import { useMantenimientoEdicion } from "@/stores/mantenimientoEdicion";
import { alarmColor, alertColor, averia, descarga, offlineColor, okColor, paroManual } from "@/variables";

const estadoColors = {
    "CARGA": okColor,
    "OK": okColor,
    "ESPERA": okColor,
    "MARCHA": okColor,
    "PARO": paroManual,
    "PRE-AVISO": alertColor,
    "AVERIA":  averia,
    "ALERTA": averia,
    "DESCARGA": descarga
};

const textColors = {
  "CARGA": '#001F3F',
  "PARO": '#FFFFFF',
  2: '#000'  
};

/*export const dataColorInfoMantenimiento = async (svg) => {
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

    if(edicion.acciones.marchaCompresores){
        edicion = useMantenimientoEdicion();
        const edicionCompresores = edicion.edicion.marchaCompresores;
        //console.log(edicionCompresores);
        for(let x in edicionCompresores){
            const status = svgStore.querySelector(`#${x}`);

            if(status){
                if(edicionCompresores[x] === 'ACTIVO'){
                    status.style.fill = '#29B32E';
                } else if (edicionCompresores[x] === 'INACTIVO') {
                    status.style.fill = '#e81b06';
                }
            }
        }
    } else {
        for(let x in marchaCompresores) {
            const status = svgStore.querySelector(`#${x}`);

            if(status){
                if(marchaCompresores[x] === 'ACTIVO'){
                    status.style.fill = '#29B32E';
                } else if (marchaCompresores[x] === 'INACTIVO') {
                    console.log(marchaCompresores[x]);
                    status.style.fill = '#e81b06';
                }
            }
        }
    }
}*/


export const dataColorInfoMantenimiento = async (svg) => {
    const svgStore = svg;
    const homeStore = useHomeMantenimientoStore();
    const edicion = useMantenimientoEdicion(); // <-- mover acá dentro

    let storeData = homeStore.datos;

    if (!storeData) {
        await useDataHomeMantenimiento();
        storeData = homeStore.datos;
    }

    const { salasCompresores, compresores, secadores, marchaCompresores } = storeData;

    const applyColor = (element, color) => {
    if (!element) return;

    element.querySelectorAll('*').forEach(el => {
        el.style.fill = color;
    });
};

    const applyColorStroke = (element, color) => {
        if (element) element.style.stroke = color;
    };

    const applyColorText = (element, color) => {
        //console.log(element);
        if (element) element.style.fill = color;
        //if(color === '#FFFFFF') element.style.stroke = '#000';
    };

    for(let x in salasCompresores){
        const salaNombre = x;
        const estadoSala = salasCompresores[x]['estado'];
        const sala = svgStore.querySelector(`#${salaNombre}`);
        const compresorIcon = svgStore.querySelector(`#${salaNombre}_icon`);
        //console.log(compresorIcon);
        //console.log(compresorIcon);

        applyColor(compresorIcon, estadoColors[estadoSala] || offlineColor);
        applyColorStroke(sala, estadoColors[estadoSala] || offlineColor);
        //if(compresorIcon) compresorIcon.style.fill = "#FFF";
    }

    // Aplica colores base
    compresores.forEach(({ nombre, estado_compresor }) => {
        const colorButton = svgStore.querySelector(`#${nombre}_icon`);
        const colorText = svgStore.querySelector(`#${nombre}_text`);
        applyColor(colorButton, estadoColors[estado_compresor] || offlineColor);
        applyColorText(colorText, textColors[estado_compresor] || '#FFF');
    });

    secadores.forEach(({ nombre, estado_secador }) =>{
        const colorButtom = svgStore.querySelector(`#${nombre}_icon`);
        //console.log(nombre, estado_secador);
        applyColor(colorButtom, estadoColors[estado_secador] || offlineColor);
    });

    // 🔄 Capa de edición dinámica
    if (edicion.acciones.marchaCompresores) {
        const edicionCompresores = edicion.edicion.marchaCompresores;

        for (let x in edicionCompresores) {
            const status = svgStore.querySelector(`#${x}`);
            if (status) {
                status.style.fill =
                    edicionCompresores[x] === 'ACTIVO' ? '#29B32E' : '#e81b06';
            }
        }
    } else {
        for (let x in marchaCompresores) {
            const status = svgStore.querySelector(`#${x}`);
            if (status) {
                status.style.fill =
                    marchaCompresores[x] === 'ACTIVO' ? '#29B32E' : '#e81b06';
            }
        }
    }
};
