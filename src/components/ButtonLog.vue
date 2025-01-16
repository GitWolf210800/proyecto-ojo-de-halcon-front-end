<template>
    <LoginButtom @click = "clickLogin" v-if="!loginTrue" />
    <LogoutButtom v-else />
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue';
import LoginButtom from './icons/LoginButtom.vue';
import LogoutButtom from './icons/LogoutButtom.vue';
const loginTrue = ref(false);
const visibilityLogin = ref(null);
const session = localStorage.getItem('sesion') ? JSON.parse(localStorage.getItem('sesion')) : null;

if (session) loginTrue.value = true;

const clickLogin = () => {

if (!visibilityLogin.value){
  visibilityLogin.value = true;
} else {
  visibilityLogin.value = false;
}

};

console.log(session);
console.log(typeof session);

//watchEffect(()=>)

</script>

<style scoped>

</style>