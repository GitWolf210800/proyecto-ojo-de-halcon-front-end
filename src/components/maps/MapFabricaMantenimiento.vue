<template>
    <div class="content" v-zoom>
        <MapMantenimiento ref="mapMantenimientoRef" class="container__map" />
    </div>

</template>

<script setup>
import { ref } from 'vue';
import MapMantenimiento from './MapMantenimiento.vue';

const mapMantenimientoRef = ref(null);
</script>

<style scoped>
body {
    background-color: #282c34;
}

.container__map {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    width: 100%;
    z-index: 0;
}
</style>