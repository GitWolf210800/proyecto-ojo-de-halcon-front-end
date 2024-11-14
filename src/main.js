import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import '@/assets/main.css';
import router from './router';
import { isMobile } from './funciones';

const zoomDirective = {
    mounted(el) {
        let scale = 1;
        let posX = 0, posY = 0;
        let startX = 0, startY = 0;
        let isDragging = false;
        let initialDistance = null;
        const smartPhone = isMobile(); // es una función que verifica si es un móvil "true" o no "false"

        // Valores de límites configurables
        const minScale = smartPhone ? 1.5 : 1; // Límite mínimo de escala si es móvil o no
        const maxScale = 2.5; // Límite máximo de escala

        el.classList.add('zoom-content');

        const updateTransform = () => {
            el.style.transform = `scale(${scale}) translate(${posX / scale}px, ${posY / scale}px)`;
        };

        const clampPosition = () => {
            const rect = el.getBoundingClientRect();

            const maxOffsetX = (rect.width * (scale - 1)) / 2.8;
            const maxOffsetY = (rect.height * (scale - 1)) / 2.8;

            posX = Math.min(Math.max(posX, -maxOffsetX), maxOffsetX);
            posY = Math.min(Math.max(posY, -maxOffsetY), maxOffsetY);
        };

        const zoomAtPoint = (deltaScale, originX, originY) => {
            const prevScale = scale;
            scale = Math.min(Math.max(minScale, scale + deltaScale), maxScale);

            const rect = el.getBoundingClientRect();
            const offsetX = (originX - rect.left) / prevScale;
            const offsetY = (originY - rect.top) / prevScale;

            posX -= (offsetX * (scale - prevScale));
            posY -= (offsetY * (scale - prevScale));

            clampPosition();
            updateTransform();
        };

        el.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                // Realiza zoom si el usuario presiona Ctrl o Meta (Mac)
                e.preventDefault();
                const zoomFactor = -e.deltaY * 0.002;
                zoomAtPoint(zoomFactor, e.clientX, e.clientY);
            } else if (e.shiftKey) {
                // Desplazamiento horizontal si el usuario presiona Shift
                e.preventDefault();
                posX += e.deltaY * 0.2; // Ajustar este valor para cambiar la velocidad del desplazamiento
                clampPosition();
                updateTransform();
            }
        });

        const startDrag = (x, y) => {
            startX = x - posX;
            startY = y - posY;
            isDragging = true;
        };

        const onDrag = (x, y) => {
            if (isDragging) {
                posX = (x - startX) * scale;
                posY = (y - startY) * scale;
                clampPosition();
                updateTransform();
            }
        };

        const endDrag = () => {
            isDragging = false;
        };

        el.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        el.addEventListener('mousemove', (e) => onDrag(e.clientX, e.clientY));
        el.addEventListener('mouseup', endDrag);
        el.addEventListener('mouseleave', endDrag);

        el.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startDrag(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2) {
                initialDistance = getDistance(e.touches[0], e.touches[1]);
            }
        });

        el.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging) {
                posX += (e.touches[0].clientX - startX - posX) * 0.38;
                posY += (e.touches[0].clientY - startY - posY) * 0.38;
                requestAnimationFrame(updateTransform);
            } else if (e.touches.length === 2 && initialDistance !== null) {
                e.preventDefault();
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const zoomFactor = currentDistance / initialDistance;
                scale = Math.min(Math.max(minScale, scale * zoomFactor), maxScale);
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

        const getDistance = (touch1, touch2) => {
            const dx = touch1.clientX - touch2.clientX;
            const dy = touch1.clientY - touch2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        };
    }
};

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.directive('zoom', zoomDirective); // Registrar la directiva global

// Bloqueo de zoom en móvil y permitido solo en el contenido (mapa o similar)
if (isMobile()) {
    // Bloquea el zoom para toda la página
    document.body.style.touchAction = 'none';
    document.body.style.overflow = 'hidden';

    // Permite el zoom solo en el contenedor del mapa
    const mapContainer = document.querySelector('.container');
    if (mapContainer) {
        mapContainer.style.touchAction = 'pinch-zoom'; // Permite el zoom en el mapa
    }
}

// Fijar las barras de navegación y pie de página
document.addEventListener('DOMContentLoaded', () => {
    const navBar = document.querySelector('nav');
    const footer = document.querySelector('footer');

    if (navBar) {
        navBar.style.position = 'fixed';
        navBar.style.top = '0';
        navBar.style.left = '0';
        navBar.style.width = '100%';
        navBar.style.zIndex = '1000';
    }

    if (footer) {
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.left = '0';
        footer.style.width = '100%';
        footer.style.zIndex = '1000';
    }
});

app.mount('#app');
