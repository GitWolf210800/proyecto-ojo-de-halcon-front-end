<template>
  <Teleport to="body">
    <dialog ref="dialog" aria-labelledby="unlock-history-title" @close="emit('close')" @cancel.prevent="emit('close')">
      <header>
        <h2 id="unlock-history-title">Historial de desbloqueos de cardas</h2>
        <button type="button" autofocus @click="emit('close')">Cerrar</button>
      </header>
      <div class="actions">
        <button type="button" :disabled="loading" @click="load(page)">Actualizar</button>
        <span aria-live="polite">{{ loading ? 'Cargando historial…' : `${total} registros` }}</span>
      </div>
      <p v-if="error" role="alert">{{ error }}</p>
      <div class="table-scroll" :aria-busy="loading" tabindex="0" role="region" aria-label="Historial de desbloqueos">
        <table>
          <thead><tr><th scope="col">Fecha y hora</th><th scope="col">ID de desbloqueo</th><th scope="col">Legajo</th><th scope="col">Nombre y apellido</th><th scope="col">Máquina o máquinas</th></tr></thead>
          <tbody>
            <tr v-for="item in items" :key="item.id_desbloqueo">
              <td>{{ formatDate(item.fecha) }}</td><td>{{ item.id_desbloqueo }}</td><td>{{ item.id_legajo }}</td>
              <td>{{ item.nombre && item.apellido ? `${item.nombre} ${item.apellido}` : 'Usuario no disponible' }}</td>
              <td class="machines">{{ item.maquinas }}</td>
            </tr>
            <tr v-if="!loading && !error && !items.length"><td colspan="5">Sin registros de desbloqueos.</td></tr>
          </tbody>
        </table>
      </div>
      <nav aria-label="Paginación del historial">
        <button type="button" :disabled="loading || page <= 1" @click="load(page - 1)">Anterior</button>
        <span>Página {{ page }} de {{ Math.max(totalPages, 1) }}</span>
        <button type="button" :disabled="loading || page >= totalPages" @click="load(page + 1)">Siguiente</button>
      </nav>
    </dialog>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
const emit = defineEmits(['close']);
const dialog = ref(null);
const items = ref([]);
const page = ref(1);
const total = ref(0);
const totalPages = ref(0);
const loading = ref(false);
const error = ref('');
const baseUrl = String(import.meta.env.VITE_SERVER_API || '').replace(/\/$/, '');
const formatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires', dateStyle: 'short', timeStyle: 'medium',
});
let controller;
let previousFocus;
let previousBodyOverflow;
function formatDate(value) {
  if (!value) return 'Fecha no disponible';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : formatter.format(date);
}
async function load(targetPage) {
  controller?.abort();
  controller = new AbortController();
  loading.value = true;
  error.value = '';
  try {
    const response = await fetch(`${baseUrl}/api/historial-desbloqueo-cardas?page=${targetPage}&pageSize=25`, {
      credentials: 'include', signal: controller.signal,
    });
    if (!response.ok) throw new Error(response.status === 401
      ? 'Iniciá sesión para consultar el historial.' : 'No se pudo cargar el historial. Intentá actualizar.');
    const data = await response.json();
    items.value = data.items;
    page.value = data.pagination.page;
    total.value = data.pagination.total;
    totalPages.value = data.pagination.totalPages;
  } catch (err) {
    if (err.name !== 'AbortError') {
      items.value = [];
      error.value = err instanceof TypeError ? 'No se pudo conectar con el servidor.' : err.message;
    }
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  previousFocus = document.activeElement;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialog.value.showModal();
  load(1);
});
onBeforeUnmount(() => {
  controller?.abort();
  dialog.value?.close();
  document.body.style.overflow = previousBodyOverflow;
  previousFocus?.focus();
});
</script>

<style scoped>
dialog { position: fixed; inset: 0; margin: auto; z-index: 2001; overflow: auto; overscroll-behavior: contain; touch-action: pan-x pan-y; width: min(1100px, 94vw); max-height: 88vh; box-sizing: border-box; border: 0; border-radius: 12px; padding: 24px; color: #222; background: #fff; box-shadow: 0 10px 40px #0005; }
dialog::backdrop { position: fixed; inset: 0; z-index: 2000; background: #0008; }
header, .actions, nav { display: flex; align-items: center; gap: 16px; justify-content: space-between; flex-wrap: wrap; }
/* Keep the global fixed navbar rules out of the dialog pagination. */
dialog nav { position: static; inset: auto; width: auto; height: auto; padding: 0; z-index: auto; background: none; box-shadow: none; }
dialog nav > * { margin: 0; }
h2 { font-size: 1.3rem; margin: 0; }
.actions, nav { margin-top: 20px; }
.table-scroll { overflow: auto; max-height: 56vh; overscroll-behavior: contain; touch-action: pan-x pan-y; margin-top: 16px; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th, td { padding: 12px; border-bottom: 1px solid #ddd; }
th { background: #f0f3f5; }
.machines { white-space: pre-wrap; overflow-wrap: anywhere; min-width: 130px; }
button { font: inherit; padding: 8px 14px; border: 1px solid #aaa; border-radius: 6px; background: #f4f4f4; cursor: pointer; }
button:disabled { opacity: .5; cursor: default; }
button:focus-visible { outline: 3px solid #2376ab; outline-offset: 2px; }
@media (max-width: 600px) { dialog { padding: 16px; } th, td { padding: 8px; } }
</style>
