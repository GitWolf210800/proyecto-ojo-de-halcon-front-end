<template>
  <transition name="fade">
    <div v-if="confirmStore.isOpen" class="overlay">

      <transition name="scale">
        <div class="dialog">

          <!-- Título opcional -->
          <h3 v-if="confirmStore.title" class="title">
            {{ confirmStore.title }}
          </h3>

          <!-- Mensaje -->
          <p class="message">
            {{ confirmStore.message }}
          </p>

          <!-- Botones -->
          <div class="actions">
            <button class="btn cancel" @click="confirmStore.cancel()">
              Cancelar
            </button>

            <button class="btn confirm" @click="confirmStore.confirm()">
              Confirmar
            </button>
          </div>

        </div>
      </transition>

    </div>
  </transition>
</template>

<script setup>
import { useConfirmStore } from "@/stores/useConfirmStore"
const confirmStore = useConfirmStore()
</script>

<style scoped>
/* Fondo oscuro */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;
}

/* Caja del diálogo */
.dialog {
  background: white;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 400px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}

/* Título */
.title {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
}

/* Mensaje */
.message {
  text-align: center;
  margin-bottom: 20px;
  font-size: 15px;
}

/* Botones */
.actions {
  display: flex;
  gap: 10px;
}

/* Botones base */
.btn {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
}

/* Cancelar */
.cancel {
  background: #e0e0e0;
}

/* Confirmar */
.confirm {
  background: #e53935;
  color: white;
}

/* Animación fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animación scale */
.scale-enter-active {
  transition: transform 0.2s ease;
}

.scale-enter-from {
  transform: scale(0.9);
}

/* 📱 Mobile */
@media (max-width: 400px) {
  .dialog {
    padding: 16px;
  }

  .message {
    font-size: 14px;
  }
}
</style>