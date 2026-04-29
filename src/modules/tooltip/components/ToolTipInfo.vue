<template>
<div 
    v-show="tooltip.visibility.info"
    class="tooltipInfo"
    :style="{ left: `${position.x}px`, top: `${position.y}px` }"
>
    <div class="info">
        <span>{{ data }}</span>
    </div>
</div>
</template>

<script setup>
import { useTooltipStore } from '@/stores/tooltipStore';
import { watch, ref } from 'vue';

const props = defineProps({
    position:Object,
    parametros:Object
});

const tooltip = useTooltipStore();
const data = ref("Sin Datos");

watch(
   ()=> tooltip.visibility.info,
   (visible) => {
        if(visible) data.value = props.parametros;
        else data.value = 'Sin Datos...'; 
   },
   {immediate: true}
);
</script>

<style scoped>
.tooltipInfo {
  background-color: #3b3b3b;
  color: #f0f0f0;
  text-align: justify;
  position: fixed;
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 10px;
  z-index: 1555;
  margin: 0 auto;
  max-width: 200px;
}

.offline {
  font-size: 20px;
}

.info {
  width: 100%;
  max-height: 330px;
  font-size: 14px;
}

.measurement {
  font-size: 12px;
}

.limits {
  font-size: 11px;
  margin-bottom: 2px;
  border-top: 1px solid dashed #aaa;
}

.limit {
  margin-right: 1em;
}

.close__button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff5c5c;
  color: #fff;
  border: none;
  width: 60px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
}
</style>