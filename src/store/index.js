import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import user from './User'
import home from "./home";
import detail from "./detail";
import cart from "./cart"
import address from "./address";
import trade from "./trade";
import order from "./order"
import search from "./search";
import center from './center'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules:{
    user,
    home,
    detail,
    cart,
    address,
    trade,
    order,
    search,
    center
  },
  plugins: [createPersistedState({//Vuex数据 持久化(页面刷新时，会把数据存储在本地存储中)
    storage: window.sessionStorage
  })]
})
export default store
