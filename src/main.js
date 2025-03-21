import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import App from './App.vue'
import './style.css'
import "@nutui/nutui/dist/style.css";
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

import router from "@/router/router.js"

const app = createApp(App)
const pinia = createPinia()
pinia.use(createPersistedState())
app.use(pinia).use(router).use(ArcoVue)
app.mount('#app')
