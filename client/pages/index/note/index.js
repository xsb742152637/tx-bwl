//index.js
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noteInfo: {},
    container_height: '800rpx'
  },
  write:function(){
    wx.navigateTo({
      url: 'write'
    })
  },
  readDetail:function(e){
    wx.navigateTo({
      url: 'write?uniqueId='+e.currentTarget.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

    that.setData({ noteInfo: {} }); 
    wx.getStorageInfo({
      success: function (res) {
        var noteInfo = new Array();
      
        if (res.keys.length > 0) {
          for (var i = res.keys.length - 1; i >= 0; i--) {
            var key = res.keys[i]
            if (key.indexOf("write_") >= 0) {
              var value = wx.getStorageSync(key)
              try {
                var obj = JSON.parse(value);
                // obj["sysTime"] = obj.sysTime.substring(0, 10) + "  " + that.getWeekDay(new Date(obj.sysTime));
                obj["sysTime"] = obj.sysTime.substring(0, 10) + "  " + (obj.weekDay ? obj.weekDay:"");
                obj["content"] = obj.content.split("<br>")[0];
                noteInfo.push(obj);
              } catch (e) {
                //wx.removeStorageSync(key)
              }
              
            } 
          }
        }

        if (noteInfo.length < 1) {
          var str = '{"uniqueId":"","title":"暂无笔记","content":"暂无笔记","sysTime":""}';
          noteInfo.push(JSON.parse(str));
        }
        that.setData({ noteInfo: noteInfo});
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