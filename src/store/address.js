import {reqGetAddressList,reqAddAddress,reqUpdateAddress,reqDeleteAddress,reqSetDefaultAddress} from "../api";
const state = {
  addressList: [],
};
const mutations = {
  setAddressList(state,val){
    state.addressList = val
  }

};
const actions = {
  //获取收货地址列表
  async addressList({commit},userId){
    const res = await reqGetAddressList(userId)
    if(res.code===1){
      commit("setAddressList",res.data)
    }
  },
  //新增收货地址
  async addAddress({commit},address){
    const res = await reqAddAddress(address)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error(res.msg));
    }
  },
  //修改收货地址
  async updateAddress({commit},address){
    const res = await reqUpdateAddress(address)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error(res.msg));
    }
  },
  //删除收货地址
  async deleteAddress({commit},id){
    const res = await reqDeleteAddress(id)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error(res.msg));
    }
  },
  //设置默认收货地址
  async setDefaultAddress({commit},address){
    const res = await reqSetDefaultAddress(address)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error(res.msg));
    }
  }

};
const getters = {
  addressList(state){
    return state.addressList||[]
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};
