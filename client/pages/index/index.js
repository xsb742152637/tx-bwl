//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    requestResult: '',
    noteInfo: {},
    shopInfo: {},
    newNote:[],
    newShop:[],
    weekShop:0
  },
  noteInfo:function(e){
    wx.navigateTo({
      url: 'note/index'
    })
  },
  shopInfo: function (e) {
    wx.navigateTo({
      url: 'shop/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: 'writeShop'
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

    var now = new Date(); 
    var monday = util.getMonDay(now);
    var sunday = util.getSunDay(now);

    console.log(monday);
    console.log(sunday);
    console.log("-----------------------");
    that.setData({ noteInfo: {} });
    that.setData({ shopInfo: {} });  
    wx.getStorageInfo({
      success: function (res) {
        var noteInfo = new Array();//笔记列表
        var shopInfo = new Array();//消费列表
        var weekShop = 0;//本周消费

        if (res.keys.length > 0) {
          for (var i = res.keys.length - 1; i >= 0; i--) {
            var key = res.keys[i]
            if (key.indexOf("write_") >= 0 || key.indexOf("writeShop_") >= 0) {
              var value = wx.getStorageSync(key)
              try {
                var obj = JSON.parse(value);
                obj["sysTime"] = obj.sysTime.substring(0, 10)+"     ";
                if (key.indexOf("write_") >= 0){
                  obj["content"] = obj.content.split("<br>")[0];
                  noteInfo.push(obj);
                } else if (key.indexOf("writeShop_") >= 0){

                  var st = new Date(obj.sysTime);
                  console.log(st);
                  if (monday <= st && sunday >= st){
                    weekShop += parseFloat(obj.shopMoney);
                  }
                  obj["shopMoney"] = parseFloat(obj.shopMoney).toFixed(2);
                  shopInfo.push(obj);
                }
                
              } catch (e) {
                console.log(e);
                // wx.removeStorageSync(key)
              }
              
            } 
          }
        }

        weekShop = parseFloat(weekShop).toFixed(2);
        if (noteInfo.length < 1) {
          var str = '{"uniqueId":"","title":"暂无笔记","content":"暂无笔记","sysTime":"","weekDay":""}';
          noteInfo.push(JSON.parse(str));
        } if (shopInfo.length < 1) {
          var str = '{"uniqueId":"","shopMoney":"0.00","shopTypeUID":"0","shopType":"无","shopComment":"暂无消费","sysTime":"","weekDay":""}';
          shopInfo.push(JSON.parse(str));
        }
        that.setData({ noteInfo: noteInfo, shopInfo: shopInfo, newNote: noteInfo[0], newShop: shopInfo[0], weekShop: weekShop });
        
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