import { useHomeClimaStore } from "@/stores/homeClimaStore";
import { useDataHomeClima } from "@/components/componsables/useHomeClima";
import { alarmColor, offlineColor, okColor, paroManual } from "@/variables";

export const dataColorInfoCarrier = async (svg) => {
  const svgStore = svg;
  let storeData = useHomeClimaStore().datos;

  if (!storeData) {
    await useDataHomeClima();
    storeData = useHomeClimaStore().datos;
  }

  const {
    chiller: chillers,
    estadoCarrier,
    demanda_agua_fria: demandaAguaFria,
    porcentajeBombas
  } = storeData;
  const tanqueNombre = "tanque_agua_fria_carrier";
  const demandaAguaFriaText = svgStore.querySelector(`#demanda_agua_fria_text`);
  const estadoCarrierGrafico = svgStore.querySelector(`#condiciones_marcha_carrier_estado`);
  const cargaTermica = svgStore.querySelector(`#carga_termica_total`);
  const entAguaFria = svgStore.querySelector("#entrada_agua_fria_principal");
  const salAguaFria = svgStore.querySelector("#salida_agua_fria_principal");
  const tanqueGrafico = svgStore.querySelector(`#${tanqueNombre}_grafico`);
  const tanqueText = svgStore.querySelector(`#${tanqueNombre}`);

  // Función para asignar color según el estado
  const applyColor = (element, color) => {
    if (element) element.style.fill = color;
  };

  try {
    // Actualizar demanda de agua fría y estado del tanque
    demandaAguaFriaText.textContent = `${porcentajeBombas}%` || "0%";
    tanqueText.textContent =
      Math.abs(estadoCarrier?.tanque_agua_fria_carrier) || "0";

    const tanqueColor =
      estadoCarrier?.tanque_agua_fria_carrier < 50 ? alarmColor : okColor;
    applyColor(tanqueGrafico, tanqueColor);

    estadoCarrierGrafico.style.stroke = estadoCarrier?.estado
      ? okColor
      : alarmColor;

    // Configurar temperatura de entrada y salida de agua fría
    entAguaFria.textContent =
      estadoCarrier?.entrada_agua_fria_principal?.toFixed(1) || "NaN";
    salAguaFria.textContent =
      estadoCarrier?.salida_agua_fria_principal?.toFixed(1) || "NaN";//fsdkkdk

    cargaTermica.textContent = 
      parseInt(estadoCarrier.carga_termica_total) || "NaN";
  } catch (error) {
    console.warn("Error en datos de estado de carrier:", error);
  }

  // Colores por estado
  const estadoColors = {
    1 : offlineColor,
    0: alarmColor,
    50: paroManual,
    100: okColor,
  };

  // Configurar color y texto para cada chiller
  chillers.forEach(({ nombre, estado, demanda }) => {
    const colorButtom = svgStore.querySelector(`#${nombre}`);
    const textButtom = svgStore.querySelector(`#${nombre}Text`);

    if (textButtom)
      textButtom.textContent = `${nombre} ${demanda.toFixed(0)} %`;
    applyColor(colorButtom, estadoColors[estado] || offlineColor);
  });
};
