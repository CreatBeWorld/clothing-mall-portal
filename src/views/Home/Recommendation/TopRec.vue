<template>
  <div class="container top-rec">
    <goods-list :goods="newGoods"/>
    <goods-list :goods="hotGoods"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import GoodsList from "../../../components/common/Goods/GoodsList";
export default {
  name: "TopRec",
  components:{
    GoodsList
  },
  mounted() {
    //获取新品首发数据
    this.$store.dispatch('newProduct')
    //获取全网爆款数据
    this.$store.dispatch('hotProduct')
  },
  computed:{
    ...mapState({
      newGoods: (state) => state.home.newGoods,
      hotGoods:(state) => state.home.hotGoods
    }),
  }

}
</script>

<style scoped lang="less">
  .top-rec{
    margin-top: 20px;
    padding-bottom: 20px;
  }
</style>
