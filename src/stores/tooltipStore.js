import { defineStore } from 'pinia'

export const useTooltipStore = defineStore('tooltip', {
  state: () => ({
    visibility: {
      chart: false,
      chartInfo: false,
      infoTable: false
    }
  }),
  actions: {
    open(type) {
      this.visibility[type] = true;
    },
    close(type) {
      this.visibility[type] = false;
    },
    closeAll() {
      Object.keys(this.visibility).forEach(key => this.visibility[key] = false);
    }
  }
});
