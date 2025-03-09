import { createRouter, createWebHistory } from "vue-router"
import Login from "@/views/Login.vue"
import Register from "@/views/Register.vue"
import Home from "@/views/Home.vue"

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    {  path: '/register', component: Register, name: 'register' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router