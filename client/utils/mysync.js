//同步秘密模块
const upd_secret = callback => {
    var startTime = "";
    var entity = wx.getStorageSync('secret');
    var mensId = "";
    // var entity = null;
    // if (str) {
        // entity = JSON.parse(str);
        //如果有一条新数据，上传到服务器
        if (entity.mensId == undefined || entity.mensId == null || entity.mensId == ""){
            startTime = entity.startTime;
        }else{
            mensId = entity.mensId;
        }
    // }
    // console.log("111");
    var url = get_url('/app/menstrualinfo/saveMainWX.do');
    // console.log("222");
    if(url){
        wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: { startTime: startTime },
            method: "POST",
            success(res) {
                // console.log("bbbb");
                console.log(res);
                //上传成功之后，通过返回的对象更新本地数据
                var newId = "";
                if (res && res.data && res.data.error == 0 && res.data.msg && res.data.msg != "null"){
                    var en = JSON.parse(res.data.msg);
                    newId = en.mensId
                    wx.setStorage({ key: "secret", data: en});
                }
                console.log(res);
                console.log("mensId：" + mensId);
                console.log("newId：" + newId);
                callback(mensId != newId);
            }, fail(e) {
                // console.log("cccc");
                console.log(e)
                callback(false);
            }
        })
    }
}

//得到请求地址
const get_url = funName => {
    var str = wx.getStorageSync('syncinfo');
    var url = null;
    // console.log(str);
    if(str){
        var obj = JSON.parse(str);
        url = "http://" + obj.myIp + ":" + obj.myPort + funName;
    }
    // console.log(url);
    return url;
}

module.exports = { upd_secret: upd_secret,get_url: get_url}