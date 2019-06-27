// pages/secret/index.js
var util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        weeks: util.weekDaysTit,
        days: [[]],
        lastX: 0,          //滑动开始x轴位置
        thisYear:2019,
        thisMonth:5,
        thisDayStr:"",
        jqState:1//1:来了，0走了
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadTbody();
    },
    /**
     * 来了
     */
    jqComIng: function(){
        var isError = false;
        var msg = "";
        if(this.data.thisDayStr == ""){
            isError = true;
            msg = "请选择一天！";
        }else{
            var l = this.data.thisDayStr.split("-");
            var d1 = new Date();
            var d = new Date();
            d.setFullYear(l[0]);
            d.setMonth(l[1] - 1);
            d.setDate(l[2]);

            if ((d.getFullYear() == d1.getFullYear() && d.getMonth() == d1.getMonth() && d.getDate() > d1.getDate()) || (d.getFullYear() == d1.getFullYear() && d.getMonth() > d1.getMonth()) || d.getFullYear() > d1.getFullYear()) {
                isError = true;
                msg = "不能设置未来日期！";
            }
        }

        if (isError) {
            wx.showModal({
                content: msg,
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        // console.log('用户点击确定')
                    }
                }
            });
        }else{
            
            try {
                var p = this;
                var str = '{"startTime":"' + this.data.thisDayStr + '"}';
                wx.setStorage({
                    key: "secret",
                    data: str,
                    success: function () {
                        p.loadTbody();
                    }
                });
            } catch (e) {
                console.log(e);
             }
        }
    },
    /**
     * 滑动开始
     */
    handletouchtart: function (event){
        this.data.lastX = event.touches[0].pageX
        // console.log(event);
    },
    /**
     * 滑动结束
     */
    handletouchend: function (event) {
        // console.log(this.data.lastX);
        // console.log(event);
        var currentX = event.changedTouches[0].pageX
        var tx = currentX - this.data.lastX
        var text = ""

        var d = new Date();
        d.setFullYear(this.data.thisYear);
        d.setMonth(this.data.thisMonth);

        //左右方向滑动
        if (Math.abs(tx) > 50) {
            if (tx < 0) {
                text = "向左滑动"
                d.setMonth(d.getMonth() + 1);
            }
            else if (tx > 0) {
                text = "向右滑动"
                d.setMonth(d.getMonth() - 1);
            }
        }
        // console.log(text)
        //将当前坐标进行保存以进行下一次计算
        this.data.thisYear = d.getFullYear();
        this.data.thisMonth = d.getMonth();
        this.loadTbody();
    },
    /**
     * 加载表格
     */
    loadTbody: function () {
        var rs = this.getDayCls();
        // console.log(rs);
        var d = new Date();
        d.setFullYear(this.data.thisYear);
        d.setMonth(this.data.thisMonth);
        d.setDate(1);

        wx.setNavigationBarTitle({
            title: this.getTitle()
        });
        var d2 = new Date();

        var ds = [];
        var thisDayStr = this.data.thisDayStr
        var i = 0;
        while (this.data.thisYear == d.getFullYear() && this.data.thisMonth == d.getMonth()) {
            if (ds[i] == null) {
                ds[i] = [];
            }
            //第一周需要填充满
            if (i == 0 && ds[i].length == 0 && d.getDay() != 0) {
                for (var a = 0; a < d.getDay(); a++) {
                    ds[i].push(null);
                }
            }
            var cls = rs[this.getDateStr(d)];
            if(cls == undefined){
                cls = "";
            }
            var dStr = d.getDate();
            var dateStr = this.getDateStr(d);
            if(d.getFullYear() == d2.getFullYear() && d.getMonth() == d2.getMonth() && d.getDate() == d2.getDate()){
                dStr = "今";
                if (thisDayStr == "")
                    thisDayStr = dateStr
            }
            ds[i].push({ year: d.getFullYear(), month: d.getMonth(), day: dStr, dateStr: dateStr, cls: cls});

            if (d.getDay() != 0 && d.getDay() % 6 == 0) {
                i++;
            }
            d.setDate(d.getDate() + 1);
        }

        if (ds[ds.length - 1].length < 7) {
            for (var a = ds[ds.length - 1].length; a < 7; a++) {
                ds[ds.length - 1].push(null);
            }
        }
        // console.log(ds);
        this.setData({
            days: ds,
            thisDayStr: thisDayStr
        });
    },
    /**
     * 点击每天
     */
    dayChecked: function (event) {
        // console.log(event);
        var data = event.currentTarget.dataset;
        this.setData({
            thisDayStr: data.str
        });
    },
    getTitle: function () {
        var str = this.data.thisYear + "年";
        str += this.data.thisMonth < 9 ? ("0" + (this.data.thisMonth + 1)) : (this.data.thisMonth + 1);
        str += "月";
        return str;
    },
    /**
     * 根据最后一次日期得到本月及后1个月的状态
     */
    getDayCls: function () {
        var lastJqStart = "";
        try {
            var str = wx.getStorageSync('secret');
            if (str) {
                var obj = JSON.parse(str);
                lastJqStart = obj.startTime;
            }
        } catch (e) {
            // Do something when catch error
        }
        
        if (lastJqStart != "") {
            //从上次月经开始，推算出到当前查看月份的下一个月的预测经期开始时间
            var ds = [];
            var l = lastJqStart.split("-");
            var d = new Date();
            d.setFullYear(l[0]);
            d.setMonth(l[1] - 1);
            d.setDate(l[2]);
            var cycle = 30;//平均周期
            while(d.getFullYear() <= this.data.thisYear && d.getMonth() <= this.data.thisMonth + 1){
                ds.push(this.getDateStr(d));
                d.setDate(d.getDate() + cycle);
            }

            // console.log(ds);
            var r = {};
            var jqLength = 3;//经期长度

            var plqStart = 19;//排卵期开始。下次经期开始往前推14天是排卵日，排卵日的前五天后四天共十天为排卵期
            var plqLength = 10;//排卵期长度
            var plr = 6;//排卵期开始后的第几天是排卵日
            var d1 = new Date();//今天的日期
            for(var m = 0 ; m < ds.length ; m++){
                l = ds[m].split("-");
                d.setFullYear(l[0]);
                d.setMonth(l[1] - 1);
                d.setDate(l[2]);

                var cls = "";
                //实际经期与预测经期
                for (var i = 0; i < jqLength; i++) {
                    if (i == 0) {
                        if (m == 0 && d.getFullYear() == d1.getFullYear() && d.getMonth() == d1.getMonth() && d.getDate() <= d1.getDate()) {
                            cls = "jq-sj jq-sj-start";//经期开始
                        } else {
                            cls = "jq-yc jq-yc-start";//预测经期开始
                        }
                    } else if (i + 1 == jqLength) {
                        if (m == 0 && d.getFullYear() == d1.getFullYear() && d.getMonth() == d1.getMonth() && d.getDate() <= d1.getDate()) {
                            cls = "jq-sj jq-sj-end";//经期结束
                        } else {
                            cls = "jq-yc jq-yc-end";//预测经期结束
                        }
                    } else {
                        if (m == 0 && d.getFullYear() == d1.getFullYear() && d.getMonth() == d1.getMonth() && d.getDate() <= d1.getDate()) {
                            cls = "jq-sj";//经期中途
                        } else {
                            cls = "jq-yc jq-yc-center";//预测经期中途
                        }
                    }

                    r[this.getDateStr(d)] = cls;
                    d.setDate(d.getDate() + 1);
                }

                if(m < ds.length - 1){
                    l = ds[m + 1].split("-");
                    d.setFullYear(l[0]);
                    d.setMonth(l[1] - 1);
                    d.setDate(l[2]);

                    d.setDate(d.getDate() - plqStart);
                    for (var i = 1; i <= plqLength; i++) {
                        if (i == plr) {
                            cls = "jq-plr";//排卵日
                        } else {
                            cls = "jq-plq";//排卵期
                        }
                        r[this.getDateStr(d)] = cls;
                        d.setDate(d.getDate() + 1);
                    }
                }
            }
            return r;
        }
        return [];
    },
    getDateStr: function (d) {
        var str = d.getFullYear() + "-";
        str += d.getMonth() < 9 ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1);
        str += "-";
        str += d.getDate() < 9 ? ("0" + d.getDate()) : d.getDate();
        return str;
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})