<template>
  <div class="cart container">
    <h4 v-if="cartList.length>0">全部商品</h4>
    <h4 v-else>购物车暂时没有商品</h4>
    <div class="cart-main"  v-if="cartList.length>0">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul
          class="cart-list"
          v-for="(cart, index) in cartList"
          :key="cart.id"
        >
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="cart.isCheck"
              @change="updateChecked(cart, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.image" />
            <div class="item-msg">{{ cart.name }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.price/100 }}.00</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('minus', -1, cart)"
            >-</a
            >
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="cart.num"
              @change="handler('change', $event.target.value * 1, cart)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('add', 1, cart)"
            >+</a
            >
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.num * (cart.price/100) }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool"  v-if="cartList.length>0">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="isAllCheck&&cartList.length>0"
          @change="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>{{checkList.length}}</span>件商品</div>
        <div class="sumprice">
          <span>总价：</span>
          <span class="summoney">{{ totalPrice +"元"}}</span>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import throttle from "lodash/throttle";
export default {
  name: "cart",
  mounted() {
    this.getData()
  },
  methods:{
    getData(){
      this.$store.dispatch("cartList",this.userId)
    },
    //修改某一个产品的个数[节流]
    handler: throttle(async function(type, disNum, cart) {
      //type:为了区分这三个元素
      //disNum形参:+ 变化量（1）  -变化量（-1）   input最终的个数（并不是变化量）
      //cart:哪一个产品【身上有id】
      //向服务器发请求，修改数量
      switch (type) {
        //加号
        case "add":
          disNum = 1;
          break;
        case "minus":
          //判断产品的个数大于1，才可以传递给服务器-1
          //如果出现产品的个数小于等于1，传递给服务器个数0（原封不动）
          disNum = cart.num > 1 ? -1 : 0;
          break;
        case "change":
          // //用户输入进来的最终量，如果非法的（带有汉字|出现负数），带给服务器数字零
          if (isNaN(disNum) || disNum < 1) {
            disNum = 0;
          } else {
            //属于正常情况（小数：取证），带给服务器变化的量 用户输入进来的 - 产品的起始个数
            disNum = parseInt(disNum) - cart.num;
          }
          // disNum = (isNaN(disNum)||disNum<1)?0:parseInt(disNum) - cart.skuNum;
          break;
      }
      //派发action
      try {
        //代表的是修改成功
        await this.$store.dispatch("updateCartNum", {
          id:cart.id,
          num: disNum+cart.num
        });
        //再一次获取服务器最新的数据进行展示
        this.getData();
      } catch (e) {
        console.log(e.message)
      }
    }, 500),
    //删除某一个产品的操作
    async deleteCartById(cart) {
      try {
        //如果删除成功再次发请求获取新的数据进行展示
        const ids = []
        ids.push(cart.id)
        await this.$store.dispatch("deleteCart", ids);
        this.getData();
      } catch (error) {
        alert(error.message);
      }
    },
    //修改某个产品的勾选状态
    async updateChecked(cart, event) {
      try {
        //如果修改数据成功，再次获取服务器数据（购物车）
        let isCheck = event.target.checked;
        await this.$store.dispatch("updateCheck", {
          id: cart.id,
          isCheck
        });
        this.getData();
      } catch (error) {
        //如果失败提示
        alert(error.message);
      }
    },
    //删除选中的商品
    async deleteAllCheckedCart(){
      const ids = this.checkList.map(c=>c.id)
      try {
        //如果删除成功再次发请求获取新的数据进行展示
        await this.$store.dispatch("deleteCart", ids);
        this.getData();
      } catch (error) {
        alert(error.message);
      }

    },
    //修改全部产品的选中状态
    async updateAllCartChecked(event){
      try {
        let isCheck= event.target.checked;
        //派发action
        await this.$store.dispatch("updateAllCartIsChecked", {userId:this.userId,isCheck});
        this.getData();
      } catch (e) {
        this.$msg.error(e.message);
      }
    }
  },
  computed:{
    ...mapGetters(["cartList"]),
    userId(){
      return this.$store.state.user.userInfo.memberId
    },
    //判断底部复选框是否勾选【全部产品都选中，采勾选】
    isAllCheck() {
      return this.cartList.every((item) => item.isCheck);
    },
    checkList(){
      return this.cartList.filter(item=>{
        return item.isCheck
      })
    },
    //计算购买产品的总价
    totalPrice() {
      let sum = 0;
      let checkList = this.checkList
      checkList.forEach((item) => {
        sum += item.num * (item.price/100);
      });
      return sum;
    },

  }
}
</script>

<style lang="less" scoped>
.cart {
  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 16px;
            text-align: center;
            //padding: 8px;
            height: 33px;
            padding: 6px 4px 4px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 16px;
            text-align: center;
            padding: 6px 4px 4px;
            height: 33px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
            cursor:pointer;
            &:hover{
              color: #ff6700;
            }
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      height: 52px;
      line-height: 52px;
      overflow: hidden;
      padding-left: 5px;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      height: 52px;
      line-height: 52px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
        cursor: pointer;
      }
    }

    .money-box {
      float: right;
      .chosed,.sumprice {
        height: 52px;
        line-height: 52px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
