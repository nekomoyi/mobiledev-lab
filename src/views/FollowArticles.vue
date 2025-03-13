<script setup>
import { onActivated, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import constants from '@/utils/constants'
import api from '@/utils/api'
import { IconThumbUp, IconMessage } from '@arco-design/web-vue/es/icon'
const articles = ref([])
const user = useUserStore()
const router = useRouter()

onMounted(async () => {
  if (user.token)
    articles.value = await api.getFollowUnread()
})

onActivated(async () => {
  if (user.token)
    articles.value = await api.getFollowUnread()
})
</script>
<template>
  <NutNavbar title="我的关注"/>
  <div v-if="!user.token">
    <NutEmpty image="error" description="未登录" />
    <div class="flex justify-center">
        <NutButton type="info" @click="router.push(`/login?redirect=${router.currentRoute.value.fullPath}`)">去登录</NutButton>
    </div>
  </div>
  <NutEmpty v-else-if="articles.length === 0" image="empty" description="暂无文章" />
  <AList v-else :bordered="false" :data="articles">
    <template #item="{ item }">
      <AListItem action-layout="vertical">
        <AListItemMeta
          :title="`${item.owner.name} ${new Date(item.modify_time).toLocaleDateString()}`"
          :description="item.title"
          @click="router.push(`/articles/${item.id}`)"
        />
        <template #actions>
          <div class="w-[40vw] pt-1 flex items-center">
            <NutRow type="flex" justify="space-between">
              <NutCol>
                <span><IconThumbUp class="pr-1" size="16" />{{ item.star }}</span>
              </NutCol>
              <NutCol @click="router.push(`/articles/${item.id}/comments`)">
                <span><IconMessage class="pr-1" size="16" />{{ item.comment_count }}</span>
              </NutCol>
            </NutRow>
          </div>
        </template>
        <template #extra>
          <div>
            <img
              :src="`${constants.ENDPOINT}${item.src}`"
              @click="router.push(`/articles/${item.id}`)"
              class="w-[45vw] h-28"
            >
          </div>
        </template>
      </AListItem>
    </template>
  </AList>
</template>