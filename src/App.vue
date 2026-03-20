<template>
  <div class="app-container">
    <!-- 全局日志面板 -->
    <section class="global-log-panel" v-if="showLogs">
      <h3>📋 全局埋点日志 <span class="log-count">({{ eventLogs.length }})</span></h3>
      <ul class="log-list">
        <li v-for="(log, idx) in eventLogs" :key="idx" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-name">{{ log.event }}</span>
          <span class="log-params">{{ JSON.stringify(log.params) }}</span>
        </li>
      </ul>
      <button class="clear-btn" @click="clearLogs">清除日志</button>
      <button class="toggle-btn" @click="showLogs = !showLogs">隐藏日志</button>
    </section>
    <button v-else class="show-log-btn" @click="showLogs = true">显示日志</button>

    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { eventLogs, clearLogs } from './util/tracking'

const showLogs = ref(true)
</script>

<style>
/* 全局样式（同之前） */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: #f8fafc;
}
.app-container {
  position: relative;
  min-height: 100vh;
}
.global-log-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 400px;
  background: #1e293b;
  color: #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  z-index: 1000;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3);
  max-height: 80vh;
  overflow-y: auto;
}
.global-log-panel h3 {
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
}
.log-list {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  max-height: 400px;
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
.log-time { color: #94a3b8; min-width: 70px; }
.log-name { color: #facc15; font-weight: 600; min-width: 180px; }
.log-params { color: #6ee7b7; word-break: break-word; flex: 1; }
.clear-btn, .toggle-btn, .show-log-btn {
  background: #475569;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  margin-right: 8px;
  cursor: pointer;
}
.clear-btn:hover, .toggle-btn:hover { background: #64748b; }
.show-log-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
}
</style>