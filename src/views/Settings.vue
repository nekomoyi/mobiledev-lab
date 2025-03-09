<script setup>
import { useRefreshStore } from '@/stores/refresh';
import { useRouter } from 'vue-router';

const router = useRouter()
const refresh = useRefreshStore()
</script>

<template>
  <nut-navbar title="参数设定" left-show @click-back="router.back()" />
  <NutCell title="开启评论自动刷新">
    <template #desc>
      <NutSwitch v-model="refresh.comment" />
    </template>
  </NutCell>
  <NutCell title="开启文章自动刷新">
    <template #desc>
      <NutSwitch v-model="refresh.article" />
    </template>
  </NutCell>
  <NutCell title="设置刷新间隔(ms)">
    <template #desc>
      <NutInputNumber v-model="refresh.interval" :max="20000" :min="100" :step="100" />
    </template>
  </NutCell>
</template>