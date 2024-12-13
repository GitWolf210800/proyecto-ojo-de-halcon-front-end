<template>
  <svg
    ref="svgRef"
    width="99.377686mm"
    height="6.7910357mm"
    viewBox="0 0 99.377684 6.7910356"
    version="1.1"
    id="svg167313"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
  >
    <defs id="defs167310">
      <rect
        x="309.71277"
        y="272.94321"
        width="178.09976"
        height="15.996286"
        id="rect43-5"
      />
    </defs>
    <g
      id="layer1"
      transform="matrix(0.64359744,0,0,0.75611351,-13.402912,-8.0202135)"
    >
      <text
        xml:space="preserve"
        transform="matrix(0.8729098,0,0,0.73742132,-249.68931,-191.90058)"
        id="nombre"
        style="
          font-style: normal;
          font-variant: normal;
          font-weight: bold;
          font-stretch: normal;
          font-size: 12px;
          font-family: sans-serif;
          -inkscape-font-specification: 'sans-serif, Bold';
          font-variant-ligatures: normal;
          font-variant-caps: normal;
          font-variant-numeric: normal;
          font-variant-east-asian: normal;
          white-space: pre;
          shape-inside: url(#rect43-5);
          display: inline;
          fill: #ffffff;
          stroke: #2f2f2f;
          stroke-width: 0.107203;
          stroke-dasharray: none;
          stroke-opacity: 1;
        "
      >
        <tspan x="309.71289" y="283.86186" id="titulo_instalacion">
          Título Instalagión Instalagión
        </tspan>
      </text>
    </g>
  </svg>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const svgRef = ref(null);
const props = defineProps({
  instalacion: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  svgRef.value.querySelector("#titulo_instalacion").textContent =
    props.instalacion;
});
</script>
