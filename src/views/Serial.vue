<template>
  <div class="cuerpo">
    <h2>Conexión Serie</h2>
    <label>Velocidad (baud rate):</label>
    <select v-model="baudRate">
      <option v-for="rate in baudRates" :key="rate" :value="rate">{{ rate }}</option>
    </select>

    <button @click="conectarPuerto">Conectar</button>

    <div v-if="mensajes.length">
      <h3>Datos recibidos:</h3>
      <pre>{{ mensajes.join('\n') }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      baudRate: 9600, // valor inicial
      baudRates: [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200],
      mensajes: []
    };
  },
  methods: {
    async conectarPuerto() {
      try {
        // Pide al usuario que elija el puerto
        const puerto = await navigator.serial.requestPort();

        // Abre el puerto con la velocidad seleccionada
        await puerto.open({ baudRate: this.baudRate });

        const lector = puerto.readable.getReader();
        const decodificador = new TextDecoder();

        while (true) {
          const { value, done } = await lector.read();
          if (done) break;
          if (value) {
            this.mensajes.push(decodificador.decode(value));
          }
        }
      } catch (err) {
        console.error("Error al conectar:", err);
      }
    }
  }
};
</script>

<style scoped>
.cuerpo{
    color: white;
}
</style>
