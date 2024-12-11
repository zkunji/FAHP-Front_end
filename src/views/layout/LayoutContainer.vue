<script setup>
import {
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { userGetInfoService } from '@/api/user'
const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  try {
    if (userStore.role === 'specialist') {
      var res = await userGetInfoService()
    } else {
      // var res = await userMGetInfoService()
      return
    }
    console.log(res)
    userStore.user.value = res?.data?.data
    console.log(userStore.user.value)
    console.log(userStore.user)
    console.log(userStore.user.value.username)
  } catch (error) {
    console.error(error)
  }
})

const handleCommand = async (command) => {
  if (command === 'logout') {
    await ElMessageBox.confirm(
      '你确认退出高校内控评价数智系统吗？',
      '温馨提示',
      {
        type: 'warning',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
    )
    userStore.removeToken()
    userStore.setUser({})
    router.push(`/login`)
  } else {
    router.push(`/user/${command}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <!-- 首页 -->
        <el-menu-item index="/home" v-if="userStore.role !== 'admin'">
          <el-icon><User /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <!-- 权重赋值 -->
        <el-sub-menu index="/index" v-if="userStore.role !== 'admin'">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>指标权重</span>
          </template>
          <!-- 路由跳转仍缓存组件，切换回来保持原状 -->
          <el-sub-menu index="/index">
            <template #title>
              <el-icon><User /></el-icon>
              <span>一级指标</span>
            </template>
            <el-menu-item index="/index/first">权重赋值</el-menu-item>
            <el-menu-item index="/index/firstAnalyse">查看分析</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="/index">
            <template #title>
              <el-icon><Crop /></el-icon>
              <span>二级指标</span>
            </template>
            <el-menu-item index="/index/second">权重赋值</el-menu-item>
            <el-menu-item index="/index/secondAnalyse">查看分析</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
        <!-- 指标评分 -->
        <el-menu-item index="/score" v-if="userStore.role !== 'admin'">
          <el-icon><User /></el-icon>
          <span>指标评分</span>
        </el-menu-item>
        <!-- 最终结果 -->
        <el-menu-item index="/result" v-if="userStore.role !== 'admin'">
          <!--  :disabled="!userStore.resultFlag[14]" -->
          <el-icon><User /></el-icon>
          <span>最终结果</span>
        </el-menu-item>
        <!-- 我的历史 -->
        <el-menu-item index="/history" v-if="userStore.role !== 'admin'">
          <el-icon><User /></el-icon>
          <span>我的历史</span>
        </el-menu-item>
        <!-- 调查问卷 -->
        <el-menu-item index="/questionnaire" v-if="userStore.role !== 'admin'">
          <el-icon><User /></el-icon>
          <span>调查问卷</span>
        </el-menu-item>
        <!-- 如果用户不是管理员，隐藏 -->
        <el-sub-menu v-if="userStore.role !== 'specialist'" index="/admin">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>管理员中心</span>
          </template>
          <el-menu-item index="/admin/role">
            <el-icon><User /></el-icon>
            <span>查看结果</span>
          </el-menu-item>
          <!-- <el-menu-item index="/admin/record">
            <el-icon><EditPen /></el-icon>
            <span>专家赋值</span>
          </el-menu-item> -->
          <el-menu-item index="/admin/end">
            <el-icon><EditPen /></el-icon>
            <span>最终结果</span>
          </el-menu-item>
          <el-menu-item index="/admin/book">
            <el-icon><EditPen /></el-icon>
            <span>分析报告</span>
          </el-menu-item>
          <el-menu-item index="/admin/fuzzyAlgorithmDataDetails">
            <el-icon><User /></el-icon>
            <span>我的历史</span>
          </el-menu-item>
          <el-menu-item index="/admin/channel">
            <el-icon><User /></el-icon>
            <span>问题分类</span>
          </el-menu-item>
          <el-menu-item index="/admin/manage">
            <el-icon><User /></el-icon>
            <span>问题汇总</span>
          </el-menu-item>
          <el-menu-item index="/admin/questionnaireAdmin">
            <el-icon><EditPen /></el-icon>
            <span>问卷报告</span>
          </el-menu-item>
        </el-sub-menu>
        <!-- 个人中心 -->
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
          <!-- <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>备用页</span>
          </el-menu-item> -->
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          用户：<strong>{{ userStore.user?.value?.username }}</strong>
        </div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user?.value?.avatar || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item command="avatar" :icon="Crop"
                >更换头像</el-dropdown-item
              >
              <el-dropdown-item command="password" :icon="EditPen"
                >重置密码</el-dropdown-item
              >
              <el-dropdown-item command="logout" :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main style="overflow: auto">
        <router-view></router-view>
      </el-main>
      <el-footer>基于模糊层级分析法高校内控评价数智系统©2024</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    overflow-y: hidden;
    background-color: #232323;
    &__logo {
      height: 120px;
      // background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
