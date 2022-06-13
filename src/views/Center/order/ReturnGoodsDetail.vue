<template>
  <div class="return container">
    <div class="content">
      <div class="border">
        <!--   退货商品信息   -->
        <el-descriptions title="退货商品" direction="vertical" :column="6" border class="goods">
          <el-descriptions-item label="商品图片">
            <img :src="returnOrderItem.image" alt="" class="img" @click="$router.push({path:'/detail',query:{skuId:returnOrderItem.skuId}})">
          </el-descriptions-item>
          <el-descriptions-item label="商品名称">
            <div class="sku-name">
              {{returnOrderItem.title}}
            </div>
          </el-descriptions-item>

          <el-descriptions-item label="价格">{{"￥"+returnOrderItem.price}}</el-descriptions-item>
          <el-descriptions-item label="数量">{{returnOrderItem.num}}</el-descriptions-item>
          <el-descriptions-item label="运费">{{"￥"+(returnOrderItem.payMoney-returnOrderItem.price*returnOrderItem.num)}}</el-descriptions-item>
          <el-descriptions-item label="合计">{{"￥"+returnOrderItem.payMoney}}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="border desc">
        <!--   服务单信息   -->
        <el-descriptions title="服务单信息" :column="1" border>
          <el-descriptions-item>
            <template slot="label">
              服务单号
            </template>
            {{returnOrder.id}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              申请状态
            </template>
            {{status}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              订单明细编号
            </template>
            {{returnOrder.orderItemId}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              申请时间
            </template>
            {{returnOrder.applyTime}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              退款原因
            </template>
            {{returnOrder.returnCause}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              问题描述
            </template>
            {{returnOrder.description}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              订单金额
            </template>
            {{"￥"+returnOrderItem.payMoney}}
          </el-descriptions-item>
        </el-descriptions>

        <el-descriptions  :column="1" border v-if="returnOrder.status!=='0'">
          <el-descriptions-item >
            <template slot="label">
              处理人员
            </template>
            {{returnOrder.adminName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              处理时间
            </template>
            {{returnOrder.disposeTime}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              处理备注
            </template>
            {{returnOrder.remark}}
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="returnOrder.status==='1'">
          <div class="return-desc">请根据下面的收货地址信息进行商品的退货</div>
          <el-descriptions  :column="1" border >
            <el-descriptions-item >
              <template slot="label">
                收件人
              </template>
              {{returnContact.name}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                收货地址
              </template>
              {{returnContact.address}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                联系电话
              </template>
              {{returnContact.phone}}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-descriptions  :column="1" border  v-if="returnOrder.status==='3'">
          <el-descriptions-item>
            <template slot="label">
              收货人员
            </template>
            {{returnOrder.receiverName}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              收货时间
            </template>
            {{returnOrder.receiveTime}}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              收货备注
            </template>
            {{returnOrder.receiverRemark}}
          </el-descriptions-item>

        </el-descriptions>

      </div>
    </div>
  </div>
</template>

<script>
import {reqReturnDetail,reqReturnContact} from "../../../api";

export default {
  name: "ReturnGoodsDetail",
  data(){
    return{
      orderItemId:'',
      returnOrder:{},
      returnOrderItem:{},
      returnContact:{}
    }
  },
  mounted() {
    this.orderItemId = this.$route.query.orderItemId
    this.getData()
  },
  computed:{
    status(){
      let status = ''
      switch (this.returnOrder.status){
        case '0':status ='待处理'
          break;
        case '1':status = '退货中'
          break
        case '2':status = '已拒绝'
          break
        case '3':status = '已完成'
          break;
      }
      return status
    }
  },
  methods:{
    async getData(){
      const res = await reqReturnDetail(this.orderItemId)
      if(res.code===1){
        this.returnOrder = res.data.returnOrder
        this.returnOrderItem = res.data.returnOrderItem
        this.returnOrderItem.price /=100
        this.returnOrderItem.payMoney/=100
        if(this.returnOrder.status!=='0'&&this.returnOrder.status!=='2'){
          const result = await reqReturnContact(this.returnOrder.id)
          if(result.code===1){
            this.returnContact = result.data
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="less">
.content{
  width: 90%;
  margin: 0 auto;
  .border{
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid rgba(0,0,0,.1);
    border-radius: 5px;
    .returnContact-input{
      width: 250px;
    }
  }
}
.img{
  height: 80px;
  width: 80px;
  object-fit: cover;
  cursor: pointer;
}
.return-desc{
  margin-bottom: 15px;
  color: red;
  font-weight: 700;
}
</style>
