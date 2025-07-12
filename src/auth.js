// src/auth.js
export function isAuthenticated() {
  return !!localStorage.getItem('sesion') // o como manejes la sesión
}