// 封装一个vue插件，在components所有的组件都可以全局注册

import mianbx from '@/components/mianbx.vue'
import pindao from '@/components/pindao.vue'
import fzimage from '@/components/fz-image.vue'

export default {
  install (Vue) {
    Vue.component(mianbx.name, mianbx)
    Vue.component(pindao.name, pindao)
    Vue.component(fzimage.name, fzimage)
  }
}
