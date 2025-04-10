import { defineStore } from "pinia";
import { ref } from "vue";

export const useDataUserStore = defineStore('dataUserStore', () => {
  const dataUser = ref(null);

  const setDataUser = (dataUserElement) => {
    dataUser.value = dataUserElement;

    // Guardar el tiempo de expiración (24hs desde ahora)
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24hs en ms
    localStorage.setItem('dataUserExpiresAt', expiresAt);
  };

  const clearDataUser = () => {
    dataUser.value = null;
    localStorage.removeItem('dataUserExpiresAt');
  };

  const restoreExpiration = () => {
    const expiresAt = localStorage.getItem('dataUserExpiresAt');
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
      clearDataUser();
    }
  };

  // Restaurar expiración automáticamente al cargar la store
  restoreExpiration();

  return {
    dataUser,
    setDataUser,
    clearDataUser,
  };
}, { persist: true });
