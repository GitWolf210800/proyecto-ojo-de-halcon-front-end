// src/stores/authStore.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loginTrue: false,
  }),

  actions: {
    setUser(user) {
      this.user = user;
      this.loginTrue = true;
      localStorage.setItem("sesion", JSON.stringify(user));
    },

    clearUser() {
      this.user = null;
      this.loginTrue = false;
      localStorage.removeItem("sesion");
    },

    initFromStorage() {
      const sesion = localStorage.getItem("sesion");
      if (sesion) {
        this.user = JSON.parse(sesion);
        this.loginTrue = true;
      }
    },
  },
});