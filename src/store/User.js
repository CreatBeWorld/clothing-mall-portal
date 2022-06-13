import {reqRegister,reqLogin,reqLogout,reqUserInfo,reqUpdateUser,reqUpdatePassword} from "../api/index";

const state = {
  userInfo: {},
  centerUserInfo:{}
};
const mutations = {
  setUserInfo(state,val){
    state.userInfo = val;
  },
  setCenterUserInfo(state,val){
    state.centerUserInfo = val;
  }
};
const actions = {
  async reqRegister({commit},user){
    let result = await reqRegister(user);
    if (result.code ===1) {
      console.log("注册成功")
      return "ok";
    } else {
      return Promise.reject(new Error("fail"));
    }
  },
  async userLogin({commit},user){
      const res = await reqLogin(user)
      if(res.code===1){
        commit("setUserInfo",{memberName:res.data.memberName,memberId:parseInt(res.data.userId)})
        sessionStorage.setItem("portalToken",res.data.tokeHead+' '+res.data.token)
        return "ok";
      }else {
        return Promise.reject(new Error(res.msg));
      }

  },
  async userLogout({commit}){
      const res = await reqLogout()
      if(res.code===1){
        commit("setUserInfo",{})
        sessionStorage.removeItem("portalToken")
        return "ok"
      }else {
        return Promise.reject(new Error(res.msg));
      }
  },
  async userInfo({commit},id){
    const res = await reqUserInfo(id)
    if(res.code===1){
      commit('setCenterUserInfo',res.data)
    }
  },
  async updateUser({commit},user){
    const res = await reqUpdateUser(user)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error(res.msg));
    }
  },
  async updatePass({commit},data){
    const res = await reqUpdatePassword(data)
    if(res.code===1){
      return "ok"
    }else{
      return Promise.reject(new Error(res.msg));
    }
  }
};
const getters = {
  userInfo(state){
    return state.centerUserInfo||{}
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};

