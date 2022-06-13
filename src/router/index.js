import Vue from 'vue'
import VueRouter from 'vue-router'

const Home =()=>import('../views/Home')
const Login =()=>import('../views/Login')
const Register =()=>import('../views/Register')
const Search =()=>import('../views/Search')
const Detail = ()=>import('../views/Detail')
const AddToCartSuccess= ()=>import('../views/AddToCartSuccess')
const Cart = ()=>import('../views/Cart')
const Trade = ()=>import('../views/Trade')
const Pay = ()=>import('../views/Pay')
const Alipay = ()=>import('../views/Pay/Alipay')
const PaySuccess = ()=>import('../views/PaySuccess')
const Center = ()=>import('../views/Center')
const Comment = ()=>import('../views/Center/comment')
const Address = ()=>import('../views/Center/address')
const Member = ()=>import('../views/Center/member')
const Order = ()=>import('../views/Center/order')
const Publish = ()=>import('../views/Center/comment/publish')
const PubDetail = ()=>import('../views/Center/comment/pubDetail')
const RefundDetail = ()=>import('../views/Center/order/RefundDetail')
const ReturnGoodsDetail = ()=>import('../views/Center/order/ReturnGoodsDetail')



const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/home'
  },
  {
    path:"/home",
    component:Home,
  },
  {
    path:"/login",
    component:Login,
  },
  {
    path:"/register",
    component:Register,
  },
  {
    path:"/search/:keyword?",
    component:Search,
    name:'search',
  },
  {
    name: 'detail',  // 是当前路由的标识名称
    path: '/detail',
    component: Detail,
  },
  {
    name:"addToCartSuccess",
    path:"/cart/addToCartSuccess",
    component:AddToCartSuccess
  },
  {
    name:"cart",
    path:"/cart",
    component:Cart
  },
  {
    name:"trade",
    path:"/trade",
    component:Trade
  },
  {
    name:"pay",
    path:"/pay",
    component:Pay
  },
  {
    name:"alipay",
    path:"/alipay",
    component:Alipay
  },
  {
    path:"/paySuccess",
    component:PaySuccess
  },
  {
    path:'/center',
    component:Center,
    redirect: '/center/member',
    children:[
      {
        path:'/center/member',
        component:Member
      },
      {
        path:'/center/address',
        component:Address
      },
      {
        path:'/center/order',
        component:Order
      },
      {
        path:'/center/comment',
        component:Comment
      }
    ]
  },
  {
    path:'/center/publish',
    component:Publish
  },
  {
    path:'/center/pubDetail',
    component:PubDetail
  },
  {
    path:'/center/refundDetail',
    component:RefundDetail
  },
  {
    path:'/center/returnGoodsDetail',
    component:ReturnGoodsDetail
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
//全局守卫：前置守卫（在路由跳转之间进行判断）
router.beforeEach( (to, from, next) => {
  //to:获取到要跳转到的路由信息
  //from：获取到从哪个路由跳转过来来的信息
  //next: next() 放行  next(path) 放行  到指定的路由
  //用户登录了
  if(sessionStorage.getItem("portalToken")){
    //已经登录了，阻止登录、注册
    if(to.path==="/login"||to.path==='/register'){
      next("/home");
    }
    else{
      next()
    }

  }else{
    //未登录：不能去个人中心、评价晒单、我的订单、购物车、交易相关、不能去支付相关【pay|paySuccess】
    //未登录去上面这些路由-----登录
    let toPath = to.path;
    if(toPath.indexOf('/trade')!==-1 ||toPath.indexOf('/cart')!==-1|| toPath.indexOf('/pay')!==-1||toPath.indexOf('/center')!==-1){
      //把未登录的时候向去而没有去成的信息，存储于地址栏中【路由】
      next('/login?redirect='+toPath);
    }else{
      //去的不是上面这些路由  放行
      next();
    }
  }
});
export default router
