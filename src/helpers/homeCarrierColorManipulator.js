import { useSvgStore } from "@/stores/svgStore";
import { useHomeClimaStore } from "@/stores/homeClimaStore";
import { alarmColor, alertColor, okColor, paroManual } from "@/variables";

export const dataColorInfoCarrier = () => {
    const svgStore = (useSvgStore()).svgRef;
    const storeData = (useHomeClimaStore()).datos;
    const chillers = storeData.chiller;
    const estadoCarrier = storeData.estadoCarrier;
    const demandaAguaFria = storeData.demanda_agua_fria;
    const tanqueNombre = 'tanque_agua_fria_carrier';
    const demandaAguaFriaText = svgStore.querySelector(`#demanda_agua_fria_text`);
    const estadoCarrierGrafico = svgStore.querySelector(`#condiciones_marcha_carrier_estado`);
    const entAguaFria = svgStore.querySelector('#entrada_agua_fria_principal');
    const salAguaFria = svgStore.querySelector('#salida_agua_fria_principal');
    const tanqueGrafico = svgStore.querySelector(`#${tanqueNombre}_grafico`);
    const tanqueText = svgStore.querySelector(`#${tanqueNombre}`);

    try {
        const estadoTanque = Math.abs(estadoCarrier.tanque_agua_fria_carrier);
        const cantidadDemanda = Object.keys(demandaAguaFria).length;
        demandaAguaFriaText.textContent = cantidadDemanda;
        entAguaFria.textContent = estadoCarrier.entrada_agua_fria_principal.toFixed(1);
        salAguaFria.textContent= estadoCarrier.salida_agua_fria_principal.toFixed(1);
        tanqueText.textContent = `${estadoTanque}`;

        if (estadoTanque < 50) {
            tanqueGrafico.style.fill = alarmColor;
        } else {
            tanqueGrafico.style.fill = okColor;
        }

        if (estadoCarrier.estado){
            estadoCarrierGrafico.style.stroke = okColor
        } else {
            estadoCarrierGrafico.style.stroke = alertColor;
        }

    } catch {
        console.error('error en estado de carrier');
    }

    for(let i = 0; i < chillers.length; i++) {
        const nombre = chillers[i].nombre;
        const colorButtom = svgStore.querySelector(`#${nombre}`);
        const textButtom = svgStore.querySelector(`#${nombre}Text`);
        const estado = chillers[i].estado;
        const demanda = chillers[i].demanda;

        textButtom.textContent = `${nombre}  ${demanda.toFixed(0)} %`;

        if (estado === 0) {
            colorButtom.style.fill = alarmColor;
        } else if (estado === 50){
            colorButtom.style.fill = paroManual;
        } else if (estado === 100) {
            colorButtom.style.fill = okColor;
        }
    }

};