// pages/index/writeShop.js
var util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTypeInfo: [],//消费类型
    array:[],//消费类型
    index: 0,//默认选择的消费类型
    shopType:"",//默认选择的消费类型

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

    var isError = false;
    var mess = "";
    if (!shopMoney){
      //请输入金额
      isError = true;
      mess = '请输入消费金额';
    } else if (isNaN(shopMoney)){
      isError = true;
      mess = '消费金额必须为数字';
    } else if (!shopType && !addShopTypeName){
      //请选择消费类型
      isError = true;
      mess = '请选择消费类型或新增一项';
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
      var shopTypeUID = "";
      if (addShopTypeName){
        var sKey = "shopType_" + d.getTime();
        var str1 = '{"uniqueId":"' + sKey + '","name":"' + addShopTypeName+'","count":0}';
        // 同步方式存储表单数据
        wx.setStorage({
          key: sKey,
          data: str1
        });
        shopTypeUID = sKey;
        shopType = addShopTypeName;
      }else{
        shopTypeUID = this.data.shopTypeInfo[this.data.index].uniqueId;
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
      var str = '{"uniqueId":"' + key + '","shopMoney":"' + shopMoney + '","shopTypeUID":"' + shopTypeUID + '","shopType":"' + shopType + '","shopComment":"' + shopComment + '","sysTime":"' + util.formatTime(d) + '","weekDay":"' + util.getWeekDay(d) +'"}';

      //更新消费类型的选择次数
      wx.getStorage({
          key: shopTypeUID,
          success: function (res) {
          var obj = JSON.parse(res.data);
          obj.count +=1;

          wx.setStorage({
            key: shopTypeUID,
            data: JSON.stringify(obj)
          });
        }
      });
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
  bindPickerChange: function (e) {
    var indx = e.detail.value;
    var shopType = this.data.array[indx];
    this.setData({
      index: indx,
      shopType: shopType
    });
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
    var uniqueId = options.uniqueId;
    var that = this;
    that.setData({ shopTypeInfo: [] });
    wx.getStorageInfo({
      success: function (res) {
        var shopTypeInfo = new Array();
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
          var str2 = '{"uniqueId":"shopType_1","name":"网购","count":1}';
          wx.setStorage({
            key: "shopType_1",
            data: str2
          });
          var str3 = '{"uniqueId":"shopType_2","name":"买菜","count":2}';
          wx.setStorage({
            key: "shopType_2",
            data: str3
          });
          shopTypeInfo.push({ "key": "shopType_0", "name": "外卖", "count": 0 });
          shopTypeInfo.push({ "key": "shopType_1", "name": "网购", "count": 1 });
          shopTypeInfo.push({ "key": "shopType_3", "name": "买菜", "count": 2 });
        }
        shopTypeInfo.sort(function (a, b) { return a.count < b.count ? 1 : -1 });//从大到小排序
        var array = new Array();
        for (var i = 0; i < shopTypeInfo.length; i++) {
          array.push(shopTypeInfo[i].name);
        }
        that.setData({ shopTypeInfo: shopTypeInfo, array: array, shopType: array[0] });

        if (uniqueId != undefined && uniqueId != "") {
          //获取本地数据
          wx.getStorage({
            key: uniqueId,
            success: function (res) {
              var obj = JSON.parse(res.data);
              obj.shopComment = obj.shopComment.replace(/<br>/g, "\n");
              var shopType = obj.shopType;
              var index = 0;
              for (var i = 0; i < array.length; i++) {
                if (shopType == array[i]) {
                  index = i;
                  break;
                }
              }
              that.setData({ uniqueId: obj.uniqueId, shopComment: obj.shopComment, shopMoney: obj.shopMoney, shopType: shopType, index: index });
            }
          });
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