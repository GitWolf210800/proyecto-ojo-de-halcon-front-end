// src/stores/tooltipStore.js
import { defineStore } from 'pinia'

export const useTooltipStore = defineStore('tooltip', {
  state: () => ({
    chartVisible: true
  }),
  actions: {
    openChart() {
      this.chartVisible = true
    },
    closeChart() {
      this.chartVisible = false
    },
    toggleChart() {
      this.chartVisible = !this.chartVisible
    }
  }
})
