var e = require("../../utils/util.js"), t = getApp(), a = {};

Page({
    data: {
        isIpx: !1,
        pageType: "attention",
        authedUserId: "",
        userId: "",
        isLink: !0,
        dataList: []
    },
    onLoad: function(e) {
        var a = this, i = e.pageType, s = void 0 === i ? "attention" : i, n = e.userId, o = void 0 === n ? "" : n, r = e.pageUser, d = void 0 === r ? "" : r, u = "", g = "";
        "attention" === s ? g = "关注" : "fans" === s && (g = "粉丝"), u = "mine" === d ? "我的" : "TA的", 
        wx.setNavigationBarTitle({
            title: "" + u + g
        }), a.setData({
            pageType: s,
            userId: o,
            isIpx: t.globalData.isIpx
        }), a.initPageLogin();
    },
    onHide: function() {
        this.setData({
            isLink: !0
        });
    },
    onPullDownRefresh: function() {
        var e = this;
        e.setData({
            dataList: []
        }), e.initPageLogin(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var e = this, t = a.currentPage, i = void 0 === t ? 1 : t, s = a.pages;
        i <= (void 0 === s ? 1 : s) && e.initPageQuery(!0);
    },
    initPageLogin: function(t) {
        var a = this, i = a.data;
        i.userId, i.pageType, i.authedUserId;
        e.initPageLogin(t).then(function(e) {
            a.setData({
                authedUserId: e
            }), a.initPageQuery();
        });
    },
    initPageQuery: function(t) {
        var i = this, s = i.data, n = s.userId, o = void 0 === n ? "" : n, r = s.authedUserId, d = void 0 === r ? "" : r, u = s.pageType, g = void 0 === u ? "attention" : u, c = (s.dataList, 
        a.currentPage), v = void 0 === c ? 1 : c;
        t || (v = 1);
        var h = {}, l = "";
        l = "attention" === g ? "USER_SUBSCIBE_LIST_QUERY" : "USER_FANS_LIST_QUERY", Object.assign(h, {
            userId: o,
            authedUserId: d,
            currentPage: v,
            service: l
        }), e.request("service.json", e.MD5(h)).then(function(e) {
            i.handleData(e, t);
        });
    },
    handleData: function(e, i) {
        var s = this, n = s.data, o = n.dataList, r = void 0 === o ? [] : o, d = n.authedUserId, u = e.userLogoUrl, g = void 0 === u ? "" : u, c = e.pages, v = e.currentPage, h = e.list, l = void 0 === h ? [] : h;
        i || (r = []), l.map(function(e) {
            var a = e.userId, i = void 0 === a ? "" : a, n = e.nickName, o = void 0 === n ? "" : n, u = e.subscribeMe, c = void 0 !== u && u, v = e.beSubscribeByMySelf, h = void 0 === v || v, l = {};
            Object.assign(l, {
                homePageUrl: "" + t.globalData.userHomePageUrl + i,
                userLogoUrl: "" + g + i,
                createUserName: o,
                createUserId: i,
                userSex: "",
                time: "",
                contactName: "",
                showAttentionButton: !0,
                follwed: h,
                beFollowed: c
            }), s.data.userId === d ? i !== s.data.userId && r.push(l) : (i === d && (l.showAttentionButton = !1), 
            r.push(l));
        }), ++v, Object.assign(a, {
            currentPage: v,
            pages: c
        }), s.setData({
            dataList: r
        });
    }
});