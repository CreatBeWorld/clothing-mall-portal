import { reqGoodsInfo } from "../api/index";
const state = {
  goodInfo: {},
};
const mutations = {
  setGoodsInfo(state, val){
    state.goodInfo = val;
  },
  getGoodsInfo(state, val) {
    val.skuInfo.images = val.skuInfo.images.split(',')
    state.goodInfo = val;
  },
};
const actions = {
  //获取商品详情
  async getGoodInfo({ commit }, skuId) {
    let result = await reqGoodsInfo(skuId);
    if (result.code === 1) {
      commit("getGoodsInfo", result.data);
    }else{
      console.log(result)
    }
  },
};
//简化数据而生
const getters = {
  //路径导航简化的数据
  categoryView(state) {
    //比如:state.goodInfo初始状态空对象，空对象的categoryView属性值undefined
    //当前计算出的 categoryView属性值至少是一个空对象，假的报错不会有了。
    return state.goodInfo.categoryView || {};
  },
  //简化产品信息的数据
  skuInfo(state) {
    return state.goodInfo.skuInfo || {};
  },
  //产品售卖属性的简化
  spuSaleAttrList(state) {
    return state.goodInfo.spuSaleAttrList || [];
  },
  spu(state){
    return state.goodInfo.spu||{};
  },
  skuAttrVoList(state){
    return state.goodInfo.skuAttrVoList||[];
  }

};
export default {
  state,
  actions,
  mutations,
  getters,
};
