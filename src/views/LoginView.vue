<template>
    <div>
        <ButtonLog />
    </div>

    <div class="logo">
        <IconoOjodeHalcon />
    </div>
</template>

<script setup>
import ButtonLog from '@/components/componentesVue/ButtonLog.vue';
import IconoOjodeHalcon from '@/components/icons/IconoOjodeHalcon.vue';
</script>

<style scoped>
    .logo {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 10px;
    width: 15vw;
    max-width: 80px;
    height: auto;
  }
</style>
