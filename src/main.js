import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import '@/assets/main.css';
import router from './router';
import { isMobile } from './funciones';

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Add SVG Core
import { library } from '@fortawesome/fontawesome-svg-core';

// Free Icons Styles
import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"

// Add Free icons Styles To SVG Core
library.add(fas, far, fab);

const zoomDirective = {
    mounted(el) {
        let scale = 1;
        let posX = 0, posY = 0;
        let targetX = 0, targetY = 0; // Nuevas variables para el desplazamiento suavizado en móvil
        let startX = 0, startY = 0;
        let isDragging = false;
        let initialDistance = null;
        const smartPhone = isMobile();

        const minScale = smartPhone ? 1.5 : 1;
        const maxScale = 2.5;

        el.classList.add('zoom-content');

        const updateTransform = () => {
            el.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
        };

        const clampPosition = () => {
            const rect = el.getBoundingClientRect();
            const containerWidth = el.parentElement.clientWidth;
            const containerHeight = el.parentElement.clientHeight;

            const maxOffsetX = (rect.width * scale - containerWidth) / 2;
            const maxOffsetY = (rect.height * scale - containerHeight) / 2;

            targetX = Math.max(Math.min(targetX, maxOffsetX), -maxOffsetX);
            targetY = Math.max(Math.min(targetY, maxOffsetY), -maxOffsetY);
        };

        const animateDrag = () => {
            if (smartPhone && isDragging) {
                posX += (targetX - posX) * 0.15; // Interpolación para suavizar el arrastre
                posY += (targetY - posY) * 0.15;
                updateTransform();

                // Continuar la animación hasta que el desplazamiento se estabilice
                if (Math.abs(targetX - posX) > 0.5 || Math.abs(targetY - posY) > 0.5) {
                    requestAnimationFrame(animateDrag);
                }
            }
        };

        const startDrag = (x, y) => {
            startX = x - targetX;
            startY = y - targetY;
            isDragging = true;
        };

        const onDrag = (x, y) => {
            if (isDragging) {
                // En móvil, actualiza el objetivo de arrastre en lugar de la posición directa
                if (smartPhone) {
                    targetX = x - startX;
                    targetY = y - startY;
                    clampPosition();
                    animateDrag();
                } else {
                    posX = x - startX;
                    posY = y - startY;
                    clampPosition();
                    updateTransform();
                }
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
                targetX += (e.touches[0].clientX - startX - targetX) * 0.38;
                targetY += (e.touches[0].clientY - startY - targetY) * 0.38;
                clampPosition();
                animateDrag();
            } else if (e.touches.length === 2 && initialDistance !== null) {
                e.preventDefault();
                const currentDistance = getDistance(e.touches[0], e.touches[1]);
                const zoomFactor = currentDistance / initialDistance;
                scale = Math.min(Math.max(minScale, scale * zoomFactor), maxScale);
                initialDistance = currentDistance;
                clampPosition();
                updateTransform();
            }
        });

        el.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                initialDistance = null;
            }
            endDrag();
        });

        const zoomAtPoint = (deltaScale, originX, originY) => {
            const prevScale = scale;
            scale = Math.min(Math.max(minScale, scale + deltaScale), maxScale);

            const rect = el.getBoundingClientRect();
            const offsetX = (originX - rect.left - posX) / prevScale;
            const offsetY = (originY - rect.top - posY) / prevScale;

            posX -= (offsetX * (scale - prevScale));
            posY -= (offsetY * (scale - prevScale));

            clampPosition();
            updateTransform();
        };

        el.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const zoomFactor = -e.deltaY * 0.002;
                zoomAtPoint(zoomFactor, e.clientX, e.clientY);
            } else if (e.shiftKey) {
                e.preventDefault();
                posX += e.deltaY * 0.2;
                clampPosition();
                updateTransform();
            }
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
app.component("fa", FontAwesomeIcon);
app.directive('zoom', zoomDirective);

if (isMobile()) {
    document.body.style.touchAction = 'none';
    document.body.style.overflow = 'hidden';

    const mapContainer = document.querySelector('.container');
    if (mapContainer) {
        mapContainer.style.touchAction = 'pinch-zoom';
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

