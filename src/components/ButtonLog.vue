<template>
    <LoginButtom v-if="!loginTrue" />
    <LogoutButtom v-else />
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import LoginButtom from './icons/LoginButtom.vue';
import LogoutButtom from './icons/LogoutButtom.vue';
const loginTrue = ref(false);
const session = localStorage.getItem('sesion') ? JSON.parse(localStorage.getItem('sesion')) : null;

if (session) loginTrue.value = true;

console.log(session);
console.log(typeof session);

//watchEffect(()=>)

</script>

<style scoped>

</style>