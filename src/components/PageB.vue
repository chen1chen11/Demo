<template>
  <div class="page-b">
    <h1>📋 任务广场 (页面B)</h1>
    <p class="user-info">当前用户 ID：<strong>{{ userId }}</strong></p>

    <!-- 任务卡片列表 -->
    <div class="task-grid">
      <div v-for="task in availableTasks" :key="task.id" class="task-card" @click="selectTask(task)">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <span class="reward">{{ task.reward }}</span>
        <button class="claim-btn">领取任务</button>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="nav-buttons">
      <button @click="goToA">⬅️ 返回工作台 (A)</button>
      <button @click="goToC" :disabled="!selectedTask">➡️ 前往任务详情 (C)</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'  // 确保导入 onBeforeUnmount
import { useRouter } from 'vue-router'
import posthog from 'posthog-js'
import {
  trackEvent,
  sendMatomoEvent,
  sendGA4Event,
  globalUserId as userId
} from '../util/tracking'  // 修正路径

const router = useRouter()
const selectedTask = ref(null)
const startTime = ref(Date.now())  // 新增：定义 startTime

const availableTasks = ref([
  { id: 1, title: '撰写周报', description: '完成本周工作总结', reward: '⭐️ 10积分' },
  { id: 2, title: '代码审查', description: '审查PR #123', reward: '⭐️ 20积分' },
  { id: 3, title: '设计评审', description: '参与产品设计会', reward: '⭐️ 15积分' }
])

onMounted(() => {
  startTime.value = Date.now()
  trackEvent('page_view', { page: 'B' })
  // 如果不想重复发送页面浏览事件，可以注释掉下面两行
  // sendMatomoEvent('page', 'view', 'B', 1)
  // sendGA4Event('page_view', { page_title: 'B' })
})

onBeforeUnmount(() => {
  const duration = Math.round((Date.now() - startTime.value) / 1000)
  trackEvent('page_duration', { page: 'B', duration_seconds: duration })
  sendMatomoEvent('page', 'duration', '页面B', duration)
  sendGA4Event('page_duration', { page_title: 'B', value: duration })
})

const selectTask = (task) => {
  selectedTask.value = task
  trackEvent('task_select', { task_id: task.id, task_title: task.title })
  sendMatomoEvent('task', 'select', task.title, task.id)
  sendGA4Event('task_select', { task_id: task.id, task_title: task.title })
  posthog.capture('task_select', { task_id: task.id, task_title: task.title })
}

const goToA = () => {
  trackEvent('navigate_click', { from: 'B', to: 'A' })
  sendMatomoEvent('navigation', 'click', 'B_to_A', 1)
  sendGA4Event('navigate', { from: 'B', to: 'A' })

    if (window.umami) {
    window.umami.track('navigate_to_a', { from: 'B', to: 'A' });
  }

  posthog.capture('navigate_click', { from: 'B', to: 'A' })
  router.push('/a')
}

const goToC = () => {
  if (!selectedTask.value) return
  sessionStorage.setItem('selectedTask', JSON.stringify(selectedTask.value))
  trackEvent('navigate_click', { from: 'B', to: 'C', task_id: selectedTask.value.id })
  sendMatomoEvent('navigation', 'click', 'B_to_C', 1)
  sendGA4Event('navigate', { from: 'B', to: 'C', task_id: selectedTask.value.id })

   if (window.collectEvent) {
    window.collectEvent('track', 'navigate', {
      from: 'B',
      to: 'C',
      task_id: selectedTask.value.id
    });
  }
  posthog.capture('navigate_click', { from: 'B', to: 'C', task_id: selectedTask.value.id })
  if (window.umami) {
    window.umami.track('navigate_to_c', { from: 'B', to: 'C', task_id: selectedTask.value.id });
  }
  router.push('/c')
}
</script>

<style scoped>
.page-b {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: #f7fafc;
  min-height: 100vh;
}
.user-info {
  background: #e2e8f0;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}
.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin: 30px 0;
}
.task-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 2px solid transparent;
}
.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}
.task-card:active {
  border-color: #667eea;
}
.task-card h3 {
  margin: 0 0 8px 0;
  color: #2d3748;
}
.task-card p {
  color: #718096;
  font-size: 14px;
  margin-bottom: 12px;
}
.reward {
  display: inline-block;
  background: #fbbf24;
  color: #744210;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 12px;
}
.claim-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  width: 100%;
  cursor: pointer;
  font-weight: 500;
}
.nav-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
}
.nav-buttons button {
  padding: 10px 24px;
  border: none;
  border-radius: 30px;
  background: #4a5568;
  color: white;
  cursor: pointer;
}
.nav-buttons button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.nav-buttons button:last-child {
  background: #38a169;
}
</style>