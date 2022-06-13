<template>
  <div class="home">
    <type-nav/>
    <banner/>
    <div class="rec">
      <top-rec/>
      <position/>
      <cate-rec/>
    </div>

  </div>
</template>

<script>
import Banner from './Banner'
import Position from "./Position";
import TopRec from "./Recommendation/TopRec";
import CateRec from "./Recommendation/CateRec";
export default {
  name: "home",
  components:{
    CateRec,
    Banner,
    TopRec,
    Position
  }
}
</script>

<style scoped lang="less">
  .home{
    position: relative;
    .rec{
      background-color: #f5f5f5;
    }
  }
</style>
