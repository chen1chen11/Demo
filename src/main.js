import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { globalUserId } from './util/tracking'


const app = createApp(App)
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '默认标题'
  next()
})

app.use(router)
app.mount('#app')