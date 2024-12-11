import request from '@/utils/request'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

export const getPerlResultServiceByAdmin = (uid) =>
  request.get(`/admin/users/${uid}/integrated_data/marked`, {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      adminId: userStore.adminId
    }
  })

export const analyseServicce = (params) =>
  request.post('/admin/analyse', params, {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      adminId: userStore.adminId
    }
  })

export const viewFileServiceByAdmin = (afd_id, asd_id, secondAlias) =>
  request.get(
    '/ahpSecondComment/files?',
    {
      afd_id: afd_id,
      asd_id: asd_id,
      second_alias: secondAlias
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.adminId
      }
    }
  )
