function e(e, t, i) {
    return t in e ? Object.defineProperty(e, t, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = i, e;
}

var t = require("../utils/util.js"), i = getApp(), a = {
    gmtCreateEnd: "",
    currentPage: 1,
    pages: 1
};

Component({
    properties: {
        noData: {
            type: String,
            value: "暂无数据！"
        }
    },
    data: {
        windowWRPX: 375,
        screenWidth: wx.getSystemInfoSync().screenWidth,
        leftDataList: [],
        rightDataList: [],
        leftDataIds: [],
        rightDataIds: [],
        leftHeight: 0,
        rightHeight: 0,
        imageHeight: 330,
        likeType: "subject"
    },
    methods: {
        initQueryParameter: function(e) {
            this.setData({
                options: e
            }), a.gmtCreateEnd = t.date.formatTime(new Date()), this.initQuery();
        },
        initQuery: function(e) {
            var i = this, r = i.data, s = r.options, n = void 0 === s ? {} : s, o = r.likeType, g = void 0 === o ? "" : o, d = a.gmtCreateEnd, c = void 0 === d ? "" : d, l = a.currentPage, u = void 0 === l ? 1 : l;
            a.pages;
            "{}" !== JSON.stringify(n) && (n.sign && delete n.sign, n.type && "discovery" === n.type || "discovery" === g ? (g = "discovery", 
            delete n.type, e ? (Object.assign(n, {
                gmtCreateEnd: c,
                currentPage: u
            }), t.request("service.json", t.MD5(n), "get", !0).then(function(t) {
                i.getListData(t, e, "discovery");
            })) : (wx.showLoading({
                title: "加载中"
            }), u = 1, Object.assign(n, {
                gmtCreateEnd: c,
                currentPage: u
            }), t.request("service.json", t.MD5(n)).then(function(t) {
                i.getListData(t, e, "discovery");
            }))) : (e || (u = 1), n.currentPage = u, wx.showLoading({
                title: "加载中"
            }), t.request("service.json", t.MD5(n)).then(function(t) {
                wx.hideLoading(), i.getListData(t, e, "homePage");
            })), i.setData({
                options: n,
                likeType: g
            }));
        },
        getListData: function(t, r, s) {
            var n, o = this, g = o.data, d = (g.leftDataList, g.rightDataList, g.leftDataIds), c = void 0 === d ? [] : d, l = g.rightDataIds, u = void 0 === l ? [] : l, h = g.leftHeight, v = void 0 === h ? 0 : h, f = g.rightHeight, p = void 0 === f ? 0 : f, m = g.imageHeight, D = t.myLikeSubjectIds, y = void 0 === D ? [] : D, b = t.likeSubjectIds, L = void 0 === b ? [] : b, w = t.list, x = void 0 === w ? [] : w, P = t.userLogoUrl, S = void 0 === P ? "" : P, j = t.currentPage, T = void 0 === j ? 1 : j, C = t.pages, I = void 0 === C ? 1 : C;
            r || ([], [], c = [], u = [], v = 0, p = 0);
            var O = [], k = [];
            x.map(function(e) {
                var t = e.id, a = e.imageSizeRate, r = void 0 === a ? "1:1" : a, s = e.createUserId, n = void 0 === s ? "" : s, g = e.content, d = void 0 === g ? "" : g, l = e.status, h = m, f = 0, D = "DELETED" === (void 0 === l ? {} : l).name;
                switch (Object.assign(e, {
                    isDelete: D,
                    isLike: -1 !== y.indexOf(t) || -1 !== L.indexOf(t),
                    userLogoUrl: S + n,
                    navigateUrl: "" + i.globalData.subjectDetailUrl + t,
                    homePageUrl: "" + i.globalData.userHomePageUrl + n
                }), r) {
                  case "3:4":
                    h = m * (4 / 3);
                    break;

                  case "1:1":
                    h = m;
                    break;

                  case "4:3":
                    h = .75 * m;
                }
                var b = wx.createCanvasContext("textCanvas");
                if (b.measureText) {
                    b.font = "normal bold 13px Arial", b.setFontSize(13);
                    var w = b.measureText && b.measureText(d).width;
                    0 === w ? f = 20 : w > 0 && w < 172 ? f = 60 : w > 172 && (f = 100);
                } else {
                    var x = o.getStrLength(d);
                    0 === x ? f = 20 : x > 0 && x < 27 ? f = 60 : x > 27 && (f = 100);
                }
                v <= p ? -1 === c.indexOf(t) && (v += o.getScaleNumber(h + f + 40 + 40), O.push(e), 
                c.push(t)) : -1 === u.indexOf(t) && (p += o.getScaleNumber(h + f + 40 + 40), k.push(e), 
                u.push(t)), e.height = h;
            }), o.setData((n = {}, e(n, "leftDataList[" + (T - 1) + "]", O), e(n, "rightDataList[" + (T - 1) + "]", k), 
            e(n, "leftDataIds", c), e(n, "rightDataIds", u), e(n, "leftHeight", v), e(n, "rightHeight", p), 
            e(n, "empty", 0 === O.length && 0 === k.length), n)), Object.assign(a, {
                currentPage: ++T,
                pages: I
            }), "discovery" === s && wx.pageScrollTo({
                scrollTop: 0
            });
        },
        getScaleNumber: function(e) {
            var t = this.data, i = t.windowWRPX;
            return e * t.screenWidth / i / 2;
        },
        onReachBottom: function() {
            var e = this, t = a.currentPage, i = void 0 === t ? 1 : t, r = a.pages, s = void 0 === r ? 1 : r, n = e.data.likeType, o = void 0 === n ? "discovery" : n;
            i <= s ? e.initQuery(!0) : "discovery" === o && wx.pageScrollTo({
                scrollTop: 0
            });
        },
        getStrLength: function(e, t) {
            for (var i = e.length, a = 0, r = 0; r < i; r++) e.charCodeAt(r) < 27 || e.charCodeAt(r) > 126 ? a += 2 : a++;
            return a;
        },
        navigate: function(e) {
            var t = {
                e: e
            };
            this.triggerEvent("navigate", t);
        }
    }
});