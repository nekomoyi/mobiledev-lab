<script setup>
import { useUserStore } from "@/stores/user";
import api from "@/utils/api";
import constants from "@/utils/constants";
import { watch, ref, onActivated } from "vue";
import { useRouter } from "vue-router";
import { IconDelete, IconBook } from "@arco-design/web-vue/es/icon";
import { showDialog } from "@nutui/nutui";
import { Search2 } from "@nutui/icons-vue";
const user = useUserStore();
const router = useRouter();
let comments = ref([]);
let commentsShow = ref([]);
const searchStr = ref("");

const gotoArticle = (articleId) => {
  router.push(`/articles/${articleId}/comments`);
};

const fetchComments = async () => {
  let data = await api.getMyComments();
  if (data.detail) {
    comments.value = [];
    return;
  }
  comments.value = data;
  filterComments();
};

const deleteComment = (comment) => {
  let commentId = comment.id;
  showDialog({
    title: "确定删除评论?",
    content: comment.content,
    onCancel: () => {},
    onOk: async () => {
      try {
        await api.deleteComment(commentId);
        await fetchComments();
      } catch (error) {
        showToast.fail("删除评论失败:", error);
      }
    },
  });
};

onActivated(async () => {
  await fetchComments();
});

const filterComments = () => {
  let str = searchStr.value;
  commentsShow.value = comments.value.filter(
    (c) => c.content.includes(str) || c.item.title.includes(str)
  );
};

watch(searchStr, () => {
  filterComments();
});
</script>
<template>
  <NutNavbar title="我的评论" />
  <NutSearchbar v-model="searchStr" placeholder="搜索">
    <template #rightout>
      <Search2 />
    </template>
  </NutSearchbar>
  <div v-if="!user.token">
    <NutEmpty image="error" description="请先登录" />
    <div class="flex justify-center">
      <NutButton type="info" @click="router.push(`/login`)">去登录</NutButton>
    </div>
  </div>
  <NutEmpty
    image="empty"
    description="没有评论"
    v-else-if="comments.length == 0"
  />
  <AList v-else>
    <AListItem v-for="c in commentsShow" :key="c.id">
      <AListItemMeta :title="c.item?.title" @click="gotoArticle(c.item_id)">
        <template #description>
          <div>
            <span>{{ c.content }}</span>
          </div>
          <div class="text-xs">
            <span>{{ new Date(c.create_time).toLocaleString() }}</span>
          </div>
        </template>
        <template #avatar>
          <AAvatar shape="square">
            <img :src="`${constants.ENDPOINT}${c.owner?.avatar}`" />
          </AAvatar>
        </template>
      </AListItemMeta>
      <template #actions>
        <IconDelete @click="deleteComment(c)" />
        <IconBook @click="gotoArticle(c.item_id)" />
      </template>
    </AListItem>
    <template #empty />
  </AList>
</template>
