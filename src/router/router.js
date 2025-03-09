import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue"
import Profile from "@/views/Profile.vue"
import Register from "@/views/Register.vue";

const routes = [
    { path: '/', component: Profile, name: 'profile' },
    { path: '/login', component: Login, name: 'login' },
    {  path: '/register', component: Register, name: 'register' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router