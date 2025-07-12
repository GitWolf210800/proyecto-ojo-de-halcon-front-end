<template>
  <LoginButtom @click="toggleLoginForm" v-if="!loginTrue && !isInternetMode" />
  <LogoutButtom @click="logout" v-else />

  <p class="log__text" v-show="loginTrue">Bienvenido {{ nombreUsuario }}</p>

  <div v-if="visibilityForm" class="login">
    <h1>Login Ojo de Halcón</h1>
    <form @submit.prevent="handleSubmit">
      <label for="username">
        <fa icon="user" />
      </label>
      <input
        v-model="form.legajo"
        id="username"
        type="text"
        placeholder="Legajo"
        required
      />
      <label for="password">
        <fa icon="lock" />
      </label>
      <input
        v-model="form.contraseña"
        id="password"
        type="password"
        placeholder="Password"
        required
      />

      <p class="error" v-if="error" id="error">Error en Inicio de Sesión</p>
      <input type="submit" value="Ingresar" />
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import LoginButtom from "@/components/icons/LoginButtom.vue";
import LogoutButtom from "@/components/icons/LogoutButtom.vue";
import { useDataUserStore } from "@/stores/dataUserStore";

const server = import.meta.env.VITE_SERVER_API;
const accessMode = import.meta.env.VITE_ACCESS_MODE;
const isInternetMode = accessMode === 'internet';

const loginTrue = ref(false);
const nombreUsuario = ref("");
const visibilityForm = ref(false);
const error = ref(null);

const form = reactive({
  legajo: "",
  contraseña: "",
});

const sesion = ref(!!localStorage.getItem("sesion"));
if (sesion.value) {
  loginTrue.value = true;
  const sesionData = ref(JSON.parse(localStorage.getItem("sesion")));
  nombreUsuario.value = sesionData.value.name;
}

if (!sesion.value && isInternetMode){
  visibilityForm.value = true;
}

const toggleLoginForm = () => {
  visibilityForm.value = !visibilityForm.value;
};

const logout = async () => {
  const userData = useDataUserStore();
  await fetch(`${server}/api/logout`, {
    method: 'GET',
    credentials: 'include'
  });

  userData.dataUser = null;
  localStorage.removeItem("sesion");
  nombreUsuario.value = "";
  loginTrue.value = false;
  // ⚡️ Redirección o recarga según modo
  if (isInternetMode) {
    window.location.href = "/"; // recarga toda la app en modo internet
  }
};

const handleSubmit = async () => {
  error.value = null;
  const { legajo, contraseña } = form;

  if (!legajo || !contraseña) {
    error.value = true;
    return;
  }

  try {
    const res = await fetch(`${server}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ user: legajo, password: contraseña }),
    });

    if (!res.ok) {
      error.value = "Error en la solicitud";
      return;
    }

    const data = await res.json();

    localStorage.setItem("sesion", JSON.stringify(data.usuario));
    loginTrue.value = !!data.usuario.name;
    nombreUsuario.value = data.usuario.name;

    const userData = useDataUserStore();
    userData.setDataUser(data.usuario);

    form.legajo = "";
    form.contraseña = "";
    visibilityForm.value = !loginTrue.value;

    // ⚡️ Redirección o recarga según modo
    if (isInternetMode) {
      window.location.href = "/"; // recarga toda la app en modo internet
    }

  } catch (err) {
    console.error("Error:", err);
    error.value = true;
  }
};
</script>


<style scoped>
.log__text {
  color: #fff;
  margin: 0%;
}

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
.login form input[type="password"],
.login form input[type="text"] {
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
