<template>
  <page-container>
    <div class="all">
      <el-select
        v-model="selectValue"
        placeholder="请选择指标"
        style="width: 240px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
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
        <!-- <div id="main" style="width: 1000px; height: 500px"></div> -->
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
  </page-container>
</template>

<script setup>
import { getFirstAnylse } from '@/utils/storage'
import { ref, nextTick, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useUserStore } from '@/stores'
import { secondResult } from '@/api/result'
const selectValue = ref('')
const options = [
  {
    value: '组织架构',
    label: '组织架构'
  },
  {
    value: '决策机制',
    label: '决策机制'
  },
  {
    value: '执行机制',
    label: '执行机制'
  },
  {
    value: '监督机制',
    label: '监督机制'
  },
  {
    value: '协调机制',
    label: '协调机制'
  },
  {
    value: '评价机制',
    label: '评价机制'
  },
  {
    value: '预算控制',
    label: '预算控制'
  },
  {
    value: '收支控制',
    label: '收支控制'
  },
  {
    value: '采购控制',
    label: '采购控制'
  },
  {
    value: '资产控制',
    label: '资产控制'
  },
  {
    value: '工程控制',
    label: '工程控制'
  },
  {
    value: '会计控制',
    label: '会计控制'
  },
  {
    value: '合同控制',
    label: '合同控制'
  }
]
const userStore = useUserStore()
const Result = ref({})
const getData = async () => {
  let name = '组织架构'
  const ResultData = await secondResult(
    userStore.afdId[userStore.afdId.length - 1],
    name
  )
  Result.value = ResultData.data.data
  Result.value.proportion = Array.from(Result.value.proportion)
  console.log('eeeeee', Result.value.proportion)
}
getData()
watch(selectValue, async () => {
  console.log(selectValue.value)
  const ResultData = await secondResult(
    userStore.afdId[userStore.afdId.length - 1],
    selectValue.value
  )
  Result.value = ResultData.data.data
})
// const firstName = [' 职责分工', '三权分立', '关键岗位责任制']
// onMounted(() => {
//   nextTick(() => {
//     console.log('fffff', Result.value.proportion)
//     var myChart = echarts.init(document.getElementById('main'))
//     myChart.setOption({
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           type: 'shadow'
//         }
//       },
//       grid: {
//         left: '3%',
//         right: '4%',
//         bottom: '3%',
//         containLabel: true
//       },
//       xAxis: [
//         {
//           type: 'category',
//           data: firstName,
//           axisTick: {
//             alignWithLabel: true
//           }
//         }
//       ],
//       yAxis: [
//         {
//           type: 'value',
//           data: ['5%', '10%', '15%']
//         }
//       ],
//       series: [
//         {
//           name: 'Direct',
//           type: 'bar',
//           barWidth: '60%',
//           // data: [10.014, 38.932, 51.053]
//           data: Result.value.proportion.map(parseFloat)
//         }
//       ]
//     })
//   })
// })
</script>

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
