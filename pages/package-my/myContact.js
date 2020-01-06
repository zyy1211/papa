var t = require("../../utils/util.js");

Page({
    bindConactCall: function(n) {
        t.requestEmpty(n), wx.makePhoneCall({
            phoneNumber: "13735441033"
        });
    },
    bindConactWeixin: function(n) {
        t.requestEmpty(n), wx.showModal({
            title: "提示",
            content: "微信号已复制到剪切板",
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#00CD91",
            success: function(t) {
                t.confirm && (wx.setClipboardData ? wx.setClipboardData({
                    data: "ilovebadmintonpapaai",
                    success: function(t) {}
                }) : wx.showModal({
                    title: "提示",
                    content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
                }));
            }
        });
    }
});