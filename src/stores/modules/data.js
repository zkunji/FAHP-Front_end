import { defineStore } from 'pinia'
import { acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
export const useDataStore = defineStore('big-data', () => {
  // 模拟一级权重赋值
  const defaultData = [
    [1.0, 0.333, 3.0, 5.0, 0.5, 5.0, 0.167, 5.0, 2.0, 4.0, 0.2, 6.0, 0.333],
    [3.0, 1.0, 5.0, 7.0, 0.25, 7.0, 0.25, 7.0, 4.0, 6.0, 0.333, 8.0, 0.5],
    [0.333, 0.2, 1.0, 3.0, 0.5, 4.0, 0.143, 4.0, 0.333, 3.0, 0.167, 5.0, 0.167],
    [
      0.2, 0.143, 0.333, 1.0, 0.167, 1.0, 0.111, 0.5, 0.25, 0.333, 0.125, 0.5,
      0.143
    ],
    [2.0, 4.0, 2.0, 6.0, 1.0, 6.0, 0.2, 6.0, 3.0, 5.0, 0.25, 7.0, 0.333],
    [
      0.2, 0.143, 0.25, 1.0, 0.167, 1.0, 0.111, 0.5, 0.25, 0.333, 0.111, 0.5,
      0.125
    ],
    [6.0, 4.0, 7.0, 9.0, 5.0, 9.0, 1.0, 8.0, 6.0, 7.0, 2.0, 8.0, 3.0],
    [
      0.2, 0.143, 0.25, 2.0, 0.167, 2.0, 0.125, 1.0, 0.2, 0.333, 0.143, 3.0,
      0.143
    ],
    [0.5, 0.25, 3.0, 4.0, 0.333, 4.0, 0.167, 5.0, 1.0, 4.0, 0.2, 6.0, 0.2],
    [
      0.25, 0.167, 0.333, 3.0, 0.2, 3.0, 0.143, 3.0, 0.25, 1.0, 0.143, 4.0,
      0.167
    ],
    [5.0, 3.0, 6.0, 8.0, 4.0, 9.0, 0.5, 7.0, 5.0, 7.0, 1.0, 8.0, 2.0],
    [
      0.167, 0.125, 0.2, 2.0, 0.143, 2.0, 0.125, 0.333, 0.167, 0.25, 0.125, 1.0,
      0.125
    ],
    [3.0, 2.0, 6.0, 7.0, 3.0, 8.0, 0.333, 7.0, 5.0, 6.0, 0.5, 8.0, 1.0]
  ]

  // 模拟一级结果数据
  const noReaData = ref({
    code: 400,
    msg: '一致性不通过!',
    data: {
      scale: 13,
      alias: '专家1的评测',
      names: [
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
      ],
      originalData: defaultData,
      eigenvectors: [
        '1.130',
        '1.287',
        '0.527',
        '0.177',
        '1.233',
        '0.170',
        '2.962',
        '0.262',
        '0.698',
        '0.380',
        '2.242',
        '0.205',
        '1.728'
      ],
      proportion: [
        '8.692%',
        '9.898%',
        '4.052%',
        '1.362%',
        '9.484%',
        '1.306%',
        '22.785%',
        '2.013%',
        '5.369%',
        '2.925%',
        '17.245%',
        '1.575%',
        '13.294%'
      ],
      maxEigenvalue: '15.468',
      ci: '0.206',
      ri: 1.56,
      cr: '0.132',
      result: true,
      afdId: 0,
      uid: 1
    }
  })

  // 一级指标数据空二维数组
  const firstData = ref([[]])
  const secondData = ref({})
  // 设置一级数据
  const setFirstData = (newData) => {
    //将传进来的数组值newData赋给firstData
    firstData.value = newData
  }
  // 移除一级数据
  // const removeFirstData = () => {
  //   firstData.value = ''
  // }

  // 设置二级数据
  const setSecondData = (newData) => {
    secondData.value = newData
  }
  // 结果储存在数组中，每一次返回结果是一个对象
  const firstResult = ref(noReaData)
  // const firstResult = noReaData
  console.log(firstResult.value)
  // const secondResult = ref({})
  const secondResult = ref({})

  const setFirstResult = (newData) => {
    firstResult.value = newData
  }
  const setSecondResult = (newData) => {
    secondResult.value = newData
  }

  const firstProp = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  const secondProp = ref([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    60, 61
  ])

  return {
    defaultData, // 一级评分默认数据
    noReaData, // 模拟一级结果数据
    firstData,
    secondData,
    setFirstData,
    setSecondData,
    firstResult,
    secondResult,
    setFirstResult,
    setSecondResult,
    firstProp,
    secondProp
  }
})

// if (import.meta.hot) {
//   import.meta.hot.accept(acceptHMRUpdate(useDataStore, import.meta.hot))
// }
