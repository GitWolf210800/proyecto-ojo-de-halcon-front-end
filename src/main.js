import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedState from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import ganttastic from '@infectoone/vue-ganttastic'

import VueCookies from 'vue-cookies'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { fas } from "@fortawesome/free-solid-svg-icons"
import { fab } from "@fortawesome/free-brands-svg-icons"
import { far } from "@fortawesome/free-regular-svg-icons"

library.add(fas, far, fab)

const zoomDirective = {
mounted(el){

let scale = 1
let posX = 0
let posY = 0

let startX = 0
let startY = 0
let isDragging = false

let initialDistance = null
let initialScale = 1
let pinchWorldX = 0
let pinchWorldY = 0

const minScale = 1
const maxScale = 20

el.style.transformOrigin = "0 0"

const updateTransform = ()=>{
el.style.transform = `translate(${posX}px,${posY}px) scale(${scale})`
}

const startDrag = (x,y)=>{
startX = x - posX
startY = y - posY
isDragging = true
}

const onDrag = (x,y)=>{
if(!isDragging) return
posX = x - startX
posY = y - startY
updateTransform()
}

const endDrag = ()=>{
isDragging = false
}

const zoomAtPoint = (deltaScale, originX, originY)=>{

const prevScale = scale

const rect = el.parentElement.getBoundingClientRect()

const mouseX = originX - rect.left
const mouseY = originY - rect.top

const worldX = (mouseX - posX) / prevScale
const worldY = (mouseY - posY) / prevScale

scale = Math.min(Math.max(minScale, scale + deltaScale), maxScale)

posX = mouseX - worldX * scale
posY = mouseY - worldY * scale

updateTransform()

}

el.addEventListener("mousedown",(e)=>{
startDrag(e.clientX,e.clientY)
})

el.addEventListener("mousemove",(e)=>{
onDrag(e.clientX,e.clientY)
})

el.addEventListener("mouseup",endDrag)
el.addEventListener("mouseleave",endDrag)

el.addEventListener("wheel",(e)=>{

e.preventDefault()

const zoomFactor = -e.deltaY * 0.001

zoomAtPoint(
zoomFactor,
e.clientX,
e.clientY
)

})

el.addEventListener("touchstart",(e)=>{

if(e.touches.length === 1){

startDrag(
e.touches[0].clientX,
e.touches[0].clientY
)

}

if(e.touches.length === 2){

isDragging = false

initialDistance = getDistance(
e.touches[0],
e.touches[1]
)

initialScale = scale

const center = getCenter(
e.touches[0],
e.touches[1]
)

const rect = el.parentElement.getBoundingClientRect()

const cx = center.x - rect.left
const cy = center.y - rect.top

pinchWorldX = (cx - posX) / scale
pinchWorldY = (cy - posY) / scale

}

},{ passive:false })

el.addEventListener("touchmove",(e)=>{

if(e.touches.length === 1 && isDragging){

e.preventDefault()

onDrag(
e.touches[0].clientX,
e.touches[0].clientY
)

}

if(e.touches.length === 2 && initialDistance){

e.preventDefault()

const currentDistance = getDistance(
e.touches[0],
e.touches[1]
)

const ratio = currentDistance / initialDistance

scale = Math.min(
Math.max(minScale, initialScale * ratio),
maxScale
)

const center = getCenter(
e.touches[0],
e.touches[1]
)

const rect = el.parentElement.getBoundingClientRect()

const cx = center.x - rect.left
const cy = center.y - rect.top

posX = cx - pinchWorldX * scale
posY = cy - pinchWorldY * scale

updateTransform()

}

},{ passive:false })

el.addEventListener("touchend",()=>{
initialDistance = null
endDrag()
})

const getDistance = (t1,t2)=>{

const dx = t1.clientX - t2.clientX
const dy = t1.clientY - t2.clientY

return Math.sqrt(dx*dx + dy*dy)

}

const getCenter = (t1,t2)=>{

return {
x:(t1.clientX + t2.clientX) / 2,
y:(t1.clientY + t2.clientY) / 2
}

}

}
}

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersistedState)

app.use(pinia)
app.use(router)
app.use(ganttastic)

app.use(VueCookies,{expires:'1d'})

app.component("fa",FontAwesomeIcon)

app.directive("zoom", zoomDirective)

app.mount('#app')
