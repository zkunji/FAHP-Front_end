import { useUserStore } from '@/stores'
const flagToFalse = () => {
  const userStore = useUserStore()
  // 数组清空
  userStore.resultFlag.length = 0
  // userStore.resultFlag.clean()
}
export default flagToFalse
