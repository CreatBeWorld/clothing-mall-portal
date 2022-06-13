import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugin/element.js'
import store from './store'
//导入字体图标
import './assets/fonts/iconfont.css'
//注册全局组件
import TypeNav from "./components/common/TypeNav";
Vue.component(TypeNav.name,TypeNav)
import "swiper/css/swiper.css"
Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App),
  //全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this;
    // Vue.prototype.$API = API;
  },
  store
}).$mount('#app')
