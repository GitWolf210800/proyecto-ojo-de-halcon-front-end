<template>
  <div
    class="modulo-card"
    :class="`modulo-card--${variante}`"
    :aria-label="`Abrir módulo de ${titulo}`"
  >
    <span class="modulo-card__halo" aria-hidden="true"></span>
    <fa class="modulo-card__icono" :icon="icono" aria-hidden="true" />
    <span class="modulo-card__titulo">{{ titulo }}</span>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    required: true,
  },
  icono: {
    type: String,
    required: true,
  },
  variante: {
    type: String,
    required: true,
    validator: (valor) =>
      ["clima", "mantenimiento", "produccion", "montacargas"].includes(valor),
  },
});
</script>

<style scoped>
.modulo-card {
  --acento: #38bdf8;
  --acento-rgb: 56, 189, 248;
  --fondo-inicio: 13, 27, 42;
  --fondo-fin: 65, 90, 119;

  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 150px;
  padding: 20px 16px;
  box-sizing: border-box;
  border: 1px solid rgba(var(--acento-rgb), 0.42);
  border-radius: 18px;
  background: linear-gradient(
    145deg,
    rgba(var(--fondo-inicio), 0.94),
    rgba(var(--fondo-fin), 0.76)
  );
  color: #f8fafc;
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.24),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.modulo-card::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    125deg,
    transparent 20%,
    rgba(255, 255, 255, 0.05) 48%,
    transparent 76%
  );
  transform: translateX(-70%);
  transition: transform 0.35s ease;
}

.modulo-card__halo {
  position: absolute;
  top: -52px;
  width: 110px;
  height: 110px;
  z-index: -1;
  border-radius: 50%;
  background: rgba(var(--acento-rgb), 0.16);
  filter: blur(18px);
}

.modulo-card__icono {
  width: 54px;
  height: 54px;
  color: var(--acento);
  filter: drop-shadow(0 6px 12px rgba(var(--acento-rgb), 0.2));
  transition: transform 0.2s ease;
}

.modulo-card__titulo {
  color: #f8fafc;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
}

.modulo-card:hover {
  transform: translateY(-4px);
  border-color: var(--acento);
  box-shadow:
    0 16px 34px rgba(0, 0, 0, 0.3),
    0 0 22px rgba(var(--acento-rgb), 0.11);
}

.modulo-card:hover::after {
  transform: translateX(70%);
}

.modulo-card:hover .modulo-card__icono {
  transform: scale(1.06);
}

.modulo-card--clima {
  --acento: #22d3ee;
  --acento-rgb: 34, 211, 238;
  --fondo-inicio: 8, 47, 73;
  --fondo-fin: 14, 116, 144;
}

.modulo-card--mantenimiento {
  --acento: #f59e0b;
  --acento-rgb: 245, 158, 11;
  --fondo-inicio: 45, 33, 14;
  --fondo-fin: 120, 53, 15;
}

.modulo-card--produccion {
  --acento: #34d399;
  --acento-rgb: 52, 211, 153;
  --fondo-inicio: 6, 45, 35;
  --fondo-fin: 6, 95, 70;
}

.modulo-card--montacargas {
  --acento: #38bdf8;
  --acento-rgb: 56, 189, 248;
  --fondo-inicio: 13, 27, 42;
  --fondo-fin: 65, 90, 119;
}

@media (prefers-reduced-motion: reduce) {
  .modulo-card,
  .modulo-card::after,
  .modulo-card__icono {
    transition: none;
  }
}
</style>
