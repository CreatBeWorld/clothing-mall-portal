import {reqGetTradeInfo} from "../api";
const state = {
  orderInfo:{}
};
const mutations = {
  setTradeInfo(state,val){
    state.orderInfo = val
  }

};
const actions = {
  //获取交易数据
  async getTradeInfo({commit},userId){
    const res = await reqGetTradeInfo(userId)
    if(res.code===1){
      commit("setTradeInfo",res.data)
    }
  },

};
const getters = {
};
export default {
  state,
  mutations,
  actions,
  getters,
};
