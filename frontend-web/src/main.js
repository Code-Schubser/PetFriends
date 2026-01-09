import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Router importieren
import './style.css' // Falls du Tailwind nutzt

const app = createApp(App)
app.use(router) // Router aktivieren
app.mount('#app')