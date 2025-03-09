<script setup>
import { ref, h, shallowRef, onMounted } from 'vue'
import AllArticles from './AllArticles.vue'
import MyArticles from './MyArticles.vue'
import MyComments from './MyComments.vue'
import Profile from './Profile.vue'
import { Find, Home, Comment, My } from '@nutui/icons-vue'
const tabItems = ref([
  { title: '所有文章', icon: h(Find), name: 'all-articles' },
  { title: '我的文章', icon: h(Home), name: 'my-articles' },
  { title: '我的评论', icon: h(Comment), name: 'my-comments' },
  { title: '个人信息', icon: h(My), name: 'profile' }
])
const tabComponents = [
  AllArticles,
  MyArticles,
  MyComments,
  Profile
]
const activeTab = ref(3)
const currentComponent = shallowRef(tabComponents[activeTab.value])

const tabSwitch = (_, idx) => {
  currentComponent.value = tabComponents[idx]
}
</script>

<template>
  <keep-alive>
    <component :is="currentComponent" />
  </keep-alive>
  <NutTabbar
    v-model="activeTab"
    @tab-switch="tabSwitch"
    bottom
    safe-area-inset-bottom
    placeholder
  >
    <NutTabbarItem
      v-for="t in tabItems"
      :key="t.name"
      :tab-title="t.title"
      :icon="t.icon"
    />
  </NutTabbar>
</template>