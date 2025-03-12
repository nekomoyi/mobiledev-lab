<script setup>
import router from '@/router/router'
import { useUserStore } from '@/stores/user'
import api from '@/utils/api'
import constants from '@/utils/constants'
import { ref, onMounted, computed, onDeactivated, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRefreshStore } from '@/stores/refresh'
import { showDialog, showToast } from '@nutui/nutui'
import ImageUploader from '@/components/ImageUploader.vue'
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
  url: '',
  parent_id: null,
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
    comment.value.url = ''
    comment.value.parent_id = null
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

const hintComment = (c) => {
  comment.value.hint = `${c.owner.name}：${c.content}`
  comment.value.parent_id = c.id
}

const clearHint = () => {
  comment.hint = ''
  comment.parent_id = null
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
    <Comment
      v-model:comments="article.comments"
      @onDelete="(c) => deleteComment(c)"
      @onHint="(c) => hintComment(c)"
    />
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
            <span @click="clearHint">取消回复</span>
          </template>
        </AInput>
      </div>
      <AInput placeholder="请输入评论" v-model="comment.content" />
      <ImageUploader v-model="comment.url" class="pt-3" />
    </template>
  </AComment>
</template>
