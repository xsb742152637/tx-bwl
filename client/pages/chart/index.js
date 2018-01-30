var util = require('../../utils/util.js')
var wxCharts = require('../../wxcharts.js');
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekShop:"0.00",
    allShop:"0.00",
    winWidth: 300,
    array: [
      { "uniqueId": "0", "name": "本周", "checked": "true" },
      { "uniqueId": "1", "name": "全部" }],
    defType: "本周"
  }, radioChange: function (e) {
    var array = this.data.array;
    var defType = 0;
    for (var i = 0, len = array.length; i < len; ++i) {

      if (array[i].uniqueId == e.detail.value) {
        array[i].checked = true;
        defType = array[i].name;
      } else {
        array[i].checked = false;
      }

    }

    this.setData({
      array: array, defType: defType
    });
    this.onShow()
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

    var now = new Date();
    var monday = util.getMonDay(now);
    var sunday = util.getNextMonDay(now);
  
    var sysRes = wx.getSystemInfoSync()
    that.setData({ winWidth: sysRes.windowWidth })
    var payTypeInfo = new Array();
    var otherPay = 0//其它支付
    var allShop = 0//总金额
    var weekShop = 0;//本周消费
    var storaRes = wx.getStorageInfoSync()
    if (storaRes.keys.length > 0) {
      for (var i = storaRes.keys.length - 1; i >= 0; i--) {
        var key = storaRes.keys[i]
        if (key.indexOf("payType_") >= 0) {
          var value = wx.getStorageSync(key)
          var obj = JSON.parse(value);
          payTypeInfo.push(obj);
        }
      }
    }

    wx.getStorageInfo({
      success: function (res) {
        if (res.keys.length > 0) {
          for (var i = res.keys.length - 1; i >= 0; i--) {
            var key = res.keys[i]
            if (key.indexOf("writeShop_") >= 0) {
              var value = wx.getStorageSync(key)
              try {
                var obj = JSON.parse(value);
                var st = new Date(obj.sysTime);
                var money = parseFloat(obj.shopMoney)
                var isHave = false;
                if ((that.data.defType == "本周" && monday.getTime() <= st.getTime() && sunday.getTime() > st.getTime()) || that.data.defType == "全部") {
                  for (var j = 0; j < payTypeInfo.length; j++) {
                    if (obj.payTypeUID == payTypeInfo[j].uniqueId) {
                      var ct = payTypeInfo[j].ct;
                      if (ct == null) {
                        ct = 0;
                      }
                      payTypeInfo[j]["ct"] = money + ct
                      isHave = true
                    }
                  }
                  if (!isHave) {
                    otherPay += money
                  }
                  allShop += money
                }

                if (monday.getTime() <= st.getTime() && sunday.getTime() > st.getTime()) {
                  weekShop += parseFloat(obj.shopMoney);
                }
              } catch (e) {
                console.log(e);
                // wx.removeStorageSync(key)
              }

            }
          }
          if (allShop > 0) {
            try {
              var cInfo = new Array()
              var bl = 100 / allShop
              for (var m = 0; m < payTypeInfo.length; m++) {
                var ct = payTypeInfo[m].ct;
                if (ct != null && ct > 0) {
                  var d = parseFloat(ct) * bl
                  d = parseFloat(d).toFixed(2);
                  var chartsInfo2 = "{ \"name\":\"" + payTypeInfo[m].name + "：" + parseFloat(ct).toFixed(2) + "￥\" , \"data\":  " + d + " }"
                  cInfo.push(JSON.parse(chartsInfo2))
                }
              }
              if (otherPay > 0) {
                cInfo.push(JSON.parse("{ \"name\":\"其它：" + parseFloat(otherPay).toFixed(2) + "￥\" , \"data\": " + parseFloat(parseFloat(otherPay) * bl).toFixed(2) + " }"))
              }

              new wxCharts({
                canvasId: 'pieCanvas',
                type: 'pie',
                series: cInfo,
                width: sysRes.windowWidth,
                height: 300,
                dataLabel: true
              });
            } catch (e) {
              console.log(e)
            }

          }
        }
        weekShop = parseFloat(weekShop).toFixed(2);
        allShop = parseFloat(allShop).toFixed(2);
        that.setData({ weekShop: weekShop, allShop: allShop});
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