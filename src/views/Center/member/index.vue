<template>
  <div class="user-center">
    <el-tabs v-model="activeTabPane">
      <el-tab-pane label="基本信息" name="userInfo">
        <el-form :model="userInfo" :rules="userInfoFormRules" ref="userInfoFormRef" label-width="100px" class="info-form">
          <el-form-item label="会员名">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="userInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="userInfo.sex" label="0">女</el-radio>
            <el-radio v-model="userInfo.sex" label="1">男</el-radio>
            <el-radio v-model="userInfo.sex" label="2">未知</el-radio>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker
              v-model="userInfo.birthday"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="headerObj"
              :show-file-list="false"
              :on-success="handleSuccessImg"
            >
              <img v-if="userInfo.headPic" :src="userInfo.headPic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="updatePass">
        <el-button type="primary" @click="updatePassDialogVisible=true">修改密码</el-button>
      </el-tab-pane>
    </el-tabs>
    <!-- 修改密码对话框-->
    <el-dialog
      title="修改密码"
      :visible.sync="updatePassDialogVisible"
      width="30%"
      @close="updatePassDialogClosed">
      <!--        内容主体区域-->
      <el-form :model="updatePassForm" :rules="updatePassFormRules" ref="updatePassFormRef" label-width="80px">
        <el-form-item label="当前密码" prop="currentPass">
          <el-input v-model="updatePassForm.currentPass" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="updatePassForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPass">
          <el-input v-model="updatePassForm.confirmPass" type="password"></el-input>
        </el-form-item>
      </el-form>
      <!--     底部区域   -->
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updatePassword">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters} from "vuex";
export default {
  name: "index",
  data() {
    // 验证手机号的规则
    let checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    //验证确认密码的规则
    let confirmPassword = (rule, value, cb) => {
      if (value === this.updatePassForm.password) {
        return cb()
      }else{
        cb(new Error('确认密码和新密码需保持一致'))
      }

    }
    return {
      value1: '',
      userInfoFormRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change']}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {validator: checkMobile, trigger: ['blur', 'change']}
        ]
      },
      activeTabPane: 'userInfo',
      uploadUrl:'http://localhost:9100/clothing_mall_backend/upload/oss?folderName=goods',
      headerObj:{
        Authorization:window.sessionStorage.getItem('portalToken')
      },
      //修改密码数据
      updatePassDialogVisible: false,//控制修改密码对话框的显示与隐藏,
      updatePassForm: {//表单数据
        currentPass: '',
        password: '',
        confirmPass: ''
      },
      //表单验证规则
      updatePassFormRules: {
        //验证当前密码
        currentPass: [
          {required: true, message: '请输入当前密码', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        //验证新密码
        password: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        //验证确认密码
        confirmPass: [
          {required: true, message: '请确认密码', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'},
          {validator: confirmPassword, trigger: ['change']}
        ]
      }
    }
  },
  computed:{
    ...mapGetters(["userInfo"]),
    userId(){
      return this.$store.state.user.userInfo.memberId
    }
  },
  mounted() {
    this.getData()
  },
  methods:{
    getData(){
      this.$store.dispatch('userInfo',this.userId)
    },
    //监听图片上传成功的事件
    handleSuccessImg(response,file){
      this.userInfo.headPic = response.data
    },
    saveUserInfo(){
      this.$refs.userInfoFormRef.validate(async valid=>{
        if(!valid)return
        try{
          await this.$store.dispatch('updateUser',this.userInfo)
          this.$msg.success('保存信息成功')
          this.getData()
        }catch (e) {
          console.log(e.message)
        }

      })
    },
    updatePassword(){
      console.log('123456')
      this.$refs.updatePassFormRef.validate(async valid=>{
        if(!valid)return
        const data = {
          password:this.updatePassForm.password,
          currentPass:this.updatePassForm.currentPass
        }
        try{
          await this.$store.dispatch('updatePass',data)
          this.updatePassDialogVisible = false
          this.$refs.updatePassFormRef.resetFields();
          this.$msg.success('修改密码成功')
        }catch (e) {
          this.$msg.error(e.message)
        }
      })
    },
    updatePassDialogClosed(){
      this.$refs.updatePassFormRef.resetFields();
    },
    cancel(){
      this.updatePassDialogVisible = false
      this.$refs.updatePassFormRef.resetFields();
    }
  }
}
</script>

<style scoped>
.info-form .el-form-item{
  width: 50%;
}
</style>
