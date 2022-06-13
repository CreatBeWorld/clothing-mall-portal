<template>
  <div class="banner">
    <!--轮播图-->
    <el-carousel trigger="click" height="460px">
      <el-carousel-item v-for="item in bannerList" :key="item.id">
        <img :src="item.image" alt="" class="image" @click="activityInto(item)">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "banner",
  mounted() {
    //mounted:组件挂载完毕，正常说组件结构（DOM）已经全有了
    //为什么swiper实例在mounted当中直接书写不可以：因为结构还没有完整
    this.$store.dispatch("getBannerList");
  },
  computed: {
    ...mapState({
      bannerList: (state) => state.home.bannerList,
    }),
  },
  methods:{
    activityInto(banner){
      this.$router.push({
        path:'/detail',
        query:{
          skuId:banner.skuId
        }
      })
    }
  }
};
</script>

<style scoped lang="less">
  .banner{
    position: absolute;
    left: 380px;
    top: 45px;
    width: 992px;
    height: 460px;
    cursor: pointer;
    .image{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>

