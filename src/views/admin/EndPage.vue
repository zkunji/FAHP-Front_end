<script setup>
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { analyseServicce } from '@/api/admin'
import { ref, onMounted } from 'vue'
import { getEndObj } from '@/utils/storage'
import { useRoute } from 'vue-router'
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])
const route = useRoute()
const endObj = getEndObj()
console.log('endObj', endObj)
const uids = route.query.uids || endObj.uids
const arr = route.query.arr || endObj.arr
const value = route.query.value || endObj.title
const percentages = arr.map((item) => Number(item))
console.log(uids, arr, value)
const params = {
  ids: uids.map((item) => Number(item)),
  percentages,
  alias: value
}
const second_param = ref([])
const first_param = ref([])
const admin_first_data_id = ref(0)
const endResult = async () => {
  const res = await analyseServicce(params)
  second_param.value = res.data.data.second_param
  first_param.value = res.data.data.first_param
  admin_first_data_id.value = res.data.data.admin_first_data_id
}
endResult()
function findMaxIndex(arr) {
  let maxIndex = 0
  let maxValue = arr[0]
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > maxValue) {
      maxValue = arr[i]
      maxIndex = i
    }
  }
  return maxIndex
}

const res = ref('')
let maxIndex = findMaxIndex(second_param.value)
console.log(maxIndex)
const obj = {
  0: '优秀',
  1: '良好',
  2: '警戒',
  3: '危险'
}
res.value = obj[maxIndex]
console.log(res.value)
var option
var chartDom
var myChart
onMounted(() => {
  chartDom = document.getElementById('main')
  myChart = echarts.init(chartDom)
  option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: '审计专家',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: 1,
            name: '专家'
          }
        ]
      }
    ]
  }
  option.series[0].data.splice(0, option.series[0].data.length)
  for (let i = 0; i < uids.length; i++) {
    option.series[0].data.push({
      value: percentages[i] * 1.0,
      name: '专家' + (i + 1)
    })
  }
  option && myChart.setOption(option)
})
</script>

<template>
  <div>
    <div class="contain">
      <div class="left">
        <table>
          <tr>
            <td rowspan="2"></td>
            <td colspan="4">评语集</td>
            <td rowspan="2">按照最大隶属原则的评价结果</td>
          </tr>
          <tr>
            <td>优秀</td>
            <td>良好</td>
            <td>警戒</td>
            <td>危险</td>
          </tr>
          <tr v-for="item in first_param" :key="item">
            <td>{{ item.first_name }}</td>
            <td v-for="it in item.comments" :key="it">{{ it }}</td>
            <td>{{ item.single_result }}</td>
          </tr>
        </table>
      </div>
      <div class="right">
        <div class="echarts">
          <div id="main"></div>
        </div>
      </div>
    </div>
    <hr />
    <el-text class="mx-1">
      &nbsp; &nbsp;&nbsp; &nbsp; 上述计算结果显示,
      该大学内部控制整体有效性达到“优秀”程度为
      {{ (second_param[0] * 100).toFixed(2) }}%，达到"良好"程度为{{
        (second_param[1] * 100).toFixed(2)
      }}%, 达到“警戒”程度为{{
        (second_param[2] * 100).toFixed(2)
      }}%，达到“危险”程度为{{ (second_param[3] * 100).toFixed(2) }}%。
      按照最大隶属度原则，内部控制整体有效性评价结果为"{{ res }}"。
      <br />
      <h3>内部控制有效性评价结果分析</h3>
      &nbsp; &nbsp;&nbsp; &nbsp; 通过上述评价结果可见，治理层面的指标要素<strong
        >组织架构、决策机制、执行机制、 监督机制、协调机制、评价机制</strong
      >的模糊综合评价结果依次为:<strong
        >"{{ first_param[0].single_result }}"、"{{
          first_param[1].single_result
        }}"、"{{ first_param[2].single_result }}"、"{{
          first_param[3].single_result
        }}"、"{{ first_param[4].single_result }}"、"{{
          first_param[5].single_result
        }}"</strong
      >;业务层面的指标要素<strong
        >预算控制、收支控制、采购控制、资产控制、工程项目控制、
        会计控制及合同控制</strong
      >模糊综合评价结果依次为:<strong
        >"{{ first_param[6].single_result }}"、"{{
          first_param[7].single_result
        }}"、"{{ first_param[8].single_result }}"、"{{
          first_param[9].single_result
        }}"、"{{ first_param[10].single_result }}"、"{{
          first_param[11].single_result
        }}"、"{{ first_param[12].single_result }}"。</strong
      >
    </el-text>
  </div>
</template>

<style scoped>
#main {
  max-width: 320px;
  height: 480px;
}
td {
  width: 58px;
  height: 16px;
  border: 1px solid#000;
  font-size: 12px;
}
.contain {
  display: flex;
}
.left {
  width: 800px;
}
.right {
  flex: 1;
}
table {
  margin: 40px auto;
  width: 600px;
  height: 200px;
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
.mx-1 {
  font-size: 18px;
  /* 行间距 */
  line-height: 34px;
}
</style>
