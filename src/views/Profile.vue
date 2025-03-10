<script setup>
import ImageUploader from "@/components/ImageUploader.vue";
import { useUserStore } from "@/stores/user";
import { onActivated, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import constants from "@/utils/constants";
import { Eye } from "@nutui/icons-vue";
import { showToast } from "@nutui/nutui";
import api from "@/utils/api";
const router = useRouter();
const userInfo = ref({
  name: "",
  avatar: "",
  id: 0,
  uuid: "",
  items: [],
  comments: [],
  email: ""
})
const user = useUserStore();

const getUserInfo = async () => {
  const resp = await fetch(`${constants.ENDPOINT}/users/mine/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": user.token
    }
  })
  const data = await resp.json();
  userInfo.value = data;
}

const logout = () => {
  user.$patch({ token: "", user: {} })
  router.push("/login")
}

onMounted(() => {
  if (!user.token)
    router.push("/login")
})

onActivated(() => {
  getUserInfo()
})

const fetchUser = async () => {
  const resp = await fetch(`${constants.ENDPOINT}/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": user.token
    }
  })
  const data = await resp.json();
  return data
}

const newPwd = ref("")
const pwdView = ref(false)
const pwdViewType = ref("password")

const changePwd = async () => {
  let u = await fetchUser()
  u.password = newPwd.value
  const resp = await fetch(`${constants.ENDPOINT}/users/me/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": user.token
    },
    body: JSON.stringify(u)
  })
  if (!resp.ok)
    showToast.fail(JSON.stringify(await resp.json()))
  else {
    showToast.success("密码修改成功")
    pwdView.value = false
    newPwd.value = ""
  }
}

const nameView = ref(false)
const newName = ref("")

const changeUser = async(username, password) => {
  const data = await api.userRename(username, password)
  if (data.name) {
    showToast.success("修改成功")
    return true
  } else {
    showToast.fail(json.stringify(data))
    return false
  }
}

const changeName = async () => {
  if (await changeUser(newName.value, userInfo.value.avatar)) {
    userInfo.value.name = newName.value
    nameView.value = false
    newName.value = ""
  }
}

const avatarView = ref(false)
const newAvatar = ref("")
const changeAvatar = async () => {
  if (await changeUser(userInfo.value.name, newAvatar.value)) {
    userInfo.value.avatar = newAvatar.value
    avatarView.value = false
  }
}
</script>

<template>
  <NutNavbar title="22211860216 卢锦轩" />
  <NutCell title="头像" is-link @click="avatarView = !avatarView">
    <template #desc>
      <NutAvatar size="large">
        <img :src="constants.ENDPOINT + userInfo.avatar">
      </NutAvatar>
    </template>
  </NutCell>
  <NutCell v-if="avatarView">
    <template #title>
      <ImageUploader
        @onSuccess="(resp) => { newAvatar = resp.src }"
      />
    </template>
    <template #desc>
      <div class="flex justify-end items-center h-full w-full">
        <NutButton type="info" size="small" @click="changeAvatar">确定</NutButton>
      </div>
    </template>
  </NutCell>
  <NutCell title="UUID" :desc="userInfo.uuid" />
  <NutCell title="Email">
    <template #desc>
      <span class="text-black">{{ userInfo.email }}</span>
    </template>
  </NutCell>
  <NutCell title="昵称" is-link @click="nameView = !nameView">
    <template #desc>
      <span class="text-black">{{ userInfo.name }}</span>
    </template>
  </NutCell>
  <NutInput placeholder="请输入新昵称" v-if="nameView" v-model="newName">
    <template #right>
      <NutButton type="info" size="small" @click="changeName">确认</NutButton>
    </template>
  </NutInput>
  <NutCell title="修改密码" is-link @click="pwdView = !pwdView" />
  <NutInput :type="pwdViewType" placeholder="请输入新密码" v-if="pwdView" v-model="newPwd">
    <template #left>
      <Eye
        @click="pwdViewType = pwdViewType === 'password' ? 'text' : 'password'"
        class="mr-2"
      />
    </template>
    <template #right>
      <NutButton type="info" size="small" @click="changePwd">确认</NutButton>
    </template>
  </NutInput>
  <NutCell title="发表文章数" is-link>
    <template #desc>
      <span class="text-black">{{ userInfo.items.length }}</span>
    </template>
  </NutCell>
  <NutCell title="发表评论数" is-link>
    <template #desc>
      <span class="text-black">{{ userInfo.comments.length }}</span>
    </template>
  </NutCell>
  <NutCell title="设置" is-link @click="router.push('/settings')" />
  <div class="flex justify-center">
    <NutButton type="danger" @click="logout">登出</NutButton>
  </div>
</template>
