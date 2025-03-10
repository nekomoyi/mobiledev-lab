<script setup>
import { useUserStore } from '@/stores/user.js'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/utils/api'
import { showToast } from '@nutui/nutui'

const user = useUserStore()
const router = useRouter()
const route = useRoute()

const username = ref('aa@wzu.edu.cn')
const password = ref('123456')

const login = async () => {
  let data = await api.login(username.value, password.value)
  if (data.access_token) {
    user.token = `${data.token_type} ${data.access_token}`
    let user_info = await api.userDetail()
    if (user_info.id != undefined) user.user = user_info
    else {
      showToast.fail('获取用户信息失败')
      return
    }
    console.log(user)
    router.push(route.query.redirect || '/')
  } else showToast.fail(JSON.stringify(data))
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