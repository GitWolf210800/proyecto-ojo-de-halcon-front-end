<template>
  <g-gantt-chart
    :chart-start="chartStart"
    :chart-end="chartEnd"
    precision="hour"
    bar-start="beginDate"
    bar-end="endDate"
  >
    <g-gantt-row label="My row 1" :bars="row1BarList" />
  </g-gantt-chart>
</template>

<script setup>
import { ref } from "vue"

const chartStart = ref("2021-07-12 12:00");
const chartEnd = ref("2021-07-14 12:00");

const row1BarList = ref([
  {
    beginDate: "2021-07-13 13:00",
    endDate: "2021-07-13 19:00",
    ganttBarConfig: {
      // each bar must have a nested ganttBarConfig object ...
      id: "unique-id-1", // ... and a unique "id" property
      label: "Lorem ipsum dolor",
      style: {
        // arbitrary CSS styling for your bar
        background: "#333fff",
        borderRadius: "20px",
        color: "white"
      }
    }
  },
  {
    beginDate: "2021-07-13 19:00",
    endDate: "2021-07-14 02:00",
    ganttBarConfig: {
      id: "another-unique-id-2",
      hasHandles: true,
      label: "Hey, look at me",
      style: {
        // arbitrary CSS styling for your bar
        background: "#e09b69",
        borderRadius: "20px",
        color: "black"
      }
    }
  }
])
/*const row2BarList = ref([
  {
    beginDate: "2021-07-13 00:00",
    endDate: "2021-07-14 02:00",
    ganttBarConfig: {
      id: "another-unique-id-2",
      hasHandles: true,
      label: "Hey, look at me",
      style: {
        // arbitrary CSS styling for your bar
        background: "#e09b69",
        borderRadius: "20px",
        color: "black"
      }
    }
  }
])*/
</script>