<template>
  <div class="detail">
    <!-- 商品分类导航 -->
    <type-nav/>

    <!-- 主要内容区域 -->
    <section class="con container">
      <!-- 导航路径区域 -->
      <div class="conPoin">
        <span v-show="categoryView.category1Name">{{
            categoryView.category1Name
          }}</span>
        <span v-show="categoryView.category2Name">{{
            categoryView.category2Name
          }}</span>
        <span v-show="categoryView.category3Name">{{
            categoryView.category3Name
          }}</span>
      </div>
      <!-- 主要内容区域 -->
      <div class="mainCon">
        <!-- 左侧放大镜区域 -->
        <div class="previewWrap">
          <!--放大镜效果-->
          <Zoom :skuImageList="skuImageList"/>
          <!-- 小图列表 -->
          <ImageList :skuImageList="skuImageList"/>
        </div>
        <!-- 右侧选择区域布局 -->
        <div class="InfoWrap">
          <div class="goodsDetail">
            <h3 class="InfoName">{{ skuInfo.name ? skuInfo.name : '' }}</h3>
            <div class="price">
              <span class="desc">价格:</span>
              <span class="num">{{ skuInfo.price ? skuInfo.price / 100 + "元" : '' }}</span>
            </div>
            <div class="deliver">{{ skuInfo.num > 0 ? ('有货,从' + spu.area + '发货') : '无货' }}</div>
            <div class="remark sale-num">
              <span class="desc">累计销量:</span>
              <span class="num">{{ spu.saleNum }}</span>
            </div>
            <div class="remark">
              <span class="desc">累计评价:</span>
              <span class="num">{{ spu.commentNum }}</span>
            </div>
          </div>

          <div class="choose">
            <div class="chooseArea">
              <dl
                v-if="spuSaleAttr.spuSaleAttrValueList.length>0"
                v-for="(spuSaleAttr, index) in spuSaleAttrList"
                :key="index"
              >
                <dt class="title">{{ spuSaleAttr.saleAttrName }}</dt>
                <div class="choose-item">
                  <dd
                    :class="{ active: spuSaleAttrValue.isChecked }"
                    v-for="(spuSaleAttrValue,index) in spuSaleAttr.spuSaleAttrValueList" :key="index"
                    @click="changeActive(spuSaleAttrValue,spuSaleAttr.spuSaleAttrValueList)"
                  >
                    {{ spuSaleAttrValue.saleAttrValueName }}
                  </dd>
                </div>

              </dl>
            </div>
            <div class="cartWrap">
              <div class="controls">
                <input
                  autocomplete="off"
                  class="itxt"
                  v-model="skuNum"
                  @change="changeSkuNum"
                />
                <div class="operate">
                  <a href="javascript:" class="plus" @click="skuNum++">+</a>
                  <a
                    href="javascript:"
                    class="mins"
                    @click="skuNum > 1 ? skuNum-- : (skuNum = 1)"
                  >-</a
                  >
                </div>

              </div>
              <div class="add" @click="addToCart">
                <a>加入购物车</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <div class="container introduction">
      <div class="content">
        <div class="title">商品介绍</div>
        <div class="line"></div>
        <div class="content-introduction">
          <div class="brand row">
            品牌：
            <span>{{ skuInfo.brandName }}</span>
          </div>
          <div class="name row">
            商品名称：
            <span>{{ skuInfo.name }}</span>
          </div>
          <div class="spec-base">
            <div class="item">
              商品编号：
              <span>{{ spu.sn }}</span>
            </div>
            <div class="item">
              商品毛重：
              <span>{{ skuInfo.weight +'克'}}</span>
            </div>
            <div class="item">
              货号：
              <span>{{ skuInfo.sn}}</span>
            </div>
            <div class="item" v-for="item in paraItemList" v-if="paraItemList.length>0">
              {{item[0]+'：'}}
              <span>{{item[1]}}</span>
            </div>
          </div>
          <div v-if="spuImages.length>0" class="images">
            <img :src="item" alt="" v-for="item in spuImages">
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Zoom from './Zoom/Zoom'
import ImageList from "./ImageList/ImageList";

export default {
  name: "index",
  data() {
    return {
      skuNum: 1,//购买产品的个数,
    }
  },
  components: {
    Zoom,
    ImageList
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // 通过 `vm` 访问组件实例
      vm.$store.commit('setGoodsInfo', {})
    })
  },
  //实现从当前页跳转到当前页数据刷新
  beforeRouteUpdate(to, from, next) {
    if (to.fullPath !== from.fullPath) {
      next()
      this.getData()
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    ...mapGetters(["categoryView", "skuInfo", "spuSaleAttrList", "spu", "skuAttrVoList"]),
    //给子组件的数据
    skuImageList() {
      //如果服务器数据没有回来，skuInfo这个对象是空对象
      return this.skuInfo.images || [];
    },
    spuImages() {
      return this.spu.images ? this.spu.images.split(',') : []
    },
    paraItemList(){
      let s = this.spu.paraItems
      if(!s)return []
      s = JSON.parse(s.replace(/\'/g, '"'))
      return Object.entries(s)
    }
  },
  methods: {
    getData() {
      //获取产品详情信息
      this.$store.dispatch('getGoodInfo', this.$route.query.skuId)
    },
    //产品的售卖属性值切换高亮
    changeActive(saleAttrValue, arr) {
      //遍历全部售卖属性值isChecked为零没有高亮了
      arr.forEach((item) => {
        item.isChecked = false;
      });
      //点击的那个售卖属性值变为1
      saleAttrValue.isChecked = true;
      //进行网页跳转
      this.getActiveSkuId()
    },
    getActiveSkuId() {
      const checkedAttr = []
      console.log(this.spuSaleAttrList)
      this.spuSaleAttrList.forEach(s => {
        const checkObj = s.spuSaleAttrValueList.find(item => item.isChecked)
        if(checkObj){
          checkedAttr.push(checkObj.saleAttrValueName)
        }
      })
      const res = this.skuAttrVoList.find(s => {
        let count = 0;
        checkedAttr.forEach(c => {
          count = s.spec.includes(c) ? count + 1 : count;
        })
        return count === checkedAttr.length
      })
      console.log(res.skuId)
      this.$router.push({
        path: '/detail',
        query: {
          skuId: res.skuId
        }
      })

    },
    //表单元素修改产品个数
    changeSkuNum(event) {
      //用户输入进来的文本 * 1
      let value = event.target.value * 1;
      //如果用户输入进来的非法,出现NaN或者小于1
      if (isNaN(value) || value < 1) {
        this.skuNum = 1;
      } else {
        //正常大于1【大于1整数不能出现小数】
        this.skuNum = parseInt(value);
      }
    },
    async addToCart() {
      if (sessionStorage.getItem("portalToken")) {
        const cart = {
          spuId: this.skuInfo.spuId,
          skuId: this.skuInfo.id,
          num: this.skuNum,
          price: this.skuInfo.price,
          userId: this.$store.state.user.userInfo.memberId,
          isCheck: true,
          image: this.skuInfo.image,
          name: this.skuInfo.name
        }
        try {
          await this.$store.dispatch('addToCart', cart)
          await this.$router.push("/cart/addToCartSuccess")
        } catch (e) {
          this.$msg.error(e.message)
        }
      } else {
        await this.$router.push("/login?redirect=" + this.$route.path+"&skuId="+this.$route.query.skuId)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.detail {
  .con {
    margin: 15px auto;

    .conPoin {
      padding: 9px 15px 9px 0;

      & > span + span:before {
        content: "/\00a0";
        padding: 0 5px;
        color: #ccc;
      }
    }

    .mainCon {
      overflow: hidden;
      margin: 5px 0 15px;

      .previewWrap {
        float: left;
        width: 400px;
        position: relative;
      }

      .InfoWrap {
        width: 750px;
        float: right;

        .InfoName {
          font-size: 24px;
          color: #212121;
          font-weight: 400;
        }

        .news {
          color: #e12228;
          margin-top: 15px;
        }

        .price, .remark {
          padding: 10px 0;
        }

        .desc {
          color: #999;
          margin-right: 10px;
        }

        .num {
          color: #ff6700;
          font-size: 18px;
        }

        .deliver {
          color: #999;
          font-size: 12px;
        }

        .remark {
          border-bottom: 1px solid #ededed;

          .num {
            cursor: pointer;
          }
        }

        .sale-num, .area {
          border-bottom: none;
        }

        .choose {
          .chooseArea {
            overflow: hidden;
            margin-top: 10px;

            dl {
              margin: 13px 0;
              display: flex;

              dt {
                width: 120px;
              }

              .choose-item {
                flex: 1;
                display: flex;
                flex-wrap: wrap;

                dd {
                  margin-right: 5px;
                  margin-bottom: 10px;
                  color: #666;
                  padding: 2px 14px;
                  border-top: 1px solid #eee;
                  border-right: 1px solid #bbb;
                  border-bottom: 1px solid #bbb;
                  border-left: 1px solid #eee;

                  &.active {
                    color: #ff6700;
                    border: 1px solid #ff6700;
                  }
                }
              }


            }
          }

          .cartWrap {
            display: flex;

            .controls {
              margin-right: 15px;
              display: flex;

              .itxt {
                width: 38px;
                height: 37px;
                border: 1px solid #ddd;
                color: #555;
                text-align: center;
              }

              .operate {
                display: flex;
                flex-direction: column;

                .plus,
                .mins {
                  width: 15px;
                  text-align: center;
                  height: 18px;
                  background: #f1f1f1;
                  color: #666;
                  border: 1px solid #ccc;
                }
              }

              .plus {
                line-height: 18px;
                margin-bottom: 1px;
              }

              .mins {
                font-size: 10px;
              }
            }

            .add {
              cursor: pointer;

              a {
                background-color: #e1251b;
                padding: 0 25px;
                font-size: 16px;
                color: #fff;
                height: 36px;
                line-height: 36px;
                display: block;
              }
            }
          }
        }
      }
    }
  }

  .introduction {
    display: flex;
    justify-content: flex-end;

    .content {
      width: 750px;

      .title {
        padding: 10px;
        background-color: #e1251b;
        width: 100px;
        text-align: center;
        color: #fff;
      }

      .line {
        border-bottom: 1px solid #ff6700;
      }

      .content-introduction {
        padding: 20px 10px;
        color: #666;
        font-size: 12px;

        .brand {
          span {
            color: #ff6700;
          }
        }

        .row {
          margin-bottom: 8px;
        }

        .name {
          display: flex;

          span {
            width: 650px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .spec-base{
          display: grid;
          border-bottom: 1px solid #ff6700;
          column-gap: 20px;
          grid-template-columns: repeat(3,1fr);
          .item{
            margin-bottom: 8px;
          }
        }
        .images{
          margin-top: 20px;
        }
        img{
          width: auto;
          height:auto;
          max-width: 100%;
          border: 0;
          vertical-align: middle;
        }
      }
    }
  }
}
</style>
