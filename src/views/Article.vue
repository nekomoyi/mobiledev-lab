<script setup>
import { useUserStore } from '@/stores/user';
import api from '@/utils/api';
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { Edit, Eye } from '@nutui/icons-vue';
import constants from '@/utils/constants';
import { IconMessage } from '@arco-design/web-vue/es/icon';
import ArticleEditor from '@/components/ArticleEditor.vue';

const router = useRouter();
const route = useRoute();
const user = useUserStore();
const article = ref({
    title: "", description: "", src: "", content: "",
    id: 0, owner_id: "", star: 0,
    modify_time: "", create_time: "",
    owner: { name: "", avatar: "" },
    comment_count: 0, images: [], comments: []
})

const isAuthor = computed(() => user.user.uuid === article.value.owner_id)
const editMode = ref(false)

const editor = ref(null)

onMounted(async () => {
  if (route.params.id) {
    article.value = await api.getArticle(route.params.id)
    if (user.token)
      await api.addReadLog(route.params.id)
  }
})
</script>

<template>
  <NutNavbar
    :title="article.title"
    left-show @click-back="router.back()"
  >
    <template #right>
      <div v-if="isAuthor" class=" text-gray-500">
        <Edit v-if="!editMode" @click="editMode = true" />
        <Eye v-else @click="editor.saveArticle()" />
      </div>
    </template>
  </NutNavbar>
  <NutEmpty v-if="!route.params.id || !article.title" description="文章不存在" />
  <div v-if="!editMode" class="flex items-center justify-center">
    <div class="mx-3">
      <ATypography>
        <ATypographyTitle :heading="3">{{ article.title }}</ATypographyTitle>
        <ATypographyTitle :heading="5">By {{ article.owner.name }}</ATypographyTitle>
        <ATypographyTitle :heading="6">
          更新于 {{ new Date(article.modify_time).toLocaleString() }}
        </ATypographyTitle>
        <ATypographyParagraph>
          <pre class="text-wrap break-all indent-0 leading-6 text-left">{{ article.content }}</pre>
        </ATypographyParagraph>
        <AImage
          v-if="article.src"
          width="100%"
          :title="article.title"
          :description="`${article.description}@${article.owner.name}`"
          :src="`${constants.ENDPOINT}${article.src}`"
          class="py-3"
        />
      </ATypography>
      <div
        v-for="item in article.images"
        :key="item.order"
      >
        <pre class="text-wrap break-all indent-0 leading-6 text-left">{{ item.img_content }}</pre>
        <AImage
          v-if="item.url"
          width="100%"
          :src="`${constants.ENDPOINT}${item.url}`"
          class="py-3"
        />
      </div>
      <NutCell
        title="评论"
        @click="router.push(`/articles/${article.id}/comments`)"
      >
        <template #desc>
          <span class="text-black">
            <IconMessage class="pr-1" />
            {{ article.comment_count }}
          </span>
        </template>
      </NutCell>
    </div>
  </div>
  <ArticleEditor v-else v-model:article="article" ref="editor" @onSave="() => { editMode = false }" />
</template>