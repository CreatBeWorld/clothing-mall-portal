<template>
  <div class="container publish">
    <div class="title">发布商品评价</div>
    <div class="operation">
      <div class="goods">
        <img :src="orderItemPub.image" alt="" @click="$router.push({path:'/detail',query:{skuId:orderItemPub.skuId}})">
        <div class="goods-name">{{orderItemPub.name}}</div>
        <div class="goods-price">{{"￥"+orderItemPub.price/100}}</div>
      </div>
      <div class="pub">
        <el-form :model="pubForm"  ref="pubFormRef" :rules="pubFormRule">
          <el-form-item>
            <el-rate v-model="pubForm.rate" show-score></el-rate>
          </el-form-item>
          <el-form-item prop="comment">
            <el-input type="textarea" placeholder="写写你的感受吧" v-model="pubForm.comment" resize="none"></el-input>
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo img-4"
              :action="uploadUrl"
              :headers="headerObj"
              :limit="5"
              :on-preview="handlePreview"
              :on-remove="handleMultiRemove"
              :on-success="handleMultiSuccess"
              list-type="text">
              <el-button size="small" type="primary">图片分享</el-button>
              <span class="upload-desc">仅可以上传5张图片</span>
            </el-upload>
          </el-form-item>

        </el-form>
        <!-- 图片预览 -->
        <el-dialog
          title="图片预览"
          :visible.sync="previewVisible"
          width="50%"
        >
          <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
      </div>
    </div>
    <div class="op">
      <el-button size="small" type="primary" @click="publish">发表评价</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters} from "vuex";
export default {
  name: "publish",
  data(){
    return {
      pubForm:{
        comment:'',
        rate:5,
        images:''
      },
      pubFormRule:{
        comment:[
          { required: true, message: '请输入商品评价', trigger: 'blur' },
        ]
      },
      uploadUrl:'http://localhost:9100/clothing_mall_backend/upload/oss?folderName=goods',
      headerObj:{
        Authorization:window.sessionStorage.getItem('portalToken')
      },
      previewPath:'',
      previewVisible:false,
      imgUrl:[],//images  最后需要把imgUrl转字符串拼接

    }
  },
  mounted() {
    this.$store.dispatch('orderItem',this.$route.query.orderId)
  },
  methods:{
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
      console.log(file)
      this.imgUrl.push(response.data)
    },
    publish(){
      this.$refs.pubFormRef.validate(async valid=>{
        if(!valid){
          return
        }
        this.pubForm.images = this.imgUrl.length===0?"":this.imgUrl.join(',')
        this.pubForm.skuId = this.$route.query.skuId
        this.pubForm.orderItemId = this.$route.query.orderId
        this.pubForm.userId = this.userId
        try{
          await this.$store.dispatch('pubComment',this.pubForm)
          this.$msg({
            showClose: true,
            message: '发布商品评价成功',
            type: 'success',
            duration:2000
          });
          await this.$router.push('/center/comment')
        }catch (e){
          this.$msg.error(e.message)
        }

      })

    }
  },
  computed:{
    ...mapGetters(["orderItemPub"]),
    userId(){
      return this.$store.state.user.userInfo.memberId
    }
  }
}
</script>

<style scoped lang="less">
  .publish{
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
      }
    }
    .op{
      padding: 20px 0;
      text-align: center;
      border: 1px solid #e4e4e4;
      margin-bottom: 20px;
    }
  }
  .previewImg{
    width: 100%;
    object-fit: cover;
  }
  .upload-desc{
    margin-left: 20px;
  }
</style>
