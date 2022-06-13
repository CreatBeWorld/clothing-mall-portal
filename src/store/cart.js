import {reqAddToCart,reqCartList,reqUpdateCart,reqDelete,reqUpdateAllCheck } from "../api";
const state = {
  cartList: [],
  newCartItem:{}
};
const mutations = {
  setNewCartItem(state,val){
    state.newCartItem = val
  },
  setCartList(state,val){
    state.cartList = val
  }

};
const actions = {
  //加入购物车
  async addToCart({commit},cart){
    const res = await reqAddToCart(cart)
    if(res.code===1){
      commit("setNewCartItem",res.data)
      return "ok"
    }
    else{
      return Promise.reject(new Error("加入购物车失败"));
    }
  },
  //获取购物车列表
  async cartList({commit},userId){
     const res = await reqCartList(userId)
      if(res.code===1){
        commit("setCartList",res.data)
      }
  },
  //修改购物车商品数量
  async updateCartNum({commit},cart){
    const res = await reqUpdateCart(cart)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error("修改商品数量失败"));
    }
  },
  //删除购物车记录
  async deleteCart({commit},ids){
    const res = await reqDelete(ids)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error("移除购物车商品失败"));
    }
  },
  //修改购物车某一个产品的选中状态
  async updateCheck({ commit }, cart) {
    let result = await reqUpdateCart(cart);
    if (result.code===1) {
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },
  //实现商品全选与全不选
  async updateAllCartIsChecked({ commit }, cart){
    const res = await reqUpdateAllCheck(cart)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error("商品全选失败"));
    }
  }

};
const getters = {
  newCartItem(state){
    return state.newCartItem||{}
  },
  cartList(state){
    return state.cartList||[]
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};
