var t = require("../../utils/util.js"), a = getApp();

Page({
    data: {
        dataList: [],
        currentPage: 1,
        pages: 1,
        authedUserId: "",
        currentTab: 0,
        allData: {}
    },
    navigate: function(a) {
        t.requestEmpty(a), wx.navigateTo({
            url: a.currentTarget.dataset.url
        });
    },
    onLoad: function() {
        var t = this;
        new a.WeToast(), t.setData({
            isIpx: a.globalData.isIpx
        }), t.reGetStorage();
    },
    onPullDownRefresh: function() {
        this.initPageData(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var t = this, a = t.data, e = a.currentTab, r = void 0 === e ? 0 : e, i = a.allData, s = void 0 === i ? {} : i, n = s.activityData, o = void 0 === n ? {} : n, c = s.raceData, d = void 0 === c ? {} : c, u = o.currentPage, g = o.pages;
        1 == r && (u = d.currentPage, g = d.pages), u <= g && t.initPageData(!0);
    },
    reGetStorage: function(t) {
        var a = this;
        wx.showLoading({
            title: "加载中"
        }), a.timer && clearTimeout(a.timer), a.timer = setTimeout(function() {
            a.getStorage(t);
        }, 100);
    },
    getStorage: function(a) {
        var e = this;
        try {
            var r = wx.getStorageSync("userInfo");
            r ? a ? (t.getUserInfo(e.reGetStorage), e.setData({
                authedUserId: ""
            })) : e.setData({
                authedUserId: r.user.userId
            }) : t.getUserInfo(e.reGetStorage);
        } catch (a) {
            t.getUserInfo(e.reGetStorage);
        }
        e.data.authedUserId && "" !== e.data.authedUserId && (clearTimeout(e.timer), e.initPageData());
    },
    initPageData: function(a) {
        var e = this, r = e.data, i = r.allData, s = void 0 === i ? {} : i, n = r.authedUserId, o = r.currentTab, c = void 0 === o ? 0 : o, d = s.activityData, u = void 0 === d ? {} : d, g = s.raceData, v = void 0 === g ? {} : g, l = 1, D = {
            service: "ACTIVITY_I_JOINED_OR_CREATE_PAGE_LIST",
            sortCode: "NORMAL",
            authedUserId: n,
            currentPage: l,
            status: "",
            activeSearchType: "CREATE",
            defindOrderBy: "GMT_CREATE_DESC",
            useByStencil: !0
        };
        if (1 == c && (D.sortCode = "RACE", u = v), a) {
            var h = u.currentPage;
            l = void 0 === h ? 1 : h, D.currentPage = l;
        }
        wx.showLoading({
            title: "加载中"
        }), t.AJAX("service.json", t.MD5(D), function(r) {
            if (r.data) {
                var i = r.data.response;
                i.success ? e.getListData(i, a) : "USER_NOT_LOGIN" === i.error.name ? (e.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), e.reGetStorage(!0)) : e.wetoast.toast({
                    title: t.showErrorResult(i),
                    duration: 1e3
                });
            } else e.wetoast.toast({
                title: r.errMsg,
                duration: 1e3
            });
            wx.hideLoading();
        });
    },
    getListData: function(a, e) {
        var r = this, i = r.data, s = i.dataList, n = i.currentTab, o = void 0 === n ? 0 : n, c = i.allData, d = void 0 === c ? {} : c, u = d.activityData, g = void 0 === u ? {} : u, v = d.raceData, l = void 0 === v ? {} : v, D = a.activeAndJoinerNumMap, h = a.activeList, p = a.currentPage, T = a.pages;
        e || (s = []), h.map(function(a) {
            var e = a.id, r = a.activityLabel, i = void 0 === r ? "" : r, n = a.gmtStart, c = a.gmtEnd, d = void 0 === c ? "" : c, u = D[e], g = i.split(","), v = t.date.getTimeInterval(n, d), l = "../package-activity/activityEvent?fromType=template&id=" + a.id;
            1 === o && (l = "../package-race/raceEvent?fromType=template&id=" + a.id), Object.assign(a, {
                navigateUrl: l,
                activityLabels: g,
                activityTimeInterval: v,
                joinerNum: u
            }), s.push(a);
        }), s = t.uniqueArray(s), 0 === o ? Object.assign(g, {
            currentPage: ++p,
            pages: T
        }) : Object.assign(l, {
            currentPage: ++p,
            pages: T
        }), Object.assign(d, {
            activityData: g,
            raceData: l
        }), r.setData({
            dataList: s,
            allData: d
        });
    },
    swichNav: function(a) {
        t.requestEmpty(a);
        var e = this, r = e.data.currentTab, i = a.target.dataset.current;
        if (r == i) return !1;
        e.setData({
            currentTab: parseInt(i),
            allData: {}
        }), e.initPageData();
    }
});