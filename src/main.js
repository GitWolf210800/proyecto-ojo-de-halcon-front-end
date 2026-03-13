import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPersistedState from 'pinia-plugin-persistedstate';
import App from './App.vue';
import '@/assets/main.css';
import router from './router';
import { isMobile } from './funciones';
import ganttastic from '@infectoone/vue-ganttastic';

import VueCookies from 'vue-cookies';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, far, fab);

const zoomDirective = {
mounted(el) {

let scale = 1;

let posX = 0;
let posY = 0;

let targetX = 0;
let targetY = 0;

let startX = 0;
let startY = 0;

let isDragging = false;

let initialDistance = null;

const smartPhone = isMobile();

const minScale = 1;
const maxScale = smartPhone ? 6 : 3;

el.classList.add('zoom-content');

const updateTransform = () => {
el.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
};

const clampPosition = () => {

const containerWidth = el.parentElement.clientWidth;
const containerHeight = el.parentElement.clientHeight;

const scaledWidth = el.offsetWidth * scale;
const scaledHeight = el.offsetHeight * scale;

const maxOffsetX = Math.max(0,(scaledWidth - containerWidth)/2);
const maxOffsetY = Math.max(0,(scaledHeight - containerHeight)/2);

posX = Math.max(Math.min(posX,maxOffsetX),-maxOffsetX);
posY = Math.max(Math.min(posY,maxOffsetY),-maxOffsetY);

targetX = posX;
targetY = posY;

};

const animateDrag = () => {

if(smartPhone && isDragging){

posX += (targetX - posX) * 0.15;
posY += (targetY - posY) * 0.15;

updateTransform();

if(
Math.abs(targetX-posX) > 0.5 ||
Math.abs(targetY-posY) > 0.5
){
requestAnimationFrame(animateDrag);
}

}

};

const startDrag = (x,y)=>{

startX = x - posX;
startY = y - posY;

isDragging = true;

};

const onDrag = (x,y)=>{

if(!isDragging) return;

const dragSpeed = scale > 3 ? 0.6 : 1;

if(smartPhone){

targetX = (x - startX) * dragSpeed;
targetY = (y - startY) * dragSpeed;

posX = targetX;
posY = targetY;

clampPosition();
animateDrag();

}else{

posX = (x - startX) * dragSpeed;
posY = (y - startY) * dragSpeed;

clampPosition();
updateTransform();

}

};

const endDrag = ()=>{

isDragging = false;

};

el.addEventListener('mousedown',(e)=>startDrag(e.clientX,e.clientY));
el.addEventListener('mousemove',(e)=>onDrag(e.clientX,e.clientY));
el.addEventListener('mouseup',endDrag);
el.addEventListener('mouseleave',endDrag);

el.addEventListener('touchstart',(e)=>{

if(e.touches.length === 1){

startDrag(
e.touches[0].clientX,
e.touches[0].clientY
);

}
else if(e.touches.length === 2){

initialDistance = getDistance(
e.touches[0],
e.touches[1]
);

}

});

el.addEventListener('touchmove',(e)=>{

if(e.touches.length === 1 && isDragging){

targetX = e.touches[0].clientX - startX;
targetY = e.touches[0].clientY - startY;

posX = targetX;
posY = targetY;

clampPosition();
animateDrag();

}
else if(e.touches.length === 2 && initialDistance !== null){

e.preventDefault();

const currentDistance = getDistance(
e.touches[0],
e.touches[1]
);

const zoomFactor = (currentDistance - initialDistance) * 0.005;

scale = Math.min(
Math.max(minScale,scale + zoomFactor),
maxScale
);

initialDistance = currentDistance;

clampPosition();
updateTransform();

}

});

el.addEventListener('touchend',(e)=>{

if(e.touches.length < 2){
initialDistance = null;
}

endDrag();

});

const zoomAtPoint = (deltaScale,originX,originY)=>{

const prevScale = scale;

const rect = el.getBoundingClientRect();

const mouseX = originX - rect.left;
const mouseY = originY - rect.top;

const worldX = (mouseX - posX) / prevScale;
const worldY = (mouseY - posY) / prevScale;

scale = Math.min(
Math.max(minScale,scale + deltaScale),
maxScale
);

posX = mouseX - worldX * scale;
posY = mouseY - worldY * scale;

clampPosition();
updateTransform();

};

el.addEventListener('wheel',(e)=>{

e.preventDefault();

const zoomFactor = -e.deltaY * 0.0015;

zoomAtPoint(
zoomFactor,
e.clientX,
e.clientY
);

});

const getDistance = (touch1,touch2)=>{

const dx = touch1.clientX - touch2.clientX;
const dy = touch1.clientY - touch2.clientY;

return Math.sqrt(dx*dx + dy*dy);

};

}
};

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersistedState);

app.use(pinia);
app.use(router);
app.use(ganttastic);

app.use(VueCookies,{expires:'1d'});

app.component("fa",FontAwesomeIcon);

app.directive('zoom',zoomDirective);

if(isMobile()){

document.body.style.touchAction = 'none';
document.body.style.overflow = 'hidden';

const mapContainer = document.querySelector('.container');

if(mapContainer){
mapContainer.style.touchAction = 'pinch-zoom';
}

}

document.addEventListener('DOMContentLoaded',()=>{

const navBar = document.querySelector('nav');
const footer = document.querySelector('footer');

if(navBar){

navBar.style.position = 'fixed';
navBar.style.top = '0';
navBar.style.left = '0';
navBar.style.width = '100%';
navBar.style.zIndex = '1000';

}

if(footer){

footer.style.position = 'fixed';
footer.style.bottom = '0';
footer.style.left = '0';
footer.style.width = '100%';
footer.style.zIndex = '1000';

}

});

app.mount('#app');
