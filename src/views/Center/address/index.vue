<template>
  <div class="address">
    <div class="content">
      <div class="receiver">
        <div class="receiver-top">
          <h5 class="receive">收货地址</h5>
          <span @click="addAddress">新增收货地址</span>
        </div>

        <div
          class="address clearFix"
          v-for="(address, index) in addressInfo"
          :key="address.id"
        >
        <span class="username " :class="{ selected: address.isDefault }">{{
            address.contact
          }}</span>
          <p>
            <span class="s1">{{ address.province+" "+address.city+" "+address.area+" "+address.address }}</span>
            <span class="s2">{{ address.phone}}</span>
            <span class="s4" v-if="!address.isDefault" @click="setDefault(address)">设置为默认地址</span>
            <span class="s3" v-if="address.isDefault" >默认地址</span>
            <span class="s4" @click="updateAddress(address)">编辑</span>
            <span class="s4" v-if="!address.isDefault" @click="deleteAddress(address.id)">删除</span>
          </p>
        </div>
      </div>
      <div class="line"></div>

    </div>
    <!--  新增或修改收货地址  -->
    <el-dialog
      :title="addOrUpdate?'新增收货地址':'修改收货地址'"
      :visible.sync="addOrUpdateDialogVisible"
      width="40%"
    >
      <!--        内容主体区域-->
      <el-form :model="addOrUpdateForm" :rules="addOrUpdateFormRules" ref="addOrUpdateFormRef" label-width="80px">
        <el-form-item label="所在区域" prop="area">
          <el-cascader
            size="large"
            :options="options"
            v-model="addOrUpdateForm.selectedOptions"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="收货人" prop="contact">
          <el-input v-model="addOrUpdateForm.contact"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addOrUpdateForm.address"></el-input>
        </el-form-item>

        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addOrUpdateForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <!--     底部区域   -->
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="addOrUpdateAddress">确 定</el-button>
          <el-button @click="addOrUpdateDialogVisible = false">取 消</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {regionData, CodeToText,TextToCode} from 'element-china-area-data'
import { mapState } from "vuex";
export default {
  name: "index",
  data(){
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
    return {
      addOrUpdateDialogVisible:false,//控制新增或修改收货地址对话框的显示与隐藏
      options: regionData,
      addOrUpdate:true,//默认为新增收货地址
      //新增或修改收货地址信息对话框表单数据
      addOrUpdateForm:{
        selectedOptions: [],
        contact:'',//收货人
        address:'',//详细地址
        phone:'',//联系电话
        postCode:'',//区级邮编
        province:'',//省
        city:'',//市
        area:'',//县
      },
      addOrUpdateFormRules:{
        area:[
          { required: true, message: '请选择所在区域', trigger: 'change' },
        ],
        contact:[
          { required: true, message: '请输入收货人', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        phone:[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator:checkMobile,trigger: ['blur','change'] }
        ]

      },
      id:0,//修改收货地址时，收货地址编号
      isDefault:true,

    }
  },
  mounted() {
    this.getData()
  },
  methods:{
    getData(){
      this.$store.dispatch("addressList",this.userId);
    },
    resetAddOrUpdateForm(data){
      this.addOrUpdateForm.selectedOptions = data.selectedOptions
      this.addOrUpdateForm.contact = data.contact
      this.addOrUpdateForm.address = data.address
      this.addOrUpdateForm.phone = data.phone
      this.addOrUpdateForm.province = data.province
      this.addOrUpdateForm.area = data.area
      this.addOrUpdateForm.city = data.city
      this.addOrUpdateForm.postCode = data.postCode
    },
    //新增收货地址
    addAddress(){
      this.addOrUpdate = true
      this.resetAddOrUpdateForm({
        selectedOptions: [],
        contact:'',
        address:'',
        phone:'',
        postCode:'',
        province:'',
        city:'',
        area:'',
      })
      this.addOrUpdateDialogVisible = true
    },
    //修改收货地址
    updateAddress(address){
      this.addOrUpdate = false
      this.addOrUpdateForm.selectedOptions = []
      this.id = address.id
      this.isDefault = address.isDefault
      this.addOrUpdateForm.selectedOptions.push(TextToCode[address.province].code)
      this.addOrUpdateForm.selectedOptions.push(TextToCode[address.province][address.city].code)
      this.addOrUpdateForm.selectedOptions.push(TextToCode[address.province][address.city][address.area].code)
      this.addOrUpdateForm.contact = address.contact
      this.addOrUpdateForm.address = address.address
      this.addOrUpdateForm.phone = address.phone
      this.addOrUpdateForm.province = address.province
      this.addOrUpdateForm.area = address.area
      this.addOrUpdateForm.city = address.city
      this.addOrUpdateForm.postCode = this.addOrUpdateForm.selectedOptions[2]
      this.addOrUpdateDialogVisible = true

    },
    //新增或修改收货地址
    addOrUpdateAddress(){
      this.$refs.addOrUpdateFormRef.validate(async valid=>{
        if(!valid)return
        if(this.addOrUpdate){
          const { selectedOptions,...address} = this.addOrUpdateForm
          address.username = this.username
          address.userId = this.userId
          try{
            await this.$store.dispatch('addAddress',address);
            this.addOrUpdateDialogVisible = false
            this.getData()
          }catch (e) {
            this.$msg.error(e.message)
            this.addOrUpdateDialogVisible = false
          }
        }
        else{
          const { selectedOptions,...address} = this.addOrUpdateForm
          address.username = this.username
          address.userId = this.userId
          address.id = this.id
          address.isDefault = this.isDefault
          try{
            await this.$store.dispatch('updateAddress',address);
            this.addOrUpdateDialogVisible = false
            this.getData()
          }catch (e) {
            this.$msg.error(e.message)
            this.addOrUpdateDialogVisible = false
          }


        }

      })

    },
    //监听所在区域组件的值变化
    handleChange (value) {
      const arr = this.getCodeToText(null,value).split(' ')
      this.addOrUpdateForm.province = arr[0]
      this.addOrUpdateForm.city = arr[1]
      this.addOrUpdateForm.area = arr[2]
      this.addOrUpdateForm.postCode = this.addOrUpdateForm.selectedOptions[2]
    },
    //邮编转地区
    getCodeToText(codeStr, codeArray) {
      if (null === codeStr && null === codeArray) {
        return null;
      } else if (null === codeArray) {
        codeArray = codeStr.split(",");
      }

      let area = "";
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]];
          break;
        case 2:
          area += CodeToText[codeArray[0]] + " " + CodeToText[codeArray[1]];
          break;
        case 3:
          area +=
            CodeToText[codeArray[0]] +
            " " +
            CodeToText[codeArray[1]] +
            " " +
            CodeToText[codeArray[2]];
          break;
        default:
          break;
      }
      return area;
    },
    //删除收货地址
    async deleteAddress(id){
      //弹框提示用户是否删除数据
      //用户确定删除，返回"confirm",取消删除返回"cancel"
      const confirmRes = await this.$confirm('此操作将永久删除该收货地址, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err=>err)
      if(confirmRes!=='confirm'){
        return this.$msg({
          showClose: true,
          message: '已经取消了删除',
          type: 'info',
          duration:2000
        });
      }
      try{
        await this.$store.dispatch('deleteAddress',id)
        this.$msg({
          showClose: true,
          message: '删除收货地址成功',
          type: 'success',
          duration:2000
        });
        this.getData()
      }catch (e){
        this.$msg.error('删除收货地址失败')
      }
    },
    //设置默认地址
    async setDefault(address){
      const data = {
        id:address.id,
        userId:address.userId
      }
      try{
        await this.$store.dispatch('setDefaultAddress',data)
        this.$msg({
          showClose: true,
          message: '设置默认收货地址成功',
          type: 'success',
          duration:2000
        });
        this.getData()
      }catch (e){
        this.$msg.error('设置默认收货地址失败')
      }

    },
  },
  computed: {
    ...mapState({
      addressInfo: (state) => state.address.addressList,
      userId:(state)=>state.user.userInfo.memberId,
      username:(state)=>state.user.userInfo.memberName
    })
  },
}
</script>

<style lang="less" scoped>
  .address{
    .content {
      margin: 10px auto 0;
      border: 1px solid rgb(221, 221, 221);
      padding: 25px;
      box-sizing: border-box;
      .receiver-top{
        display: flex;
        justify-content: space-between;
        span{
          line-height: 36px;
          margin: 18px 0;
          font-size: 12px;
          color: #005ea7;
          cursor: pointer;
          &:hover{
            color: #e1251b;
          }
        }
      }
      .receive,
      .pay {
        line-height: 36px;
        margin: 18px 0;
      }

      .address {
        padding-left: 20px;
        margin-bottom: 15px;
        display: flex;
        font-size: 12px;
        .username {
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #ddd;
          position: relative;
          cursor: pointer;
        }
        .username::after {
          content: "";
          display: none;
          width: 13px;
          height: 13px;
          position: absolute;
          right: 0;
          bottom: 0;
          background: url(./images/choosed.png) no-repeat;
        }

        .username.selected {
          border-color: #e1251b;
        }

        .username.selected::after {
          display: block;
        }

        p {
          flex: 1;
          line-height: 30px;
          margin-left: 10px;
          padding-left: 5px;
          cursor: pointer;
          display: flex;

          .s1 {
            width: 500px;
          }

          .s2 {
            width: 150px;
            margin: 0 5px;
          }

          .s3 {
            width: 64px;
            height: 24px;
            line-height: 24px;
            margin-left: 10px;
            background-color: #878787;
            color: #fff;
            margin-top: 3px;
            text-align: center;
            margin-right: 20px;
          }
          .s4{
            margin-right: 15px;
            font-size: 12px;
            color: #005ea7;
            cursor: pointer;
            &:hover{
              color: #e1251b;
            }
          }
        }

        p:hover {
          background-color: #ddd;
        }
      }

      .line {
        height: 1px;
        background-color: #ddd;
      }

    }
  }
</style>
