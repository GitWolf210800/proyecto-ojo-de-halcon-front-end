<template>
  <div class="montacargas-fabrica" aria-label="Abrir seguimiento de montacargas">
    <fa class="montacargas-fabrica__icono" icon="truck-moving" />
    <span>Montacargas</span>
  </div>
</template>

<style scoped>
.montacargas-fabrica {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 120px;
  min-height: 120px;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid rgba(125, 211, 252, 0.42);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(13, 27, 42, 0.9), rgba(65, 90, 119, 0.75));
  color: #e0f2fe;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.24);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.montacargas-fabrica:hover {
  transform: translateY(-3px);
  border-color: #38bdf8;
}

.montacargas-fabrica__icono {
  width: 54px;
  height: 54px;
  color: #38bdf8;
}

.montacargas-fabrica span {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
</style>
