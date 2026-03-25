import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

sensors.init({
  app_id: 'b4e97163acb3445f201ff1e7c241877f399344d3730b9396698860994eb45484',           // 你的 AppID
  server_url: 'rangers://c957e34d82f2a7f0d81972f6ba7bf4e9/MjAwMTMxNDI=', // 固定地址
  auto_track: {
    page: true,      // 自动采集页面浏览（对 SPA 生效）
    click: false,    // 如需自动采集点击可设为 true
    scroll: false,
  },
  show_log: true,    // 开启调试，在控制台查看日志
})
sensors.start()

// 可选：设置公共属性
sensors.registerApp({
  platform: 'Web',
  version: '1.0.0'
})

const app = createApp(App)
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})
app.use(router)
app.mount('#app')