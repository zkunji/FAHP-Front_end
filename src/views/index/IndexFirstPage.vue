<script setup>
import { useRouter } from 'vue-router'
import PageContainer from '@/components/PageContainer.vue'
import { analyseServicce } from '@/api/index'
import { useUserStore } from '@/stores'
import { ref, nextTick, onMounted } from 'vue'
import * as echarts from 'echarts'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import {
  setFirstTableData,
  getFirstTableData,
  removeFirstTableData,
  setFirstAnylse,
  setFlag,
  getFlag
} from '@/utils/storage'
import { ElMessage, ElMessageBox } from 'element-plus'
const dialogTableVisible = ref(false)
const userStore = useUserStore()
console.log('userStore.afdId', userStore.afdId)
console.log('userStore.resultFlag', userStore.resultFlag)
const Result = ref({})
function isTwoDimensionalEmptyArray(arr) {
  if (!Array.isArray(arr) || arr.length !== 1) {
    return false
  }

  const innerArr = arr[0]

  if (!Array.isArray(innerArr) || innerArr.length !== 0) {
    return false
  }

  return true
}
onMounted(() => {
  ElMessageBox.confirm('您是否使用上次保存的数据？', '温馨提示', {
    type: 'warning',
    confirmButtonText: '确认',
    cancelButtonText: '取消'
  })
    .then(() => {
      const arrayData = getFirstTableData().value
      console.log(arrayData)
      if (isTwoDimensionalEmptyArray(arrayData)) {
        ElMessage.error('没有保存数据！')
        return
      }
      tableData.value = arrayData
      console.log(tableData.value)
    })
    .catch(() => {
      // removeFirstTableData()
    })
})
const steps = [
  {
    element: '#driver-table',
    popover: {
      title: '一级指标赋值表格',
      description:
        '在表格中填写数据，只填写左下部分哦，右上部分会补充为所填值的倒数。',
      side: 'left',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#primary',
    popover: {
      title: '默认数据',
      description: '点击我，所有的数据都会成为1哦！',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#success',
    popover: {
      title: '分析结果',
      description: '完成所有数据的填写后，就可以点击我查看分析结果咯！',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '#warning',
    popover: {
      title: '清空数据',
      description: '点击我，所有的数据都会清空哦，谨慎操作！',
      nextBtnText: '下一步',
      prevBtnText: '上一步'
    }
  },
  {
    element: '.container',
    popover: {
      title: '温馨提示',
      description: '只有赋值一致性检验通过后，才可以再二级赋值哦',
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

const tableData = ref(
  Array.from({ length: 14 }, (_, rowIndex) => {
    return Array.from({ length: 14 }, (_, colIndex) => {
      if (rowIndex === 0 || colIndex === 0 || colIndex < rowIndex) {
        return ''
      } else if (rowIndex === colIndex) {
        return 1
      } else {
        return ''
      }
    })
  })
)

const highlightedRow = ref(-1)

const firstName = [
  '组织架构',
  '决策机制',
  '执行机制',
  '监督机制',
  '协调机制',
  '评价机制',
  '预算控制',
  '收支控制',
  '采购控制',
  '资产控制',
  '工程控制',
  '会计控制',
  '合同控制'
]

const router = useRouter()

const updateSymmetricCell = (rowIndex, colIndex) => {
  tableData.value[colIndex][rowIndex] = 1 / tableData.value[rowIndex][colIndex]
}

const setDefaultValues = () => {
  tableData.value = Array.from({ length: 14 }, () => Array(14).fill(1))
  ElMessage.success('默认值设置成功')
}

const saveData = () => {
  const collectedData = tableData.value.slice(0).map((row) => row.slice(0))
  setFirstTableData(collectedData)
  ElMessage.success('保存成功')
}
const collectData = async () => {
  if (userStore.resultFlag[0] === true) {
    await ElMessageBox.confirm(
      '您已经提交成功，再次提交将重新从头操作！您确定继续此操作吗？',
      '温馨提示',
      {
        type: 'error',
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
    )
  } else {
    await ElMessageBox.confirm('您要提交数据并查看分析结果吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
  }
  const collectedData = tableData.value.slice(1).map((row) => row.slice(1))
  for (let i = 0; i < collectedData.length; i++) {
    for (let j = 0; j < collectedData[i].length; j++) {
      if (collectedData[i][j] === '' || collectedData[i][j] === null) {
        ElMessage.warning('请将所有数据填写完整')
        return
      }
    }
  }

  ElMessageBox.prompt('请为本次评比赋记录名称吧', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  })
    .then(async ({ value }) => {
      ElMessage({
        type: 'success',
        message: `本次记录名称是:${value}`
      })
      const ResultGet = await analyseServicce(value, collectedData)
      // ElMessage.warning(ResultGet)
      console.log(ResultGet)
      if (ResultGet.data.data.afdId !== 0) {
        userStore.afdId.push(ResultGet?.data?.data?.afdId)
        console.log('afdId', userStore.afdId[userStore.afdId.length - 1])
        userStore.resultFlag.length = 0
        userStore.resultFlag.push(1)
        setFlag(userStore.resultFlag)
        console.log(userStore.resultFlag)
      } else {
        ElMessage.warning('一致性未通过！请您重新修改提交！')
        return
      }
      Result.value = ResultGet.data.data
      setFirstAnylse(ResultGet.data.data)
      // flagToFalse()
      // dialogTableVisible.value = true
      router.push('/index/firstAnalyse')
      nextTick(() => {
        var myChart = echarts.init(document.getElementById('main'))
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: firstName,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              data: ['5%', '10%', '15%']
            }
          ],
          series: [
            {
              name: 'Direct',
              type: 'bar',
              barWidth: '60%',
              data: Result.value.proportion.map(parseFloat)
            }
          ]
        })
      })
    })
    .catch(() => {
      ElMessage({
        type: 'warning',
        message: '输入取消'
      })
    })
}

const cleanData = () => {
  ElMessageBox.confirm('您确定要清除数据吗？', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const symmetricAxis = tableData.value.length
    tableData.value = Array.from({ length: symmetricAxis }, (_, rowIndex) => {
      return Array.from({ length: symmetricAxis }, (_, colIndex) => {
        if (rowIndex === colIndex) {
          return tableData.value[rowIndex][colIndex]
        } else {
          return null
        }
      })
    })
    ElMessage.success('清除数据成功')
  })
}
const openNo = () => {
  ElMessageBox.confirm('一致性检验未通过，现在开始重新填写吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // cleanData()
      ElMessage({
        type: 'success',
        message: '一致性未通过，请您开始重新填写！'
      })
      key.value = false
    })
    .catch(() => {
      cleanData()
      ElMessage({
        type: 'info',
        message: '一致性未通过，请您稍后重新填写！'
      })
      key.value = false
    })
}
const key = ref(false)
const openYes = () => {
  ElMessageBox.confirm(
    '恭喜您，一致性检验已通过！立即赋值二级指标吗？',
    '温馨提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: '请您开始赋值二级指标！'
      })
      router.push('/index/second')
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '请您稍后赋值二级指标！'
      })
      key.value = true
    })
}
const reWrite = () => {
  if (Result.value.result) {
    openYes()
  } else {
    openNo()
  }
}
</script>
<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="分析结果"
    :destroy-on-close="true"
    width="80%"
    @close="reWrite"
  >
    <!-- <el-button @click="getPdf('.pdf', 'dataFile')">导出PDF</el-button> -->
    <div class="all">
      <div class="table-container pdf">
        <h2 class="title" style="text-align: center">{{ Result.alias }}</h2>
        <h3>AHP数据</h3>
        <table>
          <thead>
            <tr>
              <td></td>
              <td v-for="name in Result.names" :key="name">{{ name }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in Result.originalData" :key="index">
              <td>{{ Result.names[index] }}</td>
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
        <br /><br />
        <h3>AHP层次分析结果</h3>
        <table style="width: 70%">
          <thead>
            <tr>
              <td>项</td>
              <td>特征向量</td>
              <td>权重值</td>
              <td>最大特征值</td>
              <td>CI值</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(name, index) in Result.names" :key="name">
              <td>{{ name }}</td>
              <td>{{ Result.eigenvectors[index] }}</td>
              <td>{{ Result.proportion[index] }}</td>
              <!-- 只渲染一次 -->
              <template v-if="index === 0">
                <td rowspan="13">{{ Result.maxEigenvalue }}</td>
                <td rowspan="13">{{ Result.ci }}</td>
              </template>
            </tr>
          </tbody>
        </table>
        <!-- 柱状图 -->
        <div id="main" style="width: 1000px; height: 500px"></div>
        <br /><br />
        <h3>智能分析</h3>
        <hr />
        <el-text
          class="mx-1"
          size="large"
          style="line-height: 30px; letter-spacing: 2px"
        >
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 从上表可知，针对{{
            Result.names
          }}总共13项构建13阶判断矩阵进行<span
            style="color: tomato; font-size: large"
            >AHP 层次法研究</span
          >(计算方法为:和积法)，分析得到特征向量为({{ Result.eigenvectors }})，
          并且总共13项对应的权重值分别是:{{ Result.proportion }}。除此之外，
          结合特征向量可计算出最大特征根({{
            Result.maxEigenvalue
          }})，接着利用最大特征根值计算得到 CI值({{
            Result.ci
          }})【CI=(最大特征根-n)/(n-1)]，CI值用于下述的一致性检验使用。
        </el-text>
        <hr />
        <br /><br />

        <h3>随即一致性RI表格</h3>
        <table class="graph">
          <tr>
            <td>n阶</td>
            <td>3</td>
            <td>4</td>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>9</td>
            <td>10</td>
            <td>11</td>
            <td>12</td>
            <td>13</td>
            <td>14</td>
            <td>15</td>
            <td>16</td>
          </tr>
          <tr>
            <td>RI值</td>
            <td>0.52</td>
            <td>0.89</td>
            <td>1.12</td>
            <td>1.26</td>
            <td>1.36</td>
            <td>1.41</td>
            <td>1.46</td>
            <td>1.49</td>
            <td>1.52</td>
            <td>1.54</td>
            <td>1.56</td>
            <td>1.58</td>
            <td>1.59</td>
            <td>1.5943</td>
          </tr>
          <tr>
            <td>n阶</td>
            <td>17</td>
            <td>18</td>
            <td>19</td>
            <td>20</td>
            <td>21</td>
            <td>22</td>
            <td>23</td>
            <td>24</td>
            <td>25</td>
            <td>26</td>
            <td>27</td>
            <td>28</td>
            <td>29</td>
            <td>30</td>
          </tr>
          <tr>
            <td>RI值</td>
            <td>1.6064</td>
            <td>1.6133</td>
            <td>1.6207</td>
            <td>1.6292</td>
            <td>1.6358</td>
            <td>1.6403</td>
            <td>1.6462</td>
            <td>1.6497</td>
            <td>1.6556</td>
            <td>1.6587</td>
            <td>1.6331</td>
            <td>1.6670</td>
            <td>1.6693</td>
            <td>1.6724</td>
          </tr>
        </table>
        <br /><br />
        <h3>一致性检验结果汇总</h3>
        <table class="Result" style="width: 80%">
          <thead>
            <tr>
              <td>最大特征根</td>
              <td>CI值</td>
              <td>RI值</td>
              <td>CR值</td>
              <td>一致性检验结果</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ Result.maxEigenvalue }}</td>
              <td>{{ Result.ci }}</td>
              <td>{{ Result.ri }}</td>
              <td>{{ Result.cr }}</td>
              <td style="color: red">
                {{ Result.result ? '通过' : '未通过' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-dialog>
  <keep-alive>
    <page-container title="一级指标">
      <div class="driverBtn">
        <el-button @click="driverobj">步骤条向导</el-button>
      </div>
      <!-- 状态 -->
      <el-row class="resultFlag">
        <el-col v-if="userStore.resultFlag[0]">
          <el-result icon="success"> </el-result>
        </el-col>
        <el-col v-else>
          <el-result icon="info"></el-result>
        </el-col>
      </el-row>
      <div class="container">
        <h1 style="text-align: center">
          请填写表格的左下部分，右上部分会自动默认对称补齐
        </h1>
        <div id="driver-table">
          <table class="table table-pdf">
            <tr
              v-for="(row, rowIndex) in tableData"
              :key="rowIndex"
              :style="{
                backgroundColor: rowIndex === highlightedRow ? '#DDDDDD' : ''
              }"
            >
              <td
                v-for="(cell, colIndex) in row"
                :key="colIndex"
                :style="{
                  backgroundColor:
                    rowIndex > 0 && colIndex > 0 && colIndex >= rowIndex
                      ? '#E9EFF7'
                      : ''
                }"
              >
                <template v-if="rowIndex === 0 || colIndex === 0">
                  <span v-if="rowIndex === 0 || colIndex === 0">
                    {{
                      rowIndex > 0 || colIndex > 0
                        ? firstName[rowIndex > 0 ? rowIndex - 1 : colIndex - 1]
                        : ''
                    }}
                  </span>
                </template>
                <template v-else>
                  <select
                    v-model="tableData[rowIndex][colIndex]"
                    @change="updateSymmetricCell(rowIndex, colIndex)"
                    :class="{
                      'read-only': colIndex > rowIndex
                    }"
                    :disabled="
                      colIndex > rowIndex ||
                      (rowIndex === colIndex && rowIndex !== 0)
                    "
                  >
                    <option :value="1">同等重要</option>
                    <option :value="3">稍微重要</option>
                    <option :value="5">比较重要</option>
                    <option :value="7">十分重要</option>
                    <option :value="9">绝对重要</option>
                    <option :value="1 / 3">稍微不重要</option>
                    <option :value="1 / 5">比较不重要</option>
                    <option :value="1 / 7">十分不重要</option>
                    <option :value="1 / 9">绝对不重要</option>
                  </select>
                </template>
              </td>
            </tr>
          </table>
        </div>
        <div class="buttons">
          <el-button id="primary" type="primary" @click="setDefaultValues"
            >设置默认</el-button
          >
          <el-button id="success" type="success" @click="saveData"
            >保存数据</el-button
          >
          <el-button id="success" type="success" @click="collectData"
            >一致性测试</el-button
          >
          <el-button id="warning" type="warning" @click="cleanData"
            >清除填写</el-button
          >
          <!-- <el-button @click="getPdf('.table-pdf', 'dataFile')">导出PDF</el-button> -->
        </div>
      </div>
      <a id="goSecond" href="second" v-if="key">点击我，开始二级指标权重赋值</a>
    </page-container>
  </keep-alive>
</template>

<style scoped>
.container {
  /* overflow-x: auto; 添加横向滚动 */
  white-space: nowrap; /* 防止标签换行 */
}
h1 {
  margin-top: -6px;
}
td,
input,
select {
  width: 66px;
  height: 17px;
  border: 1px solid#000;
  font-size: 10px;
}
select {
  border: 0;
}
table {
  margin: 0 auto;
  zoom: 120%;
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid #000;
  background: #e9eff7;
  text-align: center;
}
tr,
th,
td {
  padding: 2px;
  border-left: none;
}
input {
  border: none;
  background: #e9eff7;
  text-align: center;
  outline: none;
}
.buttons {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
#goSecond {
  position: absolute;
  right: 50px;
  bottom: 10%;
  font-size: 20px;
}
.driverBtn {
  position: absolute;
  top: 66px;
  right: 0px;
}
.resultFlag {
  display: block;
  position: absolute;
  transform: scale(0.6);
  top: 100px;
  left: 240px;
}
</style>
