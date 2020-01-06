var e = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        SDKVersion: wx.getSystemInfoSync().SDKVersion,
        canIUse: !1,
        isLogin: !1,
        showBindPhone: !1,
        userId: ""
    },
    onLoad: function(e) {
        var t = this, n = t.data.SDKVersion;
        n = n.replace(/\./g, ""), parseInt(n) < 111 ? wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            showCancel: !1
        }) : t.setData({
            canIUse: wx.canIUse("button.open-type.getUserInfo")
        }), "phone" === e.type ? t.setData({
            route: decodeURIComponent(e.route || ""),
            showBindPhone: !0,
            userId: e.userId
        }) : "authorize" === e.type && t.setData({
            route: decodeURIComponent(e.route || ""),
            showBindPhone: !1
        });
    },
    onUnload: function() {
        var e = this, t = e.data, n = t.isLogin, a = void 0 !== n && n, o = (t.route, getCurrentPages()), i = o[o.length - 2], s = i.route || i.__route__;
        e.setData({
            showBindPhone: !1
        }), a ? i.setData({
            fromLogin: !0
        }) : "pages/index/discovery" === s && i.setData({
            currentTab: 1
        });
    },
    bindGetUserInfo: function(e) {
        e.detail.userInfo && this.initPageLogin();
    },
    bindGetPhone: function(t) {
        var n = this, a = n.data.userId;
        t.detail.encryptedData && e.AJAX("service.json", {
            service: "MINI_PROGRAM_USER_BIND_CALL",
            encryptedData: t.detail.encryptedData,
            iv: t.detail.iv,
            authedUserId: a
        }, function(t) {
            var a = t.data.response;
            a && a.success ? n.setData({
                showBindPhone: !1
            }, function() {
                n.initPageLogin();
            }) : "PHONE_NUMBER_HAD_BEAN_BOUND" === a.error.name ? wx.showModal({
                title: "",
                content: "该手机号码已绑定papa平台其他账号，请更换手机号码进行绑定",
                showCancel: !1
            }) : e.showToast(e.showErrorResult(a));
        });
    },
    initPageLogin: function() {
        var n = this, a = n.data.route, o = void 0 === a ? "" : a;
        e.initPageLogin().then(function(e) {
            n.setData({
                isLogin: !0
            }, function() {
                if (t.globalData.isLogin = !0, o) "pages/index/index" === o || "pages/index/discovery" === o || "pages/index/myIndex" === o ? wx.switchTab({
                    url: "/" + o
                }) : wx.navigateBack({
                    delta: 1
                }); else {
                    var e = "" + t.globalData.indexUrl;
                    wx.switchTab({
                        url: e
                    });
                }
            });
        });
    }
});