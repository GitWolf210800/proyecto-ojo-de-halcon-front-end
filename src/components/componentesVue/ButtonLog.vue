<template>
    <LoginButtom @click="toggleLoginForm" v-if="!auth.loginTrue && !isInternetMode" />
  <LogoutButtom @click="logout" v-else-if="auth.loginTrue" />

  <p class="log__text" v-show="auth.loginTrue">
    {{ auth.user?.sexo === "MASCULINO" ? "BIENVENIDO!!" : "BIENVENIDA!!" }} {{ auth.user?.name }}
  </p>

  <div v-if="visibilityForm" class="login">
    <h1>Login Ojo de Halcón</h1>
    <form @submit.prevent="handleSubmit">
      <label for="username"><fa icon="user" /></label>
      <input v-model="form.legajo" id="username" type="text" placeholder="Legajo" required />

      <label for="password"><fa icon="lock" /></label>
      <input v-model="form.contraseña" id="password" type="password" placeholder="Password" required />

      <!--<a href="">¿Olvidaste tu Contraseña?</a>-->

      <p class="error" v-if="error">Error en Inicio de Sesión</p>
      <input type="submit" value="Ingresar" />
    </form>
  </div>
</template>

<script setup>
import LoginButtom from "@/components/icons/LoginButtom.vue";
import LogoutButtom from "@/components/icons/LogoutButtom.vue";
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useDataUserStore } from "@/stores/dataUserStore";

const server = import.meta.env.VITE_SERVER_API;
const accessMode = import.meta.env.VITE_ACCESS_MODE;
const isInternetMode = ref(accessMode === "internet");

const auth = useAuthStore(); // 🔹 Store global de sesión
const dataUser = useDataUserStore(); // tu store previa (si la usás para más datos)

// Inicializa sesión desde localStorage si existe
onMounted(() => {
  auth.initFromStorage();

  if (!auth.loginTrue && isInternetMode.value) {
    visibilityForm.value = true;
  }

  // Verificación periódica del token (cada 15 min)
  setInterval(verifyTokenPeriodically, 15 * 60 * 1000);
});

const visibilityForm = ref(false);
const error = ref(null);
const form = reactive({ legajo: "", contraseña: "" });

const toggleLoginForm = () => {
  visibilityForm.value = !visibilityForm.value;
};

const logout = async () => {
  try {
    await fetch(`${server}/api/logout`, { method: "GET", credentials: "include" });
  } catch {}
  auth.clearUser();
  dataUser.clearDataUser();
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

    if (!res.ok) throw new Error("Error en la solicitud");

    const data = await res.json();
    auth.setUser(data.usuario);
    dataUser.setDataUser(data.usuario);

    form.legajo = "";
    form.contraseña = "";
    visibilityForm.value = false;

  } catch (err) {
    console.error("Error:", err);
    error.value = true;
  }
};

// 🔍 Función que verifica si el token sigue siendo válido
async function verifyTokenPeriodically() {
  if (!auth.loginTrue) return;

  try {
    const res = await fetch(`${server}/api/verify-token`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (!data.valid) {
      console.warn("⚠️ Token expirado, sesión cerrada automáticamente");
      logout();
    }
  } catch (err) {
    console.error("Error verificando token:", err);
  }
}
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

@media (max-width: 480px) {
  .login {
    width: 90%;
    max-width: 320px; /* evita que crezca demasiado */
  }

  .login form input[type="password"],
  .login form input[type="text"] {
    width: calc(100% - 50px); /* respeta el espacio del label */
  }
}

/*.login form input {
    margin-bottom: 15px;
    padding: 10px;
  }*/
</style>
