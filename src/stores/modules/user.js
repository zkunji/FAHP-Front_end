import { defineStore } from 'pinia'
import { ref } from 'vue'
// import { userGetInfoService } from '../../api/user'
import { getFlag } from '@/utils/storage'
//用户模块 token setToken removeToken
export const useUserStore = defineStore(
  'big-user',
  () => {
    const token = ref('')
    const token2 = ref('')
    const uid = ref()
    const adminId = ref()
    const setToken = (newToken, newUid) => {
      token.value = newToken
      uid.value = newUid
    }
    const setToken2 = (newToken) => {
      token2.value = newToken
    }
    const setMToken = (newToken, newadminId) => {
      token.value = newToken
      adminId.value = newadminId
    }

    const removeToken = () => {
      token.value = ''
      uid.value = NaN
    }

    const user = ref({})
    const setUser = (obj) => {
      user.value = obj
    }
    const role = ref('')
    const imageUrl = ref()
    const afdId = ref([])
    const asdId = ref([])
    let resultFlag = []
    // let resultFlag = getFlag()
    console.log('Pinia中的resultFlag', ...resultFlag)

    return {
      role,
      afdId,
      asdId,
      resultFlag,
      imageUrl,
      token,
      token2,
      uid,
      adminId,
      setToken,
      setToken2,
      setMToken,
      removeToken,
      user,
      // getUser,
      setUser
    }
  },
  {
    persist: true
  }
)
