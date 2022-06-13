<template>
  <div class="register">
    <div class="top">
      <div class="container register-top">
        <div class="logo">
          <img src="../../assets/img/logo.png" alt=""  @click="$router.push('/home')">
          <span>欢迎登录</span>
        </div>
        <div class="register">
          <span class="exist">没有账号？</span>
          <span class="register-btn" @click="register">去注册></span>
        </div>
      </div>
    </div>
    <div class="bottom container">
      <!--   表单   -->
      <el-form ref="loginFormRef" label-width="0px"  :model="loginForm" :rules="loginFormRules" class="register-form">
        <el-form-item prop="username">
          <el-input  v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input  type="password"  v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data(){
    return {
      loginForm:{
        username:'',
        password:''
      },
      loginFormRules:{
        //验证用户名是否合法
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
        ],
        //验证密码
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        try {
          await this.$store.dispatch("userLogin", this.loginForm)
          this.$msg.success("登录成功")
          //判断路由中是否包含query参数
           let  toPath = this.$route.query.redirect||"/home"
          await this.$router.push(toPath==='/detail'?{path:toPath,query:{skuId:this.$route.query.skuId}}:toPath)
        } catch (e) {
          this.$msg.error(e.message)
        }
      })
    },
    register(){
      const redirect = this.$route.query.redirect
      if(this.$route.query.redirect){
        if(this.$route.query.redirect==='/detail'){
          this.$router.push("/register?redirect="+redirect+"&skuId="+this.$route.query.skuId)
        }else{
          this.$router.push("/register?redirect="+redirect)
        }

      }
      else{
        this.$router.push("/register");
      }

    }
  }
}
</script>

<style lang="less" scoped>
.register{
  .top{
    padding: 20px 0;
    box-shadow: 0 1px rgba(0,0,0,.1);
    margin-bottom: 20px;
    .register-top{
      display: flex;
      justify-content: space-between;
      .logo{
        img{
          vertical-align: -13px;
          width: 56px;
          object-fit: cover;
          margin-right: 15px;
        }
        span{
          font-size: 24px;
        }
      }
      .register{
        display: flex;
        align-items: center;
        .exist{
          color: #999;
        }
        .register-btn{
          color: #ff6700;
          cursor: pointer;
        }
      }
    }
  }
  .bottom{
    padding: 130px 0;
    .register-form{
      width: 400px;
      margin: 15px auto;
      .btns{
        text-align: center;
      }
    }
  }
}
</style>
