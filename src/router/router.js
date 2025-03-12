import { createRouter, createWebHistory } from "vue-router"
import Login from "@/views/Login.vue"
import Register from "@/views/Register.vue"
import Home from "@/views/Home.vue"
import Settings from "@/views/Settings.vue"
import Comments from "@/views/Comments.vue"
import Article from "@/views/Article.vue"
import NewArticle from "@/views/NewArticle.vue"
import MyArticles from "@/views/MyArticles.vue"

const routes = [
    { path: '/', component: Home, name: 'home' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/settings', component: Settings, name: 'settings' },
    { path: '/new-article', component: NewArticle, name: 'new-article' },
    { path: '/articles/:id', component: Article, name: 'article' },
    { path: '/articles/:id/comments', component: Comments, name: 'comments' },
    { path: '/users/:uuid/articles', component: MyArticles, name: 'user-articles' }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router