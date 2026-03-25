<template>
  <div class="workbench-container">
    <!-- 头部信息 -->
    <header class="header">
      <h1>📘 工作台 · 埋点测试 Demo (页面A)</h1>
      <p class="user-info">当前测试用户 ID：<strong>{{ userId }}</strong> (固定于本次会话)</p>
    </header>

    <!-- 导航按钮区域 -->
    <div class="nav-buttons">
      <button class="nav-btn primary" @click="goToB">🚀 前往任务广场 (B)</button>
      <button class="nav-btn secondary" @click="goToC">⚡ 直接完成任务 (C)</button>
    </div>

    <!-- 埋点日志面板 -->
    <section class="log-panel">
      <h3>📋 埋点事件日志 <span class="log-count">({{ eventLogs.length }})</span></h3>
      <ul class="log-list">
        <li v-for="(log, idx) in eventLogs" :key="idx" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-name">{{ log.event }}</span>
          <span class="log-params">{{ JSON.stringify(log.params) }}</span>
        </li>
      </ul>
      <button class="clear-btn" @click="clearLogs">清除日志</button>
    </section>

    <!-- 卡片区域：模拟项目进度与动态工作流（保持不变） -->
    <div class="cards-grid">
      <!-- 项目进度卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>📌 项目进度</h2>
          <span class="badge">page:project</span>
        </div>
        <p class="card-desc">页面加载自动触发 PV/UV/停留开始</p>

        <!-- 视图切换 -->
        <div class="view-tabs">
          <button class="tab-btn" :class="{ active: activeView === 'collect' }" @click="handleExistClick('我的收藏', 'collect')">⭐ 我的收藏</button>
          <button class="tab-btn" :class="{ active: activeView === 'recent' }" @click="handleExistClick('近期任务', 'recent')">🕒 近期任务</button>
        </div>

        <!-- 任务列表 -->
        <div class="task-list">
          <div v-for="task in projectTasks" :key="task.id" class="task-item">
            <span class="task-name">{{ task.name }}</span>
            <button class="enter-btn" @click="handleEnterTask(task, 'project')">进入任务</button>
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="action-buttons">
          <button class="action-btn" @click="handleAddView"><span>➕</span> 新增视图</button>
          <button class="action-btn" @click="handleAddTaskToView"><span>📝</span> 视图内添加任务</button>
        </div>
      </div>

      <!-- 动态工作流卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>⚡ 动态工作流</h2>
          <span class="badge">block:workflow</span>
        </div>
        <div class="task-list">
          <div v-for="task in workflowTasks" :key="task.id" class="task-item">
            <span class="task-name">{{ task.name }}</span>
            <button class="enter-btn" @click="handleEnterTask(task, 'workflow')">进入任务 (动态)</button>
          </div>
        </div>
        <p class="hint">点击上方按钮触发 dynamic_workflow_enter_task 埋点</p>
      </div>
    </div>

    <footer class="footer">
      <p>🖱️ 所有交互均已埋点，请打开控制台查看完整事件输出。</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  trackEvent,          // 仅用于界面日志（已确保不会发送真实数据）
  sendMatomoEvent,
  sendGA4Event,
  globalUserId as userId,
  eventLogs  
} from '../util/tracking'   // 注意路径：utils 而不是 util

const router = useRouter()
const startTime = ref(Date.now())
const activeView = ref('recent')

// 项目卡片任务列表
const projectTasks = ref([
  { id: 'p1', name: '撰写周报' },
  { id: 'p2', name: '评审设计稿' },
  { id: 'p3', name: '修复线上Bug' }
])
const workflowTasks = ref([
  { id: 'w1', name: '代码审查' },
  { id: 'w2', name: '部署测试环境' }
])

// 清除日志
const clearLogs = () => {
  eventLogs.value = []
}

// ------------------- 生命周期 -------------------
onMounted(() => {
  // 界面日志（仅显示）
  trackEvent('project_view', {
    page: 'project', block: 'all', seat: 'view', pv_count: 1
  })
  trackEvent('project_view_user_id', {
    page: 'project', block: 'user', seat: 'view', uv_count: 1, user_id: userId.value
  })
  startTime.value = Date.now()
  trackEvent('project_view_workbench', {
    page: 'project', block: 'all', seat: 'view', view_start: startTime.value
  })

  // 真实事件发送（页面浏览由基础代码自动完成，不需要额外发送，此处可注释）
  // sendMatomoEvent('page', 'view', 'A', 1)
  // sendGA4Event('page_view', { page_title: 'A' })
})

onBeforeUnmount(() => {
  const duration = Math.round((Date.now() - startTime.value) / 1000)
  
  // 界面日志
  trackEvent('project_leave_workbench', {
    page: 'project', block: 'all', seat: 'view',
    duration_seconds: duration, view_start: startTime.value
  })

  // 真实事件发送：停留时长
  sendMatomoEvent('page', 'duration', '页面A', duration)
  sendGA4Event('page_duration', {
    event_category: 'page',
    event_label: '页面A',
    value: duration
  })
})

// ------------------- 导航 -------------------
const goToB = () => {
  trackEvent('navigate_click', { from: 'A', to: 'B' })
  sendMatomoEvent('navigation', 'click', 'A_to_B', 1)
  sendGA4Event('navigate', { from: 'A', to: 'B' })

  if (window.collectEvent) {
    window.collectEvent('track', 'navigate', {
      from: 'A',
      to: 'B'
    });
  }
  router.push('/b')
}
const goToC = () => {
  trackEvent('navigate_click', { from: 'A', to: 'C' })
  sendMatomoEvent('navigation', 'click', 'A_to_C', 1)
  sendGA4Event('navigate', { from: 'A', to: 'C' })

  if (window.collectEvent) {
    window.collectEvent('track', 'navigate', {
      from: 'A',
      to: 'C'
    });
  }
  router.push('/c')
}

// ------------------- 交互事件 ------------------
const handleExistClick = (viewName, seatType) => {
  activeView.value = seatType
  trackEvent('project_exist_click', {
    page: 'project', block: 'view', seat: seatType, view_name: viewName
  })
  sendMatomoEvent('project:view', 'click_existing_view', viewName, null)
  sendGA4Event('click_existing_view', {
    event_category: 'project:view',
    event_label: viewName
  })
}

const handleEnterTask = (task, source) => {
  if (source === 'project') {
    trackEvent('project_task_enter', {
      page: 'project', block: 'view', seat: 'task',
      enter_task: 1, task_id: task.id, task_name: task.name
    })
    sendMatomoEvent('project:view:task', 'enter_task', task.name, 1)
    sendGA4Event('enter_task', {
      event_category: 'project:view:task',
      event_label: task.name,
      value: 1,
      task_id: task.id
    })
  } else {
    trackEvent('dynamic_workflow_enter_task', {
      page: 'project', block: 'workflow', seat: 'task',
      enter_task: 1, task_id: task.id, task_name: task.name
    })
    sendMatomoEvent('workflow:task', 'enter_task', task.name, 1)
    // GA4 事件也可以添加，这里省略
  }
}

const handleAddView = () => {
  trackEvent('project_view_add_click', {
    page: 'dashboard', block: 'project', seat: 'view', add_view: 1
  })
  sendMatomoEvent('dashboard:project:view', 'add_view_click', '新增视图', 1)
  sendGA4Event('add_view_click', {
    event_category: 'dashboard:project:view',
    event_label: '新增视图',
    value: 1
  })
}

const handleAddTaskToView = () => {
  trackEvent('project_view_task_add', {
    page: 'project', block: 'all', seat: 'view', add_task_to_view: 1
  })
  sendMatomoEvent('project:all:view', 'add_task_to_view_click', '视图内添加任务', 1)
  sendGA4Event('add_task_to_view_click', {
    event_category: 'project:all:view',
    event_label: '视图内添加任务',
    value: 1
  })
}
</script>

<style scoped>
.workbench-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

.header {
  margin-bottom: 24px;
}

.header h1 {
  font-size: 28px;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.user-info {
  background: #e0f2fe;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-block;
  font-size: 14px;
  color: #0369a1;
  margin: 0;
}

.log-panel {
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 32px;
}

.log-panel h3 {
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.log-count {
  background: #334155;
  padding: 2px 10px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: normal;
}

.log-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  max-height: 200px;
  overflow-y: auto;
  background: #0f172a;
  border-radius: 8px;
  padding: 8px;
}

.log-item {
  padding: 8px;
  border-bottom: 1px solid #334155;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #94a3b8;
  min-width: 70px;
}

.log-name {
  color: #facc15;
  font-weight: 600;
  min-width: 180px;
}

.log-params {
  color: #6ee7b7;
  word-break: break-word;
  flex: 1;
}

.clear-btn {
  background: #475569;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
}

.clear-btn:hover {
  background: #64748b;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h2 {
  font-size: 18px;
  margin: 0;
  color: #1e293b;
}

.badge {
  background: #dbeafe;
  color: #1e40af;
  padding: 4px 8px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
}

.card-desc {
  color: #64748b;
  font-size: 13px;
  margin-top: -8px;
  margin-bottom: 16px;
}

.view-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 30px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.task-list {
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  background: white;
}

.task-item:last-child {
  border-bottom: none;
}

.task-name {
  font-weight: 500;
  color: #0f172a;
}

.enter-btn {
  background: #e2e8f0;
  border: none;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s;
}

.enter-btn:hover {
  background: #cbd5e1;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.action-btn {
  flex: 1;
  background: #f8fafc;
  border: 1px dashed #94a3b8;
  border-radius: 30px;
  padding: 10px 12px;
  font-size: 14px;
  color: #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #e2e8f0;
  border-style: solid;
}

.hint {
  color: #94a3b8;
  font-size: 12px;
  margin-top: 12px;
  text-align: center;
}

.footer {
  text-align: center;
  color: #64748b;
  font-size: 14px;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.nav-buttons {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  justify-content: center;
}
.nav-btn {
  border: none;
  border-radius: 30px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.nav-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
.nav-btn.secondary {
  background: white;
  color: #4a5568;
  border: 2px solid #cbd5e0;
}
.nav-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}
</style>