<template>
  <page-container title="首页">
    <div class="driverBtn">
      <el-button @click="driverobj">步骤条向导</el-button>
    </div>
    <div id="home-desc">
      <h1 style="margin-top: -10px">
        请专家按照标度类型表对各级指标相对重要性进行打分
      </h1>
      <h3 style="text-align: center">判断矩阵的标度类型表</h3>
      <table>
        <tr>
          <th>序号</th>
          <th>重要性等级</th>
          <th>r<sub>mn</sub></th>
        </tr>
        <tr>
          <td>1</td>
          <td>同等重要</td>
          <td>1</td>
        </tr>
        <tr>
          <td>2</td>
          <td>稍微重要</td>
          <td>3</td>
        </tr>
        <tr>
          <td>3</td>
          <td>比较重要</td>
          <td>5</td>
        </tr>
        <tr>
          <td>4</td>
          <td>十分重要</td>
          <td>7</td>
        </tr>
        <tr>
          <td>5</td>
          <td>绝对重要</td>
          <td>9</td>
        </tr>
        <tr>
          <td>6</td>
          <td>稍微不重要</td>
          <td>1/3</td>
        </tr>
        <tr>
          <td>7</td>
          <td>比较不重要</td>
          <td>1/5</td>
        </tr>
        <tr>
          <td>8</td>
          <td>十分不重要</td>
          <td>1/7</td>
        </tr>
        <tr>
          <td>9</td>
          <td>绝对不重要</td>
          <td>1/9</td>
        </tr>
      </table>
      <p>
        注意：而当9个等级不够用时，可以用2，4，6，8，1/2，1/4，1/6，1/8表示相邻判断的中值。
      </p>
    </div>
    <el-button
      id="goPlay"
      @click="goPath"
      type="success"
      text
      style="font-size: large; margin-top: -10px"
      >点击我，开始一级指标权重赋值</el-button
    >
  </page-container>
</template>

<script setup>
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
const router = useRouter()
const steps = [
  {
    element: '#home-desc',
    popover: {
      title: '赋值标准表',
      description: '这个表格列举了所有重要性等级和对应的赋值，了解后即可赋值。',
      side: 'left',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#goPlay',
    popover: {
      title: '点击我！！',
      description: '点击这个链接，跳转到一级指标赋值页面，开始权重赋值之旅吧！',
      nextBtnText: '完成',
      prevBtnText: '上一步'
    }
  }
]
onMounted(() => {
  ElMessageBox.confirm(
    '请您按照顺序，先完成权重赋值中的一级指标和二级指标后，再完成指标评分，否则会造成打分失败！！',
    '温馨提示',
    {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }
  )
})
const goPath = () => {
  router.push('/index/first')
}
const driverobj = () => {
  const driverObj = driver({
    allowClose: false,
    steps: steps
  })
  driverObj.drive()
  driver.start()
}
</script>

<style scoped>
td,
th {
  width: 255px;
  height: 38px;
  border: 1px solid#000;
  /* padding: 4px; */
}
table {
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid #000;
  background: #e9eff7;
  text-align: center;
  margin: -10px auto;
}
input {
  border: none;
  background: #e9eff7;
  /* 文字水平居中 */
  text-align: center;
  /* 输入无框 */
  outline: none;
  font-size: 18px;
}
button {
  margin-top: 30px;
  margin-left: 10px;
}
a {
  margin-top: -6px;
  font-size: 20px;
}
.driverBtn {
  position: absolute;
  top: 66px;
  right: 50px;
}
</style>
