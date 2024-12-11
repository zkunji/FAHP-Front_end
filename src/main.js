import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/stores/index.js'
import '@/assets/main.scss'
//全局注册 打印pdf：
import htmlToPdf from './utils/topdf'
import flagToFalse from './utils/flagToFalse'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(htmlToPdf)
app.use(flagToFalse)
app.mount('#app')
