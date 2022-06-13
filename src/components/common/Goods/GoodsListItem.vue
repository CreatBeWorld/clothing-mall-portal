<template>
  <div class="item" @click="viewDetail(goodsItem.id)">
    <img :src="goodsItem.image" alt="" class="image">
    <div class="item-desc">
      <div class="item-name">{{goodsItem.name}}</div>
      <div class="item-price"> {{"￥"+goodsItem.price/100}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props:{
    goodsItem:{
      type:Object
    }
  },
  methods:{
    viewDetail(skuId){
      this.$router.push({
        path:'/detail',
        query:{
          skuId
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .item{
    width: 234px;
    height: 300px;
    background-color: #fff;
    padding: 20px 0;
    font-size: 14px;
    text-align: center;
    transition: all 0.5s;
    cursor: pointer;
    &:hover{
      box-shadow: 0 15px 30px rgba(0,0,0,.1);
      transform: translate3d(0,-2px,0)
    }
    .image{
      width: 160px;
      height: 160px;
      object-fit: cover;
      margin-bottom: 20px;
    }
    .item-desc{
      .item-name{
        padding: 0 10px;
        height: 40px;
        margin-bottom: 15px;
        /* Safari, Opera, and Chrome */
        white-space: normal; /*默认*/
        -webkit-line-clamp: 2; /*控制行数*/
        text-overflow: ellipsis; /*打点*/
        display: -webkit-box;
        overflow: hidden; /*隐藏打点*/
        -webkit-box-orient: vertical; /*垂直排列*/

      }
      .item-price{
        color: #ff6700;
      }
    }
  }
</style>
