<template>
  <button @click="changeRectColor">Cambiar color del rectángulo</button>
</template>

<script setup>
import { useSvgStore } from '@/stores/svgStore';
import { useDataStore } from '@/stores/dataHome';

const svgStore = useSvgStore();
const storeData = useDataStore();

/*const loadData = () => {
  storeData.fetchData();
  console.log(storeData);
};*/
/*while (storeData.data.length === 0){
  console.log('esperando');
}*/

console.log(storeData.data);

const changeRectColor = () => {
  
  const rect = svgStore.svgRef.querySelector('#fab1_preparacion_clima_temp_color');
  if (rect) {
    rect.style.fill = 'blue';
  }
  
  return {
  changeRectColor,
  };
};

    
</script>
