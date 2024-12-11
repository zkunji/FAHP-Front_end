<script>
import { postSecondData } from '@/api/index'
import { useUserStore } from '@/stores'
import { reactive } from 'vue'
import { nextTick } from 'vue'
import * as echarts from 'echarts'

const userStore = useUserStore()

export default {
  data() {
    return {
      tableData: Array.from({ length: 5 }, (_, rowIndex) => {
        return Array.from({ length: 5 }, (_, colIndex) => {
          if (rowIndex === 0 || colIndex === 0 || colIndex < rowIndex) {
            return ''
          } else if (rowIndex === colIndex) {
            return 1
          } else {
            return ''
          }
        })
      }),
      highlightedRow: -1,
      firstName: [
        ' 财务收支审批和报销',
        '会计凭证填制和传递',
        '会计账簿登记',
        '财务报告编审和披露'
      ],
      dialogTableVisible: false,
      key: false,
      result: reactive({})
    }
  },
  methods: {
    updateSymmetricCell(row, col) {
      this.tableData[col][row] = 1 / this.tableData[row][col]
    },
    async setDefaultValues() {
      this.tableData = Array.from({ length: 5 }, () => Array(5).fill(1))
      ElMessage.success('默认值设置成功')
    },
    async collectAndSubmit() {
      for (let i = 0; i < 12; i++) {
        if (userStore.resultFlag[i] === undefined) {
          ElMessage.warning(
            '指标' + (i + 0) + '未完成提交！请先提交指标' + (i + 0)
          )
          return
        }
      }
      if (userStore.resultFlag[12] === true) {
        await ElMessageBox.confirm(
          '您本次已经提交成功，请勿重复提交！！',
          '温馨提示',
          {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }
        )
        return
      } else {
        await ElMessageBox.confirm(
          '您要提交数据并查看分析结果吗？',
          '温馨提示',
          {
            type: 'warning',
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }
        )
      }
      const collectedData = this.tableData.slice(1).map((row) => row.slice(1))
      console.log(collectedData)
      for (let i = 0; i < collectedData.length; i++) {
        for (let j = 0; j < collectedData[i].length; j++) {
          if (collectedData[i][j] === '' || collectedData[i][j] === null) {
            ElMessage.warning('请将所有数据填写完整')
            return
          }
        }
      }
      console.log('afdId', userStore.afdId[userStore.afdId.length - 1])
      const resultGet = await postSecondData(
        '会计控制',
        this.firstName,
        collectedData
      )
      console.log(resultGet)
      this.result = resultGet.data.data
      console.log(this.result)
      console.log('afdId', userStore.afdId[userStore.afdId.length - 1])
      if (resultGet?.data?.data?.asdId !== 0) {
        userStore.asdId.push(resultGet.data.data.asdId)
        console.log('asdId', userStore.asdId[userStore.asdId.length - 1])
        userStore.resultFlag.push(true)
      } else {
        ElMessage.warning('一致性未通过！')
        return
      }
      this.dialogTableVisible = true
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
              data: this.firstName,
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
              data: this.result.proportion.map(parseFloat)
            }
          ]
        })
      })
    },
    cleanData() {
      ElMessageBox.confirm('您确定要清除数据吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const symmetricAxis = this.tableData.length
        this.tableData = Array.from(
          { length: symmetricAxis },
          (_, rowIndex) => {
            return Array.from({ length: symmetricAxis }, (_, colIndex) => {
              if (rowIndex === colIndex) {
                return this.tableData[rowIndex][colIndex]
              } else {
                return null
              }
            })
          }
        )
        ElMessage.success('清除数据成功')
      })
    },
    openNo() {
      ElMessageBox.confirm(
        '一致性检验未通过，现在开始重新填写吗?',
        '温馨提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.cleanData()
          ElMessage({
            type: 'success',
            message: '一致性未通过，请您开始重新填写！'
          })
        })
        .catch(() => {
          this.cleanData()
          ElMessage({
            type: 'info',
            message: '一致性未通过，请您稍后重新填写！'
          })
        })
    },
    openYes() {
      ElMessageBox.confirm('恭喜您，一致性检验已通过！', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      })
        .then(() => {
          ElMessage({
            type: 'success',
            message: '请您开始赋值新的二级指标！'
          })
          // 跳转到此页的下一分页
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '请您稍后赋值新的二级指标！'
          })
        })
    },
    reWrite() {
      if (this.result.result) {
        this.openYes()
      } else {
        this.openNo()
      }
    }
  },
  props: {
    addFlag: Function
  }
}
</script>
<script setup>
// console.log(userStore.oneResultFlag)
</script>
<template>
  <el-dialog
    v-model="dialogTableVisible"
    title="分析结果"
    destroy-on-close="true"
    width="80%"
    @close="reWrite"
  >
    <div class="all">
      <div class="table-container">
        <h2 class="title" style="text-align: center">
          {{ result.alias }}
        </h2>
        <h3>AHP数据</h3>
        <table>
          <thead>
            <tr>
              <td></td>
              <td v-for="name in result.names" :key="name">{{ name }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in result.originalData" :key="index">
              <td>{{ result.names[index] }}</td>
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
            <tr v-for="(name, index) in result.names" :key="name">
              <td>{{ name }}</td>
              <td>{{ result.eigenvectors[index] }}</td>
              <td>{{ result.proportion[index] }}</td>
              <template v-if="index === 0">
                <td rowspan="13">{{ result.maxEigenvalue }}</td>
                <td rowspan="13">{{ result.ci }}</td>
              </template>
            </tr>
          </tbody>
        </table>
        <div id="main" style="width: 1000px; height: 500px"></div>
        <br /><br />
        <h3>智能分析</h3>
        <!-- 段落缩进两格 -->
        <hr />
        <el-text
          class="mx-1"
          size="large"
          style="line-height: 30px; letter-spacing: 2px"
        >
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 从上表可知，针对{{
            result.names
          }}总共13项构建13阶判断矩阵进行<span
            style="color: tomato; font-size: large"
            >AHP 层次法研究</span
          >(计算方法为:和积法)，分析得到特征向量为({{ result.eigenvectors }})，
          并且总共13项对应的权重值分别是:{{ result.proportion }}。除此之外，
          结合特征向量可计算出最大特征根({{
            result.maxEigenvalue
          }})，接着利用最大特征根值计算得到 CI值({{
            result.ci
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
        <table class="result" style="width: 80%">
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
              <td>{{ result.maxEigenvalue }}</td>
              <td>{{ result.ci }}</td>
              <td>{{ result.ri }}</td>
              <td>{{ result.cr }}</td>
              <td style="color: red">
                {{ result.result ? '通过' : '未通过' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </el-dialog>
  <!-- 状态 -->
  <el-row class="resultFlag">
    <el-col v-if="userStore.resultFlag[12]">
      <el-result icon="success"> </el-result>
    </el-col>
    <el-col v-else>
      <el-result icon="info"></el-result>
    </el-col>
  </el-row>
  <div class="container">
    <span class="title">会计控制</span>
    <table class="table">
      <tr
        v-for="(row, rowIndex) in tableData"
        :key="rowIndex"
        :style="{
          backgroundColor: rowIndex === highlightedRow ? '#E9EFF7' : ''
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
            <span v-if="rowIndex > 0 || colIndex > 0">
              {{
                [
                  ' 财务收支审批和报销',
                  '会计凭证填制和传递',
                  '会计账簿登记',
                  '财务报告编审和披露'
                ][rowIndex > 0 ? rowIndex - 1 : colIndex - 1]
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
                colIndex > rowIndex || (rowIndex === colIndex && rowIndex !== 0)
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
    <el-button type="primary" @click="setDefaultValues">设置默认</el-button>
    <el-button type="success" @click="collectAndSubmit">查看分析</el-button>
    <el-button type="warning" @click="cleanData">清除填写</el-button>
  </div>
</template>

<style scoped>
.title {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 20px;
}
td,
th {
  width: 255px;
  height: 38px;
  border: 1px solid#000;
}
table {
  margin: 0 auto;
  box-sizing: border-box;
  border-collapse: collapse;
  border: 1px solid #000;
  background: #e9eff7;
  text-align: center;
}
input {
  border: none;
  background: #e9eff7;
  text-align: center;
  outline: none;
  font-size: 18px;
}
button {
  margin-top: 30px;
  margin-left: 10px;
}
.resultFlag {
  display: block;
  position: absolute;
  transform: scale(0.6);
  top: 120px;
  left: 300px;
}
select {
  width: 100%;
  height: 100%;
  border: 0;
  font-size: 14px;
}
</style>
