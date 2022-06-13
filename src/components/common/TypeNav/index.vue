<template>
  <div class="type-nav">
    <div class="container nav-content">
      <div class="real-nav" @mouseenter="enterShow" @mouseleave="leaveShow">
        <h2 class="all" v-show="$route.path!=='/home'">全部商品分类</h2>
        <!--   过渡动画     -->
        <transition name="sort">
          <div class="sort" v-show="show">
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="(c1, index) in categoryList"
                :key="c1.id"
              >
                <h3
                  :class="{ cur: currentIndex === index }"
                  @mouseenter="changeIndex(index)"
                >
                  <a
                    :data-categoryName="c1.name"
                    :data-category1Id="c1.id"
                  >{{ c1.name }}</a>
                  <i class="iconfont icon-youjiantou"></i>
                </h3>
                <div
                  class="item-list clearfix"
                  :style="{ display: currentIndex === index ? 'block' : 'none' }"
                >
                  <div class="subItem">
                    <dl
                      class="fore"
                      v-for="(c2, index) in c1.children"
                      :key="c2.id"
                    >
                      <dt>
                        <a
                          class="category2Name"
                          :data-categoryName="c2.name"
                          :data-category2Id="c2.id"
                        >{{ c2.name }}</a
                        >
                      </dt>
                      <dd>
                      <span
                        v-for="(c3, index) in c2.children"
                        :key="c3.id"
                      >
                        <a
                          :data-categoryName="c3.name"
                          :data-category3Id="c3.id"
                        >{{ c3.name }}</a
                        >
                      </span>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
//引入lodash:是把lodash全部封装好的函数全都引入进来了
import throttle from "lodash/throttle";
export default {
  name: "typeNav",
  data() {
    return {
      //当前这个属性决定了到底那个h3身上有类名
      currentIndex: -1,
      show: true,
    };
  },
  //组件挂载完毕
  mounted() {
    //当组件挂载完毕，让show属性变为false
    //如果不是Home路由组件，将typeNav进行隐藏
    if (this.$route.path !== "/home") {
      this.show = false;
    }
    else{
      document.querySelector('.type-nav').style.height = '505px'
    }
  },
  computed: {
    ...mapState({
      categoryList: (state) => state.home.categoryList,
    }),
  },
  methods: {
    //用于修改组件实例身上的currentIndex的属性值
    //当用户鼠标移入到h3身上的时候就会立即出发一次
    changeIndex: throttle(function(index) {
      //修改当前currentIndex索引值
      //函数节流:在20MS时间之内只能执行一次
      this.currentIndex = index;
    }, 20),
    //进行路由跳转的回调函数
    goSearch(event) {
      //event.target:获取到的是出发事件的元素(div、h3、a、em、dt、dl)
      let node = event.target;
      //给a标签添加自定义属性data-categoryName,全部的字标签当中只有a标签带有自定义属性，别的标签名字----dataset纯属扯淡
      let {
        categoryname,
        category1id,
        category2id,
        category3id,
      } = node.dataset;
      //第二个问题解决了：点击的到底是不是a标签（只要这个标签身上带有categoryname）一定是a标签
      //当前这个if语句：一定是a标签才会进入
      if (categoryname) {
        //准备路由跳转的参数对象
        let loction = { name: "search" };
        let query = { categoryName: categoryname };
        //一定是a标签：一级目录
        if (category1id) {
          query.category1Id = category1id;
          //一定是a标签：二级目录
        } else if (category2id) {
          query.category2Id =category2id;
          //一定是a标签：三级目录
        } else {
          query.category3Id =category3id;
        }
        //判断：如果路由跳转的时候，带有params参数，捎带脚传递过去
        if (this.$route.params) {
          loction.params = this.$route.params;
          //动态给location配置对象添加query属性
          loction.query = query;
          //路由跳转
          this.$router.push(loction);
        }
      }
    },
    //当鼠标移入的时候，让商品分类列表进行展示
    enterShow(e) {
      if (this.$route.path !== "/home") {
        this.show = true;
      }
    },
    //当鼠标离开的时候，让商品分类列表进行隐藏
    leaveShow() {
      this.currentIndex = -1;
      //判断如果是Search路由组件的时候才会执行
      if (this.$route.path !== "/home") {
        this.show = false;
      }
    },
  },
};
</script>

<style scoped lang="less">
.type-nav {
  position: relative;
  //&::before{
  //  content:"";
  //  position: absolute;
  //  top: 45px;
  //  width: 100%;
  //  height: 2px;
  //  background-color: #ff6a00;
  //}
  .nav-content {
    position: relative;
    .real-nav{
      .all {
        width: 234px;
        height: 45px;
        background-color: #ff6a00;
        line-height: 45px;
        text-align: center;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
      }
      .sort {
        position: absolute;
        left: 0;
        top: 45px;
        width: 234px;
        height: 460px;
        background: #949997;
        z-index: 999;

        .all-sort-list2 {
          padding: 20px 0;
          .item {
            h3 {
              position: relative;
              line-height: 52px;
              height: 52px;
              font-size: 14px;
              font-weight: 400;
              width: 100%;
              padding-left: 40px;
              color: #fff;
              cursor: pointer;
              &.cur {
                background: #ff6a00;
              }
              i{
                position: absolute;
                right: 20px;
              }
            }
            .item-list {
              display: none;
              position: absolute;
              width: 992px;
              height: 460px;
              background: #fff;
              left: 234px;
              border: 1px solid #e0e0e0;
              top: 0;
              z-index: 9999 !important;

              .subItem {
                width: 992px;
                margin-top: 22px;
                padding: 0 4px 0 8px;

                dl {
                  border-top: 1px solid #eee;
                  padding: 6px 0;
                  overflow: hidden;
                  zoom: 1;
                  display: flex;

                  &.fore {
                    border-top: 0;
                  }

                  dt {
                    width: 100px;
                    line-height: 22px;
                    height: 22px;
                    text-align: right;
                    font-weight: 700;
                    margin-right: 30px;
                    a{
                      font-size: 12px;
                      cursor: pointer;
                      &:hover{
                        color: #ff6a00;
                      }
                    }
                  }

                  dd {
                    flex: 1;
                    padding: 2px 0 0;
                    span {
                      color: #666;
                      font-size: 12px;
                      height: 14px;
                      line-height: 14px;
                      padding: 0 8px;
                      border-left: 1px solid #ccc;
                      a{
                        white-space: nowrap;
                        cursor: pointer;
                        &:hover{
                          color: #ff6a00;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      //过渡动画的样式
      //过渡动画开始状态（进入）
      .sort-enter {
        height: 0px;
      }
      // 过渡动画结束状态（进入）
      .sort-enter-to {
        height: 460px;
      }
      // 定义动画时间、速率
      .sort-enter-active {
        transition: all 0.5s linear;
      }

    }


  }
}
</style>
