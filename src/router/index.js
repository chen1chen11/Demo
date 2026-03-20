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

export default router