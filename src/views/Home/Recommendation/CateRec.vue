<template>
  <div class="container cate-rec">
    <goods-list v-for="item in cateTop" :goods="item"></goods-list>
  </div>
</template>

<script>
import { mapState } from "vuex";
import GoodsList from "../../../components/common/Goods/GoodsList";
export default {
  name: "CateRec",
  components:{
    GoodsList
  },
  mounted() {
    //获取一级分类推荐商品数据
    this.$store.dispatch('cateTop')
  },
  computed:{
    ...mapState({
      cateTop: (state) => state.home.cateTop,
    }),
  }
}
</script>

<style scoped>
.cate-rec{
  padding-bottom: 20px;
}
</style>
