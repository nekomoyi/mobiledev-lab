<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const user = useUserStore()
const router = useRouter()

const logout = () => {
  user.$reset()
}
</script>

<template>
  <nut-col :span="24">
    <div class="m-5">{{ user }}</div>
    <div class="flex justify-center">
      <nut-button v-if="user.token != ''" type="danger" @click="logout" class="shadow-lg">登出</nut-button>
      <nut-button v-else type="info" @click="router.push('/login')" class="shadow-lg">登录</nut-button>
    </div>
  </nut-col>
</template>
