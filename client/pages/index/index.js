//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    noteInfo:{}
  },
  write:function(){
    //跳转到成功页面
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
        console.log(res);
        if (res.keys.length < 1) {
          var str = '{"uniqueId":"","title":"暂无记录","content":"","sysTime":""}';
          var noteInfo = that.data.noteInfo;
          noteInfo[key] = JSON.parse(str);
          that.setData({ noteInfo: noteInfo });
        } else {
          for (var i = res.keys.length - 1; i >= 0; i--) {
            var key = res.keys[i]
            if (key.indexOf("write_") >= 0) {
              var value = wx.getStorageSync(key)
              try {
                var obj = JSON.parse(value);
                obj["sysTime"] = obj.sysTime.substring(0, 16);
                obj["content"] = obj.content.split("<br>")[0];
                var noteInfo = that.data.noteInfo;
                noteInfo[key] = obj;
                that.setData({ noteInfo: noteInfo });
              } catch (e) {
                wx.removeStorageSync(key)
              }
              
            }
          }
        }
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