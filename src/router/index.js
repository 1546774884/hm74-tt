// router 组件

// 引入vue
import Vue from 'vue'

// 引入Vue-router
import VueRouter from 'vue-router'

// 导入login.vue组件
import login from '../views/login/login.vue'
import home from '../views/home/home.vue'
import Welcome from '../views/welcome/Welcome.vue'
import NotFond from '../views/404/NotFond.vue'
import Article from '../views/article/Article.vue'
import Image from '../views/image/image.vue'
import Publish from '../views/publish/publish.vue'
import Comment from '../views/comment/comment.vue'
import Setting from '../views/setting/setting.vue'
import Fans from '../views/fans/fans.vue'

// 注册到vue实例
Vue.use(VueRouter)

// 注册路由对象
const router = new VueRouter({
  routes: [
    { name: 'login', path: '/login', component: login },
    {
      path: '/',
      component: home,
      children: [
        { name: 'welcome', path: '/', component: Welcome },
        { name: 'article', path: '/article', component: Article },
        { name: 'image', path: '/image', component: Image },
        { name: 'publish', path: '/publish', component: Publish },
        { name: 'comment', path: '/comment', component: Comment },
        { name: 'setting', path: '/setting', component: Setting },
        { name: 'fans', path: '/fans', component: Fans }
      ]
    },
    { name: '404', path: '*', component: NotFond }

  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const user = window.sessionStorage.getItem('hm74-toutiao')
  if (user) return next()
  next('/login')
})
// 导出
export default router
