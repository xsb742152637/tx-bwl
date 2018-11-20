// pages/index/writeShop.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopTypeInfo: [],//消费类型
    uniqueId: '',
    shopMoney: '',
    shopComment: '',
    container_height: '800rpx'
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
    }

    if (isError){
      wx.showModal({
        content: mess,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          }
        }
      });
    }else {
      util.showBusy('正在保存');

      var d = new Date;
  
      var key = 'writeShop_' + d.getTime();
      if (this.data.uniqueId != "") {
        key = this.data.uniqueId;
      }
      if (objData.shopComment){
        shopComment = shopComment.replace(/\n/g, '<br>');
      }

      var str = '{"uniqueId":"' + key + '","shopMoney":"' + shopMoney + '","shopTypeUID":"' + shopTypeUID.join(",") + '","shopType":"' + shopType.join(",") + '","addShopTypeName":"' + addShopTypeName + '","shopComment":"' + shopComment + '","sysTime":"' + util.formatTime(d) + '","weekDay":"' + util.getWeekDay(d) +'"}';

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
  }, checkboxChange: function (e) {
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
    that.setData({ shopTypeInfo: []});
    wx.getStorageInfo({
      success: function (res) {
        var shopTypeInfo = new Array();
        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_zaocan","name":"早餐","count":0}'));
        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_wucan","name":"午餐","count":0}'));
        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_wancan","name":"晚餐","count":0}'));

        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_maicai","name":"买菜","count":0}'));
        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_shuiguo","name":"水果","count":0}'));
        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_chaoshi","name":"超市","count":0}'));

        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_dache","name":"打车","count":0}'));
        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_wanggou","name":"网购","count":0}'));
        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_diangou","name":"店购","count":0}'));

        shopTypeInfo.push(JSON.parse('{"uniqueId":"shopType_shenghuojiaofei","name":"生活缴费","count":0}'));
      
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
              }
            
              that.setData({ uniqueId: obj.uniqueId, addShopTypeName: obj.addShopTypeName,shopComment: obj.shopComment, shopMoney: obj.shopMoney, shopTypeInfo: shopTypeInfo });
              
            }
          });
        }else{
          that.setData({ shopTypeInfo: shopTypeInfo});
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