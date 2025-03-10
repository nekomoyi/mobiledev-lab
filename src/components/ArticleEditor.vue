<script setup>
import ImageUploader from './ImageUploader.vue';
import api from '@/utils/api';
const article = defineModel('article')


const deleteImageContent = async (item) => {
  const idx = article.value.images.indexOf(item)
  if (item.id > 0) await api.deleteImageById(item.id)
  else
    if (item?.url)
      await api.deleteImage(item.url)
  article.value.images.splice(idx, 1)
}

const saveArticle = async () => {
  const articleData = {
    title: article.value.title,
    description: article.value.description,
    src: article.value.src,
    content: article.value.content,
  }
  if (article.value.id === 0) {
    let resp = await api.createArticle(articleData)
    article.value.id = resp.id
  }
  else
    await api.updateArticleById(article.value.id, articleData)
  for (const img of article.value.images) {
    await api.uploadOrUpdateImageToArticleById(article.value.id, img)
  }
  emit('onSave')
}

const addImageContent = () => {
  let item = article.value.images[article.value.images.length - 1]
  article.value.images.push({
    name: '',
    img_content: '',
    url: '',
    order: item?.order ? item.order + 1 : 0,
    id: 0
  })
}

defineExpose({ saveArticle })
const emit = defineEmits(['onSave'])

</script>

<template>
  <NutForm style="width: 100%;">
    <NutFormItem label="文章标题">
      <NutTextarea
        v-model="article.title"
        autosize
        limit-show
        :rows="3"
        :max-length="50"
      />
    </NutFormItem>
    <NutFormItem label="内容">
      <NutTextarea
        v-model="article.content"
        content
        limit-show
        :rows="3"
        :max-length="200"
    />
    </NutFormItem>
    <NutFormItem label="简介">
      <NutTextarea
        v-model="article.description"
        autosize
        limit-show
        :rows="3"
        :max-length="200"
      />
    </NutFormItem>
    <NutFormItem label="封面图片">
      <ImageUploader v-model="article.src" @onDelete="async (src) => { await api.deleteImage(src) }" />
    </NutFormItem>
  </NutForm>
  <NutSwipeGroup lock class="overflow-x-clip">
    <NutSwipe
      v-for="item in article.images"
      :key="item.id"
    >
      <NutTextarea
        v-model="item.img_content"
        :rows="3"
        :max-length="2000"
        autosize
        limit-show
      />
      <ImageUploader v-model="item.url" class="ml-5" />
      <template #right>
        <NutButton
          type="danger"
          style="height: 100%;"
          shape="square"
          @click="() => deleteImageContent(item)"
        >删除</NutButton>
      </template>
    </NutSwipe>
  </NutSwipeGroup>
  <NutSpace :gutter="20" class="m-3">
    <NutButton size="small" type="info" @click="addImageContent">添加内容</NutButton>
    <NutButton size="small" type="primary" @click="saveArticle">提交</NutButton>
  </NutSpace>
</template>