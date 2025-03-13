<script setup>
import router from "@/router/router";
import { useRefreshStore } from "@/stores/refresh";
import { useUserStore } from "@/stores/user";
import api from "@/utils/api";
import constants from "@/utils/constants";
import { usePersistentScroll } from "@/utils/scroll";
import { Search2 } from "@nutui/icons-vue";
import {
  ref,
  onMounted,
  onActivated,
  onDeactivated,
  onUnmounted,
  watch,
} from "vue";

const pagination = ref({
  limit: 5,
  offset: 0,
});

const user = useUserStore();
const articles = ref([]);
const recommendArticles = ref([]);
const recommends = ref([]);
const recommendIdx = ref(0);
const pullLoading = ref(false);
const infinityLoading = ref(false);
const hasMore = ref(true);
const searchStr = ref("");
const readLogs = ref([]);
const readId = ref([]);

const loadMore = async () => {
  const { limit, offset } = pagination.value;
  const data = await api.getArticles(offset + limit, limit, searchStr.value);
  articles.value = [...articles.value, ...data];
  pagination.value.offset += limit;
  hasMore.value = data.length === limit;
  infinityLoading.value = false;
};

const pullLoad = async () => {
  pagination.value.offset = 0;
  hasMore.value = true;
  const { limit, offset } = pagination.value;
  const data = await api.getArticles(offset, limit, searchStr.value);
  articles.value = data;
  pullLoading.value = false;
};

const refreshAll = async () => {
  let { limit, offset } = pagination.value;
  let data = await api.getArticles(0, offset + limit, searchStr.value);
  articles.value = data;
};

usePersistentScroll();

onMounted(async () => {
  const { limit, offset } = pagination.value;
  articles.value = await api.getArticles(offset, limit);
  if (user.token) readLogs.value = await api.getUserReadLogs();
  recommendArticles.value = await api.getRecommends();
  try {
    recommends.value = recommendArticles.value.map((a) => {
      return { title: a.title, src: a.src, id: a.id, idx: 0 };
    });
    for (let i = 0; i < recommends.value.length; i++)
      recommends.value[i].idx = i;
  } catch (e) {
    console.log(e);
  }
});

const refresh = useRefreshStore();
const autoRefresh = refresh.article;
const refreshInterval = refresh.interval;
const autoRefreshTimer = ref(null);
onActivated(() => {
  if (autoRefresh) {
    autoRefreshTimer.value = setInterval(async () => {
      await refreshAll();
    }, refreshInterval);
  }
});

onDeactivated(() => {
  clearInterval(autoRefreshTimer.value);
});

onUnmounted(() => {
  clearInterval(autoRefreshTimer.value);
});

const star = async (id) => {
  let data = await api.starArticle(id);
  if (data.likes) {
    let idx = articles.value.findIndex((a) => a.id === id);
    articles.value[idx] = data;
  }
};

watch(readLogs, (newLogs) => {
  readId.value = newLogs.map((log) => log.item_id);
});
</script>
<template>
  <NutNavbar title="所有文章" />

  <NutSearchbar v-model="searchStr" placeholder="搜索" @search="refreshAll">
    <template #rightout>
      <Search2 @click="refreshAll" />
    </template>
  </NutSearchbar>

  <NutInfiniteLoading
    v-model="infinityLoading"
    :has-more="hasMore"
    @load-more="loadMore"
  >
    <NutPullRefresh v-model="pullLoading" @refresh="pullLoad">
      <NutSwiper
        :auto-play="3000"
        pagination-visible
        pagination-color="#426543"
        pagination-unselected-color="#808080"
        :is-prevent-default="false"
        @change="(idx) => { recommendIdx = idx; }"
      >
        <NutSwiperItem v-for="r in recommends" :key="r.id">
          <img
            :src="`${constants.ENDPOINT}${r.src}`"
            :alt="r.title"
            style="width: 100%; height: 250px;"
            draggable="false"
            @click="router.push('/articles/' + r.id)"
          />
        <div
          class="absolute bottom-0 p-2 text-white w-full"
          style="background-color: rgba(0,0,0,0.3);"
          v-if="r.idx === recommendIdx"
        >
          <p class="text-lg">{{ r.title }}</p>
        </div>
        </NutSwiperItem>
      </NutSwiper>
      <ArticleCard
        v-for="a in articles"
        :key="a.id"
        v-bind="a"
        class="m-3"
        @onStar="star"
        :read="readId.includes(a.id) || !user.token"
      />
    </NutPullRefresh>
  </NutInfiniteLoading>
</template>
