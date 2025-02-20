<template>
    <div class="navbar">
        <div class="navbar__navegacion">
            <RouterLink to="/"> <HomeButtom class="botones__navegacion" /> </RouterLink>
        </div>
        <ClimaExterior />
        <div class="logControl">
          <ButtonLog />
          
        </div>
    </div>
</template>

<script setup>
//import { RouterLink } from 'vue-router';
import ButtonLog from '@/components/ButtonLog.vue';
import HomeButtom from '@/components/icons/HomeButtom.vue';
import ClimaExterior from '@/components/ClimaExterior.vue';

</script>

<style scoped>

.logControl__text {
  color: #FFF;
  margin: 0%;
}

.navbar {
  padding-top: 0px;
  display: flex;
  justify-content: space-between;
}



.botones__navegacion {
  display: inline;
  margin: .5px;
  width: 6.5vw;
  height: 6.5vh;
}

.login-buttom {
    display: inline-block;
  }
</style>