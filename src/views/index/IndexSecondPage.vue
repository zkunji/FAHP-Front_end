<script setup>
import { ref } from 'vue'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
const flag = ref(1)
const currentPage1 = ref(1)

const handleNextClick = (val) => {
  console.log(val)
}
const addFlag = () => {
  if (flag.value < 13) addFlag.value + 1
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
  flag.value = val
}
const steps = [
  {
    element: '.oneBox',
    popover: {
      title: '二级指标赋值表格',
      description:
        '在表格中填写数据，只填写左下部分哦，右上部分会补充为所填值的倒数。',
      side: 'left',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '.demo-pagination-block',
    popover: {
      title: '接下来',
      description: '一致性通过后，点击后面的按钮，接着赋值哦',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '.mainBox',
    popover: {
      title: '温馨提示',
      description: '共有13个二级指标，加油哦',
      nextBtnText: '完成',
      prevBtnText: '上一步'
    }
  }
]
const driverobj = () => {
  const driverObj = driver({
    allowClose: false,
    steps: steps
  })
  driverObj.drive()
  driver.start()
}
</script>
<template>
  <keep-alive>
    <page-container title="二级指标">
      <el-button class="driverBtn" @click="driverobj">步骤条向导</el-button>
      <div class="mainBox">
        <div v-show="flag === 1" class="oneBox">
          <one :addFlag="addFlag"></one>
        </div>
        <div v-show="flag === 2" class="twoBox"><two></two></div>
        <div v-show="flag === 3" class="threeBox"><three></three></div>
        <div v-show="flag === 4" class="fourBox"><four></four></div>
        <div v-show="flag === 5" class="fiveBox"><five></five></div>
        <div v-show="flag === 6" class="sixBbox"><six></six></div>
        <div v-show="flag === 7" class="sevenBbox"><seven></seven></div>
        <div v-show="flag === 8" class="eightBbox"><eight></eight></div>
        <div v-show="flag === 9" class="nineBbox"><nine></nine></div>
        <div v-show="flag === 10" class="tenBbox"><ten></ten></div>
        <div v-show="flag === 11" class="elevenBbox"><eleven></eleven></div>
        <div v-show="flag === 12" class="twelveBox"><twelve></twelve></div>
        <div v-show="flag === 13" class="threeteenBox">
          <threeteen></threeteen>
        </div>
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage1"
            :page-size="1"
            :background="true"
            layout="total, prev, pager, next"
            :total="13"
            @current-change="handleCurrentChange"
            @next-click="handleNextClick"
            style="margin-top: 20px; justify-content: flex-end"
          />
        </div>
      </div>
    </page-container>
  </keep-alive>
</template>
<style scoped>
.mainBox {
  margin: 20px auto;
}
input {
  border: none;
  height: 30px;
  width: 120px;
  background-color: #e9eff7;
  text-align: center;
  font-size: 18px;
}
table {
  border-collapse: collapse;
  margin: 20px auto;
  background-color: #e9eff7;
}
th,
td {
  border: 1px solid black;
  padding: 5px;
  text-align: center;
  width: 50px;
  height: 50px;
  text-align: center;
}
th {
  background-color: #e9eff7;
}
.mylist {
  padding: 100px auto;
  display: flex;
  justify-content: space-between;
  list-style: none;
}
.driverBtn {
  position: absolute;
  top: 94px;
  right: 40px;
}
</style>
