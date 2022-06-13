<template>
  <div class="container pay">
    <div class="content">
      <div class="desc">订单提交成功，请尽快付款！订单号：{{orderId}}</div>
      <el-button type="primary" @click="payOrder" class="btn">去支付</el-button>
    </div>
  </div>
</template>

<script>
import { reqAlipay } from "../../api";

export default {
  name: "pay",
  methods:{
   payOrder(){
      reqAlipay(this.orderId).then((form) => {
        console.log(form)
        const routerData = this.$router.resolve({
          path: '/alipay',
          query: { html: form },
        })
        console.log(routerData.href)
        window.open(routerData.href, '_blank')
      })
    }
  },
  computed:{
    orderId(){
      return this.$route.query.orderId
    }
  },
}
</script>

<style scoped lang="less">
  .pay{
    .content{
      display: flex;
      padding-top: 50px;
      justify-content: space-between;
    }
  }

</style>
