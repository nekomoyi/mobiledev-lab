<script setup>
import { IconMessage, IconDelete } from '@arco-design/web-vue/es/icon'
import constants from '@/utils/constants'
import { useUserStore } from '@/stores/user'
const user = useUserStore()
const emit = defineEmits(['onDelete', 'onHint'])
defineModel('comments')
</script>
<template>
  <AComment
    align="right"
    v-for="c in comments"
    :key="c.id"
    :author="c.owner.name"
    :avatar="`${constants.ENDPOINT}${c.owner.avatar}`"
    :datetime="new Date(c.create_time).toLocaleString()"
    class="m-3"
  >
    <template #actions>
      <span @click="emit('onHint', c)">
        <IconMessage class="mr-1" />回复
      </span>
      <span v-if="user.user.uuid == c.owner_id" @click="emit('onDelete', c)">
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
      <div>
        <AImage :src="`${constants.ENDPOINT}${c.url}`" v-if="c.url" width="64px" />
      </div>
    </template>
    <AComment
      align="right"
      v-if="c.replies"
      v-for="r in c.replies"
      :key="r.id"
      :author="r.owner.name"
      :avatar="`${constants.ENDPOINT}${r.owner.avatar}`"
      :datetime="new Date(r.create_time).toLocaleString()"
    >
      <template #actions>
        <span v-if="user.user.uuid == r.owner_id" @click="emit('onDelete', r)">
          <IconDelete class="mr-1" />删除
        </span>
      </template>
      <template #content>
        <div>
          {{ r.content }}
        </div>
        <div>
          <AImage :src="`${constants.ENDPOINT}${r.url}`" v-if="r.url" width="64px" />
        </div>
      </template>
    </AComment>
  </AComment>
</template>
