// pages/index/writeShop.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTypeInfo: [],//消费类型
    payTypeInfo: [],//支付类型

    uniqueId: '',
    shopMoney: '',
    shopComment: '',
    container_height: '800rpx',
    addShopTypeShow:false
  },
  formSubmit: function (e) {
    //获得表单数据
    var objData = e.detail.value;
    var shopMoney = objData.shopMoney;
    var shopType = objData.shopType;
    var shopComment = objData.shopComment;
    var addShopTypeName = objData.addShopTypeName;

    var shopTypeUID = new Array();
    var shopType = new Array();
    var shopTypeInfo = this.data.shopTypeInfo
    for (var i = 0; i < shopTypeInfo.length; i++) {
      if (shopTypeInfo[i].checked == true) {
        shopTypeUID.push(shopTypeInfo[i].uniqueId)
        shopType.push(shopTypeInfo[i].name)
      }
    }

    var payTypeUID = new Array();
    var payType = new Array();
    var payTypeInfo = this.data.payTypeInfo
    for (var i = 0; i < payTypeInfo.length; i++) {
      if (payTypeInfo[i].checked == true) {
        payTypeUID.push(payTypeInfo[i].uniqueId)
        payType.push(payTypeInfo[i].name)
      }
    }

    var isError = false;
    var mess = "";
    if (!shopMoney){
      //请输入金额
      isError = true;
      mess = '请输入消费金额';
    } else if (isNaN(shopMoney)){
      isError = true;
      mess = '消费金额必须为数字';
    } else if (shopTypeUID.length < 1 && !addShopTypeName){
      //请选择消费类型
      isError = true;
      mess = '请选择消费类型或新增一项';
    } else if (payTypeUID.length < 1) {
      //请选择消费类型
      isError = true;
      mess = '请选择支付方式';
    } 

    if (isError){
      wx.showModal({
        content: mess,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }else {
      util.showBusy('正在保存');

      var d = new Date;
      if (addShopTypeName){
        var sKey = "shopType_" + d.getTime();
        var str1 = '{"uniqueId":"' + sKey + '","name":"' + addShopTypeName+'","count":0}';
        // 同步方式存储表单数据
        wx.setStorage({
          key: sKey,
          data: str1
        });
        shopTypeUID.push(sKey)
        shopType.push(addShopTypeName)
      }
      
      var key = 'writeShop_' + d.getTime();
      if (this.data.uniqueId != "") {
        key = this.data.uniqueId;
      }
      if (!objData.shopComment){
        shopComment = shopType;
      }else{
        shopComment = shopComment.replace(/\n/g, '<br>');
      }
      console.log(shopTypeUID)
      var str = '{"uniqueId":"' + key + '","shopMoney":"' + shopMoney + '","shopTypeUID":"' + shopTypeUID.join(",") + '","shopType":"' + shopType.join(",") + '","payTypeUID":"' + payTypeUID.toString() + '","payType":"' + payType.toString() + '","shopComment":"' + shopComment + '","sysTime":"' + util.formatTime(d) + '","weekDay":"' + util.getWeekDay(d) +'"}';

      //更新消费类型的选择次数
      for (var i = 0; i < shopTypeUID.length;i++){
        wx.getStorage({
          key: shopTypeUID[i],
          success: function (res) {
            var obj = JSON.parse(res.data);
            obj.count += 1;

            wx.setStorage({
              key: obj.uniqueId,
              data: JSON.stringify(obj)
            });
          }
        });
      }
      for (var i = 0; i < payTypeUID.length; i++) {
        wx.getStorage({
          key: payTypeUID[i],
          success: function (res) {
            var obj = JSON.parse(res.data);
            obj.count += 1;

            wx.setStorage({
              key: obj.uniqueId,
              data: JSON.stringify(obj)
            });
          }
        });
      }
      console.log(str);
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
  addShopType: function(e){
    this.setData({ addShopTypeShow:true});
  },
  deleteDetail: function (e) {
    var key = e.currentTarget.id;
    wx.removeStorageSync(key)
    wx.navigateBack({
      delta: 1
    })
  },
  radioChange: function (e) {
    var payTypeInfo = this.data.payTypeInfo;
    for (var i = 0, len = payTypeInfo.length; i < len; ++i) {
      payTypeInfo[i].checked = payTypeInfo[i].uniqueId == e.detail.value;
    }

    this.setData({
      payTypeInfo: payTypeInfo
    });
  }, checkboxChange: function (e) {
    console.log(e.detail);

    var shopTypeInfo = this.data.shopTypeInfo, values = e.detail.value;
    for (var i = 0, lenI = shopTypeInfo.length; i < lenI; ++i) {
      shopTypeInfo[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (shopTypeInfo[i].uniqueId == values[j]) {
          shopTypeInfo[i].checked = true;
          break;
        }
      }
    }

    this.setData({
      shopTypeInfo: shopTypeInfo
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uniqueId = options.uniqueId;
    var that = this;
    that.setData({ shopTypeInfo: [], payTypeInfo:[] });
    wx.getStorageInfo({
      success: function (res) {
        var shopTypeInfo = new Array();
        var payTypeInfo = new Array();
        if (res.keys.length > 0) {
          for (var i = res.keys.length - 1; i >= 0; i--) {
            var key = res.keys[i]
            if (key.indexOf("shopType_") >= 0) {
              var value = wx.getStorageSync(key)
              try {
                var obj = JSON.parse(value);
                shopTypeInfo.push(obj);
              } catch (e) {
                wx.removeStorageSync(key)
              }
            } if (key.indexOf("payType_") >= 0) {
              var value = wx.getStorageSync(key)
              try {
                var obj = JSON.parse(value);
                payTypeInfo.push(obj);
              } catch (e) {
                wx.removeStorageSync(key)
              }
            }
          }
        }
        if (shopTypeInfo.length < 1) {
          var str1 = '{"uniqueId":"shopType_0","name":"外卖","count":0}';
          // 同步方式存储表单数据
          wx.setStorage({
            key: "shopType_0",
            data: str1
          });
          shopTypeInfo.push(JSON.parse(str1));

          var str2 = '{"uniqueId":"shopType_1","name":"网购","count":1}';
          wx.setStorage({
            key: "shopType_1",
            data: str2
          });
          shopTypeInfo.push(JSON.parse(str2));

          var str3 = '{"uniqueId":"shopType_2","name":"买菜","count":2}';
          wx.setStorage({
            key: "shopType_2",
            data: str3
          });
          shopTypeInfo.push(JSON.parse(str3));
        } if (payTypeInfo.length < 1) {
          var str1 = '{"uniqueId":"payType_0","name":"微信","count":2}';
          // 同步方式存储表单数据
          wx.setStorage({
            key: "payType_0",
            data: str1
          });
          payTypeInfo.push(JSON.parse(str1));

          var str2 = '{"uniqueId":"payType_1","name":"信用卡","count":1}';
          wx.setStorage({
            key: "payType_1",
            data: str2
          });
          payTypeInfo.push(JSON.parse(str2));

          var str3 = '{"uniqueId":"payType_2","name":"现金","count":0}';
          wx.setStorage({
            key: "payType_2",
            data: str3
          });
          payTypeInfo.push(JSON.parse(str3));
        }
        shopTypeInfo.sort(function (a, b) { return a.count < b.count ? 1 : -1 });//从大到小排序
        payTypeInfo.sort(function (a, b) { return a.count < b.count ? 1 : -1 });//从大到小排序
        
        if (uniqueId != undefined && uniqueId != "") {
          //获取本地数据
          wx.getStorage({
            key: uniqueId,
            success: function (res) {
              var obj = JSON.parse(res.data);
              obj.shopComment = obj.shopComment.replace(/<br>/g, "\n");
              if (obj.shopTypeUID) {
                var stu = (new String(obj.shopTypeUID)).split(",");
                for (var i = 0; i < shopTypeInfo.length; i++) {
                  for (var j = 0; j < stu.length; j++) {
                    if (stu[j].toString() == shopTypeInfo[i].uniqueId) {
                      shopTypeInfo[i]["checked"] = true;
                    }
                  }
                }
              }else{
                shopTypeInfo[0]["checked"] = true;
              }
              if (obj.payTypeUID) {
                var ptu = (new String(obj.payTypeUID)).split(",");
                for (var i = 0, lenI = payTypeInfo.length; i < lenI; ++i) {
                  for (var j = 0; j < ptu.length; j++) {
                    if (ptu[j] == payTypeInfo[i].uniqueId) {
                      payTypeInfo[i].checked = true;
                      break;
                    }
                  }
                }
              }else{
                payTypeInfo[0]["checked"] = true;
              }
              
              
              that.setData({ uniqueId: obj.uniqueId, shopComment: obj.shopComment, shopMoney: obj.shopMoney, shopTypeInfo: shopTypeInfo, payTypeInfo: payTypeInfo });
              
            }
          });
        }else{
          shopTypeInfo[0]["checked"]=true;
          payTypeInfo[0]["checked"] = true;
          that.setData({ shopTypeInfo: shopTypeInfo, payTypeInfo: payTypeInfo });
        }
        

      }
    })

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