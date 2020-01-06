var t = require("../../utils/util.js"), e = getApp(), a = {};

Page({
    data: {
        helpModalHidden: !0,
        singleModel: "SINGLE",
        doubleModel: "DOUBLE",
        fightModel: "DOUBLE",
        singleModelPoint: "-",
        doubleModelPoint: "-"
    },
    onLoad: function(t) {
        var a = this;
        new e.WeToast(), a.setData({
            userId: t.id || "",
            isIpx: e.globalData.isIpx
        }), a.initPageLogin();
    },
    navigate: function(e) {
        t.requestEmpty(e), wx.navigateTo({
            url: e.currentTarget.dataset.url
        });
    },
    showHelpModal: function(e) {
        t.requestEmpty(e), this.setData({
            helpModalHidden: !1
        });
    },
    closeHelpModal: function() {
        this.setData({
            helpModalHidden: !0
        });
    },
    initPageLogin: function(e) {
        var i = this;
        t.initPageLogin(e).then(function(t) {
            wx.showLoading({
                title: "加载中"
            }), a.authedUserId = t, i.getListData();
        });
    },
    getListData: function(e) {
        var i = this, n = a.authedUserId, s = void 0 === n ? "" : n, o = a.currentPage, d = void 0 === o ? 1 : o, r = i.data, g = r.userId, u = void 0 === g ? "" : g, l = r.dataList, c = r.fightModel;
        wx.showLoading({
            title: "加载中"
        }), e || (d = 1, l = []), t.request("service.json", t.MD5({
            service: "USER_POINT_RACE_QUERY",
            fightModel: c,
            authedUserId: s,
            userId: u,
            currentPage: d
        })).then(function(t) {
            var e = t.raceList, n = void 0 === e ? [] : e, s = t.myPoint, o = void 0 === s ? "-" : s, d = t.myRank, r = void 0 === d ? "-" : d, g = t.raceIdAndChangePoint, u = void 0 === g ? {} : g, c = t.currentPage, h = t.pages;
            n.map(function(t) {
                var e = u[t.id], a = e.indexOf("+") > -1;
                Object.assign(t, {
                    point: e,
                    isAdd: a
                }), l.push(t);
            }), i.setData({
                dataList: l,
                myPoint: o,
                myRank: r
            }), Object.assign(a, {
                currentPage: ++c,
                pages: h
            });
        });
    },
    onReachBottom: function() {
        this.getMoreListData();
    },
    getMoreListData: function() {
        var t = this;
        a.currentPage <= a.pages && t.getListData(!0);
    },
    switchNav: function(e) {
        t.requestEmpty(e), this.setData({
            fightModel: e.currentTarget.dataset.service
        }), this.getListData();
    }
});