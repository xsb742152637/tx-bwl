// pages/mysync/index.js
var util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        myIp: "192.168.1.8",
        myPort:"8081"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 上传
     */
    upd: function(event){
        var data = event.currentTarget.dataset;
        // console.log(data);
        util.showBusy('正在上传数据');
        var url = "http://" + this.data.myIp + ":" + this.data.myPort
        try{
            if ("secret" == data.code) {
                var obj = null;
                try {
                    var str = wx.getStorageSync('secret');
                    if (str) {
                        obj = JSON.parse(str);
                    }
                } catch (e) {
                    console.log(e);
                }
                if (obj != null && (obj.uniqueId == undefined || obj.uniqueId == "") && obj.startTime){
                    wx.request({
                        url: url + '/sys/textindex/search.jsp', //仅为示例，并非真实的接口地址
                        data: { startTime: obj.startTime},
                        method: "POST",
                        success(res) {
                            util.showSuccess('上传成功')
                            console.log(res);
                            //上传成功之后，通过返回的对象更新本地数据
                            // wx.setStorage({key: "secret",data: res.data});
                        }, fail(e) {
                            util.showModel('上传失败', e.errMsg)
                            console.log(e)
                        }
                    })
                }else{
                    util.showSuccess('暂无数据需要上传')
                }
            }
        } catch (e) {
            util.showModel('上传失败', e.errMsg)
            console.log(e)
        }
    },
    /**
     * 下载
     */
    dow: function (event) {
        var data = event.currentTarget.dataset;
        // console.log(data);
        util.showBusy('正在更新数据');
        var url = "http://" + this.data.myIp + ":" + this.data.myPort
        try {
            if ("secret" == data.code) {
                wx.request({
                    url: url + '/sys/textindex/search.jsp', //仅为示例，并非真实的接口地址
                    data: { },
                    method: "POST",
                    success(res) {
                        util.showSuccess('更新成功')
                        console.log(res);
                        //上传成功之后，通过返回的对象更新本地数据
                        // wx.setStorage({key: "secret",data: res.data});
                    }, fail(e) {
                        util.showModel('更新失败', e.errMsg)
                        console.log(e)
                    }
                })
            }
        } catch (e) {
            util.showModel('更新失败', e.errMsg)
            console.log(e)
        }
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