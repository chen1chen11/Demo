import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as amplitude from '@amplitude/unified'

const API_KEY = '49f707cab6888a0d146e4a37f69950d3'

// 初始化 Amplitude（开启 Autocapture 和 Session Replay）
amplitude.initAll(API_KEY, {
  analytics: {
    autocapture: {
      attribution: true,          // 归因追踪
      fileDownloads: true,        // 文件下载
      formInteractions: true,     // 表单交互
      pageViews: true,            // 页面浏览
      sessions: true,             // 会话
      elementInteractions: true,  // 元素点击
      // 以下为 frustration signals（用户受挫信号）
      rageClicks: true,           // 愤怒点击（快速重复点击）
      deadClicks: true,           // 死点击（点击无响应）
      errorClicks: true,          // 错误点击（点击到控制台错误）
      thrashedCursor: true        // 光标抖动
    }
  },
  sessionReplay: {
    sampleRate: 1  // 1 = 100% 录制会话回放，生产环境建议调低
  }
})


const app = createApp(App)
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})

app.use(router)
app.mount('#app')