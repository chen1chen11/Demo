import { createRouter, createWebHistory } from 'vue-router'
import ProjectWorkbench from '../components/ProjectWorkbench.vue'
import PageB from '../components/PageB.vue'
import PageC from '../components/PageC.vue'

const routes = [
  { path: '/', redirect: '/a' },
  { path: '/a', component: ProjectWorkbench },
  { path: '/b', component: PageB },
  { path: '/c', component: PageC },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router