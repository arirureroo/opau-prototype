import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { Mode } from '@/types/test.types'
import { useMobileRestriction } from '@/composables/useMobileRestriction'

const APP_NAME = 'oPau'

const createTitle = (subtitle: string) => `${APP_NAME} - ${subtitle}`

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: { title: createTitle('Open Pauli Test') },
      component: HomeView,
    },
    {
      path: '/pretest',
      name: 'pretest',
      meta: { title: createTitle('Take a Test') },
      component: () => import('../views/PreTestView.vue'),
    },
    {
      path: '/test',
      name: 'test',
      meta: { title: createTitle('Taking a test') },
      component: () => import('../views/TestView.vue'),
    },
    {
      path: '/test/result',
      name: 'test-result',
      meta: { title: createTitle('Test Results') },
      component: () => import('../views/TestResultView.vue'),
    },
    {
      path: '/history',
      name: 'history',
      meta: { title: createTitle('Your test history') },
      component: () => import('../views/HistoryView.vue'),
    },
    {
      path: '/history/:id',
      name: 'history-detail',
      meta: { title: createTitle('Test Result Details') },
      component: () => import('../views/HistoryDetailView.vue'),
    },
    {
      path: '/performance',
      name: 'performance',
      meta: { title: createTitle('Performance Statistics') },
      component: () => import('../views/PerformanceView.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const { isMobile, openDialog } = useMobileRestriction()

  if (isMobile.value && to.name !== 'home') {
    openDialog()
    if (from.name) {
      next(false)
    } else {
      next({ name: 'home' })
    }
    return
  }

  const isPracticeMode = to.query.mode === Mode.PRACTICE
  document.title = isPracticeMode ? createTitle("Let's practice") : (to.meta.title as string)
  next()
})

export default router
