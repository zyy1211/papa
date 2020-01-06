var t = require("../../utils/util.js"), e = getApp(), a = {};

Page({
    data: {
        commentList: [],
        isLink: !0,
        userInfo: {},
        currentTab: 0,
        attentionBtnText: "关注",
        modalHidden: !0
    },
    navigate: function(e) {
        var a = this.data.isLink;
        e.detail.e && (e = e.detail.e), a && (this.setData({
            isLink: !1
        }), wx.navigateTo({
            url: e.currentTarget.dataset.url
        }), e.detail.value && t.requestEmpty(e));
    },
    onHide: function() {
        this.setData({
            isLink: !0
        });
    },
    onShow: function() {
        a.getTab1 = !0, a.getTab2 = !0, this.initPageLogin();
    },
    onLoad: function(t) {
        var a = this;
        a.setData({
            userId: t.userId || "",
            isIpx: e.globalData.isIpx
        }), a.initPageLogin();
    },
    initPageLogin: function(e) {
        var a = this;
        t.initPageLogin(e).then(function(t) {
            a.setData({
                authedUserId: t
            }), a.initPageQuery(), a.initPageData();
        });
    },
    initPageQuery: function() {
        var e = this, a = e.data.authedUserId, i = void 0 === a ? "" : a, n = e.data, s = n.userId, o = void 0 === s ? "" : s, r = n.attentionBtnText, d = void 0 === r ? "" : r;
        wx.showLoading({
            title: "加载中"
        }), t.request("service.json", t.MD5({
            service: "USER_HOME_PAGE_DATA_QUERY",
            authedUserId: i,
            userId: o
        })).then(function(t) {
            var a = t.province, n = void 0 === a ? "" : a, s = t.city, r = void 0 === s ? "" : s, u = (t.sex, 
            t.registerDay, t.userJoinActivityCount), c = void 0 === u ? 0 : u, v = t.follow, h = void 0 !== v && v, g = t.beFollowed, l = void 0 !== g && g, I = (t.subscribeCount, 
            t.fansCount, {}), b = "", f = "", m = "";
            n && r && (b = "" + n + r + " "), b += "参加活动" + c + "场";
            var p = "";
            f = "/pages/package-my/attentionList?pageType=attention&&userId=" + o + "&&pageUser=" + (p = i === o ? "mine" : "others"), 
            m = "/pages/package-my/attentionList?pageType=fans&&userId=" + o + "&&pageUser=" + p, 
            Object.assign(I, t, {
                memo: b,
                attentionListUrl: f,
                fansListUrl: m
            }), d = h ? l ? "互相关注" : "已关注" : "关注", e.setData({
                userInfo: I,
                attentionBtnText: d
            });
        });
    },
    onPullDownRefresh: function() {
        this.initPageLogin(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var t = this, e = t.data.currentTab, a = void 0 === e ? 0 : e;
        switch (parseInt(a)) {
          case 0:
            t.selectComponent("#activityCard").onReachBottom();
            break;

          case 1:
            t.selectComponent("#subjectCard").onReachBottom();
            break;

          case 2:
            t.selectComponent("#likeSubjectCard").onReachBottom();
        }
    },
    swichNav: function(t) {
        var e = a.getTab1, i = void 0 === e || e, n = a.getTab2, s = void 0 === n || n, o = this, r = o.data.currentTab, d = t.currentTarget.dataset.current;
        if (d = parseInt(d), r !== d) {
            switch (d) {
              case 0:
                break;

              case 1:
                i && (o.getSubjectData(), a.getTab1 = !1);
                break;

              case 2:
                s && (o.getLikeSubjectData(), a.getTab2 = !1);
            }
            o.setData({
                currentTab: d
            });
        }
    },
    initPageData: function() {
        var t = this, e = t.data.currentTab;
        switch (parseInt(e)) {
          case 0:
            t.getActivityData();
            break;

          case 1:
            t.getSubjectData();
            break;

          case 2:
            t.getLikeSubjectData();
        }
    },
    showHelpToast: function() {
        t.showToast("列表展示为所有公开的活动");
    },
    getActivityData: function() {
        var t = this, e = t.data, a = e.authedUserId, i = void 0 === a ? "" : a, n = e.userId, s = {
            service: "USER_CREATE_ACTIVITY_LIST_PAGE_QUERY",
            authedUserId: i,
            userId: void 0 === n ? "" : n
        };
        t.selectComponent("#activityCard").initQueryParameter(s);
    },
    getSubjectData: function() {
        var t = this, e = t.data, a = e.authedUserId, i = void 0 === a ? "" : a, n = e.userId, s = {
            service: "USER_SUBJECT_LIST_QUERY",
            authedUserId: i,
            userId: void 0 === n ? "" : n
        };
        t.selectComponent("#subjectCard").initQueryParameter(s);
    },
    getLikeSubjectData: function() {
        var t = this, e = t.data, a = e.authedUserId, i = void 0 === a ? "" : a, n = e.userId, s = {
            service: "USER_LIKE_OBJECT_LIST_QUERY",
            authedUserId: i,
            userId: void 0 === n ? "" : n
        };
        t.selectComponent("#likeSubjectCard").initQueryParameter(s);
    },
    previewImage: function() {
        var t = this.data.userInfo, e = void 0 === t ? {} : t;
        e.userLogoUrl && wx.previewImage({
            urls: [ e.userLogoUrl ]
        });
    },
    openClub: function() {
        t.downloadApp.openClub();
    },
    changeAttention: function() {
        var e = this, a = e.data, i = a.authedUserId, n = void 0 === i ? "" : i, s = a.userId, o = void 0 === s ? "" : s, r = a.attentionBtnText, d = void 0 === r ? "" : r, u = (a.modalHidden, 
        {});
        "关注" === d ? (Object.assign(u, {
            service: "SUBSCRIBE",
            subscribeId: o,
            authedUserId: n
        }), t.request("service.json", t.MD5(u)).then(function(t) {
            e.handleData(t, "attention");
        })) : e.setData({
            modalHidden: !1
        });
    },
    handleData: function(e, a) {
        var i = this, n = i.data, s = n.attentionBtnText, o = void 0 === s ? "" : s, r = n.userInfo, d = void 0 === r ? {} : r, u = d.fansCount, c = void 0 === u ? "0" : u;
        if ("attention" === a) {
            var v = e.subscribeEachOther;
            o = void 0 !== v && v ? "互相关注" : "已关注", t.math.isNumber(c) && (c = parseInt(c) + 1);
        } else "cancelAttention" === a && (o = "关注", t.math.isNumber(c) && (c = parseInt(c) - 1));
        Object.assign(d, {
            fansCount: c
        }), i.setData({
            attentionBtnText: o,
            userInfo: d
        });
    },
    submitModal: function() {
        var e = this, a = e.data, i = a.authedUserId, n = void 0 === i ? "" : i, s = a.userId, o = void 0 === s ? "" : s, r = (a.attentionBtnText, 
        a.modalHidden, {});
        Object.assign(r, {
            service: "CANCEL_SUBSCRIBE",
            subscribeId: o,
            authedUserId: n
        }), t.request("service.json", t.MD5(r)).then(function(t) {
            e.setData({
                modalHidden: !0
            }), e.handleData(t, "cancelAttention");
        });
    },
    hideModal: function() {
        var t = this;
        t.data.modalHidden;
        t.setData({
            modalHidden: !0
        });
    }
});