<script setup>
import { ElMessageBox } from 'element-plus'
import zh from 'element-plus/es/locale/lang/zh-cn.mjs'
import flagToFalse from './utils/flagToFalse'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
const userStore = useUserStore()
const router = useRouter()
const exam = () => {
  ElMessageBox.confirm('您确定现在要填写调研报告吗吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    window.open('https://www.wjx.cn/vm/rc5rqtv.aspx?wsource=iframe&s=t')
  })
}
const adminExam = () => {
  ElMessageBox.confirm('您确定现在要填写调研报告吗吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    window.open('https://www.wjx.cn/vm/OtmiqCT.aspx?width=750&source=iframe')
    // const a = document.getElementById('test')
    // a.click()
  })
}
const sureOver = () => {
  ElMessageBox.confirm('您确定要重新从开始赋值吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      flagToFalse()
      router.push('/index/first')
    })
    .catch(() => {
      console.log('取消')
    })
}
</script>
<template>
  <!-- 国际化处理 -->
  <el-config-provider :locale="zh">
    <router-view />
  </el-config-provider>
  <div v-if="userStore.role !== 'admin'">
    <!-- <button type="primary" @click="exam" class="test">调研</button> -->
    <button type="primary" @click="sureOver" class="sure">重头再来</button>
  </div>
  <div v-else>
    <!-- <button type="primary" @click="adminExam" class="test">调研报告</button> -->
    <!-- 跳转到与此路由无关的页面 -->
    <a id="test" href="adminTest.html" target="_blank"></a>
  </div>
</template>
<style scoped>
.test {
  position: absolute;
  cursor: pointer;
  width: 44px;
  height: 100px;
  text-align: center;
  right: 0px;
  bottom: 20%;
  border: none;
  font-size: 18px;
  color: aliceblue;
  border-radius: 4px;
  background-color: rgb(0, 0, 236);
}
.sure {
  position: absolute;
  cursor: pointer;
  width: 44px;
  height: 100px;
  text-align: center;
  right: 0px;
  bottom: 1%;
  border: none;
  font-size: 18px;
  color: aliceblue;
  border-radius: 4px;
  background-color: rgb(116, 116, 244);
}
</style>
