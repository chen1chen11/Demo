import { createRouter, createWebHistory } from 'vue-router'
import ProjectWorkbench from '../components/ProjectWorkbench.vue'
import PageB from '../components/PageB.vue'
import PageC from '../components/PageC.vue'

const routes = [
  { path: '/', redirect: '/a' },
  { path: '/a', component: ProjectWorkbench, meta: { title: '页面A - 工作台' } },
  { path: '/b', component: PageB, meta: { title: '页面B - 任务广场' } },
  { path: '/c', component: PageC, meta: { title: '页面C - 任务详情' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 在每次路由切换后，同时通知 Matomo、火山引擎、Umami 和 PostHog
router.afterEach((to) => {
  // 1. 更新页面标题（如果使用了 meta.title）
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 2. Matomo SPA 跟踪
  if (window._paq) {
    window._paq.push(['setDocumentTitle', document.title])
    window._paq.push(['setCustomUrl', to.fullPath])
    window._paq.push(['trackPageView'])
  } else {
    console.warn('Matomo _paq 未加载')
  }

  // 3. 火山引擎增长分析 SPA 跟踪
  if (window.collectEvent) {
    window.collectEvent('track', '$pageview', {
      $url: to.fullPath,
      $title: to.meta.title
    })
  }

  // 4. Umami SPA 跟踪
  if (window.umami) {
    window.umami.track({
      url: to.fullPath,
      title: to.meta.title
    })
  }

  // 5. PostHog SPA 跟踪（新增）
  if (window.posthog) {
    window.posthog.capture('$pageview', {
      path: to.fullPath,
      title: to.meta.title
    })
  }
})

export default router