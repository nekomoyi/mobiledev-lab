import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App.vue'
import './style.css'
import "@nutui/nutui/dist/style.css";
import router from "@/router/router.js"

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState())
app.use(pinia).use(router)
app.mount('#app')
