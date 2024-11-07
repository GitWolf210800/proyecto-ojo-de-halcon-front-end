<template>

    <nav>
        <LoginButtom class="login" />
    </nav>

    <div class="menu">
        <RouterLink to="/clima"> <ClimaFabrica /> </RouterLink>
    </div> 

</template>

<script setup>
//import { RouterLink } from 'vue-router';
import LoginButtom from '@/components/icons/LoginButtom.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';

</script>

<style>
body {
    background-color: #282c34;
}

nav{
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
}

.login{
    display: inline-block;
    margin-right: 2px;
}

.menu {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

</style>