import { ref } from "vue";
import { okColor, alarmColor, alertColor, paroManual } from "./variables";

// Función para reemplazar guiones bajos por espacios en los encabezados
export const formatoTextoSinGion = (header) => {
    return header.replace(/_/g, ' ');
};

//Funcion para verificar si el valor impreso es un numero y si es distinto a un numero entero
//para formatear a dos decimales
export const formatValue = (value) => {
    //console.log(value);
    return typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2) : value;
  }

export function createTooltipConfig(selector, tooltipType, payload, config) {
  return { selector, tooltipType, payload, config };
}

export function createRouterConfig(selector, path, params){ // Crea una configuracion de query
  return {selector, path, params};
}

export const isMobile = () => {                                 //// This function is for detected if is mobile
  return /Mobi|Android/i.test(navigator.userAgent);
};

export function setElementColor(element, medicion, value) { // Utilidad para determinar colores

  // Funciones de color para cada caso
  function getColorForFill(value) {
  return value === 100
    ? okColor
    : value === 50
    ? paroManual
    : value === 0
    ? alarmColor
    : "#D5A200"; // Color específico para el caso `bomba_pileta`
}

function getColorForStroke(value) {
  return value === 100
    ? okColor
    : value === 80
    ? "#E9EC03"
    : value === 5 || value === 50
    ? paroManual
    : null;
}
  
  
  if (
    medicion.startsWith("filtro") ||
    medicion.startsWith("bomba_") ||
    medicion.startsWith("ventilador") ||
    medicion === "estado"
  ) {
    element.style.fill = getColorForFill(value);
  }

  if (medicion === "pileta" || medicion.startsWith("valvula_")) {
    element.style.stroke = getColorForStroke(value);
  }

  if (
    medicion.includes("temp") ||
    medicion.includes("delta") ||
    medicion.includes("entrada") ||
    medicion.includes("salida") ||
    medicion.includes("tanque_agua_fria_carrier") ||
    medicion === "demanda"
  ) {
    element.textContent = value ? value.toFixed(1) : 0;
  }
}


