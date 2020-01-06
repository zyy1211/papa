var e = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        nickName: "立即登录",
        createActivityCount: "0",
        joinActivityCount: "0",
        waitingSettlementAmount: "0",
        isLink: !0,
        fromLogin: !1
    },
    navigate: function(t) {
        var i = this, a = this.data.isLink, n = t.currentTarget.dataset.url;
        n || (n = t.detail.e.currentTarget.dataset.url), a && ("/pages/package-my/myDownloadApp" === n ? (i.setData({
            isLink: !1
        }), t.detail.e && (t = t.detail.e), e.requestEmpty(t), wx.navigateTo({
            url: n
        })) : e.initPageLogin().then(function(a) {
            i.setData({
                authedUserId: a,
                isLink: !1
            }), t.detail.e && (t = t.detail.e), e.requestEmpty(t), wx.navigateTo({
                url: n
            });
        }));
    },
    onLoad: function() {
        this.initPageLogin();
    },
    onShow: function() {
        var t = this, i = t.data, a = i.fromLogin, n = i.authedUserId, r = void 0 === n ? "" : n;
        a && (t.initPageLogin(), r = r || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
        t.setData({
            authedUserId: r
        }), e.request("service.json", e.MD5({
            service: "USER_OPERATION_PERMISSION_QUERY",
            authedUserId: r
        })).then(function(e) {
            var t = e.allowCreateRace, i = void 0 === t || t, a = e.blackUser, n = void 0 !== a && a, r = e.hideSubjectCreate, o = wx.getStorageSync("userInfo") || {};
            o.inWhiteList = !n || !1, o.allowCreateRace = i || !1;
            var s = {
                inWhiteList: !n || !1,
                allowCreateRace: i || !1,
                hideSubjectCreate: r
            };
            wx.setStorage({
                key: "userInfo",
                data: o
            }), wx.setStorage({
                key: "userPermisssion",
                data: s
            });
        }));
    },
    onHide: function() {
        this.setData({
            isLink: !0,
            fromLogin: !1
        });
    },
    onPullDownRefresh: function() {
        var e = this;
        wx.stopPullDownRefresh(), e.initPageLogin();
    },
    initPageLogin: function(e) {
        var i = this, a = i.data.authedUserId, n = void 0 === a ? "" : a;
        n = n || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        i.setData({
            authedUserId: n,
            userHomePageUrl: "" + t.globalData.userHomePageUrl + n
        }), i.initPageQuery();
    },
    initPageQuery: function() {
        var t = this, i = t.data.authedUserId, a = void 0 === i ? "" : i;
        a = a || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        wx.showLoading({
            title: "加载中"
        }), e.request("service.json", e.MD5({
            service: "MY_INDEX",
            authedUserId: a
        })).then(function(i) {
            var n = i.createActivityCount, r = i.joinActivityCount, o = i.waitingSettlementAmount, s = i.nickName, u = void 0 === s ? "立即登录" : s, g = i.userLogoUrl;
            u = e.unicodeNickname(u), g += a, t.setData({
                createActivityCount: n,
                joinActivityCount: r,
                waitingSettlementAmount: o,
                nickName: u,
                userLogoUrl: g
            });
        });
    }
});