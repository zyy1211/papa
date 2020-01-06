function e(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var a = require("../../utils/util.js"), t = getApp(), i = {
    currentPage: 1,
    pages: 1,
    authedUserId: ""
};

Page({
    data: {
        isIpx: !1,
        dataList: [],
        pageType: "allHnRace",
        isLink: !0
    },
    onLoad: function(e) {
        var a = this, i = e.pageType, n = void 0 === i ? "allHnRace" : i, r = "";
        "allHnRace" === n ? r = "赛事" : "myHnRace" === n && (r = "毅行大会"), wx.setNavigationBarTitle({
            title: r
        }), a.setData({
            isIpx: t.globalData.isIpx,
            pageType: n
        }, function() {
            "allHnRace" === n && a.initPageLogin();
        });
    },
    onShow: function() {
        var e = this, a = e.data.pageType;
        "myHnRace" === (void 0 === a ? "myHnRace" : a) && e.initPageLogin();
    },
    onHide: function() {
        this.setData({
            isLink: !0
        });
    },
    onPullDownRefresh: function() {
        this.initPageLogin(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var e = this, a = i.currentPage, t = void 0 === a ? 1 : a, n = i.pages;
        t <= (void 0 === n ? 1 : n) && e.initPageQuery(!0);
    },
    initPageLogin: function(e) {
        var t = this, n = t.data.pageType;
        "allHnRace" === (void 0 === n ? "allHnRace" : n) ? (Object.assign(i, {
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || ""
        }), t.initPageQuery()) : a.initPageLogin(e).then(function(e) {
            Object.assign(i, {
                authedUserId: e
            }), t.initPageQuery();
        });
    },
    initPageQuery: function(e) {
        var t = this, n = t.data, r = (n.dataList, n.pageType), s = void 0 === r ? "" : r, o = i.currentPage, d = void 0 === o ? 1 : o, g = i.authedUserId, c = void 0 === g ? "" : g;
        c = c || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        e || (d = 1);
        var u = {}, l = "", v = "";
        l = "HN_RACE_BASIC_INFO_QUERY", "allHnRace" === s ? v = "INDEX" : "myHnRace" === s && (v = "MINE"), 
        Object.assign(u, {
            authedUserId: c,
            currentPage: d,
            service: l,
            scene: v
        }), a.request("service.json", a.MD5(u)).then(function(a) {
            t.handleData(a, e);
        });
    },
    handleData: function(n, r) {
        var s = this, o = (s.data.dataList, n.paginator), d = void 0 === o ? {} : o, g = n.raceIdAndHeadImageMap, c = void 0 === g ? {} : g, u = n.raceSimpleList, l = void 0 === u ? [] : u, v = (n.provinceAreaCodeAndNameMap, 
        n.cityAreaCodeAndNameMap, d.page), p = void 0 === v ? 1 : v, h = d.pages, I = void 0 === h ? 1 : h;
        l.map(function(e) {
            var i = e.id, n = void 0 === i ? "" : i, r = e.gmtStart, s = void 0 === r ? "" : r, o = e.gmtEnd, d = void 0 === o ? "" : o, g = (e.province, 
            e.city, e.addressDescribe), u = void 0 === g ? "" : g, l = t.globalData.hnRaceDetailUrl + n, v = c[n], p = a.date.getTimeInterval(s, d);
            u = u.slice(6, u.length), Object.assign(e, {
                pageUrl: l,
                homeImgUrl: v,
                timeInterval: p,
                addressDescribe: u
            });
        });
        var f = l;
        s.setData(e({}, "dataList[" + (p - 1) + "]", f)), Object.assign(i, {
            currentPage: ++p,
            pages: I
        });
    }
});