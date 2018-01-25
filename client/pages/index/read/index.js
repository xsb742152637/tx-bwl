// pages/index/read/index.js

var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    center: "",
    title:"",

    url: "https://www.ybdu.com",//网址
    first:"/xiaoshuo/0/910/4195702.html",//第一页
    last:"",//最后一页
    prev:"",//上一页
    curr:"",//当前页
    next:""//下一页
  },
  clickPrev:function(e){
    //点击上一页
    console.log("上一页");
    var curr = this.data.prev;
    if(curr == ""){
      console.log("翻页失败");
      util.showSuccess('已经是第一页了')
    }else{
      wx.setStorage({
        key: "read_dldl",
        data: curr
      });
      this.onShow();
    }
    
  },
  clickNext: function (e) {
    //点击下一页
    console.log("下一页")
    var curr = this.data.next;
    if (curr == "") {
      console.log("翻页失败");
      util.showSuccess('已经是最后一页了')
    } else {
      wx.setStorage({
        key: "read_dldl",
        data: curr
      });
      this.onShow();
    }
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
    var that = this;
    var curr = wx.getStorageSync("read_dldl")
    if(curr == ""){
      curr = this.data.first;
    }
    var prev = this.data.prev;
    var next = this.data.next;
    console.log(that.data.url+curr);
    wx.request({
      url: that.data.url+curr,
      header: {
        "Content-Type": "text/html; charset=utf8"
      },
      method: "GET",
      responseType:"text",
      //data: { cityname: "上海", key: "1430ec127e097e1113259c5e1be1ba70" },  
      // data: {},
      success: function (res) {
        console.log(res);
        console.log("成功");
        var html = res.data;
        var title = html.substring(html.indexOf("h1title\">") + 9, html.indexOf("<div class=\"chapter_Turnpage"))
        util.showSuccess(title)
        var center = html.substring(html.indexOf("<div id=\"htmlContent\" class=\"contentbox\">")+41, html.indexOf("<div class=\"ad00\">"))

        var page = html.substring(html.indexOf("<div class=\"chapter_Turnpage")+30)
        page = page.substring(0,page.indexOf("</div>"))

        prev = page.substring(page.indexOf("/xiaoshuo"), page.indexOf(".html") + 5)
        next = page.substring(page.lastIndexOf("/xiaoshuo"), page.lastIndexOf(".html") + 5)
        if (prev.indexOf("<") >= 0 || prev.indexOf(">") >= 0){
          prev = "";
        } if (next.indexOf("<") >= 0 || next.indexOf(">") >= 0) {
          next = "";
        }
        title = title.replace(/<[^>]+>/g, "");
        center = center.replace(/<br \/>/g, "\n");
        
        console.log(prev);
        console.log(next);
        that.setData({ center: center, title: title, prev: prev, next: next, curr: curr })
        if (res == null || res.data == null) {
          console.error('网络请求失败');
          return;
        }
      }, fail:function(mes){
          console.log(mes);
      }, complete:function(){

      }
    }) 

    //回到顶部
    wx.pageScrollTo({
      scrollTop: 0,//滚动到的位置，单位px
      duration: 1//滚动所耗时间，单位ms
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