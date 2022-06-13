//统一管理项目接口的模块
//引入二次封装的axios（带有请求、响应的拦截器）
import requests from "./request";
//三级联动接口
export const reqGetCategoryList = () =>requests.get(`/category/threeCatePortal`);//返回promise对象
//轮播图
export const reqGetBannerList= ()=>requests.get('/banner/list')
//新品首发
export const reqGetNewProduct=()=>requests.get('/home/newProduct')
//全网爆款
export const reqGetHotProduct=()=>requests.get('/home/hotProduct')
//一级分类商品推荐
export const reqGetCateTop = ()=>requests.get('/home/cateGoodsRecList')
// //商品搜索
// export const reqGetSearchInfo = (params)=>requests({url:"/search/list",method:"post",data:params});
//商品详情
//获取产品详情信息的接口  URL: /api/item/{ skuId }  请求方式：get
export const reqGoodsInfo = (skuId)=>requests({url:`/sku/detail/${skuId}`,method:'get'});
//用户注册 用户名唯一性检验
export const reqUsernameCheck = (username)=>requests({url:`/user/usernameCheck`,method:'get',params:{username}})
export const reqRegister = (user)=>requests({url:'/user/register',data:user,method:'post'})
//用户登录
export const reqLogin = (user)=>requests({url:'/login/memberLogin',data:user,method:'post'})
//退出登录
export const reqLogout = ()=>requests.post('/logout')
//加入购物车
export const reqAddToCart = (data)=>requests({url:'/cart/addToCart',data,method:'post'})
//购物车列表
export const reqCartList = (userId)=>requests({url:`/cart/list`,method:'get',params:{userId}})
//修改购物车（商品数量、商品是否选中）
export const reqUpdateCart = (data)=>requests({url:`/cart/update`,data,method:'post'})
//删除购物车产品（包含批量删除）
export const reqDelete =(data)=>requests({url:`/cart/delete`,data,method:'post'})
//实现商品全选与全不选
export const reqUpdateAllCheck = (data)=>requests({url:'/cart/updateAllCheck',data,method:'post'})
//收货地址列表
export const reqGetAddressList = (userId)=>requests({url:`/address/list`,method:'get',params:{userId}})
//获取交易页数据
export const reqGetTradeInfo = (userId)=>requests({url:`/cart/trade`,method:'get',params:{userId}})
//新增收货地址
export const reqAddAddress = (data)=>requests({url:'/address/add',data,method:'post'})
//修改收货地址
export const reqUpdateAddress = (data)=>requests({url:'/address/update',data,method:'post'})
//删除收货地址
export const reqDeleteAddress = (id)=>requests({url:'/address/delete',method:'get',params:{id}})
//设置默认收货地址
export const reqSetDefaultAddress = (data)=>requests({url:'/address/setDefault',data,method:'post'})
//提交订单
export const reqSubmitOrder = (data)=>requests({url:'/order/submitOrder',data,method:'post'})
//支付订单  支付包沙箱支付  未实现
export const reqAlipay = (orderId)=>requests.post(`/order/alipay/${orderId}`)
//支付订单
export const reqPay = (orderId)=>requests.post(`/order/pay/${orderId}`)
//商品搜索
export const reqSearch = (data)=>requests({url:'/home/search',data,method:'post'})
//待评价订单
export const reqWaitComment = (userId)=>requests({url:`/comment/waitList`,method:'get',params:{userId}})
//订单明细
export const reqOrderItem = (id)=>requests({url:`/orderItem/findById`,method:'get',params:{id}})
//发布商品评价
export const reqPubComment = (data)=>requests({url:'/comment/publish',data,method:'post'})
//已评价订单
export const reqCommented = (userId)=>requests({url:`/comment/commentedList`,method:'get',params:{userId}})
//评价详情
export const reqPubDetail = (orderItemId)=>requests({url:`/comment/detail`,method:'get',params:{orderItemId}})
//会员信息
export const reqUserInfo= (id)=>requests({url:`/user/info`,method:'get',params:{id}})
//修改会员信息
export const reqUpdateUser = (data)=>requests({url:'/user/update',data,method:'post'})
//修改密码
export const reqUpdatePassword = (data)=>requests({url:'/user/updatePass',data,method:'post'})
//订单列表
export const reqOrderList = (data)=>requests({url:`/order/portalFindPage`,method:'get',params:data})
//订单详情
export const reqOrderDetail = (orderId)=>requests({url:`/order/orderDetail`,method:'get',params:{orderId}})
//订单跟踪
export const reqStatusFollow =(id)=>requests({url:`/order/statusFollow`,method:'get',params:{id}})
//修改订单
export const reqUpdateOrder = (data)=>requests({url:'/order/update',data,method:'post'})
//退货、退款、取消订单原因
export const reqGetCause = ()=>requests.get('/returnCause/list')
//取消订单
export const reqCancelOrder = (data)=>requests({url:'/order/portalCancelOrder',data,method:'post'})
//删除订单
export const reqDeleteOrder = (id)=>requests({url:`/order/deleteOrder`,method:'get',params:{id}})
//确认收货
export const reqConfirmReceive = (orderItemId)=>requests.post(`/order/confirmReceive/${orderItemId}`)
//申请退款
export const reqApplyRefund = (data)=>requests({url:'/order/applyRefund',data,method:'post'})
//申请退货
export const reqApplyReturnGoods = (data)=>requests({url:'/order/applyReturnGoods',data,method:'post'})
//退货退款详情
export const reqReturnDetail = (orderItemId)=>requests({url:`/returnOrder/portalReturnDetail`,method:'get',params:{orderItemId}})
//获取同意退款联系信息
export const reqReturnContact = (returnOrderId)=>requests({url:`/returnOrder/getReturnContact`,method:'get',params:{returnOrderId}})
//区域商品推荐
export const areaRec = (city)=>requests({url:`/home/areaRec`,method:'get',params:{city}})
