<template>
  <div class="goodsList">
    <div class="title">{{goods.name}}</div>
    <div class="list">
      <goods-list-item v-for="item in goods.skuList" :goods-item="item"></goods-list-item>
    </div>
  </div>
</template>

<script>
import GoodsListItem from "./GoodsListItem";
export default {
  name: "GoodsList",
  components: {GoodsListItem},
  props:{
    goods:{
      type:Object
    }
  }
}
</script>

<style scoped lang="less">
  .goodsList{
    .title{
      text-align: center;
      font-size: 22px;
      padding: 20px 0;
    }
    .list{
      display: grid;
      grid-template-columns: repeat(5,1fr);
      column-gap: 14px;
    }

  }
</style>
