<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Add } from '@nutui/icons-vue'
import { showToast } from '@nutui/nutui'
import api from '@/utils/api'
import { useUserStore } from '@/stores/user'

const formRef = ref(null)
const router = useRouter()
const formData = ref({
  email: '',
  password: '',
  confirmPassword: ''
})
const formRules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { message: '请输入正确的邮箱格式', regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ }
  ],
  password: [
    { required: true, message: '请输入密码' },
    {
      validator: (val) => {
        return val.length > 2 ?
          Promise.resolve() :
          Promise.reject('密码长度为2位以上')
      }
    }
  ],
  confirmPassword: [
    { required: true, message: '请输入确认密码' },
    {
      validator: (val) => {
        return val === formData.value.password ?
          Promise.resolve() :
          Promise.reject('两次输入密码不一致')
      }
    }
  ]
}
const formValidateProp = (prop) => {
  formRef.value?.validate(prop)
}

const register = async () => {
  formRef.value?.validate().then(async ({ valid, errors }) => {
    console.log(errors)
    if (!valid) return
    let data = await api.register(formData.value.email, formData.value.password)
    if (data.id) {
      let loginResp = await api.login(formData.value.email, formData.value.password)
      if (loginResp.access_token) useUserStore().$patch({ token: `${loginResp.token_type} ${loginResp.access_token}`  })
      await api.userRename(formData.value.email, "/images/1729043598910.jpg")
      router.push('/')
    } else
      showToast.fail(JSON.stringify(data))
  })
}
</script>
<template>
  <NutRow type="flex" justify="center">
    <NutCol :span="8">
      <Add color="darkblue" width="100%" height="40vh" />
    </NutCol>
  </NutRow>
  <NutRow type="flex" justify="center">
    <NutCol :span="18">
      <NutForm
        ref="formRef"
        :model-value="formData"
        :rules="formRules"
      >
        <NutFormItem label="邮箱" prop="email">
          <NutInput v-model="formData.email" placeholder="请输入邮箱" @blur="formValidateProp('email')" />
        </NutFormItem>
        <NutFormItem label="密码" prop="password">
          <NutInput v-model="formData.password" placeholder="请输入密码" type="password" @blur="formValidateProp('password')" />
        </NutFormItem>
        <NutFormItem label="确认密码" prop="confirmPassword">
          <NutInput v-model="formData.confirmPassword" placeholder="请输入确认密码" type="password" @blur="formValidateProp('confirmPassword')" />
        </NutFormItem>
      </NutForm>
      <div class="flex justify-center pt-2">
        <NutButton type="info" @click="register">注册</NutButton>
      </div>
    </NutCol>
  </NutRow>
</template>