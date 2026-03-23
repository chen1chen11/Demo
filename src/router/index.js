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

// 在每次路由切换后向 Matomo 发送页面视图
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (window._paq) {
    // 显式告诉 Matomo 当前页面的标题
    window._paq.push(['setDocumentTitle', title])
    window._paq.push(['setCustomUrl', to.fullPath])
    window._paq.push(['trackPageView'])
  } else {
    console.warn('Matomo _paq 未加载，无法发送页面视图')
  }
  
  // 调用 Matomo 页面跟踪
  if (window._paq) {
    window._paq.push(['setCustomUrl', to.fullPath])
    window._paq.push(['trackPageView'])
  } else {
    console.warn('Matomo _paq 未加载，无法发送页面视图')
  }
})

export default router