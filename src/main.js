import Vue from 'vue'
import App from './App.vue'

// 导入element包
import Element from 'element-ui'
// 导入样式
import 'element-ui/lib/theme-chalk/index.css'

// 导入VueRouter
import router from './router/index'

// 导入axios
import axios from '@/api/axios'
// // 基准路径
// axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// // token认证
// axios.defaults.headers = {
//   authorization: 'Bearer ' +
//   JSON.parse(window.sessionStorage.getItem('hm74-toutiao')).token
// }
// 注册到vue实例
Vue.use(Element)
// 放到原型上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  // 挂载router
  router,
  render: h => h(App)
}).$mount('#app')
