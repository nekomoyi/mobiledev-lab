<script setup>
import { useUserStore } from '@/stores/user.js'
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('aa@wzu.edu.cn')
const password = ref('123456')
const resp = ref('')
const store = useUserStore()
const router = useRouter()

const login = () => {
  axios.post('http://localhost:80/auth/jwt/login', {
    username: username.value,
    password: password.value
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    router.push('/')
    store.$patch({ token: res.data.token_type + ' ' + res.data.access_token })
  })
}
</script>

<template>
  <nut-row type="flex" justify="center" class="pt-5">
    <nut-col :span="18" fill>
      <nut-image
        src="https://cover.sli.dev"
        width="100%"
        height="50vh"
        fit="cover"
        radius="10px"
        class="shadow-xl"
      />
    </nut-col>
  </nut-row>
  <nut-row type="flex" justify="center">
    <nut-col :span="18">
      <nut-form class="shadow-lg">
        <nut-form-item label="用户名">
          <nut-input v-model="username" type="text" />
        </nut-form-item>
        <nut-form-item label="密码">
          <nut-input v-model="password" type="password" />
        </nut-form-item>
      </nut-form>
      <div class="flex justify-center">
        <nut-button
          type="info"
          @click="login"
          class="shadow-lg"
        >登录</nut-button>
      </div>
    </nut-col>
  </nut-row>
</template>