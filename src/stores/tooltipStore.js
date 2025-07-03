import { defineStore } from 'pinia'

export const useTooltipStore = defineStore('tooltip', {
  state: () => ({
    status: true,
    visibility: {
      chart: false,
      chartInfo: false,
      infoTable: false
    },
    activeTooltipId: null,
  }),
  actions: {
    open(type, id = null) {
      this.visibility[type] = true;
      this.activeTooltipId = id;
    },
    close(type) {
      this.visibility[type] = false;
      this.activeTooltipId = null;
    },
    closeAll() {
      Object.keys(this.visibility).forEach(key => this.visibility[key] = false);
    }
  }
});
