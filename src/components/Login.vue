<template>
    <div class="login">
        <!--<button class="close__button" @click="closeTooltip"></button>-->
        <h1>Login Ojo de Halcon</h1>
        <form @submit.prevent="">
            <label for="username">
                <i class=" fas fa-user"></i>
            </label>
            <input v-model="legajo" type="number" placeholder="Legajo" required>
            <input v-model="password" type="password" placeholder="Password" required>
            <button type="submit"> Enviar </button>
    </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const legajo = ref('');
const password = ref('');

//const closeTooltip = () => visibilityLogin.value = false;

/*const handleSubmit = () => {
    
};*/

</script>

<style scoped>
/*body {
    
}*/

.login{
    width: 400px;
    background-color: #ffffff;
    box-shadow: 0 0 9px 0 rgba(0, 0, 0, 0.3);
    margin: 100px auto;
    /*background: linear-gradient(to top, rgba(30, 48, 85, 0.9) 20%, rgba(47, 61, 90, 0) 65%);*/
    display: flex;
    position: fixed;
   /* width: 300px;
    height: 600px;*/
    z-index: 1600;
}
.login h1 {
    text-align: center;
    color: #5b6574;
    font-size: 24px;
    padding: 20px 0 20px 0;
    border-bottom: 1px solid #dee0e4;
}

.login a {
    text-align: center;
    color: #5b6574;
    font-size: 24px;
    padding: 20px 0 20px 0;
    border-bottom: 1px solid #dee0e4;
}
.login form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 20px;
}
/*
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
}*/


.form-content{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    align-items: center;
}

.close__button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #ff5c5c;
  color: #fff;
  border: none;
  /* border-radius: 50%;*/
  width: 60px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
}




</style>