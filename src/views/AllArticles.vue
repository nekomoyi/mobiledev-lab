<script setup>
import { useLikeStore } from '@/stores/like'
import { useRefreshStore } from '@/stores/refresh'
import api from '@/utils/api'
import { usePersistentScroll } from '@/utils/scroll'
import { showToast } from '@nutui/nutui'
import { Search2 } from '@nutui/icons-vue'
import { ref, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'

const pagination = ref({
  limit: 5,
  offset: 0,
})

const articles = ref([])
const pullLoading = ref(false)
const infinityLoading = ref(false)
const hasMore = ref(true)
const searchStr = ref('')

const loadMore = async () => {
  const { limit, offset } = pagination.value
  const data = await api.getArticles(offset + limit, limit, searchStr.value)
  articles.value = [...articles.value, ...data]
  pagination.value.offset += limit
  hasMore.value = data.length === limit
  infinityLoading.value = false
}

const pullLoad = async () => {
  pagination.value.offset = 0
  hasMore.value = true
  const { limit, offset } = pagination.value
  const data = await api.getArticles(offset, limit, searchStr.value)
  articles.value = data
  pullLoading.value = false
}

const refreshAll = async () => {
  let { limit, offset } = pagination.value
  let data = await api.getArticles(0, offset + limit, searchStr.value)
  articles.value = data
}

usePersistentScroll()

onMounted(async () => {
  const { limit, offset } = pagination.value
  articles.value = await api.getArticles(offset, limit)
})

const refresh = useRefreshStore()
const autoRefresh = refresh.article
const refreshInterval = refresh.interval
const autoRefreshTimer = ref(null)
onActivated(() => {
  if (autoRefresh) {
    autoRefreshTimer.value = setInterval(async () => {
      await refreshAll()
    }, refreshInterval)
  }
})

onDeactivated(() => {
  clearInterval(autoRefreshTimer.value)
})

onUnmounted(() => {
  clearInterval(autoRefreshTimer.value)
})

const like = useLikeStore()

const star = async (id) => {
  let data = await api.starArticle(id)
  if (data.likes) {
    let idx = articles.value.findIndex((a) => a.id === id)
    articles.value[idx] = data
  }
}
</script>
<template>
  <NutNavbar title="所有文章" />

  <NutSearchbar
    v-model="searchStr"
    placeholder="搜索"
    @search="refreshAll"
  >
    <template #rightout>
      <Search2 @click="refreshAll" />
    </template>
  </NutSearchbar>

  <NutInfiniteLoading v-model="infinityLoading" :has-more="hasMore" @load-more="loadMore">
    <NutPullRefresh v-model="pullLoading" @refresh="pullLoad">
      <ArticleCard
        v-for="a in articles"
        :key="a.id"
        v-bind="a"
        class="m-3"
        @onStar="star"
      />
    </NutPullRefresh>
  </NutInfiniteLoading>
</template>