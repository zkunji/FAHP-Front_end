import request from '@/utils/request'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

export const secondResult = (afdid, first_name) =>
  request.get(`ahpSecondData?afd_id=${afdid}&first_name=${first_name}`, {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      adminId: userStore.adminId
    }
  })

export const postSecondData = (alias, names, originalData) =>
  request.post(
    '/ahpSecondData/analyse',
    {
      // afdId: 1,
      afdId: userStore.afdId[userStore.afdId.length - 1],
      alias,
      names,
      originalData
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.uid
      }
    }
  )
