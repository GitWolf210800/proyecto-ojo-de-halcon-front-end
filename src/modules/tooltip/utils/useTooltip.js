// useTooltip.js
import { isMobile } from "@/funciones";
import { ref } from "vue";

// Crea y exporta la función de utilidad
export function useTooltip() {
  const tooltipPosition = ref({ x: 0, y: 0 });
  const params = ref({});
  const tooltipVisibility = ref({
    chart: false,
    chartInfo: false,
    infoTable: false,
  });
  const smartphone = isMobile();

  // Función para calcular la posición del tooltip
  function calculateTooltipPosition(e, config) {
    const x = e.clientX + config.padding;
    const y = e.clientY + config.padding;

    return {
      x: Math.max(
        x + config.width > window.innerWidth
          ? e.clientX - config.width - config.padding
          : x,
        config.padding
      ),
      y: Math.max(
        y + config.height > window.innerHeight
          ? e.clientY - config.height - config.padding
          : y,
        config.padding
      ),
    };
  }

  // Función para mostrar el tooltip con una configuración específica
  function displayTooltip(e, tipo, payload, config) {
    tooltipPosition.value = calculateTooltipPosition(e, config);
    params.value = payload;
    tooltipVisibility.value[tipo] = true;
  }

  // Función para ocultar el tooltip
  function hideTooltip(tipo) {
    //if(!smartphone){
      tooltipVisibility.value[tipo] = false;
    //}
  }

  // Exporta los datos y métodos necesarios
  return {
    tooltipPosition,
    params,
    tooltipVisibility,
    displayTooltip,
    hideTooltip,
  };
}
