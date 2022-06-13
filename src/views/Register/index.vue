<template>
  <div class="register">
    <div class="top">
      <div class="container register-top">
        <div class="logo">
          <img src="../../assets/img/logo.png" alt="" @click="$router.push('/home')">
          <span>欢迎注册</span>
        </div>
        <div class="login">
          <span class="exist">已有账号？</span>
          <span class="login-btn" @click="login">请登录></span>
        </div>
      </div>
    </div>
    <div class="bottom container">
      <!--   表单   -->
      <el-form ref="registerFormRef" label-width="0px"  :model="registerForm" :rules="registerFormRules" class="register-form">
        <el-form-item prop="username">
          <el-input  v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input  type="password"  v-model="registerForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input  type="password"  v-model="registerForm.confirmPassword" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {reqUsernameCheck} from "../../api";
export default {
  name: "Register",
  data() {
    // 验证用户名的规则
    let usernameCheck = (rule, value, cb) => {
        reqUsernameCheck(value).then(res=>{
          console.log(res)
          if(res.data!==1){
            return cb()
          }else{
            cb(new Error('用户名已存在'))
          }

        })
    }
    //验证确认密码的规则
    let confirmPassword =(rule,value,cb)=>{
      if(value===this.registerForm.password){
        return cb()
      }
      cb(new Error('密码和确认密码需保持一致'))
    }
    return {
      registerForm:{
        username:'',
        password:'',
        confirmPassword:''
      },
      registerFormRules:{
        //验证用户名是否合法
        username:[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' },
          { validator:usernameCheck,trigger: 'blur' }
        ],
        //验证密码
        password:[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword:[
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { validator:confirmPassword,trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
     register(){
      this.$refs.registerFormRef.validate( async valid=>{
        if(!valid)return ;
        const user = {
          username:this.registerForm.username,
          password:this.registerForm.password
        }
        try{
          await this.$store.dispatch("reqRegister",user)
          this.$msg.success("注册成功")
          if(this.$route.query.redirect){
            console.log(this.$route.query.redirect)
            if(this.$route.query.redirect!=='/detail'){
              await this.$router.push("/login?redirect="+this.$route.query.redirect)
            }else{
              await this.$router.push("/login?redirect="+this.$route.query.redirect+"&skuId="+this.$route.query.skuId)
            }

            }
          else{
             await this.$router.push("/login")
          }
        }catch (e) {
          console.log("注册失败")
          this.$msg.error("注册失败")
        }

      })
    },
    resetForm(){
      this.$refs.registerFormRef.resetFields()
    },
    login(){
       if(this.$route.query.redirect){
         if(this.$route.query.redirect!=='/detail'){
           this.$router.push("/login?redirect="+this.$route.query.redirect)
         }else{
           this.$router.push("/login?redirect="+this.$route.query.redirect+"&skuId="+this.$route.query.skuId)
         }

       }else{
         this.$router.push("/login")
       }
    }
  },
};
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
      .login{
        display: flex;
        align-items: center;
        .exist{
          color: #999;
        }
        .login-btn{
          color: #ff6700;
          cursor: pointer;
        }
      }
    }
  }
  .bottom{
    padding: 100px 0;
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
