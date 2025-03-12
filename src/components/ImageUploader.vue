<script setup>
import { ref, onMounted, watch } from "vue";
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
    default: 1000,
  },
});

const emit = defineEmits(["onSuccess", "onDelete"])
const compressOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: props.maxWidthOrHeight,
  useWebWorker: true,
}
const needCompression = ref(true)
const imgPath = defineModel()
const fileList = ref([])

const onSuccess = ({ responseText }) => {
  let resp = JSON.parse(responseText)
  resp.src = resp?.src ?? resp?.url
  imgPath.value = resp.src
  emit("onSuccess", resp)
}

const onDelete = async (_) => {
  emit("onDelete", imgPath.value)
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

onMounted(() => {
  if (imgPath.value)
    fileList.value.push({ url: `${constants.ENDPOINT}${imgPath.value}`, name: "img", status: 'success', type: 'image' })
})

watch(() => imgPath.value, (newVal) => {
  if (newVal == "")
    fileList.value = []
})
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
      :maximum="1"
    />
  </div>
</template>
