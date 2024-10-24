import { defineStore } from "pinia";
import { ref } from "vue";

export const useSvgStore = defineStore('svgStore', ()=> {
    const svgRef = ref(null); //Aqui se almacena la referencia del SVG

    const setSvgRef = (svgElement) => {
        svgRef.value = svgElement;
    };

    return {
        svgRef,
        setSvgRef
    };
});