var a = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        navData: {
            currentTab: 0,
            status: "all",
            myStatusList: []
        },
        dataList: [],
        isDataEmpty: !0,
        allData: [ {}, {}, {} ],
        currentPage: 1,
        pages: 1
    },
    navigate: function(t) {
        a.requestEmpty(t), wx.navigateTo({
            url: t.currentTarget.dataset.url
        });
    },
    onLoad: function(a) {
        var e = this;
        new t.WeToast(), e.setData({
            activeSearchType: a.activeSearchType || "",
            isIpx: t.globalData.isIpx
        }), e.reGetStorage(), "CREATE" === a.activeSearchType && wx.setNavigationBarTitle({
            title: "我发起的"
        });
    },
    onPullDownRefresh: function() {
        var a = this, t = a.data.navData, e = t.currentTab, r = t.status, i = a.data.allData[parseInt(e)];
        i && (i[r] = {}, a.initPageData()), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var a = this, t = a.data.navData, e = t.currentTab, r = t.status, i = a.data.allData[parseInt(e)];
        if (i) {
            var s = i[r];
            if (s) {
                var n = s.currentPage, o = s.pages;
                n <= o && (a.setData({
                    currentPage: n,
                    pages: o
                }), a.initPageData(!0));
            }
        }
    },
    reGetStorage: function(a) {
        var t = this;
        t.setData({
            dataList: [],
            isDataEmpty: !0,
            currentPage: 1,
            pages: 1
        }), t.timer && clearTimeout(t.timer), t.timer = setTimeout(function() {
            t.getStorage(a);
        }, 100);
    },
    getStorage: function(t) {
        var e = this;
        try {
            var r = wx.getStorageSync("userInfo");
            r ? t ? (a.getUserInfo(e.reGetStorage), e.setData({
                authedUserId: ""
            })) : e.setData({
                authedUserId: r.user.userId
            }) : a.getUserInfo(e.reGetStorage);
        } catch (t) {
            a.getUserInfo(e.reGetStorage);
        }
        e.data.authedUserId && "" !== e.data.authedUserId && (clearTimeout(e.timer), e.initPageData());
    },
    initPageData: function(t) {
        var e = this, r = e.data.navData, i = r.currentTab, s = r.status, n = void 0 === s ? "" : s, o = e.data, c = o.allData, g = o.authedUserId, u = o.activeSearchType, d = c[parseInt(i)], l = [], v = 1, p = 1, T = "";
        if (i = parseInt(i), d && d[n]) {
            var I = d[n];
            if (l = I.dataList, v = I.currentPage, p = I.pages, !t) return e.setData({
                dataList: l,
                currentPage: v,
                pages: p,
                isDataEmpty: 0 === l.length
            }), !1;
        }
        1 === i ? T = "NORMAL" : 2 === i && (T = "RACE");
        var D = {
            service: "ACTIVITY_I_JOINED_OR_CREATE_PAGE_LIST",
            activeSearchType: u,
            status: "all" === n ? "" : n,
            currentPage: v,
            authedUserId: g
        };
        "" !== T && (D.sortCode = T), wx.showLoading({
            title: "加载中"
        }), a.AJAX("service.json", a.MD5(D), function(r) {
            if (r.data) {
                var i = r.data.response;
                i.success ? e.getListData(i, t) : "USER_NOT_LOGIN" === i.error.name ? (e.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), e.reGetStorage(!0)) : e.wetoast.toast({
                    title: a.showErrorResult(i),
                    duration: 1e3
                });
            } else e.wetoast.toast({
                title: r.errMsg,
                duration: 1e3
            });
            wx.hideLoading();
        });
    },
    getListData: function(t, e) {
        var r = this, i = r.data, s = (i.id, i.allData), n = i.navData, o = i.activeSearchType, c = n.currentTab, g = n.status, u = void 0 === g ? "all" : g, d = s[parseInt(c)], l = t.statusList, v = t.activeList, p = void 0 === v ? [] : v, T = t.activeAndJoinerNumMap, I = void 0 === T ? {} : T, D = t.activeImageJointUrl, m = t.clubIdAndNameMap, E = void 0 === m ? {} : m, h = t.clubLogoUrl, y = void 0 === h ? "" : h, S = t.currentPage, A = t.pages, N = t.typeIdAndTypeName, L = t.parentTypeIdAndBackGroundColor, f = [];
        d && d[u] && (f = d[u].dataList), e || (f = []), n.myStatusList = l, p.map(function(t) {
            var e = t.id, r = t.activityLabel, i = void 0 === r ? "" : r, s = t.gmtStart, n = t.gmtEnd, c = void 0 === n ? "" : n, g = t.activityStatus, u = void 0 === g ? {} : g, d = t.activitySort, l = void 0 === d ? {} : d, v = t.chargeFeeType, p = void 0 === v ? {} : v, T = t.needSignUp, m = void 0 !== T && T, h = t.belongType, S = void 0 === h ? {} : h, A = t.belongId, _ = void 0 === A ? "" : A, b = t.typeId, w = t.parentTypeId, P = a.date.getTimeInterval(s, c), R = I[e], U = i.split(","), C = "/pages/package-race/raceDetail?id=" + e, G = D + e, O = "/static/icon-end.svg", k = "", x = "", J = "已结束", M = !1, B = "", F = "", H = N[b], V = L[w];
            switch (p = p.name, "NORMAL" === l.name && (C = "../package-activity/activityDetail?id=" + e, 
            l.message = "活动"), u.name) {
              case "ENTERING":
                O = "/static/icon-entering.svg";
                break;

              case "ACTIVITY_END_WITH_NO_PAIED":
                k = "JOINE" === o ? k : "未收齐费用", x = "themes-list-memo-end", M = !(!m || "CREATE" !== o);
                break;

              case "ACTIVITY_END_WITH_PAIED":
                k = "SELF_CHARGING" === p ? "自行收取" : k, "FREE" !== p && "SELF_CHARGING" !== p && (k = "JOINE" === o ? k : "已收齐费用"), 
                x = "themes-list-memo-end", M = !(!m || "CREATE" !== o);
                break;

              case "ACTIVITY_END_WITH_EXPIRED_NO_PAIED":
                k = "JOINE" === o ? k : "收费时间已过", x = "themes-list-memo-end", M = !(!m || "CREATE" !== o);
                break;

              case "ACTIVITY_CANCEL":
                x = "themes-list-memo-end", J = "已取消";
                break;

              case "ENTER_END":
                O = "/static/icon-wait.svg", M = !(!m || "CREATE" !== o);
                break;

              case "WORKING":
                O = "/static/icon-working.svg", M = !(!m || "CREATE" !== o);
            }
            "CLUB" === S.name && (B = E[_], F = y + _), Object.assign(t, {
                imageUrl: G,
                iconUrl: O,
                navigateUrl: C,
                activityLabels: U,
                activityTimeInterval: P,
                joinerNum: R,
                chargeFee: k,
                className: x,
                canSignUp: M,
                signUpUrl: "/pages/package-template/signUp?id=" + e,
                iconMessage: J,
                clubName: B,
                clubUrl: F,
                typeName: H,
                typeBack: V
            }), f.push(t);
        }), f = a.uniqueArray(f), s[parseInt(c)][u] = {
            dataList: f,
            currentPage: ++S,
            pages: A
        }, r.setData({
            dataList: f,
            allData: s,
            navData: n,
            isDataEmpty: 0 === f.length
        });
    },
    swichNav: function(a) {
        var t = this, e = t.data.navData, r = a.currentTarget.dataset.current;
        if (r = parseInt(r), e.currentTab === r) return !1;
        e.currentTab = r, t.setData({
            navData: e
        }), t.initPageData(), wx.pageScrollTo && wx.pageScrollTo({
            scrollTop: 0
        });
    },
    swichStatus: function(a) {
        var t = this, e = t.data.navData, r = a.target.dataset.status;
        if (e.status === r) return !1;
        e.status = r, t.setData({
            navData: e
        }), t.initPageData(), wx.pageScrollTo && wx.pageScrollTo({
            scrollTop: 0
        });
    }
});