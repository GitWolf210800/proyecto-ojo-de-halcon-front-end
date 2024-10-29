<template>
    <div
      class="tooltip"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    >
      <Line :data="data" :options="options" />
    </div>
  </template>
  
  <script>
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  } from 'chart.js'
  import { Line } from 'vue-chartjs'
  import * as chartConfig from './chartConfig.js'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )
  
  export default {
    name: 'ToolTipChart',
    components: {
      Line
    },
    props: {
      position: {
        type: Object,
        required: true
      }
    },
    data() {
      return chartConfig
    }
  }
  </script>
  
  <style scoped>
  .tooltip {
    background-color: #626262;
    color: #f0f0f0;
    text-align: justify;
    position: fixed;
    border: 1px solid #ccc;
    border-radius: 7px;
    padding: 10px;
    z-index: 555;
    width: 500px;
    height: 255px;
  }
  </style>
  