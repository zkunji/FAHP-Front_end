import request from '@/utils/request'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

export const userSpeRegisterService = ({ account, password, re_password }) =>
  request.post('/user/register', { account, password, re_password })
export const userManRegisterService = ({ account, password, re_password }) =>
  request.post('/admin/register', { account, password, re_password })

export const userSpeLoginService = ({ account, password }) =>
  request.post('/user/login', { account, password })
export const userManLoginService = ({ account, password }) =>
  request.post('/admin/login', { account, password })

export const userGetInfoService = () =>
  request.get('/user/userinfo', {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      uid: userStore.uid
    }
  })
export const userMGetInfoService = () =>
  request.get('/user/userinfo', {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      uid: userStore.adminId
    }
  })
export const userUpdateAdminInfoService = () =>
  request.get('/user/userinfo', {
    headers: {
      'Content-Type': 'application/json',
      token: userStore.token,
      uid: userStore.adminId
    }
  })
export const userGetAllInfoService = (currentPage, pageSize) =>
  request.post(
    '/admin/userinfo',
    {
      pageNum: currentPage,
      pageSize: pageSize
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        adminId: userStore.adminId
      }
    }
  )
export const userUpdateInfoService = ({ username, phone, email, sex }) =>
  request.put(
    '/user/userinfo',
    {
      username,
      phone,
      email,
      sex,
      avatar: userStore.imageUrl
    },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.uid
      }
    }
  )

export const userUpdateAvatarService = (avatar) =>
  request.patch(
    '/user/update/avatar',
    { avatar },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.uid
      }
    }
  )

export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch(
    '/user/updatepwd',
    { old_pwd, new_pwd, re_pwd },
    {
      headers: {
        'Content-Type': 'application/json',
        token: userStore.token,
        uid: userStore.uid
      }
    }
  )

export const userUploadFiles = (data) =>
  request.post('/ahpSecondComment/uploadFiles', data, {
    headers: {
      // 'Content-Type': 'multipart/form-data;charset=utf-8',
      token: userStore.token,
      uid: userStore.uid
    }
  })
