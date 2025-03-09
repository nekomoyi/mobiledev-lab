import { createRouter, createWebHistory } from "vue-router"
import Login from "@/views/Login.vue"
import Register from "@/views/Register.vue"
import Home from "@/views/Home.vue"
import Settings from "@/views/Settings.vue"

const routes = [
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/settings', component: Settings, name: 'settings' },
    { path: '/', component: Home, name: 'home' },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router