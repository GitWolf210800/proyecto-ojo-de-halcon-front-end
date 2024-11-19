<template>

    <head>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.1/css/all.css">

    </head>

    <div class="login">
        <!--<button class="close__button" @click="closeTooltip"></button>-->
        <h1>Login Ojo de Halcon</h1>
        <form @submit.prevent="">
            <label for="username">
                <i class=" fas fa-user"></i>
            </label>
            <input v-model="legajo" type="text" placeholder="Legajo" required>
            <label for="password">
                <i class="fas fa-lock"></i>
            </label>
            <input v-model="password" type="password" placeholder="Password" required>
            <input type="submit" value="Ingresar">
        </form>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const legajo = ref('');
const password = ref('');

//onMounted(() => document.title = 'Ojo de Halcon - login' );

//const closeTooltip = () => visibilityLogin.value = false;

/*const handleSubmit = () => {
    
};*/

</script>

<style scoped>

.login {
    width: 400px;
    background-color: #ffffff;
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column; /* Asegura que el título esté encima del formulario */
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
    background-color: #f9f9f9; /* Fondo opcional para resaltar el título */
    width: 100%; /* Asegura que ocupe todo el ancho */
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

.close__button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff5c5c;
  color: #fff;
  border: none;
  width: 60px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
}

</style>