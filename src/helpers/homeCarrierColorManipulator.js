import { useHomeClimaStore } from "@/stores/homeClimaStore";
import { alarmColor, alertColor, okColor, paroManual } from "@/variables";

export const dataColorInfoCarrier = (svg) => {
    const svgStore = svg;
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
        const cantidadDemanda = demandaAguaFria.length;
        demandaAguaFriaText.textContent = cantidadDemanda;
        tanqueText.textContent = `${estadoTanque}`;
        
        if (estadoTanque < 50) {
            tanqueGrafico.style.fill = alarmColor;
        } else {
            tanqueGrafico.style.fill = okColor;
        }

        if (estadoCarrier.estado){
            estadoCarrierGrafico.style.stroke = okColor
        } else {
            estadoCarrierGrafico.style.stroke = alarmColor;
        }

        if (estadoCarrier.entrada_agua_fria_principal){
            entAguaFria.textContent = estadoCarrier.entrada_agua_fria_principal.toFixed(1);
        } else {
            entAguaFria.textContent = 'NaN';
        }
        
        if (estadoCarrier.salida_agua_fria_principal) {
            salAguaFria.textContent= estadoCarrier.salida_agua_fria_principal.toFixed(1);
        } else  {
            salAguaFria.textContent= 'NaN';
        }

    } catch (error) {
        console.warn('error en datos de estado de carrier', error);
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