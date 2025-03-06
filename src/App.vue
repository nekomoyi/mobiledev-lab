<script setup>
import { useUserStore } from './stores/user.js'
import axios from 'axios'
import { ref } from 'vue'

const name = ref('aa@wzu.edu.cn')
const password = ref('123456')
const resp = ref('')
const store = useUserStore()

const login = () => {
  axios.post('http://localhost:80/auth/jwt/login', {
    username: name.value,
    password: password.value
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    resp.value = res.data
    store.$patch({ token: res.data.token_type + ' ' + res.data.access_token })
  })
}

const logout = () => {
  axios.post('http://localhost:80/auth/jwt/logout', {}, {
    headers: {
      'Authorization': store.$state.token
    }
  }).then(res => {
    resp.value = res.data
    store.$patch({ token: '' })
  })
}

const profile = () => {
  axios.get('http://localhost:80/users/me', {
    headers: {
      'Authorization': store.$state.token
    }
  }).then(res => {
    resp.value = res.data
  })
}
</script>

<template>
  <input v-model="name" type="text" />
  <input v-model="password" type="password" />
  <p>22211860216 卢锦轩</p>
  <button @click="login">Login</button>
  <button @click="logout">Logout</button>
  <button @click="profile">Profile</button>
  <p>{{ resp }}</p>
</template>