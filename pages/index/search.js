var t = require("../../utils/util.js"), e = (require("../../config.js"), getApp()), a = {};

Page({
    data: {
        showHistory: !0,
        currentTab: 0,
        tabList: [],
        isLink: !0,
        userList: [],
        fromLogin: !1
    },
    navigate: function(e) {
        var a = this.data.isLink;
        e.detail.e && (e = e.detail.e), a && (this.setData({
            isLink: !1
        }), t.requestEmpty(e), wx.navigateTo({
            url: e.currentTarget.dataset.url
        }));
    },
    onHide: function() {
        this.setData({
            isLink: !0,
            fromLogin: !1
        });
    },
    onPullDownRefresh: function() {
        var t = this, e = t.data, a = e.keyWord, i = void 0 === a ? "" : a, r = e.showHistory, s = void 0 !== r && r;
        "" !== i.trim() && (s || t.initPageData(), t.setData({
            userList: []
        }), wx.stopPullDownRefresh());
    },
    onLoad: function(t) {
        var a = this, i = wx.getStorageSync("historySearch") || [], r = 0;
        switch (t.pageType) {
          case "activity":
            r = 0;
            break;

          case "subject":
            r = 1;
            break;

          case "user":
            r = 2;
        }
        a.setData({
            historyList: i,
            currentTab: r,
            isIpx: e.globalData.isIpx,
            tabList: [ r ]
        }), a.initPageLogin();
    },
    onShow: function() {
        var t = this;
        t.data.fromLogin && (t.setData({
            userList: []
        }), t.initPageLogin(), t.initPageData());
    },
    initPageLogin: function(t) {
        this.setData({
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "",
            dataList: [],
            currentPage: 1,
            pages: 1
        });
    },
    initPageData: function() {
        var t = this, e = t.data.currentTab, a = void 0 === e ? 0 : e;
        switch (t.setData({
            showHistory: !1
        }), parseInt(a)) {
          case 0:
            t.getActivityData();
            break;

          case 1:
            t.getSubjectData();
            break;

          case 2:
            t.getUserList();
        }
    },
    getActivityData: function() {
        var t = this, e = t.data, a = e.authedUserId, i = void 0 === a ? "" : a, r = e.keyWord, s = {
            service: "ACTIVITY_PAGE_QUERY",
            authedUserId: i,
            activityTitle: void 0 === r ? "" : r
        };
        t.selectComponent("#activityCard").initQueryParameter(s);
    },
    getSubjectData: function() {
        var t = this, e = t.data, a = e.authedUserId, i = void 0 === a ? "" : a, r = e.keyWord, s = {
            service: "SEARCH_SUBJECT_LIST",
            authedUserId: i,
            keyword: void 0 === r ? "" : r
        };
        t.selectComponent("#subjectCard").initQueryParameter(s);
    },
    getUserList: function(e) {
        var i = this, r = i.data, s = r.authedUserId, o = void 0 === s ? "" : s, n = r.keyWord, c = void 0 === n ? "" : n, d = a.currentPage, u = void 0 === d ? 1 : d;
        e || (u = 1);
        var h = {};
        Object.assign(h, {
            keyword: c,
            authedUserId: o,
            currentPage: u,
            service: "USER_NICK_NAME_SEARCH"
        }), t.request("service.json", t.MD5(h)).then(function(t) {
            i.handleData(t, e);
        });
    },
    handleData: function(t, i) {
        var r = this, s = r.data, o = s.userList, n = void 0 === o ? [] : o, c = s.authedUserId, d = void 0 === c ? "" : c, u = t.userLogoUrl, h = void 0 === u ? "" : u, g = t.pages, v = t.currentPage, y = t.list, l = void 0 === y ? [] : y;
        i || (n = []), l.map(function(t) {
            var a = t.userId, i = void 0 === a ? "" : a, r = t.nickName, s = void 0 === r ? "" : r, o = t.subscribeMe, c = void 0 !== o && o, u = t.beSubscribeByMySelf, g = void 0 === u || u, v = {};
            Object.assign(v, {
                homePageUrl: "" + e.globalData.userHomePageUrl + i,
                userLogoUrl: "" + h + i,
                createUserName: s,
                createUserId: i,
                userSex: "",
                time: "",
                contactName: "",
                showAttentionButton: i !== d,
                follwed: g,
                beFollowed: c
            }), n.push(v);
        }), ++v, Object.assign(a, {
            currentPage: v,
            pages: g
        }), r.setData({
            userList: n
        });
    },
    onReachBottom: function() {
        var t = this, e = t.data.currentTab, i = void 0 === e ? 0 : e;
        switch (parseInt(i)) {
          case 0:
            t.selectComponent("#activityCard").onReachBottom();
            break;

          case 1:
            t.selectComponent("#subjectCard").onReachBottom();
            break;

          case 2:
            var r = a.currentPage, s = void 0 === r ? 1 : r, o = a.pages;
            s <= (void 0 === o ? 1 : o) && t.getUserList(!0);
        }
    },
    swichNav: function(t) {
        var e = this, a = e.data, i = a.currentTab, r = void 0 === i ? 0 : i, s = a.tabList, o = void 0 === s ? [] : s, n = a.keyWord, c = void 0 === n ? "" : n, d = t.currentTarget.dataset.current;
        if (d = parseInt(d), r === d) return !1;
        e.setData({
            currentTab: d
        }), -1 === o.indexOf(d) && ("" !== c.trim() && e.initPageData(), o.push(d), e.setData({
            tabList: o
        }));
    },
    deleteSearchInput: function() {
        this.setData({
            showHistory: !0,
            keyWord: "",
            showDelete: !1
        });
    },
    bindActivityInput: function(t) {
        var e = t.detail.value || "", a = !0;
        "" === e.trim() && (a = !1), this.setData({
            keyWord: e,
            showDelete: a
        });
    },
    bindDeleteHistory: function(e) {
        t.requestEmpty(e);
        var a = this;
        wx.setStorage({
            key: "historySearch",
            data: []
        }), a.setData({
            historyList: []
        });
    },
    bindSearchHistory: function(e) {
        t.requestEmpty(e);
        var a = this, i = (a.data.currentTab, e.currentTarget.dataset.data), r = wx.getStorageSync("historySearch") || [];
        r.indexOf(i) > -1 && r.splice(r.indexOf(i), 1), r.unshift(i), wx.setStorage({
            key: "historySearch",
            data: r
        }), a.setData({
            historyList: r,
            keyWord: i,
            showDelete: !0
        }), a.initPageData();
    },
    bindSearch: function(e) {
        var a = this, i = a.data, r = i.showDelete;
        i.currentTab;
        if (e.detail.formId && t.requestEmpty(e), !r) return !1;
        var s = a.data.keyWord, o = void 0 === s ? "" : s, n = wx.getStorageSync("historySearch") || [];
        "" === o && (o = "羽毛球"), n.indexOf(o) > -1 && n.splice(n.indexOf(o), 1), n.length > 8 && n.splice(n.length - 1, 1), 
        n.unshift(o), wx.setStorage({
            key: "historySearch",
            data: n
        }), a.setData({
            historyList: n,
            keyWord: o
        }), a.initPageData();
    },
    bindInputFocus: function() {
        this.setData({
            showHistory: !0
        });
    }
});