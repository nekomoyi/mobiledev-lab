<script setup>
import router from '@/router/router'
import { useUserStore } from '@/stores/user'
import api from '@/utils/api'
import constants from '@/utils/constants'
import { ref, onMounted, computed, onActivated, onDeactivated, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { IconMessage, IconDelete } from '@arco-design/web-vue/es/icon'
import { useRefreshStore } from '@/stores/refresh'
import { showDialog, showToast } from '@nutui/nutui'
const route = useRoute()
const user = useUserStore()
const refresh = useRefreshStore()
const articleId = route.params.id
let article = ref({ title: '', comments: [] })
let noComments = computed(() => article.value.comments.length === 0)
let articleExist = computed(() => article.value.id !== undefined)

const comment = ref({
  content: '',
  hint: '',
  order: 0,
})

let refreshRef = ref(null)

const fetchArticle = async () => {
  try {
    let data = await api.getArticle(articleId)
    article.value = data
  } catch (error) {
    showToast.fail('获取文章失败:', error)
  }
}

const sendComment = async () => {
  try {
    await api.comment(articleId, comment.value)
    comment.value.content = ''
    comment.value.hint = ''
    fetchArticle()
  } catch (error) {
    showToast.fail('评论失败:', error)
  }
}

const deleteComment = (comment) => {
  let commentId = comment.id
  showDialog({
    title: '确定删除评论?',
    content: comment.content,
    onCancel: () => { },
    onOk: async () => {
      try {
        await api.deleteComment(commentId)
        fetchArticle()
      } catch (error) {
        showToast.fail('删除评论失败:', error)
      }
    }
  })
}

onMounted(() => {
  fetchArticle()
  if (refresh.comment) {
    refreshRef.value = setInterval(() => {
      fetchArticle()
    }, refresh.interval)
  }
})

onDeactivated(() => {
  if (refreshRef.value)
    clearInterval(refreshRef.value)
})

onUnmounted(() => {
  if (refreshRef.value)
    clearInterval(refreshRef.value)
})

</script>
<template>
  <NutNavbar :title="article.title" left-show @click-back="router.back()" />
  <NutEmpty v-if="noComments" :image="articleExist ? 'empty' : 'error'"
    :description="articleExist ? '暂无评论' : '文章不存在'" />
  <div>
    <AComment align="right" v-for="c in article.comments" :key="c.id" :author="c.owner.name"
      :avatar="`${constants.ENDPOINT}${c.owner.avatar}`" :datetime="new Date(c.create_time).toLocaleString()"
      class="m-3">
      <template #actions>
        <span @click="comment.hint = `引用: ${c.content}@${c.owner.name}`">
          <IconMessage class="mr-1" />引用
        </span>
        <span v-if="user.user.uuid == c.owner_id" @click="deleteComment(c)">
          <IconDelete class="mr-1" />删除
        </span>
      </template>
      <template #content>
        <div v-if="c.hint" class="text-gray-500">
          {{ c.hint }}
        </div>
        <div>
          {{ c.content }}
        </div>
      </template>
    </AComment>
  </div>
  <NutCell v-if="!user.token" title="未登录，不能评论" is-link
    @click="router.push('/login?redirect=' + router.currentRoute.value.fullPath)" />
  <AComment class="m-3" v-else align="right" :avatar="`${constants.ENDPOINT}${user.user.avatar}`">
    <template #actions>
      <AButton v-if="!refresh.comment" type="primary" :key="0" @click="fetchArticle">刷新</AButton>
      <AButton type="primary" :key="1" @click="sendComment">发送</AButton>
    </template>
    <template #content>
      <div v-if="comment.hint" class="text-gray-500">
        <AInput v-model="comment.hint" readonly>
          <template #append>
            <span @click="comment.hint = ''">取消引用</span>
          </template>
        </AInput>
      </div>
      <AInput placeholder="请输入评论" v-model="comment.content" />
    </template>
  </AComment>
</template>
