<template>
    <nav>
      <div class="navegacion">
        <span class="version" id="version">Ojo de Halcón V3.7</span>
        <LoginButtom class="login-buttom" @click = "clickLogin" />
      </div>
    </nav>
  
    <body>

    <div class="menu">
      <RouterLink to="/clima">
        <ClimaFabrica class="botones" />
      </RouterLink>

      <MantenimientoFabrica class="botones" />

      <ProduccionFabrica class="botones" />

    </div>

      <Login v-if="visibilityLogin" />
    
    </body>
  
    <div class="logo">
      <IconoOjodeHalcon />
    </div>
  </template>
  
  <script setup>
  //import { RouterLink } from 'vue-router';
  import { ref } from 'vue';
  import LoginButtom from '@/components/icons/LoginButtom.vue';
  import Login from '@/components/Login.vue';
  import HomeButtom from '@/components/icons/HomeButtom.vue';
  import IconoOjodeHalcon from '@/components/icons/IconoOjodeHalcon.vue';
  import ClimaFabrica from '@/components/icons/ClimaFabrica.vue';
  import MantenimientoFabrica from '@/components/icons/MantenimientoFabrica.vue';
  import ProduccionFabrica from '@/components/icons/ProduccionFabrica.vue';

  const visibilityLogin = ref(null);

  const clickLogin = () => {

    if (!visibilityLogin.value){
      visibilityLogin.value = true;
    } else {
      visibilityLogin.value = false;
    }
  
  }

  </script>
  
  <style scoped>
  /* Estilo general de navegación */
  .navegacion {
    display: flex;
    margin: 10px;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .version {
    color: #FFF;
    padding: 5px;
  }
  
  .login-buttom {
    display: inline-block;
  }
  
  /* Ajuste del logo */
  .logo {
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 10px;
    width: 15vw;
    max-width: 80px;
    height: auto;
  }
  
  /* Menú de opciones */
  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    flex-wrap: wrap;
  }
  
  /* Estilos responsivos para pantallas pequeñas */
  @media (max-width: 768px) {
    .navegacion {
      flex-direction: column;
      align-items: center;
    }
  
    .menu {
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      width: 100%;
      height: 30vh;
      border: 10px;
    }
  
    .logo {
      width: 50%;
      margin-top: 10px;
    }
  
    .version {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .version {
      font-size: 12px;
    }
  
    .logo {
      width: 70%;
      height: auto;
    }
  }
  </style>
  