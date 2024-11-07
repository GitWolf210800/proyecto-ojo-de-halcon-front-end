import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Establece el valor base como la raíz del proyecto
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)) // Alias para simplificar las rutas de importación
    }
  },
  server: {
    host: '0.0.0.0', // Permite el acceso desde cualquier IP en la red local
    port: 3000       // Cambia el puerto si es necesario
  }
})

