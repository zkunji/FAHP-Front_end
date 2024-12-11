import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
const baseURL = 'http://1.12.49.85:8836'

const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token，uid
    const userStore = useUserStore()
    if (userStore.token && userStore.uid) {
      //续访问其他接口需要在请求head中加入token、uid
      config.headers.Authorization = userStore.token
      config.headers.uid = userStore.uid
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // TODO 3. 处理业务失败
    // TODO 4. 摘取核心响应数据
    // if (res.data.code === 200) {
    console.log('200')
    return res
    // }
    // ElMessage.error('数据有误，请您修改后重新填写提交！')
    // return Promise.reject(res.data)
  },
  (err) => {
    // TODO 5. 处理401错 误
    //错误的特殊情况 => 401 权限不足 token过期 =>拦截到登录
    if (err.response?.status === 401) {
      ElMessage.error('登陆失效，请您重新登陆！')
      router.push('/login')
    }
    //错误的默认情况下，直接返回错误信息
    ElMessage.error('操作失败，异常操作或服务器错误！')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
