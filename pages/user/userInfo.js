function e(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var a = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        userInfo: {},
        cityModalVisible: !1,
        address: "请选择",
        isLogin: !1
    },
    onLoad: function(e) {
        var a = this;
        a.setData({
            authedUserId: e.authedUserId || "",
            route: decodeURIComponent(e.route || "")
        }), a.initPageQuery();
    },
    onHide: function() {
        t.globalData.openUserInfo = !1;
    },
    onUnload: function() {
        t.globalData.openUserInfo = !1;
        var e = this.data, a = e.isLogin, s = void 0 !== a && a, i = (e.route, getCurrentPages()), n = i[i.length - 2], o = n.route || n.__route__;
        o.indexOf("pages/user/userAuthorize") > -1 && (o = (n = i[i.length - 3]).route || n.__route__), 
        s ? n.setData({
            fromLogin: !0
        }) : "pages/index/discovery" === o && n.setData({
            currentTab: 1
        });
    },
    initPageQuery: function() {
        var e = this, t = e.data.authedUserId;
        a.request("service.json", a.MD5({
            service: "USER_INFO_MODIFY_INIT",
            authedUserId: t
        })).then(function(a) {
            var t = a.nickName, s = void 0 === t ? "" : t, i = a.addressCityName, n = void 0 === i ? "" : i, o = a.addressProvinceName, r = void 0 === o ? "" : o, d = a.sex, u = void 0 === d ? {} : d, c = a.userLogoUrl, l = a.addressId, g = void 0 === l ? "" : l, v = {
                userLogoUrl: c,
                sex: u.name
            };
            e.setData({
                nickName: s,
                userInfo: v,
                addressId: g,
                address: r ? r + " " + n : "请选择"
            });
        });
    },
    submitUserInfo: function() {
        var e = this, s = e.data, i = s.authedUserId, n = s.addressId, o = void 0 === n ? "" : n, r = s.userInfo, d = void 0 === r ? {} : r, u = s.nickName, c = void 0 === u ? "" : u, l = e.data.route, g = void 0 === l ? "" : l, v = "";
        if (d.userLogoUrl ? "" === c.trim() ? v = "昵称不能为空" : d.sex || (v = "请选择性别") : v = "请上传头像", 
        "" === v) {
            var h = {
                service: "USER_INFO_MODIFY",
                authedUserId: i,
                addressId: o,
                sex: d.sex,
                nickName: c,
                fromCompleteInfo: !0
            };
            "" === o && delete h.addressId, a.request("service.json", a.MD5(h)).then(function(s) {
                a.showToast("完善资料成功！", "success"), t.globalData.isUserInfoBack = !0, a.initPageLogin().then(function(a) {
                    e.setData({
                        isLogin: !0
                    }, function() {
                        if (t.globalData.isLogin = !0, g) {
                            var e = getCurrentPages(), a = e[e.length - 2], s = a.route || a.__route__;
                            s.indexOf("pages/user/userAuthorize") > -1 ? "pages/index/index" === (s = (a = e[e.length - 3]).route || a.__route__) || "pages/index/discovery" === s || "pages/index/myIndex" === s ? wx.switchTab({
                                url: "/" + s
                            }) : wx.navigateBack({
                                delta: 2
                            }) : "pages/index/index" === s || "pages/index/discovery" === s || "pages/index/myIndex" === s ? wx.switchTab({
                                url: "/" + s
                            }) : wx.navigateBack({
                                delta: 1
                            });
                        } else {
                            var i = "" + t.globalData.indexUrl;
                            wx.switchTab({
                                url: i
                            });
                        }
                    });
                });
            });
        } else a.showToast(v);
    },
    getQueryString: function(e, a) {
        var t = new RegExp("(^|&)" + a + "=([^&]*)(&|$)");
        return null != (e = e.split("?")[1].match(t)) ? unescape(e[2]) : null;
    },
    changeSex: function(a) {
        var t = a.currentTarget.dataset.sex, s = void 0 === t ? "" : t;
        this.setData(e({}, "userInfo.sex", s));
    },
    bindNickNameinput: function(e) {
        this.setData({
            nickName: e.detail.value
        });
    },
    navigateToUploadImage: function() {
        var e = this.data.authedUserId;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var t = a.tempFilePaths;
                wx.navigateTo({
                    url: "/pages/package-template/uploadHeader?authedUserId=" + e + "&imageResouce=" + t[0]
                });
            }
        });
    },
    showCityModal: function() {
        this.selectComponent("#cityModal").initData(), this.setData({
            cityModalVisible: !0
        });
    },
    hideCityModal: function() {
        this.setData({
            cityModalVisible: !1
        });
    },
    doCityModal: function(e) {
        var a = e.detail, t = a.address, s = void 0 === t ? "" : t, i = a.addressId, n = void 0 === i ? "" : i;
        this.setData({
            address: s,
            addressId: n
        });
    }
});