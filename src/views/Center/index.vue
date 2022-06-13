<template>
  <div class="center container">
    <el-container>
      <el-aside width="110px" class="aside">
        <ul class="menu">
          <li v-for="item in menu" :class="{active:$route.path===item.path}" @click="$router.push(item.path)">{{item.name}}</li>
        </ul>
      </el-aside>
      <el-container>
        <el-header>
          {{content}}
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "index",
  data(){
    return {
      menu:[
        {
          name:'我的信息',
          path:'/center/member'
        },
        {
          name:'订单中心',
          path:'/center/order'
        },
        {
          name:'评价晒单',
          path:'/center/comment'
        },
        {
          name:'收货地址',
          path:'/center/address'
        }
      ]
    }
  },
  computed:{
    content(){
      const path = this.$route.path
      if(path.includes('/member')){
        return "我的信息"
      }else if(path.includes('/order')){
        return "订单中心"
      }else if(path.includes('/comment')){
        return "评价晒单"
      }else{
        return "收货地址"
      }
    }
  }
}
</script>

<style scoped lang="less">
  .center{
    height:800px;
    margin-bottom: 20px;
    .el-container{
      height: 100%;
    }
    .el-aside{
      background-color: #f5f5f5;
      margin-right: 20px;
      .menu{
        margin-top: 15px;
        li{
          height: 30px;
          text-align: center;
          cursor: pointer;
          &.active{
            color: #ff6700;
          }
        }
      }
    }
    .el-header{
      background-color: #f5f5f5;
      line-height: 60px;
      text-align: center;
      color: #666;
      padding-left: 10px !important;
      margin-bottom: 20px;
    }
    .el-main{
      background-color: #fff;
      box-shadow: 0 0 2px rgba(0,0,0,.2);
    }
  }
</style>
