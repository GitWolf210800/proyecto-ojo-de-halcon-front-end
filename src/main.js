import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import '@/assets/main.css'
import router from './router'

// Directiva personalizada para zoom
const zoomDirective = {
    mounted(el) {
        let scale = 1;
        let posX = 0, posY = 0;
        let startX = 0, startY = 0;
        let isDragging = false;
        let initialDistance = null;

        // Añade la clase con la transición de zoom suave
        el.classList.add('zoom-content');

        // Zoom en PC usando la rueda del ratón
        el.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomFactor = 0.006; // Factor de zoom más suave
                scale += e.deltaY * -zoomFactor;
                scale = Math.min(Math.max(0.5, scale), 3); // Limitar zoom entre 0.5x y 3x
                updateTransform();
            }
        });

        // Función para aplicar la transformación con suavidad
        const updateTransform = () => {
            el.style.transform = `scale(${scale}) translate(${posX / scale}px, ${posY / scale}px)`;
        };

        // Iniciar arrastre en PC y móvil
        const startDrag = (x, y) => {
            startX = x - posX;
            startY = y - posY;
            isDragging = true;
        };

        // Mover mientras se arrastra en PC y móvil
        const onDrag = (x, y) => {
            if (isDragging) {
                // Calcular la posición nueva en función de la escala actual
                posX = (x - startX) * scale;
                posY = (y - startY) * scale;
                requestAnimationFrame(updateTransform); // Usar requestAnimationFrame para una actualización suave
            }
        };

        // Fin del arrastre
        const endDrag = () => {
            isDragging = false;
        };

        // Eventos de ratón para arrastre en PC
        el.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        el.addEventListener('mousemove', (e) => onDrag(e.clientX, e.clientY));
        el.addEventListener('mouseup', endDrag);
        el.addEventListener('mouseleave', endDrag);

        // Eventos táctiles para pellizco en móviles
        el.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2) {
                initialDistance = getDistance(e.touches[0], e.touches[1]);
            }
        });

        el.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging) {
                onDrag(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2 && initialDistance !== null) {
                e.preventDefault();
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const zoomFactor = currentDistance / initialDistance;
                scale = Math.min(Math.max(0.5, scale * zoomFactor), 3);
                initialDistance = currentDistance;
                updateTransform();
            }
        });

        el.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                initialDistance = null;
            }
            endDrag();
        });

        // Función para calcular la distancia entre dos toques
        const getDistance = (touch1, touch2) => {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };
    }
};


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('zoom', zoomDirective); // Registrar la directiva global
app.mount('#app')
