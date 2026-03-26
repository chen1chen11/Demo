import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import posthog from 'posthog-js'
import { globalUserId } from './util/tracking'

posthog.init(import.meta.env.VITE_POSTHOG_PROJECT_TOKEN || '', {
  api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com',
  defaults: '2026-01-30',
})

posthog.identify(globalUserId.value)

const app = createApp(App)
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})

app.config.errorHandler = (err) => {
  posthog.captureException(err)
}

app.use(router)
app.mount('#app')