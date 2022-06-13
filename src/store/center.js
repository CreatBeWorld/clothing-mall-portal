import {reqWaitComment,reqOrderItem,reqPubComment,reqCommented,reqPubDetail} from "../api";
const state = {
  waitCommentList: [],//待评价订单列表
  commentedList: [],//已评价订单列表
  orderItemPub:{},
  pubDetail:{}
};
const mutations = {
  setWaitCommentList(state,val){
    state.waitCommentList = val
  },
  setCommentedList(state,val){
    state.commentedList = val
  },
  orderItemPub(state,val){
    state.orderItemPub = val
  },
  pubDetail(state,val){
    state.pubDetail = val
  }

};
const actions = {
  async waitCommentList({commit},userId){
    const res = await reqWaitComment(userId)
    console.log(res)
    if(res.code===1){
      commit("setWaitCommentList",res.data)
    }
  },
  async commentedList({commit},userId){
    const res = await reqCommented(userId)
    if(res.code===1){
      commit("setCommentedList",res.data)
    }
  },
  async orderItem({commit},id){
    const res = await reqOrderItem(id)
    if(res.code===1){
      commit("orderItemPub",res.data)
    }
  },
  //发布商品评价
  async pubComment({commit},data){
    const res = await reqPubComment(data)
    if(res.code===1){
      return "ok"
    }else{
      console.log(res.msg)
      return Promise.reject(new Error('商品评价失败'));
    }
  },
  //商品详情
  async getPubDetail({commit},orderItemId){
    const res = await reqPubDetail(orderItemId)
    if(res.code===1){
      commit("pubDetail",res.data)
    }
  }

};
const getters = {
  waitCommentList(state){
    return state.waitCommentList||[]
  },
  commentedList(state){
    return state.commentedList||[]
  },
  orderItemPub(state){
    return state.orderItemPub||{}
  },
  pubDetail(state){
    return state.pubDetail||{}
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};
