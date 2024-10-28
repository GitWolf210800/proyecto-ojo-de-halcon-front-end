<template>
    <div class="tooltip">
        <Line :data="data" :options="options" />
    </div>
</template>

<script >
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
import * as chartConfig from './chartConfig.js' // Asegúrate de que chartConfig esté exportado de forma predeterminada o usa `* as`

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
  name: 'App',
  components: {
    Line
  },
  data() {
    return chartConfig
  }
}

</script>

<style scoped>
    .tooltip{
        background-color: #626262;
        color: #f0f0f0;
        text-align: justify;
        /*justify-content: center;*/
        position: fixed;
        border: 1px solid #ccc;
        border-radius: 7px;
        padding: 10px;
        z-index: 555;
        margin: 0 auto;
        width: 500px;
        height: 255px;
    }
</style>