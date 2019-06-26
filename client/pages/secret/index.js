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
        dateStr: "2019年06月",
        thisYear:2019,
        thisMonth:5,
        thisDay:"",
        jqLength:3,
        lastJqStart:"2019-06-17"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.loadTbody();
    },
    /**
     * 滑动开始
     */
    handletouchtart: function (event){
        this.data.lastX = event.touches[0].pageX
        console.log(event);
    },
    /**
     * 滑动结束
     */
    handletouchend: function (event) {
        console.log(this.data.lastX);
        console.log(event);
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
        console.log(text)
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
        console.log(rs);
        var d = new Date();
        d.setFullYear(this.data.thisYear);
        d.setMonth(this.data.thisMonth);
        d.setDate(1);

        wx.setNavigationBarTitle({
            title: this.getTitle()
        });
        var d2 = new Date();

        var ds = [];

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
            if(d.getFullYear() == d2.getFullYear() && d.getMonth() == d2.getMonth() && d.getDate() == d2.getDate()){
                dStr = "今";
            }
            ds[i].push({ year: d.getFullYear(), month: d.getMonth(), day: dStr, cls: cls});

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
        console.log(ds);
        this.setData({
            days: ds
        });
    },
    /**
     * 点击每天
     */
    dayChecked: function (event) {
        console.log(event);
        var data = event.currentTarget.dataset;
        console.log(data);
        var thisDay = this.data.thisDay
        if (thisDay == data.day) {
            thisDay = "";
        } else {
            thisDay = data.day;
        }
        this.setData({
            thisDay: thisDay
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
        if (this.data.lastJqStart != "") {
            var l = this.data.lastJqStart.split("-");
            console.log(l);
            var d = new Date();
            d.setFullYear(l[0]);
            d.setMonth(l[1] - 1);
            d.setDate(l[2]);

            var ljs = this.data.lastJqStart;

            //状态说明：
            /*
            1：经期开始，2：经期中途，3：经期结束
            11:预计开始，12：预计中途，13，：预计结束
            20：排卵期
            30：排卵日
            40：今天

            开始后的第9天位排卵期开始，共计9天,再过5天为排卵日
            */
            var r = {};
            var cls = "";
            //经期
            for (var i = 0; i < this.data.jqLength; i++) {
                if (i == 0) {
                    cls = "jq-sj jq-sj-start";//经期开始
                } else if (i + 1 == this.data.jqLength) {
                    cls = "jq-sj jq-sj-end";//经期结束
                } else {
                    cls = "jq-sj";//经期中途
                }
                r[this.getDateStr(d)] = cls;
                d.setDate(d.getDate() + 1);
            }

            var plqs = 9 - this.data.jqLength - 1;//开始后的第几天排卵期开始
            var plqLength = 9;//排卵期长度
            var plr = 5;//排卵期开始后的第几天是排卵日
            d.setDate(d.getDate() + plqs);
            for (var i = 1; i <= plqLength; i++) {
                if (i == plr) {
                    cls = "jq-plr";//排卵日
                } else {
                    cls = "jq-plq";//排卵期
                }
                r[this.getDateStr(d)] = cls;
                d.setDate(d.getDate() + 1);
            }
            return r;
        }
        return null;
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