<script setup>
import { onActivated, ref } from 'vue'
import { Search2 } from '@nutui/icons-vue'
import api from '@/utils/api'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { IconThumbUp, IconMessage, IconDelete } from '@arco-design/web-vue/es/icon'
import constants from '@/utils/constants'
import { showDialog } from '@nutui/nutui'

const user = useUserStore()
const router = useRouter()
const articles = ref([])
const searchStr = ref('')

const getArticles = async () => {
  articles.value = await api.getUserArticles(
    user.user.uuid, searchStr.value
  )
}

const deleteArticle = (article) => {
  let articleId = article.id
  showDialog({
    title: '确定删除文章?',
    content: article.title,
    onCancel: () => { },
    onOk: async () => {
      try {
        await api.deleteArticle(articleId)
        getArticles()
      } catch (error) {
        showToast.fail('删除失败:', error)
      }
    }
  })
}

onActivated(() => {
  if (user.token) getArticles()
})
</script>
<template>
  <NutSearchbar
    v-model="searchStr"
    placeholder="搜索"
    @search="getArticles"
  >
    <template #rightin>
      <Search2 @click="getArticles" />
    </template>
    <template #rightout>
      <NutButton
        type="danger"
        size="mini"
        @click="console.log('new article')"
      >
        发布文章
      </NutButton>
    </template>
  </NutSearchbar>
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
          @click="router.push(`/articles/${item.uuid}`)"
        />
        <template #actions>
          <div class="w-[40vw] pt-1 flex items-center">
            <NutRow type="flex" justify="space-between">
              <NutCol :span="8">
                <span><IconThumbUp class="pr-1" size="16" />{{ item.star }}</span>
              </NutCol>
              <NutCol :span="8" @click="router.push(`/articles/${item.id}/comments`)">
                <span><IconMessage class="pr-1" size="16" />{{ item.comment_count }}</span>
              </NutCol>
              <NutCol :span="8" @click="deleteArticle(item)">
                <span><IconDelete class="pr-1" size="16" /></span>
              </NutCol>
            </NutRow>
          </div>
        </template>
        <template #extra>
          <div class=" ">
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