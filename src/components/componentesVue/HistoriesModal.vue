<template>
  <Teleport to="body">
    <dialog ref="dialog" aria-labelledby="histories-title" @cancel.prevent="emit('close')" @close="emit('close')">
      <header>
        <svg class="mark" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="9" width="38" height="34" rx="4"/><path d="M5 18h38M15 5v9M33 5v9M11 35l8-9 7 5 10-9"/>
        </svg>
        <div><div class="title"><h2 id="histories-title">Históricos</h2><span>Clima</span></div><p>Consulta y análisis de mediciones</p></div>
        <button autofocus aria-label="Cerrar" title="Cerrar" @click="emit('close')"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </header>
      <div class="history-body"><ClimateHistoryPanel /></div>
    </dialog>
  </Teleport>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import ClimateHistoryPanel from './ClimateHistoryPanel.vue';
const emit = defineEmits(['close']);
const dialog = ref(null);
let previousFocus, previousOverflow;
onMounted(() => {
  previousFocus = document.activeElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  dialog.value.showModal();
});
onBeforeUnmount(() => {
  dialog.value.close();
  document.body.style.overflow = previousOverflow;
  previousFocus?.focus();
});
</script>

<style scoped>
dialog {
  --history-bg:#0b1624; --history-surface:#102338; --history-surface-raised:#172d43;
  --history-border:#31506b; --history-text:#edf4ff; --history-muted:#adc0d1;
  --history-accent:#63ccfb; --history-primary:#235c91; --history-success:#176648;
  --history-warning:#f6ba60; --history-danger:#ff9a95;
  box-sizing:border-box; position:fixed; inset:0; margin:auto; z-index:2001; width:min(1380px,96vw);
  max-width:96vw; max-height:94dvh; overflow:hidden; padding:0; border:1px solid var(--history-border);
  border-radius:14px; background:var(--history-bg); color:var(--history-text); color-scheme:dark;
  font: 15px/1.45 Arial,sans-serif; box-shadow:0 18px 58px #0007;
}
dialog[open] {display:flex; flex-direction:column}
dialog::backdrop {background:#030d19b8; backdrop-filter:blur(3px)}
header {display:flex; align-items:center; gap:14px; flex:none; padding:14px clamp(14px,2vw,28px);
  background:var(--history-surface); border-bottom:2px solid var(--history-primary)}
.mark {width:34px; color:var(--history-accent)}
.title {display:flex; align-items:center; gap:10px}
h2 {margin:0; font-size:1.45rem} .title span {font-size:.75rem; font-weight:650; border:1px solid var(--history-border); border-radius:20px; padding:1px 9px; color:var(--history-accent)}
p {margin:0; color:var(--history-muted); font-size:.85rem}
.history-body {min-height:0; overflow:auto; touch-action:pan-x pan-y; overscroll-behavior:contain; scrollbar-color:var(--history-border) transparent; padding:clamp(12px,2vw,24px)}
header button {margin-left:auto; width:38px; height:38px; display:grid; place-items:center}
header button svg {width:18px; fill:none; stroke:currentColor; stroke-width:2}
dialog :deep(*) {box-sizing:border-box}
dialog :deep(button), dialog :deep(select), dialog :deep(input:not([type=checkbox])) {
  font:inherit; color:var(--history-text); border:1px solid var(--history-border); border-radius:7px; background:var(--history-surface-raised); padding:6px 10px}
dialog :deep(button) {cursor:pointer; line-height:1.35}
dialog :deep(button:hover:not(:disabled)) {border-color:var(--history-accent)}
dialog :deep(button:disabled) {opacity:.55; cursor:not-allowed}
dialog :deep(:focus-visible) {outline:2px solid var(--history-accent); outline-offset:2px}
dialog :deep(input[type=checkbox]) {accent-color:var(--history-accent)}
@media(max-width:600px){dialog{width:98vw;max-width:98vw;max-height:96dvh}header{gap:9px;padding:10px 14px}.mark{width:28px}}
</style>
