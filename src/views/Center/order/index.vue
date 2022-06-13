<template>
  <div class="order-center">

    <div class="search">
      <span>订单状态：</span>
      <el-select v-model="queryInfo.orderStatus" placeholder="全部" clearable size="medium" @change="selectChange">
        <el-option
          v-for="item in statusOptions"
          :key="item.status"
          :label="item.label"
          :value="item.status">
        </el-option>
      </el-select>
    </div>
    <el-table :data="orderList" border stripe  class="table" @expand-change="expandChange">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="children-table-name">订单明细</div>
          <div v-if="scope.row.children&&scope.row.children.length>=1">
            <el-table :data="scope.row.children" border stripe>
              <el-table-column  width="100">
                <template slot-scope="childrenScope">
                  <img :src="childrenScope.row.image" class="img" alt="" v-if="childrenScope.row.image" @click="$router.push({path:'/detail',query:{skuId:childrenScope.row.skuId}})">
                </template>
              </el-table-column>
              <el-table-column label="商品名称" prop="name" width="200"></el-table-column>
              <el-table-column label="数量" prop="num" width="100"></el-table-column>
              <el-table-column label="单价" width="150">
                <template slot-scope="childrenScope">
                  <div>{{"￥"+childrenScope.row.price/100}}</div>
                </template>
              </el-table-column>
              <el-table-column label="小计" width="150">
                <template slot-scope="childrenScope">
                  <div>{{"￥"+childrenScope.row.price/100*childrenScope.row.num}}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="childrenScope">
                  <el-button type="text" @click="confirmReceive(childrenScope.row.id)" v-if="scope.row.orderStatus==='2'">确认收货</el-button>
                  <el-button type="text" @click="applyRefund(childrenScope.row.id)" v-if="scope.row.orderStatus==='1'&&childrenScope.row.isReturn==='0'">申请退款</el-button>
                  <el-button type="text" @click="applyReturnGoods(childrenScope.row.id)" v-if="childrenScope.row.hasReceive&&childrenScope.row.isReturn==='0'">申请退货</el-button>
                  <el-button type="text" @click="viewReFundDetail(childrenScope.row.id)" v-if="childrenScope.row.hasApplyRefund">查看退款详情</el-button>
                  <el-button type="text" @click="viewReturnGoodsDetail(childrenScope.row.id)" v-if="childrenScope.row.hasApplyReturnGoods">查看退货详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" prop="id" width="180"></el-table-column>
      <el-table-column label="提交时间" prop="createTime" width="160"></el-table-column>
      <el-table-column label="订单金额" width="150">
        <template slot-scope="scope">
          <div>{{"￥"+scope.row.payMoney/100}}</div>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="130">
        <template slot-scope="scope">
          <div>{{statusOptions.find(s=>s.status===scope.row.orderStatus).label}}</div>
          <el-button type="text" @click="statusFollow(scope.row.id)">订单跟踪</el-button>
        </template>
      </el-table-column>
      <el-table-column label="收货人" prop="receiverContact" width="150"></el-table-column>
      <el-table-column label="操作"  width="200">
        <template slot-scope="scope">
          <el-button type="text" @click="changeOrder(scope.row)" v-if="scope.row.orderStatus==='1'">修改订单</el-button>
          <el-button type="text" @click="payOrder(scope.row.id)" v-if="scope.row.orderStatus==='0'">支付订单</el-button>
          <el-button type="text" @click="cancelOrder(scope.row.id)" v-if="scope.row.orderStatus==='0'">取消订单</el-button>
          <el-button type="text" @click="deleteOrder(scope.row.id)" v-if="scope.row.orderStatus==='3'||scope.row.orderStatus==='4'">删除订单</el-button>

        </template>
      </el-table-column>

    </el-table>
    <!--   分页   -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.page"
      :page-sizes="[1,2, 5, 10]"
      :page-size="queryInfo.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="orderTotal"
      class="pager"
      >
    </el-pagination>
    <!--  订单状态跟踪对话框  -->
    <el-dialog
      title="关闭订单"
      :visible.sync="statusFollowDialogVisible"
      width="30%"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in orderLog"
          :key="index"
          :color="'#0bbd87'"
          :timestamp="activity.operateTime">
          {{activity.remarks}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <!--  订单修改对话框  -->
    <el-dialog
      title="修改订单"
      :visible.sync="updateOrderDialogVisible"
      width="30%"
    >
      <el-form :model="updateOrderForm" :rules="updateOrderFormRules" ref="updateOrderFormRef">
        <el-form-item label="收货人" prop="receiverContact">
          <el-input v-model="updateOrderForm.receiverContact"></el-input>
        </el-form-item>
        <el-form-item label="收货人联系方式" prop="receiverMobile">
          <el-input v-model="updateOrderForm.receiverMobile"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="receiverAddress">
          <el-input v-model="updateOrderForm.receiverAddress"></el-input>
        </el-form-item>
      </el-form>
      <!--     底部区域   -->
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="updateOrder">确 定</el-button>
          <el-button @click="updateOrderDialogVisible=false">取消</el-button>
  </span>
    </el-dialog>
    <!-- 取消订单对话框   -->
    <el-dialog
      title="请选择取消订单的原因"
      :visible.sync="cancelOrderDialogVisible"
      width="30%"
      @close="cancelBtn"
    >
      <el-radio-group v-model="cancelOrderDto.remarks" class="cause"  size="medium">
        <el-radio-button :label="item.cause" v-for="item in causeList" class="item"></el-radio-button>
      </el-radio-group>
      <!--     底部区域   -->
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="cancel">确 定</el-button>
          <el-button @click="cancelBtn">取消</el-button>
  </span>
    </el-dialog>
    <!-- 申请退款对话框   -->
    <el-dialog
      title="请选择申请退款的原因"
      :visible.sync="applyRefundDialogVisible"
      width="30%"
      @close="applyRefundBtn"
    >
      <el-radio-group v-model="cancelOrderDto.remarks" class="cause"  size="medium">
        <el-radio-button :label="item.cause" v-for="item in causeList" class="item"></el-radio-button>
      </el-radio-group>
      <!--     底部区域   -->
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="confirmApplyRefund">确 定</el-button>
          <el-button @click="applyRefundBtn">取消</el-button>
  </span>
    </el-dialog>
    <!-- 申请退货对话框   -->
    <el-dialog
      title="请选择退货的原因"
      :visible.sync="applyReturnGoodsDialogVisible"
      width="30%"
      @close="cancelReturnGoods"
    >
      <el-radio-group v-model="applyReturnGoodsObj.returnCause" class="cause"  size="medium">
        <el-radio-button :label="item.cause" v-for="item in causeList" class="item"></el-radio-button>
      </el-radio-group>
      <el-input v-model="applyReturnGoodsObj.description" placeholder="请输入退货详细描述" class="return-goods-desc"></el-input>
      <el-upload
        ref="uploadRef"
        class="upload-demo img-4"
        :action="uploadUrl"
        :headers="headerObj"
        :limit="5"
        :on-preview="handlePreview"
        :on-remove="handleMultiRemove"
        :on-success="handleMultiSuccess"
        list-type="text">
        <el-button size="small" type="primary" class="upload-btn">上传商品图片</el-button>
        <span class="upload-desc">仅可以上传5张图片</span>
      </el-upload>
      <!--     底部区域   -->
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="confirmReturnGoods">确 定</el-button>
          <el-button @click="cancelReturnGoods">取消</el-button>
  </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="40%"
    >
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {
  reqStatusFollow, reqUpdateOrder, reqGetCause,
  reqCancelOrder, reqDeleteOrder, reqPay, reqConfirmReceive, reqApplyRefund, reqApplyReturnGoods, reqAlipay
} from "../../../api";

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
    return{
      queryInfo:{
        userId:0,//订单编号
        orderStatus:'',//订单状态
        page:1,//当前页码
        size:5//每页显示条数
      },
      statusOptions:[
        {
          status:'0',
          label:'待付款'
        },
        {
          status:'1',
          label:'待发货'
        },
        {
          status:'2',
          label:'已发货'
        },
        {
          status:'3',
          label:'已完成'
        },
        {
          status:'4',
          label:'已关闭'
        },

      ],
      orderLog:[],
      statusFollowDialogVisible:false,
      updateOrderDialogVisible:false,
      updateOrderForm:{
        id:'',//订单编号
        receiverContact:'',//收货人
        receiverMobile:'',//收货人手机
        receiverAddress:'',//收货地址
      },
      updateOrderFormRules:{
        receiverContact:[
          { required: true, message: '请输入收货人姓名', trigger: 'blur' },
        ],
        receiverMobile: [
          { required: true, message: '请输入收货人联系方式', trigger: 'blur' },
          { validator:checkMobile,trigger: ['blur','change'] }
        ],
        receiverAddress: [
          { required: true, message: '请输入收货地址', trigger: 'blur' },
        ]
      },
      causeList:[],
      cancelOrderDialogVisible:false,
      cancelOrderDto:{
        id:'',
        remarks:''
      },
      cancelOrderId:'',
      applyRefundDialogVisible:false,
      applyOrderItemId:'',
      applyReturnGoodsObj:{
        orderItemId:'',
        returnCause:'',
        description:'',
        evidence:''
      },
      uploadUrl:'http://localhost:9100/clothing_mall_backend/upload/oss?folderName=goods',
      headerObj:{
        Authorization:window.sessionStorage.getItem('portalToken')
      },
      previewPath:'',
      previewVisible:false,
      imgUrl:[],//images  最后需要把imgUrl转字符串拼接
      applyReturnGoodsDialogVisible:false

    }
  },
  mounted() {
    this.findPage()
  },
  computed:{
    ...mapGetters(["orderList","orderTotal"]),
    userId(){
      return this.$store.state.user.userInfo.memberId
    }
  },
  methods:{
    findPage(){
        this.queryInfo.userId = this.userId
        this.$store.dispatch('orderListRes',this.queryInfo)
    },
    //监听pageSize改变的事件 每页显示多少条
    handleSizeChange(newSize){
      this.queryInfo.size =newSize
      this.queryInfo.page=1;
      this.findPage()
    },
    //监听页码值改变
    handleCurrentChange(newPage){
      this.queryInfo.page=newPage
      this.findPage()
    },
    async expandChange(row,rows){
     if(row.children===undefined){
       const isExpend = rows.some(r => r.id === row.id) // 判断当前行展开状态
       if (isExpend) {
         const children = await this.$store.dispatch('orderDetail',row.id)
         if(children.length>=1){
           row.children = children
         }
         console.log(row)
       }
     }
    },
    selectChange(item){
      this.queryInfo.orderStatus = item
      this.findPage()
    },
    //订单状态跟踪
    async statusFollow(id){
      const res = await reqStatusFollow(id)
      if(res.code===1){
        this.orderLog = res.data
        this.statusFollowDialogVisible=true
      }
    },
    //订单修改
    changeOrder(row){
      this.updateOrderForm.id = row.id
      this.updateOrderForm.receiverContact = row.receiverContact
      this.updateOrderForm.receiverMobile = row.receiverMobile
      this.updateOrderForm.receiverAddress = row.receiverAddress
      this.updateOrderDialogVisible = true
    },
   updateOrder(){
      this.$refs.updateOrderFormRef.validate(async valid=>{
        if(!valid)return
        const res = await reqUpdateOrder(this.updateOrderForm)
        if(res.code===1){
          this.$msg.success("订单修改成功")
          this.findPage()
        }else{
          this.$msg.error("订单修改失败")
        }
        this.updateOrderDialogVisible=false
      })

    },
    //取消订单
    cancelOrder(id){
      this.getCause()
      this.resetCancelOrderDto()
      this.cancelOrderDialogVisible=true
      this.cancelOrderId = id
    },
    async getCause(){
      const res = await reqGetCause()
      if(res.code===1){
        this.causeList = res.data
      }
    },
    async cancel(){
      if(!this.cancelOrderDto.remarks){
        this.$msg.error('请选择取消订单的原因')
      }else{
        this.cancelOrderDto.id = this.cancelOrderId
        const res = await reqCancelOrder(this.cancelOrderDto)
        if(res.code===1){
          this.$msg.success('取消申请已提交，系统正在审核')
          this.findPage()
        }else{
          this.$msg.error('取消订单申请提交失败')
        }
        this.cancelBtn()
      }
    },
    cancelBtn(){
      this.cancelOrderDialogVisible =false
      this.resetCancelOrderDto()
      this.cancelOrderId = ''

    },
    resetCancelOrderDto(){
      this.cancelOrderDto.id = ''
      this.cancelOrderDto.remarks=''
    },
    async deleteOrder(id){
      const confirmRes = await this.$confirm('此操作将删除该订单, 是否继续?', '提示', {
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
      const res = await reqDeleteOrder(id)
      if(res.code===1){
        this.$msg.success('删除订单成功')
        this.findPage()
      }else{
        this.$msg.error('删除订单失败')
      }
    },
    //支付订单
    payOrder(orderId){
      reqAlipay(orderId).then((form) => {
        console.log(form)
        const routerData = this.$router.resolve({
          path: '/alipay',
          query: { html: form },
        })
        console.log(routerData.href)
        window.open(routerData.href, '_blank')
      })
    },
    //确认收货
    async confirmReceive(orderItemId){
      const res = await reqConfirmReceive(orderItemId)
      if(res.code===1){
        this.$msg.success("确认收货成功")
        this.findPage()
      }else{
        this.$msg.error("确认收货失败")
      }
    },
    //申请退款
    applyRefund(orderItemId){
      this.getCause()
      this.resetCancelOrderDto()
      this.applyRefundDialogVisible = true
      this.applyOrderItemId = orderItemId

    },
    async confirmApplyRefund(){
      if(!this.cancelOrderDto.remarks){
        this.$msg.error('请选择退款的原因')
      }else{
        this.cancelOrderDto.id = this.applyOrderItemId
        const res = await reqApplyRefund(this.cancelOrderDto)
        if(res.code===1){
          this.$msg.success('退款申请已提交，系统正在审核')
          this.findPage()
        }else{
          this.$msg.error('退款申请提交失败')
        }
        this.applyRefundBtn()
      }
    },
    applyRefundBtn(){
      this.applyRefundDialogVisible =false
      this.resetCancelOrderDto()
      this.applyOrderItemId = ''
    },
    //申请退货
    applyReturnGoods(orderItemId){
      this.getCause()
      this.applyReturnGoodsObj = {
        orderItemId,
        returnCause:'',
        description:'',
        evidence:''
      }
      this.imgUrl = []
      this.applyReturnGoodsDialogVisible = true

    },
    async confirmReturnGoods(){
      if(!this.applyReturnGoodsObj.returnCause){
        return  this.$msg.error("请选择退货原因")
      }
      if(!this.applyReturnGoodsObj.description){
        return  this.$msg.error("请输入退货详细描述")
      }
      if(this.imgUrl.length===0){
        return  this.$msg.error("请上传商品图片")
      }
      this.applyReturnGoodsObj.evidence = this.imgUrl.join(',')
      const res = await reqApplyReturnGoods(this.applyReturnGoodsObj)
      if(res.code===1){
        this.$msg.success("退货申请已提交，系统正在审核")
      }else{
        this.$msg.error('退货申请提交失败')
      }
      this.cancelReturnGoods()
    },
    //取消申请退货
    cancelReturnGoods(){
      this.applyReturnGoodsObj = {
        orderItemId:'',
        returnCause:'',
        description:'',
        evidence:''
      }
      if(this.imgUrl.length>0){
        this.imgUrl = []
        this.$refs.uploadRef.clearFiles()
      }
      this.applyReturnGoodsDialogVisible =false
    },
    //图片预览
    handlePreview(file){
      this.previewPath = file.response.data
      this.previewVisible = true
    },
    //处理多图片 删除
    handleMultiRemove(file){
      const path = file.response.data
      const index = this.imgUrl.findIndex(x=>x===path)
      this.imgUrl.splice(index,1)
    },
    //处理多图片上传
    handleMultiSuccess(response,file){
      this.imgUrl.push(response.data)
    },
    //查看退款详情
    viewReFundDetail(orderItemId){
      this.$router.push({
        path:'/center/refundDetail',
        query:{orderItemId}
      })
    },
    //查看退货详情
    viewReturnGoodsDetail(orderItemId){
      this.$router.push({
        path:'/center/returnGoodsDetail',
        query:{orderItemId}
      })
    }

  }
}
</script>

<style scoped lang="less">
  .order-center{
    .search{
      margin-bottom: 10px;
      text-align: right;
    }
    .table{
      margin-bottom: 15px;
    }
    .pager{
      text-align: right;
    }
    .img{
      width: 60px;
      height: 60px;
      cursor: pointer;
      object-fit: cover;
    }
    .children-table-name{
      text-align: center;
    }
    .cause{
      display: grid;
      column-gap: 20px;
      row-gap: 10px;
      grid-template-columns: repeat(3,1fr);
    }
    .previewImg{
      width: 100%;
      object-fit: cover;
    }
    .return-goods-desc{
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .upload-btn{
      margin-right: 15px;
    }

  }
</style>
