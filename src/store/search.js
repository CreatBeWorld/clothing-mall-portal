import {reqSearch } from "../api/index";
//search模块的仓库
const state = {
  //仓库初始状态
  searchList:{}
};
const mutations = {
  searchList(state, val) {
    state.searchList = val
  },
};
const actions = {
  //获取search模块数据
  async getSearchList({ commit }, data) {
    let result = await reqSearch(data);
    if (result.code === 1) {
      commit("searchList", result.data);
    }else {
      commit("searchList", {});
      return Promise.reject(new Error(result.msg));
    }
  },
};
//计算属性
//项目当中getters主要的作用是:简化仓库中的数据(简化数据而生)
//可以把我们将来在组件当中需要用的数据简化一下【将来组件在获取数据的时候就方便了】
const getters = {
  goodsList(state){
    return state.searchList.rows||[];
  }
  ,
  total(state){
    return state.searchList.total||0;
  }
};
export default {
  state,
  mutations,
  actions,
  getters,
};
