import Vue from 'vue'
import App from './App.vue'

// 导入element包
import Element from 'element-ui'
// 导入样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入VueRouter
import router from './router/index'

// 导入axios
import axios from 'axios'
// 注册到vue实例
Vue.use(Element)
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  // 挂载router
  router,
  render: h => h(App)
}).$mount('#app')
