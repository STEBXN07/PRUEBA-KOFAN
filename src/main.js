import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap'
import './assets/base.css'
import './assets/formulario.css'
import './assets/main.css' // (O los nombres exactos que ellos tengan)
//import './assets/main.css' 

createApp(App).use(createPinia()).use(router).mount('#app')