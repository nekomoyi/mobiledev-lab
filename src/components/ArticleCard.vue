<script setup>
import {
  IconThumbUp,
  IconMessage,
  IconMore
} from '@arco-design/web-vue/es/icon'
import constants from '@/utils/constants'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const props = defineProps({
  src: String,
  title: String,
  description: String,
  star: Number,
  id: Number,
  owner_id: String,
  modify_time: String,
  comment_count: Number,
  showMessage: {
    type: Boolean,
    default() { return true }
  },
  owner: {
    type: Object,
    default() { return { name: "", avatar: "" } }
  }
})

const formatDatetime = (datetime) => {
  return new Date(datetime).toLocaleString()
}

const router = useRouter()
const emit = defineEmits(['onStar'])

const toUserArticles = (id) => {
  if (useUserStore().user.uuid === id)
    router.push('/?tab=my-articles')
  else
    router.push(`/users/${id}/articles`)
}
</script>

<template>
  <ACard>
    <template #actions v-if="showMessage">
      <span class="m-2 hover:text-blue-600" @click="emit('onStar', props.id)">
        <IconThumbUp />{{ props.star }}
      </span>
      <span
        class="m-2 hover:text-blue-600"
        @click="router.push(`/articles/${props.id}/comments`)"
      >
        <IconMessage />{{ props.comment_count }}
      </span>
      <span class="m-2 hover:text-blue-600">
        <IconMore @click="router.push(`/articles/${props.id}`)" />
      </span>
    </template>
    <template #cover>
      <div @click="router.push(`/articles/${props.id}`)">
        <img :src="`${constants.ENDPOINT}${props.src}`" alt="cover" />
      </div>
    </template>
    <ACardMeta :title="props.title" :description="props.owner.name">
      <template #avatar>
        <AAvatar :size="24" @click="toUserArticles(props.owner_id)">
          <img :src="`${constants.ENDPOINT}${props.owner.avatar}`" />
        </AAvatar>
        <ATypographyText class="pl-2">{{ formatDatetime(props.modify_time) }}</ATypographyText>
      </template>
    </ACardMeta>
  </ACard>
</template>