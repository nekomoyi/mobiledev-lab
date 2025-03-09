<script setup>
import { onMounted, ref } from "vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
import imageCompression from "browser-image-compression";
import constants from "@/utils/constants";
import { useUserStore } from "@/stores/user";
const user = useUserStore();
const headToken = { Authorization: `${user.token}` };
const props = defineProps({
  url: {
    type: String,
    default: `${constants.ENDPOINT}/uploadimage/`,
  },
  maxWidthOrHeight: {
    type: Number,
    default: 800,
  },
});

const emit = defineEmits(["onSuccess", "onDelete"])
const compressOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: props.maxWidthOrHeight,
  useWebWorker: true,
}
const needCompression = ref(true)
const imgPath = ref("")
const imgSrc = computed(() => {
  return `${constants.ENDPOINT}${imgPath.value}`
})
const fileList = ref([])

const onSuccess = ({ responseText }) => {
  let resp = JSON.parse(responseText)
  resp.src = resp?.src ?? resp?.url
  imgPath.value = resp.src
  emit("onSuccess", resp)
}

const onDelete = async (_) => {
  await fetch(`${constants.ENDPOINT}/deleteimage-bypath${imgPath.value}`, {
    method: "DELETE",
    headers: headToken,
  })
  imgPath.value = ""
}

const compressImage = async (files) => {
  const file = files[0]
  if (!needCompression.value)
    return [ file ]
  try {
    console.log(`originalFile size ${file.size / 1024 } KB`)
    const compressedFile = await imageCompression(file, compressOptions)
    console.log(
      `compressedFile size ${compressedFile.size / 1024 } KB`
    )
    return [ compressedFile ]
  } catch (error) {
    console.error("Failed to compress image", error)
  }
}
</script>

<template>
  <div>
    <NutUploader
      :url="props.url"
      :file-list="fileList"
      :headers="headToken"
      @success="onSuccess"
      @delete="onDelete"
      :before-upload="compressImage"
    />
  </div>
</template>
