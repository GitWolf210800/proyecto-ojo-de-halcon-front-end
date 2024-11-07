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