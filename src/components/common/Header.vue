<template>
  <div class="header">
    <div class="nav">
      <div class="top container">
        <router-link to="/home" class="web-name header-hover">服装购物网站</router-link>
        <div class="middle">
          <div v-if="!username" class="middle-item">
            <router-link to="/login" class="header-hover nav-li">登录</router-link>
            <router-link to="/register" class="header-hover nav-li">注册</router-link>
          </div>
          <div v-else class="middle-item web-item">
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
            {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown" >
                <el-dropdown-item command="1">个人中心</el-dropdown-item>
                <el-dropdown-item command="2">评价晒单</el-dropdown-item>
                <el-dropdown-item command="3">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <div class="header-hover" @click="$router.push('/center/order')">我的订单</div>
          </div>
        </div>
        <div class="cart header-hover" @click="toCart">
          <i class="iconfont icon-gouwuche"></i>
          <span>购物车</span>
        </div>
      </div>
    </div>

    <div class="bottom container">
      <div class="logoArea">
        <router-link to="/home" class="logo">
          <img src="../../assets/img/logo.png" alt="" />
        </router-link>
      </div>
      <div class="search-area">
        <form  class="searchForm">
          <input
            type="text"
            id="autocomplete"
            v-model="keyword"
          />
          <button
            type="button"
            @click="goSearch"
          >
            搜索
          </button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "Header",
  data(){
    return {
      keyword:''
    }
  },
  computed:{
    //用户名
    username(){
      return this.$store.state.user.userInfo.memberName
    }
  },
  methods:{
    //搜索按钮的回调函数
    goSearch(){
      if (this.$route.query) {
        let loction = {
          name: "search",
          params: { keyword: this.keyword || undefined },
        };
        loction.query = this.$route.query;
        this.keyword = ''
        this.$router.push(loction);
      }
    },
    handleCommand(command){
      //command string
      if(command === "3"){
        //退出登录
        this.logout()
      }else if(command==="1"){
        this.$router.push("/center")
      }else{
        this.$router.push("/center/comment")
      }
    },
    async logout(){
      try{
        await this.$store.dispatch("userLogout")
        await this.$router.push("/home")
      }catch (e) {
        console.log(e.message)
      }
    },
    toCart(){
      this.$router.push("/cart")
    }
  }
}
</script>

<style scoped lang="less">
  .header{
    width: 100%;
    .nav{
      background-color: #333;
    }
    .top{
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #b0b0b0;
      display: flex;
      .web-name{
        width: 100px;
        text-align: center;
        cursor: pointer;
      }
      .middle{
        flex: 1;
        display: flex;
        justify-content: flex-end;
        .middle-item{
          margin-right:15px;
          .nav-li{
            padding: 0 5px;
            display: inline-block;
            height: 100%;
          }
        }
        .web-item{
          display: flex;
          font-size: 12px;
          .el-dropdown{
            margin-right: 15px;
          }
          .el-dropdown:hover .el-dropdown-link{
            color: #fff;
          }

        }
      }
      .cart{
        width: 120px;
        text-align: center;
        background-color: #424242;
        cursor:pointer;
        span{
          margin-left: 5px;
        }
      }
      .header-hover:hover{
        color: #fff;
        cursor: pointer;
      }
    }
    .bottom{
      height: 100px;
      padding: 22px 0;
      display: flex;
      justify-content: space-between;
      .logoArea{
        width: 56px;
        .logo img{
          width: 56px;
        }
      }
      .search-area{
        height: 50px;
        .searchForm {
          height: 100%;
          display: flex;
          input {
            width: 244px;
            height: 50px;
            padding: 0 10px;
            border: 1px solid #e0e0e0;
            border-right: none;
            outline: none;
          }
          button {
            height: 50px;
            width: 52px;
            color: #b0b0b0;
            border: 1px solid #e0e0e0;
            background-color:transparent;
            outline: none;
            cursor: pointer;
            &:hover{
              background-color: #ff6a00;
              color: #fff;
            }
          }
          input:focus,input:focus+button{
            border-color: #ff6a00;
          }
        }
      }
    }
  }


</style>
