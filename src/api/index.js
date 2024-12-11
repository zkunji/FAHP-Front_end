import request from '@/utils/request'
// import axios from 'axios'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

export const analyseServicce = (proName, collectedData) =>
  // request.post(
  //   '/ahpFirstData/analyse',
  request.get(
    '/ahpData/consistency-test',
    {
      alias: proName,
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
      originalData: collectedData,
      scale: 13,
      uid: parseInt(userStore.uid)
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: parseInt(userStore.uid)
      }
    }
  )

// 二级接口
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

// 评分
export const postScoreData = (afd_id, asd_comments) =>
  request.post(
    '/ahpSecondComment/evaluate',
    {
      afd_id,
      asd_comments
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.uid
      }
    }
  )

export const getFinalResultService = (
  afd_id = userStore.afdId[userStore.afdId.length - 1]
) =>
  request.get('/ahpFirstData/searchProportionComments/' + afd_id, {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      uid: userStore.uid
    }
  })

export const getPerlResultService = (currentPage) =>
  request.post(
    '/ahpFirstData/searchAll-pagination-user',
    {
      pageNum: currentPage,
      pageSize: 10
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.uid
        // uid: 7
      }
    }
  )

export const viewFileService = (afd_id, asd_id, secondAlias) =>
  request.get(
    '/ahpSecondComment/files?',
    // +
    //   'adf_id=' +
    //   afd_id +
    //   '&asd_id=' +
    //   asd_id +
    //   '&alias=' +
    //   secondAlias,
    {
      afd_id: afd_id,
      asd_id: asd_id,
      second_alias: secondAlias
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.uid
      }
    }
  )
// 'Content-Type': 'multipart/form-data',
export const toOneService = (afd_id) =>
  request.get('/ahpFirstData/submit/' + afd_id, {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      uid: userStore.uid
    }
  })

// 删除我的历史
export const removeHistoryService = (params) =>
  request.delete('/ahpFirstData', JSON.stringify({ ids: params }), {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      uid: userStore.uid
    }
  })
