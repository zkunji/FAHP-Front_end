import { ref } from 'vue'

const First_Table_Data = 'First_Table_Data'

export const setFirstTableData = (data) => {
  localStorage.setItem(First_Table_Data, JSON.stringify(data))
}

export const getFirstTableData = () => {
  const result = localStorage.getItem(First_Table_Data)
  const defaultData = ref([[]])
  return result ? ref(JSON.parse(result)) : defaultData
}

export const removeFirstTableData = () => {
  localStorage.removeItem(First_Table_Data)
}

export const setFirstAnylse = (data) => {
  localStorage.setItem('First_Anylse', JSON.stringify(data))
}

export const getFirstAnylse = () => {
  const result = localStorage.getItem('First_Anylse')
  return result ? ref(JSON.parse(result)) : ref({})
}
// 标识
export const setFlag = (data) => {
  localStorage.setItem('flag', JSON.stringify(data))
  console.log('存标识', JSON.stringify(data))
}

export const getFlag = () => {
  const result = localStorage.getItem('flag')
  console.log('111', result)
  const res = result ? JSON.parse(result) : []
  console.log('取标识', ...res)
  return res
}
// 保存最终结果对象
export const setEndObj = (data) => {
  localStorage.setItem('end', JSON.stringify(data))
}

export const getEndObj = () => {
  const obj = localStorage.getItem('end')
  return (
    JSON.parse(obj) || {
      uids: [1, 2],
      arr: [0.333, 0.333, 0.333],
      title: '测试'
    }
  )
}

// 保存13个二级数据，放数组中
export const setSecodeArray = (data) => {
  localStorage.setItem('one', JSON.stringify(data))
}

export const getSecondArray = () => {
  const array = localStorage.getItem('one')
  return ref(JSON.parse(array)) || ref([[]])
}

// export const removeSecondArray = (index) =>{

// }
