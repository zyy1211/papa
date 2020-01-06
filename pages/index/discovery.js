function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t = require("../../utils/util.js"), a = getApp(), i = {
    attentionPage: {},
    tap: 0,
    gmtCreateEnd: ""
};

Page({
    data: {
        currentTab: 1,
        attentionList: [],
        isFirstAttention: !0,
        hasNewAttention: !1,
        isLink: !0,
        imageHeight: 670,
        fromLogin: !1
    },
    onLoad: function(e) {
        this.initPageLogin();
    },
    onShow: function() {
        i.tap = 0;
        var e = this, a = e.data, r = a.fromLogin, n = (a.currentTab, a.authedUserId), o = void 0 === n ? "" : n;
        r && (e.initPageLogin(), o = o || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
        t.request("service.json", t.MD5({
            service: "USER_OPERATION_PERMISSION_QUERY",
            authedUserId: o
        })).then(function(e) {
            var t = e.allowCreateRace, a = void 0 === t || t, i = e.blackUser, r = void 0 !== i && i, n = e.hideSubjectCreate, o = wx.getStorageSync("userInfo") || {};
            o.inWhiteList = !r || !1, o.allowCreateRace = a || !1;
            var s = {
                inWhiteList: !r || !1,
                allowCreateRace: a || !1,
                hideSubjectCreate: n
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
        var e = this, t = e.data, a = t.currentTab, i = void 0 === a ? 1 : a, r = t.authedUserId, n = void 0 === r ? "" : r;
        if (n = n || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        1 === i) {
            e.newSubjectCard = e.selectComponent("#newSubjectCard");
            var o = {
                service: "NEWEST_SUBJECT_LIST_QUERY",
                authedUserId: n,
                type: "discovery"
            };
            e.newSubjectCard.initQueryParameter(o);
        } else 0 === i && e.initPageLogin();
        wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var e = this, t = i.attentionPage, a = void 0 === t ? {} : t, r = e.data.currentTab, n = void 0 === r ? 1 : r;
        1 === n ? (e.newSubjectCard = e.selectComponent("#newSubjectCard"), e.newSubjectCard.onReachBottom()) : 0 === n && (a.currentAttentionPage <= a.pages ? e.initPageQuery(!0) : wx.pageScrollTo({
            scrollTop: 0
        }));
    },
    onTabItemTap: function(e) {
        var a = this, r = a.data, n = r.currentTab, o = void 0 === n ? 1 : n, s = r.authedUserId, d = void 0 === s ? "" : s, c = i.tap;
        if (d = d || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        0 === c && d) t.request("service.json", t.MD5({
            service: "SUBSCRIBE_SUBJECT_LIST_INIT_QUERY",
            authedUserId: d
        })).then(function(e) {
            var t = e.unReadCount;
            (void 0 === t ? 0 : t) > 0 && a.setData({
                hasNewAttention: !0
            });
        }); else if (1 === c) if (1 === o) {
            a.newSubjectCard = a.selectComponent("#newSubjectCard"), a.newSubjectCard.setData({
                leftDataList: [],
                rightDataList: [],
                leftDataIds: [],
                rightDataIds: [],
                leftHeight: 0,
                rightHeight: 0
            });
            var u = {
                service: "NEWEST_SUBJECT_LIST_QUERY",
                authedUserId: d,
                type: "discovery"
            };
            a.newSubjectCard.initQueryParameter(u);
        } else 0 === o && (a.setData({
            attentionList: []
        }), wx.startPullDownRefresh(), a.initPageLogin());
        i.tap = 1;
    },
    navigate: function(e) {
        this.data.isLink && (e.detail.e && (e = e.detail.e), this.setData({
            isLink: !1
        }), t.requestEmpty(e), wx.navigateTo({
            url: e.currentTarget.dataset.url
        }));
    },
    initPageLogin: function(e) {
        var a = this, r = a.data, n = r.currentTab, o = void 0 === n ? 1 : n, s = r.authedUserId, d = void 0 === s ? "" : s;
        if (0 === o) t.initPageLogin(e).then(function(e) {
            a.setData({
                authedUserId: e
            }), i.gmtCreateEnd = t.date.formatTime(new Date()), a.initPageQuery();
        }); else if (1 === o) {
            d = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
            a.newSubjectCard = a.selectComponent("#newSubjectCard");
            var c = {
                service: "NEWEST_SUBJECT_LIST_QUERY",
                authedUserId: d,
                type: "discovery"
            };
            a.newSubjectCard.initQueryParameter(c);
        }
    },
    initPageQuery: function(e) {
        var a = this, r = a.data.authedUserId, n = void 0 === r ? "" : r, o = i.gmtCreateEnd, s = void 0 === o ? "" : o, d = i.attentionPage, c = (void 0 === d ? {} : d).currentAttentionPage, u = void 0 === c ? 1 : c;
        n = n || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        e ? t.request("service.json", t.MD5({
            service: "SUBSCRIBE_SUBJECT_LIST_QUERY",
            authedUserId: n,
            gmtCreateEnd: s,
            currentPage: u
        }), "get", !0).then(function(t) {
            a.getListData(t, e);
        }) : (wx.showLoading({
            title: "加载中"
        }), u = 1, t.request("service.json", t.MD5({
            service: "SUBSCRIBE_SUBJECT_LIST_QUERY",
            authedUserId: n,
            gmtCreateEnd: s,
            currentPage: u
        })).then(function(t) {
            a.getListData(t, e);
        }));
    },
    getListData: function(r, n) {
        var o, s = this, d = s.data, c = (d.currentTab, d.attentionList, d.isFirstAttention, 
        d.hasNewAttention, d.imageHeight), u = r.myLikeSubjectIds, g = void 0 === u ? [] : u, l = r.list, v = void 0 === l ? [] : l, I = r.userLogoUrl, S = void 0 === I ? "" : I, h = r.currentPage, b = r.pages, f = r.activityImageUrl, w = void 0 === f ? "" : f, m = r.activityIdAndGmtEnd, U = void 0 === m ? {} : m, L = r.activityIdAndGmtStart, T = void 0 === L ? {} : L, y = r.activityIdAndTitle, C = void 0 === y ? {} : y, j = r.activityIdAndTypeBgColor, D = void 0 === j ? {} : j, P = r.activityIdAndTypeName, p = void 0 === P ? {} : P, E = r.activityIdAndSort, A = void 0 === E ? {} : E, R = i.attentionPage, _ = void 0 === R ? {} : R, x = c, N = [];
        v.map(function(e) {
            var i = e.id, r = e.createUserId, n = void 0 === r ? "" : r, o = e.imageSizeRate, s = void 0 === o ? "1:1" : o, d = e.imageUrlList, u = void 0 === d ? [] : d, l = e.createUserName, v = e.gmtCreate, I = void 0 === v ? "" : v, h = e.objectId, b = void 0 === h ? "" : h, f = e.objectType, m = void 0 === f ? "" : f, L = [], y = {}, j = 0, P = "";
            if (P = t.date.getFormatGmt(I), Object.assign(y, {
                homePageUrl: "" + a.globalData.userHomePageUrl + n,
                userLogoUrl: "" + S + n,
                createUserName: l,
                createUserId: n,
                userSex: "",
                time: P,
                contactName: "",
                showAttentionButton: !1,
                follwed: !0,
                beFollowed: !1
            }), "NORMAL" === m) {
                switch (s) {
                  case "3:4":
                    x = c * (4 / 3);
                    break;

                  case "1:1":
                    x = c;
                    break;

                  case "4:3":
                    x = .75 * c;
                }
                u.length > 3 ? (j = u.length - 3, L = u.slice(0, 3)) : L = u, Object.assign(e, {
                    imageUrlList: L,
                    imageHeight: x,
                    moreImgLength: j,
                    isLike: -1 !== g.indexOf(i),
                    userLogoUrl: "" + S + n,
                    navigateUrl: "" + a.globalData.subjectDetailUrl + i,
                    homePageUrl: "" + a.globalData.userHomePageUrl + n,
                    userHeaderInfo: y
                });
            } else {
                var E = T[e.objectId], R = U[e.objectId], _ = "";
                "NORMAL" === A[e.objectId].name ? _ = "" + a.globalData.activityDetailUrl + b : "RACE" === A[e.objectId].name && (_ = "" + a.globalData.raceDetailUrl + b), 
                Object.assign(e, {
                    navigateUrl: _,
                    userHeaderInfo: y,
                    activityTitle: C[e.objectId],
                    activityType: p[e.objectId],
                    activityTypeColor: D[e.objectId],
                    activityTimeInterval: t.date.getTimeInterval(E, R),
                    activityImg: "" + w + e.objectId
                });
            }
            N.push(e);
        }), h = 0 === h ? 1 : h, s.setData((o = {}, e(o, "attentionList[" + (h - 1) + "]", N), 
        e(o, "isFirstAttention", !1), e(o, "hasNewAttention", !1), o)), Object.assign(_, {
            currentAttentionPage: h + 1,
            pages: b
        }), wx.pageScrollTo({
            scrollTop: 0
        });
    },
    swichNav: function(e) {
        var t = this, a = t.data, i = a.currentTab, r = a.isFirstAttention, n = void 0 === r || r, o = a.hasNewAttention, s = void 0 === o || o, d = e.currentTarget.dataset.current;
        i === (d = parseInt(d)) ? (1 === d ? (t.newSubjectCard = t.selectComponent("#newSubjectCard"), 
        t.newSubjectCard.setData({
            leftDataList: [],
            rightDataList: [],
            leftDataIds: [],
            rightDataIds: [],
            leftHeight: 0,
            rightHeight: 0
        })) : 0 === d && t.setData({
            attentionList: []
        }), t.initPageLogin()) : (t.setData({
            currentTab: d
        }), 0 === d && (n || s) && t.initPageLogin());
    },
    bindListChange: function(e) {
        var t = e.detail.current, a = void 0 === t ? 1 : t, i = this, r = i.data, n = r.currentTab, o = r.isFirstAttention, s = void 0 === o || o, d = r.hasNewAttention, c = void 0 === d || d;
        n !== (a = parseInt(a)) && (i.setData({
            currentTab: a
        }), 0 === a && (s || c) && i.initPageLogin());
    }
});