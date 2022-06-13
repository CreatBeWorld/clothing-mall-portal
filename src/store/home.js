import {reqGetCategoryList,reqGetBannerList,reqGetNewProduct,reqGetHotProduct,reqGetCateTop} from "../api";

const state = {
  categoryList:[],//三级分类联动
  bannerList:[],//轮播图
  newGoods:{},//新品首发
  hotGoods:{},//全网爆款
  cateTop:[],//一级分类商品推荐
  // isFirst:true,//是否是第一次打开地图
};
const mutations = {
  categoryList(state,val){
    state.categoryList = val
  },
  bannerList(state,val){
    state.bannerList = val
  },
  newGoods(state,val){
    state.newGoods = val
  },
  hotGoods(state,val){
    state.hotGoods = val
  },
  cateTop(state,val){
    state.cateTop =val
  },
  setIsFirst(state,val){
    state.isFirst = val
  }
};
const actions = {
  //三级分类联动数据获取
  async threeCatePortal({commit}){
    const res = await reqGetCategoryList()
    if(res.code===1){
      commit("categoryList",res.data)
    }
  },
  async getBannerList({commit}){
    const res = await reqGetBannerList()
    if(res.code===1){
      commit('bannerList',res.data)
    }
  },
  async newProduct({commit}){
    const res = await reqGetNewProduct()
    if(res.code===1){
      commit('newGoods',res.data)
    }

  },
  async hotProduct({commit}){
    const res = await reqGetHotProduct()
    if(res.code===1){
      commit('hotGoods',res.data)
    }

  },
  async cateTop({commit}){
    const res = await reqGetCateTop()
    if(res.code===1){
      const realData = res.data.filter(cate=>{
        return cate.skuList.length>0
      })
      commit('cateTop',realData)
    }
  }

};
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
