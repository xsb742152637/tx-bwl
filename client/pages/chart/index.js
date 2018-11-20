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
  }, deleteBefor: function () {
    var date = new Date();
    var monday = util.getMonDay(date);
    var that = this;
    wx.showModal({
      title: '警告',
      content: '你即将删除所有消费记录，请确认？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.getStorageInfo({
            success: function (res) {
              if (res.keys.length > 0) {
                for (var i = res.keys.length - 1; i >= 0; i--) {
                  var key = res.keys[i]
                  if (key.indexOf("writeShop_") >= 0) {
                    var obj = JSON.parse(wx.getStorageSync(key));
                    var sysTime = new Date(obj.sysTime);
                    if (monday.getTime() > sysTime.getTime()){
                      wx.removeStorageSync(key)
                    }
                  }
                }
              }
              that.onShow();
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  }, deleteAll: function () {
    var date = new Date();
    var month = date.getMonth();
    var year = date.getFullYear();
    var that = this;
    wx.showModal({
      title: '警告',
      content: '你即将删除所有消费记录，请确认？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          wx.getStorageInfo({
            success: function (res) {
              if (res.keys.length > 0) {
                for (var i = res.keys.length - 1; i >= 0; i--) {
                  var key = res.keys[i]
                  if (key.indexOf("writeShop_") >= 0) {
                    var obj = JSON.parse(wx.getStorageSync(key));
                    var sysTime = new Date(obj.sysTime);
                    wx.removeStorageSync(key)
                  }
                }
              }
              that.onShow();
            }
          })
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
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
    var shopTypeInfo = new Array();
    var otherPay = 0//其它支付
    var allShop = 0//总金额
    var weekShop = 0;//本周消费
    
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
                  if (obj.shopTypeUID != "" && obj.shopTypeUID != null){
                    var stu = (new String(obj.shopTypeUID)).split(",");
                    var sty = (new String(obj.shopType)).split(",");
                    var nmoney = money;
                    if(stu.length > 1){
                      nmoney = nmoney / stu.length;
                    }
                    for (var m = 0; m < stu.length; m++) {
                      var isHave = false;
                      for (var j = 0; j < shopTypeInfo.length; j++) {
                        if (stu[m] == shopTypeInfo[j].uniqueId) {
                          var ct = shopTypeInfo[j].ct;
                          if (ct == null) {
                            ct = 0;
                          }
                          shopTypeInfo[j]["ct"] = parseFloat(ct) + nmoney
                          isHave = true
                        }
                      }
                      if (!isHave) {
                        shopTypeInfo.push(JSON.parse('{"uniqueId":"' + stu[m] + '","name":"' + sty[m] + '","ct":"' + nmoney + '","count":0}'));
                      }
                    }
                  }else{
                    var key = "shopType_" + obj.addShopTypeName;
                    shopTypeInfo.push(JSON.parse('{"uniqueId":"' + key + '","name":"' + obj.addShopTypeName + '","count":0}'));
                    var len = shopTypeInfo.length - 1;
                    if (key == shopTypeInfo[len].uniqueId) {
                      var ct = shopTypeInfo[len].ct;
                      if (ct == null) {
                        ct = 0;
                      }
                      shopTypeInfo[len]["ct"] = parseFloat(ct) + money
                    }
                  }
                  allShop += money;
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
              for (var m = 0; m < shopTypeInfo.length; m++) {
                var ct = shopTypeInfo[m].ct;
                if (ct != null && ct > 0) {
                  var d = parseFloat(ct) * bl
                  d = parseFloat(d).toFixed(2);
                  var chartsInfo2 = "{ \"name\":\"" + shopTypeInfo[m].name + "：" + parseFloat(ct).toFixed(2) + "￥\" , \"data\":  " + d + " }"
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