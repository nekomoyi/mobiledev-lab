<script setup>
import { useRefreshStore } from '@/stores/refresh'
import api from '@/utils/api'
import { usePersistentScroll } from '@/utils/scroll'
import { ref, onMounted, onActivated, onDeactivated, onUnmounted } from 'vue'

const pagination = ref({
  limit: 5,
  offset: 0,
})

const articles = ref([])
const pullLoading = ref(false)
const infinityLoading = ref(false)
const hasMore = ref(true)

const loadMore = async () => {
  const { limit, offset } = pagination.value
  const data = await api.getArticles(offset + limit, limit)
  articles.value = [...articles.value, ...data]
  pagination.value.offset += limit
  hasMore.value = data.length === limit
  infinityLoading.value = false
}

const pullLoad = async () => {
  pagination.value.offset = 0
  hasMore.value = true
  const { limit, offset } = pagination.value
  const data = await api.getArticles(offset, limit)
  articles.value = data
  pullLoading.value = false
}

const refreshAll = async () => {
  let { limit, offset } = pagination.value
  let data = await api.getArticles(0, offset + limit)
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

const star = async (id) => {
  await api.starArticle(id)
  await refreshAll()
}
</script>
<template>
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