import { reqSubmitOrder,reqPay,reqOrderList,reqOrderDetail} from "../api";

const state = {
  orderListRes:{},
};
const mutations = {
  setOrderListRes(state,val){
    state.orderListRes = val
  }
};
const actions = {
  async submitOrder({commit}, data) {
    const res = await reqSubmitOrder(data)
    if (res.code === 1) {
      return res.data
    } else {
      return Promise.reject(new Error("提交订单失败"));
    }
  },
  async pay({commit}, data) {
    const res = await reqPay(data)
    if (res.code === 1) {
      return "ok"
    } else {
      return Promise.reject(new Error(res.msg));
    }
  },
  async orderListRes({commit},data){
    const res = await reqOrderList(data)
    if(res.code===1){
      commit('setOrderListRes',res.data)
    }else{
      commit('setOrderListRes',{})
    }
  },
  async orderDetail({commit},orderId){
    const res =  await reqOrderDetail(orderId)
    if(res.code===1){
      return res.data
    }
  }
};
const getters = {
  orderList(state){
    return state.orderListRes.rows||[]
  },
  orderTotal(state) {
    return state.orderListRes.total||0
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};
