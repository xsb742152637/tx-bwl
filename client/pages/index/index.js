//index.js
var util = require('../../utils/util.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopInfo: {},
    container_height: '800rpx'
  }, checkTabber: function (e) {
    var myUrl = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: myUrl
    })
  },
  write: function () {
    wx.navigateTo({
      url: '../shop/write'
    })
  },
  readDetail: function (e) {
    wx.navigateTo({
      url: '../shop/write?uniqueId=' + e.currentTarget.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: '../secret/index'
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //wx.clearStorage();//清空本地存储

    var that = this;
    
    that.setData({ shopInfo: {} });
    wx.getStorageInfo({
      success: function (res) {
        var shopInfo = new Array();

        if (res.keys.length > 0) {
          for (var i = res.keys.length - 1; i >= 0; i--) {
            var key = res.keys[i]
            if (key.indexOf("writeShop_") >= 0) {
              var value = wx.getStorageSync(key)
              try {
                var obj = JSON.parse(value);
                var sysTime = new Date(obj.sysTime);
                
                obj["sysTime"] = obj.sysTime.substring(0, 16) + "  " + (obj.weekDay ? obj.weekDay : "");
                if (obj.shopComment != "" && obj.shopComment != null){
                  obj["shopComment"] = obj.shopComment.split("<br>")[0].substring(0, 22);
                }
                obj["shopMoney"] = parseFloat(obj.shopMoney).toFixed(2);
                console.log(obj.shopType);
                if (obj.shopType != "" && obj.shopType != null){
                  obj["shopType"] = (new String(obj.shopType)).split(",");
                }else{
                  obj["shopType"] = new Array();
                }
                if (obj["addShopTypeName"] != "" && obj["addShopTypeName"] != null) {
                  obj["shopType"].push(obj["addShopTypeName"]);
                }
                shopInfo.push(obj);
              } catch (e) {
                //wx.removeStorageSync(key)
                console.log(e);
              }
            }
          }
        }
        if (shopInfo.length < 1) {
          var str = '{"uniqueId":"","shopMoney":"0.00","shopTypeUID":"0","shopType":"无","payType":"未知","shopComment":"暂无消费记录","sysTime":""}';
          shopInfo.push(JSON.parse(str));
        }
        that.setData({ shopInfo: shopInfo});
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    util.showBusy('正在刷新');
    onShow();
    util.showSuccess('刷新成功')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})