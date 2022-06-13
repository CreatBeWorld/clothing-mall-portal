<template>
  <div class="container area-rec">
    <div class="header">
      <div class="left-header">区域商品推荐</div>
      <div @click="areaRec" class="right-btn">更换区域</div>
    </div>
    <div class="goods">
      <goods-list-item :goods-item="item" v-for="item in areaList"/>
    </div>
    <el-dialog
      title="请单击地图区域，决定商品推荐的区域"
      :visible.sync="positionDialogVisible"
      width="60%"
      @close="closeDialog"
    >
      <div class="map-desc">
        <span>区域有效范围：中国城市</span>
        <span class="current-province">{{ "当前区域：" + city }}</span>
      </div>
      <div id="map-container" style="width:860px; height:500px"></div>
      <!--     底部区域   -->
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="areaGoodsRec">确 定</el-button>
          <el-button @click="closeDialog">取消</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import AMap from "AMap";
import {areaRec} from "../../../api";
import goodsListItem from "../../../components/common/Goods/GoodsListItem";
import area from "../../../utils/area";

export default {
  name: "index",
  data() {
    return {
      city:'',
      oldCity:'',
      preciousCity:'',
      positionDialogVisible: false,
      map: null,
      geoCoder: null,
      markersPosition: [],
      areaList: [],
      districtSearch:null,
      area:[]
    }
  },
  components: {
    goodsListItem
  },
  created() {
    this.area = area
    this.getLocation()
  },
  methods: {
    //生成当前所在城市的覆盖物
    handlePolygon(result, color) {
      let bounds = result.districtList[0].boundaries;
      if (bounds) {
        for (let i = 0, l = bounds.length; i < l; i++) {
          //生成行政区划polygon
          let polygon = new AMap.Polygon({
            map: this.map, // 指定地图对象
            strokeWeight: 1, // 轮廓线宽度
            path: bounds[i], //轮廓线的节点坐标数组
            fillOpacity: 0.4, //透明度
            fillColor: color, //填充颜色
            strokeColor: "#256edc", //线条颜色
          });
        }
      }
    },
    //移除生成的区域覆盖物
    removePolygon() {
      // 获取当前地图中所有覆盖物的实例。
      let mapPolyArr = this.map.getAllOverlays('polygon')
      // 移除覆盖物
      this.map.remove(mapPolyArr)
    },
    // 获取定位
    getLocation() {
      const _this = this
      //AMap.CitySearch:城市获取服务，获取用户所在城市信息或根据给定IP参数查询城市信息
      //AMap.Geocoder:地理编码与逆地理编码服务，提供地址与坐标间的相互转换
      //AMap.DistrictSearch:行政区查询服务，提供了根据名称关键字、citycode、adcode(区域代码：共6位（省、市、县各占两位）) 来查询行政区信息的功能
      AMap.plugin(['AMap.CitySearch', 'AMap.Geocoder','AMap.DistrictSearch'], function () {
        _this.geoCoder = new AMap.Geocoder()
        _this.districtSearch = new AMap.DistrictSearch({
          // 关键字对应的行政区级别，共有5种级别
          level: "city",
          //  是否显示下级行政区级数，1表示返回下一级行政区
          subdistrict: 0,
          // 返回行政区边界坐标点
          extensions: "all",
        });
        const citySearch = new AMap.CitySearch()
        //通过IP定位获取当前用户所在城市信息
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            _this.city = result.city?result.city:result.province
            _this.preciousCity = _this.city
            _this.oldCity = _this.city
            _this.getAreaGoods()
          }
        })
      })
    },
    //更换区域并获取新区域的推荐商品
    areaGoodsRec() {
      if (this.oldCity !== this.city) {
        this.oldCity = this.city
        if(this.area.includes(this.city)){
          this.getAreaGoods()
        }else{
          return this.$msg.error("该区域暂无商品")
        }
      }
      this.closeDialog()
    },
    //根据行政区名字获取行政区对象
    areaSearch(){
      this.districtSearch.search(this.city, (status, result) => {
        // 查询成功时，result即为对应的行政区信息
        this.handlePolygon(result, "blue");
      });
    },
    //创建地图
    createMap() {
      this.map = new AMap.Map('map-container', {
        zoom: 4
      });
      this.areaSearch()
      this.handleMapClick()
    },
    areaRec() {
      const _this = this
      setTimeout(() => {
        _this.createMap()
      }, 1000)
      this.positionDialogVisible = true
    },
    //监听地图点击
    handleMapClick() {
      this.map.on('click', (e) => {
        this.markersPosition = [e.lnglat.lng, e.lnglat.lat]
        this.geoCoder.getAddress(this.markersPosition, (status, result) => {//result为对应的地理位置详细信息
          if (status === 'complete' && result.regeocode) {//result.regeocode:逆地理编码结果
            this.city = result.regeocode.addressComponent.city?result.regeocode.addressComponent.city:result.regeocode.addressComponent.province
            this.removePolygon()
            this.areaSearch()
          }
        })
      })
    },
    //获取区域推荐商品
    async getAreaGoods() {
      const res = await areaRec(this.city)
      if (res.code === 1) {
        this.areaList = res.data
      }
    },
    closeDialog(){
      this.city = this.preciousCity
      this.positionDialogVisible = false
    }
  }
}
</script>

<style scoped lang="less">
.area-rec {
  padding-bottom: 20px;

  .header {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;

    .left-header {
      font-size: 22px;
    }

    .right-btn {
      font-size: 14px;
      color: #ff6700;
      cursor: pointer;
    }
  }

  .goods {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 14px;
  }

  .map-desc {
    color: red;
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;

    .current-province {
      margin-right: 12px;
    }
  }
}
</style>
