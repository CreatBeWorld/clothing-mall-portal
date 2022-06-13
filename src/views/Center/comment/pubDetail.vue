<template>
  <div class="detail container">
    <div class="title">商品评价详情</div>
    <div class="operation">
      <div class="goods">
        <img :src="orderItemPub.image" alt="" @click="$router.push({path:'/detail',query:{skuId:orderItemPub.skuId}})">
        <div class="goods-name">{{orderItemPub.name}}</div>
        <div class="goods-price">{{"￥"+orderItemPub.price/100}}</div>
      </div>
      <div class="pub">
        <div class="time">{{pubDetail.commentTime}}</div>
        <el-rate v-model="pubDetail.rate" show-score disabled class="rate"></el-rate>
        <el-input type="textarea"  v-model="pubDetail.comment" resize="none" disabled class="comment"></el-input>
        <div class="img-box" v-if="images.length>0">
          <img :src="item" alt="" v-for="item in images" class="img" @click="showImg(item)">
        </div>

      </div>
    </div>
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
import { mapGetters} from "vuex";
export default {
  name: "pubDetail",
  data(){
    return {
      previewPath:'',
      previewVisible:false,
    }
  },
  mounted() {
    this.$store.dispatch('orderItem',this.$route.query.orderId)
    this.$store.dispatch('getPubDetail',this.$route.query.orderId)
  },
  methods:{
    showImg(path){
      this.previewPath = path
      this.previewVisible = true
    }
  },
  computed:{
    ...mapGetters(["orderItemPub","pubDetail"]),
    userId(){
      return this.$store.state.user.userInfo.memberId
    },
    images(){
      return this.pubDetail.images?this.pubDetail.images.split(','):[]
    }
  }
}
</script>

<style scoped lang="less">
.detail{
  .title{
    text-align: center;
    padding: 10px 0;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .operation{
    //background-color: #fff;
    border: 1px solid #e4e4e4;
    box-shadow: 0 0 2px rgba(0,0,0,.2);
    height: 350px;
    display: flex;
    margin-bottom: 20px;
    .goods{
      border-right: 1px solid #e4e4e4;
      height: 100%;
      width: 330px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .goods-name{
        font-size: 12px;
        color: #666;
        width: 200px;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 15px;
      }
      img{
        width: 100px;
        height: 100px;
        object-fit: cover;
        cursor: pointer;
      }
    }
    .pub{
      flex: 1;
      padding: 30px;
      .time{
        margin-bottom: 15px;
      }
      .rate{
        margin-bottom: 15px;
      }
      .comment{
        margin-bottom: 15px;
      }
      .img-box{
        //display: flex;
        //justify-content: space-around;
        img{
          border: 1px solid #eee;
          width: 60px;
          height: 60px;
          object-fit: cover;
          cursor: pointer;
          margin-right: 15px;
        }
      }
    }
  }
  .previewImg{
    width: 100%;
    object-fit: cover;
  }
}
</style>
