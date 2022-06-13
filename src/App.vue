<template>
  <div id="app">
    <div class="cmw-content">
      <Header v-show="$route.path!=='/login'&&$route.path!=='/register'"/>
      <!--  路由占位符  -->
      <router-view></router-view>
    </div>

    <div class="footer">
      <Footer/>
    </div>
  </div>
</template>
<script>
import Header from './components/common/Header'
import Footer from './components/common/Footer'
 export default {
   name:'app',
   components:{
     Footer,
     Header
   },
   mounted() {
     //请求商品三级分类联动数据
     this.$store.dispatch('threeCatePortal')
   }
 }
</script>
<style>
@import "./assets/css/base.css";
.cmw-content{
  min-height: calc(100vh - 140px)
}
.footer{
  height: 140px;
}
</style>
