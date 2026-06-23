<template>
  <div class="content" v-zoom>
      <Map_Sala_fab9_atlas 
          class="container__map"
          ref="mapSala"
          v-if="fab9SalaCompresor && !loading"
      />

      <Map_Sala_fab3_atlas 
        class="container__map"
        ref="mapSala"
        v-if="fab3SalaAtlasCompresor && !loading"
      />

      <Map_Sala_fab4_atlas 
        class="container__map"
        ref="mapSala"
        v-if="fab4SalaAtlasCompresor && !loading"
      />

      <Map_Sala_fab6_atlas 
        class="container__map"
        ref="mapSala"
        v-if="fab6SalaAtlasCompresor && !loading"
      />

      <Map_Sala_fab1_atlas 
        class="container__map"
        ref="mapSala"
        v-if="fab1SalaAtlasCompresor && !loading"
      />
  </div>

  <ToolTipChartBar 
        :position="tooltipPosition"
        :parametros="params"
        v-if="tooltip.visibility.chartBar"
    />
</template>

<script setup>

import { ref, onMounted, onUnmounted, watchEffect } from 'vue';
import Map_Sala_fab9_atlas from '../salas_compresores/Map_Sala_fab9_atlas.vue';
import Map_Sala_fab1_atlas from '../salas_compresores/Map_Sala_fab1_atlas.vue';
import Map_Sala_fab3_atlas from '../salas_compresores/Map_Sala_fab3_atlas.vue';
import Map_Sala_fab4_atlas from '../salas_compresores/Map_Sala_fab4_atlas.vue';
import Map_Sala_fab6_atlas from '../salas_compresores/Map_Sala_fab6_atlas.vue';
import { useRoute } from 'vue-router';
import axios from "axios";

import ToolTipChart from '@/modules/tooltip/components/ToolTipChart.vue';
import ToolTipChartBar from "@/modules/tooltip/components/ToolTipChartBar.vue";
import {
  TOOLTIP_CHART_CONFIG,
  TOOLTIP_INFO_TABLE,
} from "@/variables";
import { useTooltipStore } from '@/stores/tooltipStore';
import { useTooltip } from "@/modules/tooltip/utils/useTooltip";
import { createTooltipConfig } from '@/funciones';

import { alarmColor, alertColor, averia, descarga, offlineColor, okColor, paroManual } from "@/variables";


const tooltip = useTooltipStore();
const {
  tooltipPosition,
  params,
  tooltipVisibility,
  displayTooltip,
  hideTooltip,
} = useTooltip();

const estadoColors = {
    "CARGA": okColor,
    "OK": okColor,
    "ESPERA": okColor,
    "MARCHA": okColor,
    "PARO": paroManual,
    "PARO-MANUAL": paroManual,
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

// Función de carga inicial y sincronización de datos
let intervalId;

const mapSala = ref(null);
const loading = ref(null);
const route = useRoute();
loading.value = true;

const fab9SalaCompresor = ref(null);
const fab3SalaAtlasCompresor = ref(null);
const fab4SalaAtlasCompresor = ref(null);
const fab6SalaAtlasCompresor = ref(null);
const fab1SalaAtlasCompresor = ref(null);

const serverNodeREd = import.meta.env.VITE_SERVER_NODE_RED;
const parametros = route.query;
const result = Object.values(parametros).join("");
const partes = result.split('_');
partes.pop();
const instalacionFisica = partes.join('_');

const datos = ref(null);
const datosGral = ref(null);
let svg = null;

const updateOpciones = () => {

  if(result === 'fab9_atlas_sala_compresor') fab9SalaCompresor.value = true;
  else fab9SalaCompresor.value = false;

  if(result === 'fab1_atlas_sala_compresor') fab1SalaAtlasCompresor.value = true;
  else fab1SalaAtlasCompresor.value = false;

  if(result === 'fab3_atlas_sala_compresor') fab3SalaAtlasCompresor.value = true;
  else fab3SalaAtlasCompresor.value = false;

  if(result === 'fab4_atlas_sala_compresor') fab4SalaAtlasCompresor.value = true;
  else fab4SalaAtlasCompresor.value = false;

  if(result === 'fab6_atlas_sala_compresor') fab6SalaAtlasCompresor.value = true;
  else fab6SalaAtlasCompresor.value = false; 

  //console.log(fab3SalaAtlasCompresor.value);
};

const applyColor = (element, color) => {
    if (!element) return;

    element.querySelectorAll('*').forEach(el => {
        el.style.fill = color;
    });
};

const applyColorStroke = (element, color) => {
  if (!element) return;

  [element, ...element.querySelectorAll('*')].forEach(el => {
    el.style.stroke = color;
  });
};

const applyColorText = (element, color) => {
        //console.log(element);
        if (element) element.style.fill = color;
        //if(color === '#FFFFFF') element.style.stroke = '#000';
    };

async function fetchData() {
    try {
        const lastIndex = result.lastIndexOf('_');
        const dato = result.substring(0, lastIndex);
        const response = await axios.get(`${serverNodeREd}/salaCompresorNow`, {
            params: { sala: result },
        });
        if (response.data) {
            //mediciones = response.data.mediciones;
            datos.value = response.data;
            datosGral.value = response.data;
            //console.log(response.data);
            loading.value = false;
        }
    } catch (error) {
        console.error('Error fetching Sala Compresor Data: ', error);
        loading.value = false;
    }
};

function interactWithSVG(svg) {
  if(mapSala.value && mapSala.value.svgRef){
    const datosOn = datos.value;
    const compresoresSala = datosOn.compresoresSala;
    const secadoresIndependientes = datosOn.secadoresIndependientes;
    const secadoresAsociados = datosOn.secadoresAsociados;

    if(compresoresSala.length !== 0){
      compresoresSala.forEach(objeto => {
        const compresor = svg.querySelector(`#${objeto.nombre}_icon`);
        const secadorIntegrado = svg.querySelector(`#${objeto.nombre}_secador_integrado`);
        //console.log(compresor);
        if(compresor){
          applyColorStroke(compresor, estadoColors[objeto.estado_compresor] || offlineColor);
        }

        if(secadorIntegrado){
          applyColorStroke(secadorIntegrado, estadoColors[objeto.estado_secador] || offlineColor);
        }
      });
    }

    if(secadoresIndependientes.length !== 0){
      secadoresIndependientes.forEach(objeto => {
        const secador = svg.querySelector(`#${objeto.nombre}`);

        if(secador){
          applyColorStroke(secador, estadoColors[objeto.estado_secador] || offlineColor);
        }
      });
    }

    if(secadoresAsociados.length !== 0){
      secadoresAsociados.forEach(objeto => {
          const dato = objeto.secador;

          const secador = svg.querySelector(`#${dato.nombre}`);

          if(secador) applyColorStroke(secador, estadoColors[dato.estado_secador] || offlineColor);
        }
      )
    }
  }
};

function initializeTooltipEvents() {
  const svg = mapSala.value.svgRef;
  const tooltipConfigs = [
      ...datos.value.compresoresSala.map((dato) => 
          createTooltipConfig(
            `#${dato.nombre}`,
            'chartBar',
            { nombre: dato.nombre, medicion: 'estado_compresor', tabla: 'mediciones_compresores' },
            TOOLTIP_CHART_CONFIG
          )
      ),

      ...datos.value.compresoresSala.map((dato) => 
          createTooltipConfig(
            `#${dato.nombre}_secador_integrado`,
            'chartBar',
            { nombre: dato.nombre, medicion: 'estado_secador', tabla: 'mediciones_compresores' },
            TOOLTIP_CHART_CONFIG
          )
      ),

      ... datos.value.secadoresIndependientes.map((dato) =>
        createTooltipConfig(
          `#${dato.nombre}`,
          'chartBar',
          { nombre: dato.nombre, medicion: 'estado_secador', tabla: 'mediciones_secadores' },
          TOOLTIP_CHART_CONFIG
        )
    ),
    ... datos.value.secadoresAsociados.map((dato) =>
        createTooltipConfig(
          `#${dato.secador.nombre}`,
          'chartBar',
          { nombre: dato.secador.nombre, medicion: 'estado_secador', tabla: 'mediciones_secadores' },
          TOOLTIP_CHART_CONFIG
        )
    )
  ];

  tooltipConfigs.forEach(({ selector, tooltipType, payload, config }) => {
        const element = svg.querySelector(selector);
        //console.log(element);
        if(element){
            element.addEventListener('mouseover', (e) =>
                displayTooltip(e, tooltipType, payload, config)
            );
            element.addEventListener('mouseleave', () => hideTooltip(tooltipType));
        }
    } );

};

onMounted(async () => {
  await fetchData();

  intervalId = setInterval(() => {
    fetchData();
  }, 1000); // Actualización cada 10 segundos
});

onUnmounted(() => {
  clearInterval(intervalId); // Limpieza del intervalo al desmontar el componente
});

watchEffect(updateOpciones);

watchEffect (() => {
  if(datosGral.value && mapSala.value){
    svg = mapSala.value.svgRef;
    interactWithSVG(svg);
    initializeTooltipEvents();
  }
});


</script>

<style scoped>
  .loading {
    color: #fff;
    display: flex;
  }

  .container__map {
    padding-top: 4vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
  }
</style>