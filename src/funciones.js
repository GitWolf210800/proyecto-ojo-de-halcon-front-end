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


