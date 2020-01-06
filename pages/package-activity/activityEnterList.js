var e = require("../../utils/util.js"), t = getApp(), a = {
    currentPage: 1,
    pages: 1,
    joinerList: []
};

Page({
    data: {
        joinerBaseList: [],
        joinerBaseList1: [],
        cancelEnterCount: 0,
        enterCount: 0,
        queueCount: 0,
        currentTab: 3,
        isLink: !0,
        modalHidden: !0,
        callPhone: "",
        fromLogin: !1
    },
    onPullDownRefresh: function() {
        this.initPage(), wx.stopPullDownRefresh();
    },
    navigate: function(t) {
        var a = this;
        a.data.isLink && e.initPageLogin().then(function(n) {
            a.setData({
                authedUserId: n,
                isLink: !1
            }), t.detail.e && (t = t.detail.e), e.requestEmpty(t), wx.navigateTo({
                url: t.currentTarget.dataset.url
            });
        });
    },
    onHide: function() {
        this.setData({
            isLink: !0,
            fromLogin: !1
        });
    },
    onLoad: function(e) {
        var a = this, n = 0;
        e.form || (n = 1), new t.WeToast(), a.setData({
            id: e.id,
            isIpx: t.globalData.isIpx,
            currentTab: n,
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || ""
        }), a.initPage();
    },
    onShow: function() {
        var e = this;
        e.data.fromLogin && (e.setData({
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || ""
        }), e.initPage());
    },
    initPage: function() {
        var n = this, i = n.data, o = i.id, s = i.authedUserId, r = i.currentTab, u = void 0 === r ? 0 : r;
        s = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        e.request("service.json", e.MD5({
            service: "ACTIVITY_ENTER_LIST_DETAIL_VIEW",
            activityId: o,
            authedUserId: s
        })).then(function(i) {
            var o = i.userIdAndWeiXinNameMap, s = void 0 === o ? {} : o, r = i.baseIdAndUserTypeAndNumMap, d = i.userIdAndJoinCountMap, c = void 0 === d ? {} : d, l = i.userIdAndCancelCountMap, g = void 0 === l ? {} : l, h = i.joinSameActiveUserIds, m = void 0 === h ? [] : h, f = i.queueList, v = i.joinerBaseList, I = (i.activeInfo, 
            i.cancelEnterCount), p = i.enterCount, x = i.queueCount, w = i.userLogoUrl, L = [], C = [];
            i.creator ? n.setData({
                currentTab: 0
            }) : n.setData({
                currentTab: 1
            }), v.map(function(a) {
                var n = a.id, i = a.userId, o = a.fixName, u = void 0 === o ? "" : o, d = a.fixSex, l = a.enabled, h = a.gmtCreate, f = a.gmtModified, v = w + i, I = e.unicodeNickname(s[i] || ""), p = d.name || "", x = c[i] || 0, b = g[i] || 0, D = void 0, P = void 0, S = void 0, U = void 0, j = r[n];
                u = e.unicodeNickname(u), h = h.replace(new RegExp("-", "gm"), "/").substring(0, 16), 
                f = f.replace(new RegExp("-", "gm"), "/").substring(5, 16), j && (D = j.M || 0, 
                P = j.W || 0, S = D && P, U = D || P), Object.assign(a, {
                    imageUrl: v,
                    weixinName: I,
                    fixName: u,
                    sex: p,
                    joinCount: x,
                    cancelCount: b,
                    withMan: D,
                    withWoman: P,
                    withBoth: S,
                    withOther: U,
                    isCancel: !l,
                    gmtCreate: h,
                    gmtModified: f,
                    same: m.indexOf(i) > -1,
                    homePageUrl: "" + t.globalData.userHomePageUrl + i
                }), l && C.push(a), L.push(a);
            }), f.map(function(a) {
                a.id;
                var n = a.userId, i = a.fixName, o = void 0 === i ? "" : i, r = a.fixSex, u = a.gmtCreate, d = w + n, l = e.unicodeNickname(s[n] || ""), h = r.name || "", f = c[n] || 0, v = g[n] || 0;
                o = e.unicodeNickname(o), u = u.replace(new RegExp("-", "gm"), "/").substring(0, 16), 
                Object.assign(a, {
                    imageUrl: d,
                    weixinName: l,
                    fixName: o,
                    sex: h,
                    joinCount: f,
                    gmtCreate: u,
                    cancelCount: v,
                    queue: "排队中",
                    same: m.indexOf(n) > -1,
                    homePageUrl: "" + t.globalData.userHomePageUrl + n
                }), L.push(a);
            }), n.setData({
                cancelEnterCount: I,
                enterCount: p,
                queueCount: x,
                nodata: 0 === L.length
            }), a.pages = Math.ceil(L / 20), a.joinerList = L, 1 === parseInt(u) ? n.setData({
                joinerBaseList1: L.slice(0, 20),
                nodata: 0 === C.length
            }) : n.setData({
                joinerBaseList: L.slice(0, 20)
            });
        });
    },
    onReachBottom: function() {
        var e = this, t = e.data, n = (t.joinerBaseList, t.currentTab), i = void 0 === n ? 0 : n, o = a.currentPage, s = void 0 === o ? 1 : o, r = a.pages, u = void 0 === r ? 1 : r, d = a.joinerList, c = void 0 === d ? [] : d;
        s > u || c.length < 20 || (a.currentPage = s + 1, 1 === parseInt(i) ? e.setData({
            joinerBaseList1: c.slice(0, 20 * (s + 1))
        }) : e.setData({
            joinerBaseList: c.slice(0, 20 * (s + 1))
        }));
    },
    bindExcelList: function() {
        var t = this, a = t.data, n = a.disabledSubmit, i = a.id, o = a.authedUserId;
        n || (t.setData({
            disabledSubmit: !0
        }), e.request("service.json", e.MD5({
            service: "GET_JOINER_FILE_URL",
            activeId: i,
            authedUserId: o
        })).then(function(e) {
            wx.showModal({
                title: "点击确定复制地址到浏览器里打开下载表格",
                content: e.applicationListDowloadUrl,
                showCancel: !1,
                confirmText: "确定",
                confirmColor: "#00CD91",
                success: function(t) {
                    t.confirm ? wx.setClipboardData ? wx.setClipboardData({
                        data: e.applicationListDowloadUrl,
                        success: function(e) {}
                    }) : wx.showModal({
                        title: "提示",
                        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
                    }) : t.cancel;
                }
            }), t.setData({
                disabledSubmit: !1
            });
        }));
    },
    bindCallPhone: function(t) {
        var a = this;
        e.initPageLogin().then(function(e) {
            a.setData({
                authedUserId: e,
                modalHidden: !1,
                callPhone: t.currentTarget.dataset.phone
            });
        });
    },
    hideModal: function() {
        this.setData({
            modalHidden: !0,
            callPhone: ""
        });
    },
    submitModal: function() {
        var e = this.data.callPhone, t = void 0 === e ? "" : e;
        wx.makePhoneCall({
            phoneNumber: t + ""
        });
    }
});