// pages/index/write.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uniqueId: '',
    title: '',
    content: '',
    container_height: '800rpx'
  },
  formSubmit: function (e) {
    //获得表单数据
    var objData = e.detail.value;

    if (objData.content) {
      util.showBusy('正在保存');
      var d = new Date;
      var key = 'write_' + d.getTime();
      if (this.data.uniqueId != ""){
        key = this.data.uniqueId;
      }
      var content = objData.content.replace(/\n/g, '<br>');
      util.showBusy(content);
      var title = objData.title;
      if (!objData.title){
        title = content.split("<br>")[0];
        title = title.length > 10 ? title.substring(0, 10):title;
      }
      var str = '{"uniqueId":"' + key + '","title":"' + title + '","content":"' + content + '","sysTime":"' + util.formatTime(d) + '","weekDay":"' + util.getWeekDay(d) +'"}';

      // 同步方式存储表单数据
      wx.setStorage({
        key: key,
        data: str
      });
      util.showSuccess('保存成功')
      //跳转到成功页面
      wx.navigateBack({
        delta: 1
      })
    }
  },
  deleteDetail: function (e) {
    var key = e.currentTarget.id;
    wx.removeStorageSync(key)
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.uniqueId != undefined && options.uniqueId != "") {
      //获取本地数据
      wx.getStorage({
        key: options.uniqueId,
        success: function (res) {
          var obj = JSON.parse(res.data);
          obj.content = obj.content.replace(/<br>/g, "\n");
          that.setData({ uniqueId: obj.uniqueId, title: obj.title, content: obj.content });
        }
      });
    }
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ container_height: (res.windowHeight * 2) + "rpx" });
      }
    })  
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