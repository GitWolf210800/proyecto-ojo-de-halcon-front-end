<template>
    <LoginButtom @click="toggleLoginForm" v-if="!loginTrue" />
    <LogoutButtom @click="logout" v-else />
  
    <div v-if="visibilityForm" class="login">
      <h1>Login Ojo de Halcón</h1>
      <form @submit.prevent="handleSubmit">
        <label for="username">
          <fa icon="user"/>
        </label>
        <input v-model="form.legajo" id="username" type="text" placeholder="Legajo" required />
        <label for="password">
           <fa icon="lock"/> 
        </label>
        <input v-model="form.contraseña" id="password" type="password" placeholder="Password" required />
  
        <p class="error" v-if="error" id="error" >Error en Inicio de Sesión</p>
        <input type="submit" value="Ingresar" />
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import LoginButtom from './icons/LoginButtom.vue';
  import LogoutButtom from './icons/LogoutButtom.vue';
  
  const loginTrue = ref(false);
  const visibilityForm = ref(false);
  const error = ref(null);
  
  const form = reactive({
    legajo: '',
    contraseña: '',
  });
  
  const session = ref(!!localStorage.getItem('sesion'));
  if (session.value) loginTrue.value = true;
  
  const toggleLoginForm = () => {
    visibilityForm.value = !visibilityForm.value;
  };
  
  const logout = () => {
    //document.cookie = 'jwt=; path=/; Expires=thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('sesion');
    console.log(document.cookie);
    loginTrue.value = false;
  };
  
  const handleSubmit = async () => {
    error.value = null;
  
    const { legajo, contraseña,  } = form;
    if (!legajo || !contraseña) {
      error.value = true;
      return;
    }
  
    try {
      const res = await fetch('http://192.168.3.122:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user: legajo, password: contraseña }),
      });
  
      if (!res.ok) {
        error.value = 'Error en la solicitud';
        return;
      }
  
      const data = await res.json();
      localStorage.setItem('sesion', JSON.stringify(data.usuario));
      loginTrue.value = !!data.usuario.name;
      form.legajo = '';
      form.contraseña = '';
      visibilityForm.value = !loginTrue.value;
    } catch (err) {
      console.error('Error:', err);
      error.value = true;
    }
  };
  </script>
  
  <style scoped>
  .error {
    color: #ef0f0f;
    font-size: 0.9rem;
  }
  .login {
    width: 400px;
    background-color: #ffffff;
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column; /* Asegura que el título esté encima del formulario*/
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1600;
    overflow: hidden; /* Opcional: para asegurar que el contenido no se desborde */ 
  }
  .login h1 {
    text-align: center;
    color: #5b6574;
    font-size: 24px;
    padding: 20px 0;
    margin: 0;
    border-bottom: 1px solid #dee0e4;
    background-color: #f9f9f9 /* Fondo opcional para resaltar el título */;
    width: 100% /* Asegura que ocupe todo el ancho */;
  }
  .login form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 20px;
  }
  .login form label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    background-color: #1984bc;
    color: #ffffff;
  }
  .login form input[type="password"], .login form input[type="text"] {
    width: 310px;
    height: 50px;
    border: 1px solid #dee0e4;
    margin-bottom: 20px;
    padding: 0 15px;
  }
  .login form input[type="submit"] {
    width: 100%;
    padding: 15px;
    margin-top: 20px;
    background-color: #1984bc;
    border: 0;
    cursor: pointer;
    font-weight: bold;
    color: #ffffff;
    transition: background-color 0.2s;
  }
  .login form input[type="submit"]:hover {
    background-color: #1984bc;
    transition: background-color 0.2s;
  }

  /*.login form input {
    margin-bottom: 15px;
    padding: 10px;
  }*/
  </style>
  