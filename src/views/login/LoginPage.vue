<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import {
  userSpeRegisterService,
  userManRegisterService,
  userSpeLoginService,
  userManLoginService
} from '@/api/user'
import { userRegisterService, userLoginService } from '@/api/user2.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { watch } from 'vue'
import { useUserStore } from '@/stores'

const isRegister = ref(false)
const form = ref('form')
const formModel = ref({
  account: '',
  password: '',
  re_password: ''
})

const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  re_password: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const register = async () => {
  // 验证表单
  await form.value.validate()
  console.log('通过验证')
  // const roleType = document.querySelector(
  //   'input[name="roleType"]:checked'
  // ).value
  // if (roleType === null) {
  //   ElMessage.error('请选择用户类型')
  //   return
  // }
  // console.log(roleType)
  // if (roleType === 'specialist') {
  let res = await userSpeRegisterService(formModel.value)
  // } else {
  //   var res = await userManRegisterService(formModel.value)
  // }
  console.log('成功返回')
  // 弹出成功消息
  ElMessage.success('注册成功')
  // 改变注册状态
  isRegister.value = false
}

const userStore = useUserStore()
const router = useRouter()

const login = async () => {
  await form.value.validate()
  console.log('通过验证')
  // const roleType = document.querySelector(
  //   'input[name="roleType"]:checked'
  // )?.value
  // if (roleType !== undefined) {
  //   console.log(roleType)
  // } else {
  //   ElMessage.error('请选择用户类型')
  //   return
  // }
  // console.log(roleType)

  // const roleType = 'specialist'
  if (formModel.value.account !== 'admin') {
    let res = await userSpeLoginService(formModel.value)
    if (res.data.code === 400) {
      ElMessage.warning(res.data.msg)
      return
    }
    console.log('开始登陆', res.data.data.token)
    userStore.setToken(res.data.data.token, res.data.data.uid)
    console.log(userStore.token, userStore.uid)
    userStore.role = 'specialist'
    ElMessage.success('登录成功')
    router.push('/home')
    console.log('进入用户页1')
  } else {
    // 登录2
    const result = await userLoginService({
      username: 'admin',
      password: 'qazwsx@123'
    })
    userStore.setToken2(result.data.token)
    console.log(userStore.token2)
    console.log('登录2成功！！')
    let res = await userManLoginService(formModel.value)
    if (res.data.msg === '账号或密码不正确') {
      ElMessage.warning('账号或密码不正确')
      return
    }
    console.log('开始登陆', res.data.data.token)
    userStore.setMToken(res.data.data.token, res.data.data.adminId)
    console.log(userStore.token, userStore.adminId)
    userStore.role = 'admin'
    ElMessage.success('登录成功,欢迎尊贵的管理员')
    router.push('/admin/role')
    console.log('进入用户页')
  }
}
watch(isRegister, () => {
  formModel.value = {
    account: '',
    password: '',
    re_password: ''
  }
})
</script>

<template>
  <body>
    <div class="main">
      <div class="box">
        <div class="left">
          <img src="@/assets/left.png" alt="" />
        </div>
        <div class="right">
          <!-- <div class="logo"><img src="@/assets/logo.png" alt="" /></div> -->
          <el-form
            :model="formModel"
            :rules="rules"
            ref="form"
            size="large"
            autocomplete="off"
            v-if="isRegister"
          >
            <el-form-item>
              <h1>注册</h1>
            </el-form-item>
            <el-form-item prop="account">
              <el-input
                v-model="formModel.account"
                :prefix-icon="User"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="formModel.password"
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <el-form-item prop="re_password">
              <el-input
                v-model="formModel.re_password"
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入再次密码"
              ></el-input>
            </el-form-item>
            <!-- <div class="roleBox">
              <input type="radio" value="specialist" name="roleType" />我是专家
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" value="manager" name="roleType" />我是管理员
            </div> -->
            <el-form-item>
              <el-button
                @click="register"
                class="btn"
                type="primary"
                auto-insert-space
              >
                注册
              </el-button>
            </el-form-item>
            <el-form-item class="flex">
              <el-link
                type="info"
                :underline="false"
                @click="isRegister = false"
              >
                ← 返回
              </el-link>
            </el-form-item>
          </el-form>
          <el-form
            :model="formModel"
            :rules="rules"
            ref="form"
            size="large"
            autocomplete="off"
            v-else
          >
            <el-form-item>
              <h1>登录</h1>
            </el-form-item>
            <el-form-item prop="account">
              <el-input
                v-model="formModel.account"
                :prefix-icon="User"
                placeholder="请输入用户名"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="formModel.password"
                name="password"
                :prefix-icon="Lock"
                type="password"
                placeholder="请输入密码"
              ></el-input>
            </el-form-item>
            <!-- <div class="roleBox">
              <input type="radio" value="specialist" name="roleType" />我是专家
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" value="manager" name="roleType" />我是管理员
            </div> -->
            <!-- <el-form-item class="flex">
              <div class="flex">
                <el-checkbox>记住我</el-checkbox>
                <el-link type="primary" :underline="false">忘记密码？</el-link>
              </div>
            </el-form-item> -->
            <el-form-item>
              <el-button
                @click="login"
                class="btn"
                type="primary"
                auto-insert-space
                >登录</el-button
              >
            </el-form-item>
            <el-form-item class="flex">
              <el-link
                type="info"
                :underline="false"
                @click="isRegister = true"
              >
                注册 →
              </el-link>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="foot">
        <span>基于模糊层级分析法高校内控评价数智系统©2024</span>
      </div>
    </div>
  </body>
</template>

<style lang="scss" scoped>
body {
  background-image: url(@/assets/bg.png);
  width: 100vw;
  height: 100vh;
  margin: 0;
}
.box {
  width: 86%;
  height: 550px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.8);
  border-radius: 30px;
  display: flex;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.left {
  width: 65%;
  background: linear-gradient(to right, #15bbfc, #073edf);
  border-radius: 30px 0 0 30px;
}
.left > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1;
}
.right {
  width: 35%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0 20px;
  border-radius: 0 30px 30px 0;
}
.logo {
  max-width: 50px;
  max-height: 50px;
  margin: 30px auto;
}
.logo > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
h1 {
  text-align: center;
  padding-left: 42%;
  margin-top: 30%;
  font-size: 2em;
}

.btn {
  background: linear-gradient(to bottom, #15bbfc, #073edf);
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 30px;
  height: 46px;
  width: 80%;
  font-size: 18px;
  display: block;
  margin: auto;
  margin-top: 30px;
}
.foot span {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
  color: #fff;
}
/* 适配PC */
@media screen and (min-width: 960px) {
  .box {
    max-width: 950px;
    min-width: 750px;
  }
}
/* 适配ipad */
@media screen and (max-width: 960px) {
  .box {
    display: block;
    height: auto;
  }
  .left,
  .right {
    width: 100%;
    margin-top: 0;
  }
  .left {
    height: 200px;
  }
  .right {
    padding: 2vw 2vw;
  }
  h1 {
    padding-top: 0;
    margin-bottom: 1vw;
  }
  .inputItem,
  .forgetPassword,
  .btn {
    margin-top: 2vw;
  }
}
/* 适配移动 */
@media screen and (max-width: 750px) {
  .box {
    width: 85%;
  }
}
</style>
