<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue';

const router = useRouter()
const article = ref({
    title: "", description: "", src: "", content: "",
    id: 0, owner_id: "", star: 0,
    modify_time: "", create_time: "",
    owner: { name: "", avatar: "" },
    comment_count: 0, images: [], comments: []
})
</script>
<template>
  <NutNavbar title="发布文章" left-show @click-back="router.back()" />
  <ArticleEditor v-model:article="article" @onSave="router.push('/?tab=my-articles')" />
</template>