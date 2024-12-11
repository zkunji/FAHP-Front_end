<script setup>
import PageContainer from '@/components/PageContainer.vue'
import { Plus } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import {
  userUpdateInfoService,
  userGetInfoService,
  userMGetInfoService,
  userUpdateAdminInfoService
} from '@/api/user'
const uploadRef = ref()
const userStore = useUserStore()

// const imageUrl = ref(userStore.user.user_pic)
const onSelectFile = (uploadFile) => {
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    userStore.imageUrl = reader.result
    console.log(userStore.imageUrl)
  }
}

const formRef = ref()
const {
  user: { username, phone, email, sex }
} = useUserStore()

const form = ref({
  username,
  phone,
  email,
  sex
  // imageUrl: userStore.imageUrl
})
console.log(form.value)
onMounted(async () => {
  if (userStore.role !== 'admin') {
    const userInform = await userGetInfoService()
    form.value = userInform.data.data
  } else {
    const userInform = await userMGetInfoService()
    form.value = userInform.data.data
  }
})
const rules = {
  username: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { min: 11, max: 11, message: '长度为11个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change']
    }
  ]
}

const submitForm = async () => {
  // 表单校验
  await formRef.value.validate()
  console.log(form.value)
  if (userStore.role !== 'admin') {
    await userUpdateInfoService(form.value)
  } else {
    await userUpdateAdminInfoService(form.value)
  }
  // getUser()
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="基本资料">
    <!-- 表单部分 -->
    <template #default>
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        class="avatar-uploader"
        :show-file-list="false"
        :on-change="onSelectFile"
      >
        <img
          v-if="userStore.imageUrl"
          :src="userStore.imageUrl"
          class="avatar"
        />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <br />
      <el-button
        @click="uploadRef.$el.querySelector('input').click()"
        type="primary"
        :icon="Plus"
        size="large"
        >选择图片</el-button
      >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        style="width: 300px"
      >
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="1" size="large">男</el-radio>
            <el-radio label="0" size="large">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户电话" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')"
            >提交修改</el-button
          >
        </el-form-item>
      </el-form>
    </template>
  </page-container>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 120px;
      height: 120px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
</style>
