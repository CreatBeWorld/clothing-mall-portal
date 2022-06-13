<template>
  <div>
    <type-nav/>
    <div class="search-detail container">
      <div class="operation" v-if="goodsList.length>0">
        <!-- 排序的解构 -->
        <ul class="sui-nav">
          <li :class="{ active: isOne }" @click="changeOrder('1')">
            <a
            >销量<span
              v-show="isOne"
              :class="{ 'el-icon-top': isAsc, 'el-icon-bottom': isDesc }"
            ></span
            ></a>
          </li>
          <li :class="{ active: isTwo }" @click="changeOrder('2')">
            <a
            >价格<span
              v-show="isTwo"
              :class="{ 'el-icon-top': isAsc, 'el-icon-bottom': isDesc }"
            ></span
            ></a>
          </li>
        </ul>
        <!--   分页   -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchParams.page"
          :page-sizes="[10,15,20,30]"
          :page-size="searchParams.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          class="pager">
        </el-pagination>
      </div>
      <div class="goods">
        <div v-if="goodsList.length===0" class="error-desc" ref="err"></div>
        <goods-list-item v-for="item in goodsList" :goods-item="item"></goods-list-item>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsListItem from "../../components/common/Goods/GoodsListItem";
import { mapGetters} from "vuex";
export default {
  name: "search",
  data(){
    return {
      searchParams: {
        category1Id: null,//一级分类ID
        category2Id: null,//二级分类id
        category3Id: null,//三级分类id
        categoryName:'',
        keyword: "",//搜索的关键字,输入框输入
        //排序:初始状态是销量-降序
        order: "1:desc",
        //第几页
        page: 1,
        //每一页展示条数
        size: 10,
      },
      title:"",
    }
  },
  components:{
    GoodsListItem
  },
  //在挂载之前调用一次|可以在发请求之前将带有参数进行修改
  beforeMount() {
    //在发请求之前，把接口需要传递参数，进行整理（在给服务器发请求之前，把参数整理好，服务器就会返回查询的数据）
    Object.assign(this.searchParams, this.$route.query, this.$route.params);
  },
  computed:{
    ...mapGetters(["goodsList","total"]),
    isOne() {
      return this.searchParams.order.indexOf("1") !== -1;
    },
    isTwo() {
      return this.searchParams.order.indexOf("2") !== -1;
    },
    isAsc() {
      return this.searchParams.order.indexOf("asc") !== -1;
    },
    isDesc() {
      return this.searchParams.order.indexOf("desc") !== -1;
    },
  },
  beforeRouteEnter(to, from,next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('searchList',{})
    })
  },
  mounted() {
    console.log(this.$route.query.categoryName)
    this.title = this.$route.query.categoryName? this.$route.query.categoryName:this.$route.params.keyword
    //在发请求之前咱们需要将searchParams里面参数进行修改带给服务器
    this.getData();
  },
  methods:{
    async getData(){
      this.searchParams.category1Id = this.searchParams.category1Id?parseInt(this.searchParams.category1Id):null
      this.searchParams.category2Id = this.searchParams.category2Id?parseInt(this.searchParams.category2Id):null
      this.searchParams.category3Id = this.searchParams.category3Id?parseInt(this.searchParams.category3Id):null
      try{
        await this.$store.dispatch("getSearchList", this.searchParams);
      }catch (e){
        this.$refs.err.innerHTML = '无数据'
      }

    },
    handleSizeChange(newSize){
      this.searchParams.size =newSize
      this.searchParams.page=1;
      this.getData()
    },
    //监听页码值改变
    handleCurrentChange(newPage){
      this.searchParams.page=newPage
      this.getData()
    },
    //排序的操作
    changeOrder(flag) {
      //flag:用户每一次点击li标签的时候，用于区分是综合（1）还是价格（2）
      //现获取order初始状态【咱们需要通过初始状态去判断接下来做什么】
      let originOrder = this.searchParams.order;
      let originFlag = originOrder.split(":")[0];
      let originSort = originOrder.split(":")[1];
      //新的排序方式
      let newOrder = "";
      //判断的是多次点击的是不是同一个按钮
      if (flag === originFlag) {
        newOrder = `${originFlag}:${originSort === "desc" ? "asc" : "desc"}`;
      } else {
        //点击不是同一个按钮
        newOrder = `${flag}:${"desc"}`;
      }
      //需要给order重新赋值
      this.searchParams.order = newOrder;
      //再次发请求
      this.getData();
    },
  },
  watch: {
    //监听路由的信息是否发生变化，如果发生变化，再次发起请求
    $route(newValue, oldValue) {
      //每一次请求完毕，应该把相应的1、2、3级分类的id置空的，让他接受下一次的相应1、2、3
      //再次发请求之前整理带给服务器参数
      Object.assign(this.searchParams, this.$route.query, this.$route.params);
      this.getData();
      //分类名字与关键字不用清理：因为每一次路由发生变化的时候，都会给他赋予新的数据
      this.searchParams.category1Id = null;
      this.searchParams.category2Id = null;
      this.searchParams.category3Id = null;
    },
  },
}
</script>

<style scoped lang="less">
  .search-detail{
    .operation{
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
      .sui-nav {
        border: 1px solid #eee;
        width: 124px;
        height: 40px;
        display: flex;
        margin-left: 36px;
        li {
         flex: 1;
          height: 40px;
          a {
            display: block;
            width: 100%;
            height: 100%;
            text-align: center;
            padding-top: 10px;
            cursor: pointer;
            color: #777;
            background: #ff6700;
          }

          &.active {
            a {
              background: #e1251b;
              color: #fff;
            }
          }
        }
      }
      .pager{
        margin-right: 33px;
        margin-top: 5px;
      }
    }
    .goods{
      margin-top: 20px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: repeat(5,1fr);
      column-gap: 14px;
      .error-desc{
        text-align: center;
        font-size: 18px;
        color: #e1251b;
      }
    }
  }
</style>
