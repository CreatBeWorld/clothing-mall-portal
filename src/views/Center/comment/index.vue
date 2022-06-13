<template>
  <div>
    <el-tabs v-model="activeTabPane">
      <el-tab-pane label="待评价订单" name="waitComment">
        <div v-if="waitCommentList.length===0">没有要评价的订单</div>
        <div v-else>
          <el-table :data="waitCommentList" border stripe size="medium">
            <el-table-column label="商品图片" width="100px">
              <template slot-scope="scope">
                <img :src="scope.row.image" alt="" class="sku-image" @click="$router.push({path:'/detail',query:{skuId:scope.row.skuId}})">
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="数量" prop="num" width="100px"></el-table-column>
            <el-table-column label="单价" width="200px">
              <template slot-scope="scope">
                <div>{{"￥"+scope.row.price/100}}</div>
              </template>
            </el-table-column>

            <el-table-column label="操作"  width="100px">
              <template slot-scope="scope">
                <!--      修改参数     -->
                <el-button type="text" @click="comment(scope.row)">评价商品</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已评价" name="commented">
        <div v-if="commentedList.length===0">没有已评价的订单</div>
        <div v-else>
          <el-table :data="commentedList" border stripe size="medium">
            <el-table-column label="商品图片" width="100px">
              <template slot-scope="scope">
                <img :src="scope.row.image" alt="" class="sku-image" @click="$router.push({path:'/detail',query:{skuId:scope.row.skuId}})">
              </template>
            </el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="数量" prop="num" width="100px"></el-table-column>
            <el-table-column label="单价" width="200px">
              <template slot-scope="scope">
                <div>{{"￥"+scope.row.price/100}}</div>
              </template>
            </el-table-column>

            <el-table-column label="操作"  width="100px">
              <template slot-scope="scope">
                <!--      查看详情     -->
                <el-button type="text" @click="viewDetail(scope.row)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
import { mapGetters} from "vuex";
export default {
  name: "index",
  mounted() {
   this.getWait()
    this.getCommented()
  },
  data(){
    return {
      activeTabPane:'waitComment',
    }
  },
  methods:{
    getWait(){
      this.$store.dispatch('waitCommentList',this.userId)
    },
    getCommented(){
      this.$store.dispatch('commentedList',this.userId)
    },
    comment(row){
      this.$router.push({
        path:'/center/publish',
        query:{
          skuId:row.skuId,
          orderId:row.id
        }
      })
    },
    viewDetail(row){
      this.$router.push({
        path:'/center/pubDetail',
        query:{
          skuId:row.skuId,
          orderId:row.id
        }
      })
    }
  },
  computed:{
    ...mapGetters(["waitCommentList","commentedList"]),
    userId(){
      return this.$store.state.user.userInfo.memberId
    }
  }
}
</script>

<style scoped lang="less">
.sku-image{
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: pointer;
}
</style>
