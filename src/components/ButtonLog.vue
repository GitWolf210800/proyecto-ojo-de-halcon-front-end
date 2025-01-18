<template>
    <LoginButtom @click="toggleLoginForm" v-if="!loginTrue" />
    <LogoutButtom @click="logout" v-else />
  
    <div v-if="visibilityForm" class="login">
      <h1>Login Ojo de Halcón</h1>
      <form @submit.prevent="handleSubmit">
        <label for="username">
          <i class="fas fa-user"></i>
        </label>
        <input v-model="form.legajo" id="username" type="text" placeholder="Legajo" required />
        <label for="password">
          <i class="fas fa-lock"></i>
        </label>
        <input v-model="form.contraseña" id="password" type="password" placeholder="Password" required />
  
        <p class="error" v-if="error">Error en Inicio de Sesión</p>
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
    localStorage.removeItem('sesion');
    loginTrue.value = false;
  };
  
  const handleSubmit = async () => {
    error.value = null;
  
    const { legajo, contraseña } = form;
    if (!legajo || !contraseña) {
      error.value = 'Por favor, complete todos los campos';
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
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1600;
  }
  .login h1 {
    text-align: center;
    color: #5b6574;
    font-size: 24px;
    padding: 20px 0;
  }
  .login form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 0;
  }
  .login form input {
    margin-bottom: 15px;
    padding: 10px;
  }
  </style>
  