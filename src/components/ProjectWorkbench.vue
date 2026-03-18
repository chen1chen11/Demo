<template>
  <div class="workbench-container">
    <!-- 头部信息 -->
    <header class="header">
      <h1>📘 博客工作台 · 埋点测试 Demo</h1>
      <p class="user-info">当前测试用户 ID：<strong>{{ userId }}</strong> (固定于本次会话)</p>
    </header>

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

    <!-- 卡片区域：模拟项目进度与动态工作流 -->
    <div class="cards-grid">
      <!-- 卡片 1：项目进度卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>📌 项目进度</h2>
          <span class="badge">page:project</span>
        </div>
        <p class="card-desc">页面加载自动触发 PV/UV/停留开始</p>

        <!-- 视图切换（我的收藏 / 近期任务） -->
        <div class="view-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeView === 'collect' }"
            @click="handleExistClick('我的收藏', 'collect')"
          >
            ⭐ 我的收藏
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeView === 'recent' }"
            @click="handleExistClick('近期任务', 'recent')"
          >
            🕒 近期任务
          </button>
        </div>

        <!-- 任务列表 -->
        <div class="task-list">
          <div v-for="task in projectTasks" :key="task.id" class="task-item">
            <span class="task-name">{{ task.name }}</span>
            <button class="enter-btn" @click="handleEnterTask(task, 'project')">
              进入任务
            </button>
          </div>
        </div>

        <!-- 操作按钮组 -->
        <div class="action-buttons">
          <button class="action-btn" @click="handleAddView">
            <span>➕</span> 新增视图 (卡片内添加视图)
          </button>
          <button class="action-btn" @click="handleAddTaskToView">
            <span>📝</span> 视图内添加任务
          </button>
        </div>
      </div>

      <!-- 卡片 2：动态工作流卡片 -->
      <div class="card">
        <div class="card-header">
          <h2>⚡ 动态工作流</h2>
          <span class="badge">block:workflow</span>
        </div>
        <div class="task-list">
          <div v-for="task in workflowTasks" :key="task.id" class="task-item">
            <span class="task-name">{{ task.name }}</span>
            <button class="enter-btn" @click="handleEnterTask(task, 'workflow')">
              进入任务 (动态)
            </button>
          </div>
        </div>
        <p class="hint">点击上方按钮触发 dynamic_workflow_enter_task 埋点</p>
      </div>
    </div>

    <!-- 底部提示 -->
    <footer class="footer">
      <p>🖱️ 所有交互均已埋点，请打开控制台查看完整事件输出。</p>
    </footer>
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ------------------- 真实 Matomo 事件发送 -------------------
const sendMatomoEvent = (category, action, name, value = null) => {
  if (window._paq) {
    window._paq.push(['trackEvent', category, action, name, value]);
  } else {
    console.warn('Matomo _paq not found');
  }
};
// ------------------- 真实 GA4 事件发送 -------------------
const sendGA4Event = (eventName, params = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.warn('gtag not found');
  }
};

// ------------------- 响应式数据 -------------------
const userId = ref(`blog_tester_${Math.floor(Math.random() * 10000)}`) // 模拟独立用户
const startTime = ref(Date.now())
const eventLogs = ref([]) // 界面日志
const activeView = ref('recent') // 当前激活的视图，仅用于UI反馈

// 项目卡片任务列表
const projectTasks = ref([
  { id: 'p1', name: '撰写周报' },
  { id: 'p2', name: '评审设计稿' },
  { id: 'p3', name: '修复线上Bug' }
])

// 动态工作流任务列表
const workflowTasks = ref([
  { id: 'w1', name: '代码审查' },
  { id: 'w2', name: '部署测试环境' }
])

// ------------------- 通用埋点方法 -------------------
const trackEvent = (eventName, params = {}) => {
  // 添加时间戳
  const fullParams = { ...params, timestamp: Date.now() }
  // 记录到界面日志
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    event: eventName,
    params: fullParams
  })
  // 调用第三方SDK
  //mockSDK.track(eventName, fullParams)
}

// 清除日志
const clearLogs = () => {
  eventLogs.value = []
}

// ------------------- 页面生命周期埋点 -------------------
onMounted(() => {
  // 1. 页面访问 PV
  trackEvent('project_view', {
    page: 'project',
    block: 'all',
    seat: 'view',
    pv_count: 1
  })

  // 2. 页面访问 UV (独立用户)
  trackEvent('project_view_user_id', {
    page: 'project',
    block: 'user',
    seat: 'view',
    uv_count: 1,
    user_id: userId.value
  })

  // 3. 用户停留开始
  startTime.value = Date.now()
  trackEvent('project_view_workbench', {
    page: 'project',
    block: 'all',
    seat: 'view',
    view_start: startTime.value
  })
})

onBeforeUnmount(() => {
  const duration = Math.round((Date.now() - startTime.value) / 1000);
  trackEvent('project_leave_workbench', {
    page: 'project', block: 'all', seat: 'view',
    duration_seconds: duration, view_start: startTime.value
  });

  // 发送停留时长事件
  sendMatomoEvent(
    'project:all:view',
    'page_duration',
    '停留时长',
    duration   // 以秒为单位的数值
  );
   // GA4
  sendGA4Event('page_duration', {
    event_category: 'project:all:view',
    event_label: '停留时长',
    value: duration
  });
});

// ------------------- 交互事件埋点 ------------------
// 点击「我的收藏 / 近期任务」
const handleExistClick = (viewName, seatType) => {
  activeView.value = seatType;
  trackEvent('project_exist_click', {
    page: 'project', block: 'view', seat: seatType, view_name: viewName
  });

  // 发送真实 Matomo 事件
  sendMatomoEvent(
    'project:view',           // 类别
    'click_existing_view',    // 动作
    viewName,                 // 名称（如“我的收藏”）
    null                      // 值（不需要）
  );
  // GA4
  sendGA4Event('click_existing_view', {
    event_category: 'project:view',
    event_label: viewName
  });
};

// 进入任务（区分项目卡片与动态工作流）
const handleEnterTask = (task, source) => {
  if (source === 'project') {
    trackEvent('project_task_enter', {
      page: 'project', block: 'view', seat: 'task',
      enter_task: 1, task_id: task.id, task_name: task.name
    });

    sendMatomoEvent(
      'project:view:task',
      'enter_task',
      task.name,
      1   // 可选的数值，表示一次进入
    );
    // GA4
    sendGA4Event('enter_task', {
      event_category: 'project:view:task',
      event_label: task.name,
      value: 1,
      task_id: task.id
    });

  } else {
    // 动态工作流
    trackEvent('dynamic_workflow_enter_task', {
      page: 'project', block: 'workflow', seat: 'task',
      enter_task: 1, task_id: task.id, task_name: task.name
    });

    sendMatomoEvent(
      'workflow:task',
      'enter_task',
      task.name,
      1
    );
  }
};

// 卡片内添加视图
const handleAddView = () => {
  trackEvent('project_view_add_click', {
    page: 'dashboard', block: 'project', seat: 'view', add_view: 1
  });

  sendMatomoEvent(
    'dashboard:project:view',
    'add_view_click',
    '新增视图',
    1
  );
  // GA4
  sendGA4Event('add_view_click', {
    event_category: 'dashboard:project:view',
    event_label: '新增视图',
    value: 1
  });
};

// 视图内添加任务
const handleAddTaskToView = () => {
  trackEvent('project_view_task_add', {
    page: 'project', block: 'all', seat: 'view', add_task_to_view: 1
  });

  sendMatomoEvent(
    'project:all:view',
    'add_task_to_view_click',
    '视图内添加任务',
    1
  );
  // GA4
  sendGA4Event('add_task_to_view_click', {
    event_category: 'project:all:view',
    event_label: '视图内添加任务',
    value: 1
  });
};
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
</style>