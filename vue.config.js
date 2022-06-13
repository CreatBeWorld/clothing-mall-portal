module.exports = {
  configureWebpack:{
    devServer:{
      port:8089,//端口号
      open:true,
    },
    externals: {
      AMap: 'AMap', // 高德地图配置
    }
  }
}
