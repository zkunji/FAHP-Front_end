import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/test', component: () => import('@/views/test/test.vue') }, //测试页
    { path: '/admin', component: () => import('@/views/admin/RolePage.vue') }, //管理员页面
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') }, // 登录页
    {
      path: '/',
      component: () => import('@/views/login/LoginPage.vue'),
      redirect: '/login'
    },
    {
      path: '/head',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      // redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/HomePage.vue')
          // meta: true
        },
        {
          path: '/index/first',
          component: () => import('@/views/index/IndexFirstPage.vue')
        },
        {
          path: '/index/firstAnalyse',
          component: () => import('@/views/index/IndexFirstAnalysePage.vue')
        },
        {
          path: '/index/second',
          component: () => import('@/views/index/IndexSecondPage.vue')
        },
        {
          path: '/index/secondAnalyse',
          component: () => import('@/views/index/IndexSecondAnalysePage.vue')
        },
        {
          path: '/score',
          component: () => import('@/views/score/ScorePage.vue')
        },
        {
          path: '/history',
          component: () => import('@/views/history/HistoryPage.vue')
        },
        {
          path: '/questionnaire',
          component: () => import('@/views/questionnaire/Questionnaire.vue')
        },
        {
          path: '/result',
          component: () => import('@/views/result/ResultPage.vue')
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue')
        },
        {
          path: '/admin/role',
          component: () => import('@/views/admin/RolePage.vue')
        },
        {
          path: '/admin/fuzzyAlgorithmDataDetails',
          component: () => import('@/views/admin/fuzzyAlgorithmDataDetails.vue')
        },
        {
          path: '/admin/record',
          component: () => import('@/views/admin/RecordPage.vue')
        },
        {
          path: '/admin/end',
          component: () => import('@/views/admin/EndPage.vue')
        },
        {
          path: '/admin/book',
          component: () => import('@/views/admin/bookPage.vue')
        },
        {
          path: '/admin/manage',
          component: () => import('@/views/admin/ArticleManage.vue')
        },
        {
          path: '/admin/channel',
          component: () => import('@/views/admin/ArticleChannel.vue')
        },

        {
          path: '/admin/questionnaireAdmin',
          component: () =>
            import('@/views/questionnaireAdmin/QuestionnaireAdmin.vue')
        }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'
})

export default router
