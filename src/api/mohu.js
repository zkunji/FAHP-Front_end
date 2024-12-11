import request from '@/utils/request'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

export const assessment = (uid, data) =>
  request.post(
    '/user/assessment',
    {
      uid,
      assessment: data
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        adminId: userStore.adminId
      }
    }
  )
export const updataassessment = (uid, data) =>
  request.put(
    '/user/assessment',
    {
      uid,
      assessment: data
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        adminId: userStore.adminId
      }
    }
  )

export const lookAssessment = (uid) =>
  request.get(`/user/assessment?uid=${uid}`, {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      adminId: userStore.adminId
    }
  })

// 熵权法
export const entropyWeight = (uids) =>
  request.post(
    '/admin/entropyWeight',
    {
      uidArray: uids
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        adminId: userStore.adminId
      }
    }
  )

//1.获取模糊算法数据的外键(FuzzyAlgorithmFirstDataId)集合、用户信息和用户权重
export const fuzzyAlgorithmDataDetails = (currentPage, pageSize) =>
  request.get(
    `/admin/fuzzyAlgorithmDataDetails?pageNum=${currentPage}&pageSize=${pageSize}`,
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        adminId: userStore.adminId
      }
    }
  )

//2. 根据外键（FuzzyAlgorithmFirstDataId）获取模糊算法主要数据内容
export const fuzzyAlgorithmDataSubject = (faf_id) =>
  request.get(`/admin/fuzzyAlgorithmDataSubject?faf_id=${faf_id}`, {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      adminId: userStore.adminId
    }
  })
