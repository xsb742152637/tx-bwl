const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//得到今天的星期
const getWeekDay = date => {
  const weekDays = ["周日","周一","周二","周三","周四","周五","周六"]
  return weekDays[date.getDay()]
}
//得到本周的周一
const getMonDay = date => {
  var nowTime = date.getTime();
  var day = date.getDay();
  var oneDayTime = 24 * 60 * 60 * 1000;

  //显示周一
  var MondayTime = nowTime - (day - 1) * oneDayTime;
  //初始化日期时间
  var monday = new Date(MondayTime);
  return monday;
}
//得到本周的周一
const getSunDay = date => {
  var nowTime = date.getTime();
  var day = date.getDay();
  var oneDayTime = 24 * 60 * 60 * 1000;

  //显示周日
  var SundayTime = nowTime + (7 - day) * oneDayTime;
  //初始化日期时间
  var sunday = new Date(SundayTime);
  return sunday;
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

module.exports = { formatTime, showBusy, showSuccess, showModel, getWeekDay, getMonDay, getSunDay }
