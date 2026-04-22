<template>
  <div class="page-c">
    <h1>✅ 任务详情 (页面C)</h1>
    <p class="user-info">当前用户 ID：<strong>{{ userId }}</strong></p>

    <div v-if="task" class="task-detail">
      <h2>{{ task.title }}</h2>
      <p>{{ task.description }}</p>
      <div class="reward-badge">{{ task.reward }}</div>

      <div class="action-buttons">
        <button @click="completeTask" class="complete-btn">✔️ 确认完成任务</button>
      </div>
    </div>
    <div v-else>
      <p>没有选中任何任务，请返回B选择。</p>
    </div>

    <div class="nav-buttons">
      <button @click="goToA">⬅️ 返回工作台 (A)</button>
      <button @click="goToB">⬅️ 返回任务广场 (B)</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  trackEvent,
  sendMatomoEvent,
  sendGA4Event,
  globalUserId as userId
} from '../util/tracking'  // 注意路径是 utils，不是 util

const router = useRouter()
const task = ref(null)
const startTime = ref(Date.now())  // 新增：定义 startTime

onMounted(() => {
  startTime.value = Date.now()

  // 从 sessionStorage 获取选中的任务
  const storedTask = sessionStorage.getItem('selectedTask')
  if (storedTask) {
    task.value = JSON.parse(storedTask)
  }

  // 界面日志：页面浏览
  trackEvent('page_view', { page: 'C', task_id: task.value?.id })

  // 🔥 Matomo 目标转化（请将 1 替换为你的实际目标 ID）
  if (window._paq) {
    window._paq.push(['trackGoal', 1])  // 确保目标 ID 正确
  }

 if (window.collectEvent) {
    window.collectEvent('track', 'view_pageC', {
      page_title: '任务详情',
      task_id: task.value?.id,
      task_name: task.value?.title,
    });
  }
})

onBeforeUnmount(() => {
  const duration = Math.round((Date.now() - startTime.value) / 1000)
  // 记录日志（界面日志）
  trackEvent('page_duration', { page: 'C', duration_seconds: duration })
  // 发送给 Matomo 和 GA4（使用正确的页面标识）
  sendMatomoEvent('page', 'duration', '页面C', duration)
  sendGA4Event('page_duration', { page_title: 'C', value: duration })
})

const completeTask = () => {
  if (!task.value) return  // 避免空任务报错

  trackEvent('task_complete', { task_id: task.value.id, task_title: task.value.title })
  sendMatomoEvent('task', 'complete', task.value.title, task.value.id)
  sendGA4Event('task_complete', { task_id: task.value.id, task_title: task.value.title })

   if (window.collectEvent) {
    window.collectEvent('track', 'task_complete', {
      task_id: task.value.id,
      task_title: task.value.title,
    });
  }
  sessionStorage.removeItem('selectedTask')
  router.push('/a')
}

const goToA = () => {
  trackEvent('navigate_click', { from: 'C', to: 'A' })
  sendMatomoEvent('navigation', 'click', 'C_to_A', 1)
  sendGA4Event('navigate', { from: 'C', to: 'A' })
    if (window.umami) {
    window.umami.track('navigate_to_a', { from: 'C', to: 'A' });
  }
  router.push('/a')
}

const goToB = () => {
  trackEvent('navigate_click', { from: 'C', to: 'B' })
  sendMatomoEvent('navigation', 'click', 'C_to_B', 1)
  sendGA4Event('navigate', { from: 'C', to: 'B' })
  if (window.umami) {
    window.umami.track('navigate_to_b', { from: 'C', to: 'B' });
  }
  router.push('/b')
}
</script>

<style scoped>
.page-c {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  text-align: center;
}
.user-info {
  background: #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
}
.task-detail {
  margin: 30px 0;
  padding: 20px;
  background: #f7fafc;
  border-radius: 16px;
}
.reward-badge {
  display: inline-block;
  background: #fbbf24;
  color: #744210;
  padding: 6px 16px;
  border-radius: 30px;
  font-weight: 600;
  margin: 15px 0;
}
.complete-btn {
  background: #38a169;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 30px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(56, 161, 105, 0.4);
}
.nav-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 20px;
}
.nav-buttons button {
  padding: 8px 20px;
  border: none;
  border-radius: 30px;
  background: #4a5568;
  color: white;
  cursor: pointer;
}
</style>