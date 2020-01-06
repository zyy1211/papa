function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t = require("../../utils/util.js"), a = getApp(), i = {
    currentPage: 1,
    pages: 1,
    authedUserId: "",
    isLink: !0,
    pageJoinerIdAndNumMap: {}
};

Page({
    data: {
        isIpx: !1,
        dataList: []
    },
    onLoad: function(e) {
        this.setData({
            isIpx: a.globalData.isIpx
        });
    },
    onShow: function() {
        this.initPageLogin(), i.isLink = !0;
    },
    onPullDownRefresh: function() {
        this.initPageLogin(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var e = this, t = i.currentPage, a = void 0 === t ? 1 : t, n = i.pages;
        a <= (void 0 === n ? 1 : n) && e.initPageQuery(!0);
    },
    initPageLogin: function(e) {
        var t = this, a = i.authedUserId, n = void 0 === a ? "" : a;
        n = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        Object.assign(i, {
            authedUserId: n
        }), t.initPageQuery();
    },
    initPageQuery: function(e) {
        var a = this, n = (a.data.dataList, i.currentPage), r = void 0 === n ? 1 : n, s = (i.pages, 
        i.authedUserId), o = void 0 === s ? "" : s;
        e || (r = 1);
        var d = {}, u = "";
        u = "SPECIAL_RACE_LIST_PAGE_QUERY", Object.assign(d, {
            authedUserId: o,
            currentPage: r,
            service: u
        }), t.request("service.json", t.MD5(d)).then(function(t) {
            a.handleData(t, e);
        });
    },
    handleData: function(n, r) {
        var s = this, o = (s.data.dataList, i.pageJoinerIdAndNumMap), d = void 0 === o ? {} : o, u = n.currentPage, g = void 0 === u ? 1 : u, c = n.pages, v = void 0 === c ? 1 : c, l = n.imageUrlPrex, p = void 0 === l ? "" : l, I = n.list, h = void 0 === I ? [] : I, m = n.joinerIdAndNumMap, P = void 0 === m ? {} : m, f = n.raceTypeIdAndNameMap, L = void 0 === f ? {} : f;
        r || ([], d = {}), Object.assign(d, P), h.map(function(e) {
            var i = e.id, n = void 0 === i ? "" : i, r = e.typeId, s = void 0 === r ? "" : r, o = e.gmtStart, u = void 0 === o ? "" : o, g = e.gmtEnd, c = void 0 === g ? "" : g, v = e.status, l = void 0 === v ? {} : v, I = a.globalData.specialRaceDetailUrl + n, h = p + n, m = t.date.getTimeInterval(u, c), P = d[n] || 0, f = "/static/icon-entering.svg";
            "ENTER_END" === l.name ? f = "/static/icon-wait.svg" : "WORKING" === l.name && (f = "/static/icon-working.svg"), 
            Object.assign(e, {
                pageUrl: I,
                homeImgUrl: h,
                timeInterval: m,
                joinNum: P,
                statusImg: f,
                typeName: L[s]
            });
        });
        var b = h;
        g = g || 1, s.setData(e({}, "dataList[" + (g - 1) + "]", b)), Object.assign(i, {
            currentPage: ++g,
            pages: v
        });
    },
    navigate: function(e) {
        var a = i.isLink;
        void 0 === a || a ? (e.detail.e && (e = e.detail.e), i.isLink = !1, t.requestEmpty(e, i.authedUserId), 
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })) : i.isLink = !0;
    }
});