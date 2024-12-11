<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="800px">
        <div class="form">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="专家一">
              <el-input
                v-model="formInline.user1"
                placeholder="请为专家进行权重(百分比)赋值"
                clearable
              />
            </el-form-item>

            <el-form-item label="专家二">
              <el-input
                v-model="formInline.user2"
                placeholder="请为专家进行权重(百分比)赋值"
                clearable
              />
            </el-form-item>

            <el-form-item label="专家三">
              <el-input
                v-model="formInline.user3"
                placeholder="请为专家进行权重(百分比)赋值"
                clearable
              />
            </el-form-item>

            <el-form-item label="专家四">
              <el-input
                v-model="formInline.user4"
                placeholder="请为专家进行权重(百分比)赋值"
                clearable
              />
            </el-form-item>

            <el-form-item label="专家五">
              <el-input
                v-model="formInline.user5"
                placeholder="请为专家进行权重(百分比)赋值"
                clearable
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </div></el-aside
      >
      <el-main>
        <div class="echarts">
          <div id="main"></div></div
      ></el-main>
    </el-container>
  </div>
</template>

<script setup>
import * as echarts from 'echarts/core'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { PieChart } from 'echarts/charts'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { reactive } from 'vue'
import { onMounted } from 'vue'
echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout
])

const formInline = reactive({
  user1: '',
  user2: '',
  user3: '',
  user4: '',
  user5: ''
})

const onSubmit = () => {
  console.log('submit!')
}
onMounted(() => {
  var chartDom = document.getElementById('main')
  var myChart = echarts.init(chartDom)
  var option

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
          { value: 1, name: '专家一' },
          { value: 1, name: '专家二' },
          { value: 1, name: '专家三' },
          { value: 1, name: '专家四' },
          { value: 1, name: '专家五' }
        ]
      }
    ]
  }

  option && myChart.setOption(option)
})
</script>

<style scoped>
#main {
  width: 400px;
  height: 500px;
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}
</style>
