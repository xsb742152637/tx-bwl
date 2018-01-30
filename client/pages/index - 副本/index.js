//index.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  }, checkTabber: function (e) {
    var myUrl = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: myUrl
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.navigateTo({
    //   url: 'writeShop'
    // })
    // wx.navigateTo({
    //   url: 'shop/write'
    // })
    // wx.clearStorage();//清空本地存储
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