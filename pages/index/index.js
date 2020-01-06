var t = require("../../utils/util.js"), e = require("../../utils/tool.js"), a = require("../../config.js"), i = require("../../utils/qqmap-wx-jssdk.js"), s = getApp(), n = {
    classList: [ {
        title: "",
        sortItem: []
    }, {
        title: "活动",
        sortItem: [ {
            name: "全部活动",
            id: 0,
            type: "NORMAL"
        } ]
    }, {
        title: "比赛",
        sortItem: []
    } ],
    positionList: [ {
        title: "",
        sortItem: [ {
            name: "附近",
            id: 5,
            type: "DISTANCE"
        }, {
            name: "10km",
            id: 10,
            type: "DISTANCE"
        }, {
            name: "20km",
            id: 20,
            type: "DISTANCE"
        } ]
    } ],
    dateList: [ {
        title: "",
        sortItem: []
    } ],
    costList: [ {
        title: "",
        sortItem: []
    } ],
    isLink: !0,
    authedUserId: ""
};

Page({
    data: {
        infoList: [],
        bannerList: [],
        specialRaceList: [],
        dataList: [],
        isAddressBack: !1,
        windowWRPX: 375,
        screenWidth: wx.getSystemInfoSync().screenWidth,
        sorts: [ "分类", "位置", "日期", "价格" ],
        activeSort: null,
        activeSortId: [ "", "", "", "" ],
        activeSortList: [],
        activitySort: "",
        bannerCurrent: 1,
        hnRaceEntranceShowSwitch: !1
    },
    navigate: function(e) {
        var a = n.isLink, i = n.authedUserId, s = void 0 === i ? "" : i;
        a ? (e.detail.e && (e = e.detail.e), n.isLink = !1, t.requestEmpty(e, s), wx.navigateTo({
            url: e.currentTarget.dataset.url
        })) : n.isLink = !0;
    },
    onShareAppMessage: function(t) {
        return {
            title: "找活动，上PAPA~",
            desc: "欢迎使用PAPA报名，点击打开!",
            path: s.globalData.indexUrl,
            imageUrl: "/static/weixin.png"
        };
    },
    navigateToInfo: function(e) {
        var a = n.isLink, i = n.authedUserId, s = void 0 === i ? "" : i;
        if (t.requestEmpty(e, s), a) {
            n.isLink = !1;
            var r = e.currentTarget.dataset, o = (r.id, r.linkurl);
            "LINK" === r.infotype ? o.indexOf("papa-") > -1 ? wx.navigateTo({
                url: "/" + o.split("papa-")[1]
            }) : wx.navigateTo({
                url: "/pages/info/infoDetail?webUrl=" + o
            }) : wx.navigateTo({
                url: "/pages/info/infoDetail?infoId=" + e.currentTarget.dataset.id + "&formId=" + e.detail.formId
            });
        } else n.isLink = !0;
    },
    navigateToBanner: function(e) {
        var a = this.data.bannerList, i = void 0 === a ? [] : a, r = n.isLink, o = n.authedUserId, c = void 0 === o ? "" : o;
        if (t.requestEmpty(e, c), r) {
            n.isLink = !1;
            var l = e.currentTarget.dataset.linkid;
            i.map(function(t) {
                var e = t.id, a = t.infoType, i = void 0 === a ? {} : a, n = t.linkUrl, r = void 0 === n ? "" : n, o = t.title, c = void 0 === o ? "" : o, d = t.shortTitle, u = void 0 === d ? "" : d, g = t.configNameAndConfigValueMap, v = void 0 === g ? {} : g, p = "", h = "", I = v.LINK_TYPE, L = void 0 === I ? "" : I, m = v.LINK_OBJECT, f = void 0 === m ? "" : m, D = v.LINK_PARAMETER_ID, S = void 0 === D ? "" : D;
                if (r = t.linkUrl, c = t.title, u = t.shortTitle, e == l) switch ("TEXT_PIC" === i.name ? (p = L, 
                h = "SELF_BUILD" === L ? S : f) : p = i.name, p) {
                  case "ACTIVITY":
                    wx.navigateTo({
                        url: "" + s.globalData.activityDetailUrl + h
                    });
                    break;

                  case "RACE":
                    wx.navigateTo({
                        url: "" + s.globalData.raceDetailUrl + h
                    });
                    break;

                  case "SUBJECT":
                    wx.navigateTo({
                        url: "" + s.globalData.subjectDetailUrl + h
                    });
                    break;

                  case "CLUB":
                    wx.navigateTo({
                        url: "" + s.globalData.clubDetailUrl + h
                    });
                    break;

                  case "LINK":
                    r.indexOf("papa-") > -1 ? wx.navigateTo({
                        url: "/" + r.split("papa-")[1]
                    }) : wx.navigateTo({
                        url: "/pages/info/infoDetail?webUrl=" + r + "&title=" + c + "&shortTitle=" + u
                    });
                    break;

                  case "SELF_BUILD":
                    wx.navigateTo({
                        url: "/pages/info/infoDetail?id=" + e + "&shortTitle=" + u + "&title=" + c + "&pageType=" + f
                    });
                    break;

                  case "SPECIAL_RACE":
                    wx.navigateTo({
                        url: "" + s.globalData.specialRaceDetailUrl + h
                    });
                }
            });
        } else n.isLink = !0;
    },
    getScaleNumber: function(t) {
        var e = this.data, a = e.windowWRPX;
        return t * e.screenWidth / a;
    },
    onLoad: function(t) {
        var e = this;
        e.setData({
            isIpx: s.globalData.isIpx,
            isUserInfoBack: s.globalData.isUserInfoBack || !1
        }), e.initPageLogin();
    },
    onShow: function() {
        var e = this, a = e.data, i = a.isAddressBack, r = void 0 !== i && i, o = a.isUserInfoBack, c = void 0 !== o && o;
        (r || c || s.globalData.isLogin) && (e.initPageLogin(), s.globalData.isUserInfoBack = !1, 
        s.globalData.isLogin = !1, n.authedUserId = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        t.request("service.json", t.MD5({
            service: "USER_OPERATION_PERMISSION_QUERY",
            authedUserId: n.authedUserId
        })).then(function(t) {
            var e = t.allowCreateRace, a = void 0 === e || e, i = t.blackUser, s = void 0 !== i && i, n = t.hideSubjectCreate, r = void 0 !== n && n, o = wx.getStorageSync("userInfo") || {};
            o.inWhiteList = !s || !1, o.allowCreateRace = a || !1;
            var c = {
                inWhiteList: !s || !1,
                allowCreateRace: a || !1,
                hideSubjectCreate: r
            };
            wx.setStorage({
                key: "userInfo",
                data: o
            }), wx.setStorage({
                key: "userPermisssion",
                data: c
            });
        })), s.globalData.scene = "";
    },
    initPageLogin: function(t) {
        var e = this, a = e.data.isAddressBack;
        n.authedUserId = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        e.setData({
            infoList: [],
            bannerList: [],
            dataList: [],
            bannerCurrent: 1
        }), a ? (e.setData({
            isAddressBack: !1
        }), e.initPageQuery(), e.initPageData()) : (e.initPageQuery(), e.setData({
            addressDescribe: "正在定位中..."
        }), e.selectComponent("#authorize").getAuthorizeLocation(e.getLocationName));
    },
    onHide: function() {
        this.closeMask(), n.isLink = !0;
    },
    onPullDownRefresh: function() {
        this.setData({
            isAddressBack: !0,
            activeSort: null
        }), this.initPageLogin(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var t = this;
        n.currentPage <= n.pages && t.initPageData(!0);
    },
    getLocationName: function(t) {
        var e = this, n = new i({
            key: a.QQmapsdkKey
        }), r = s.globalData.latitude, o = s.globalData.longitude;
        t || (r = s.globalData.latitude, o = s.globalData.longitude), n.reverseGeocoder({
            location: {
                latitude: r,
                longitude: o
            },
            success: function(t) {
                if (t) {
                    var a = (t = t && t.result).formatted_addresses, i = {
                        lon: t.location.lng,
                        lat: t.location.lat,
                        addressDescribe: a.recommend
                    };
                    try {
                        wx.setStorageSync("location", i);
                    } catch (t) {}
                    e.initPageData();
                }
            }
        });
    },
    initPageQuery: function() {
        var e = this, a = n.dateList, i = void 0 === a ? [ {
            title: "",
            sortItem: []
        } ] : a, r = n.costList, o = void 0 === r ? [ {
            title: "",
            sortItem: []
        } ] : r, c = n.classList, l = void 0 === c ? [ {
            title: "",
            sortItem: []
        }, {
            title: "活动",
            sortItem: [ {
                name: "全部活动",
                id: 0,
                type: "NORMAL"
            } ]
        }, {
            title: "比赛",
            sortItem: []
        } ] : c, d = n.authedUserId, u = void 0 === d ? "" : d;
        wx.showLoading({
            title: "加载中"
        }), t.request("service.json", t.MD5({
            service: "INDEX_QUERY",
            authedUserId: u
        })).then(function(t) {
            var a = t.bannerList, s = void 0 === a ? [] : a, r = t.infoList, c = void 0 === r ? [] : r, d = (t.timeSliceList, 
            t.chargeTypeList), u = void 0 === d ? [] : d, g = t.sortIdAndName, v = void 0 === g ? {} : g, p = t.sortTypeAndTypeIds, h = void 0 === p ? {} : p, I = t.listDaysAndweeks, L = void 0 === I ? [] : I, m = t.hnRaceEntranceShowSwitch, f = t.hideSubjectCreate;
            i[0].sortItem = [], o[0].sortItem = [], l[1].sortItem = [ {
                name: "全部活动",
                id: 0,
                type: "NORMAL"
            } ], l[2].sortItem = [], L.forEach(function(t, e) {
                var a = {}, s = Object.keys(t)[0];
                a.id = s + " 00:00:00", a.name = t[s], a.time = s.slice(8), a.type = "TIME", i[0].sortItem.push(a);
            }), u.forEach(function(t, e) {
                var a = {};
                a.id = t.name, a.name = t.message, a.type = "CHARGE", o[0].sortItem.push(a);
            }), h.NORMAL.forEach(function(t, e) {
                var a = {};
                a.id = t, a.name = v[t], a.type = "NORMAL", l[1].sortItem.push(a);
            }), h.RACE.forEach(function(t, e) {
                var a = {};
                a.id = t, a.name = v[t], a.type = "RACE", l[2].sortItem.push(a);
            }), Object.assign(n, {
                dateList: i,
                costList: o,
                classList: l
            }), e.setData({
                bannerList: s,
                infoList: c,
                hnRaceEntranceShowSwitch: m
            });
            var D = wx.getStorageSync("userInfo") || {};
            D.inWhiteList = !t.blackUser || !1, D.allowCreateRace = t.allowCreateRace || !1;
            var S = {
                inWhiteList: !t.blackUser || !1,
                allowCreateRace: t.allowCreateRace || !1,
                hideSubjectCreate: f
            };
            wx.setStorage({
                key: "userInfo",
                data: D
            }), wx.setStorage({
                key: "userPermisssion",
                data: S
            });
        }), t.request("service.json", t.MD5({
            service: "INDEX_SPECIAL_RACE_QUERY",
            authedUserId: u
        })).then(function(t) {
            var a = t.list, i = void 0 === a ? [] : a;
            i.map(function(t) {
                var e = t.id, a = void 0 === e ? "" : e, i = t.status, n = void 0 === i ? {} : i, r = "/static/special-race-enter.png", o = "/static/special-race-enter-bg.png";
                "ENTER_END" === n.name ? (r = "/static/special-race-enter-end.png", o = "/static/special-race-enter-end-bg.png") : "WORKING" === n.name ? (r = "/static/special-race-working.png", 
                o = "/static/special-race-working-bg.png") : "END" === n.name && (r = "/static/special-race-end.png", 
                o = "/static/special-race-end-bg.png"), Object.assign(t, {
                    statusUrl: r,
                    statusBgUrl: o,
                    navigateUrl: "" + s.globalData.specialRaceDetailUrl + a
                });
            }), e.setData({
                specialRaceList: i
            });
        });
    },
    initPageData: function(e) {
        var a = this, i = a.data, s = i.activeSortId, r = void 0 === s ? [ "", "", "", "" ] : s, o = i.activitySort, c = void 0 === o ? "" : o, l = n.currentPage, d = void 0 === l ? 1 : l;
        e || (d = 1);
        var u = r[0];
        0 === r[0] && (u = "");
        var g = r[1], v = r[2], p = r[3], h = wx.getStorageSync("location");
        if (a.setData({
            addressDescribe: h.addressDescribe
        }), wx.showLoading({
            title: "加载中"
        }), !h.lon && !h.lat) return a.selectComponent("#authorize").getAuthorizeLocation(a.getLocationName), 
        !1;
        t.request("service.json", t.MD5({
            service: "NEAR_ACTIVE_QUERY",
            currentPage: d,
            lon: h.lon,
            lat: h.lat,
            authedUserId: n.authedUserId,
            typeId: u,
            distance: g,
            indexActivityTime: v,
            chargeFeeType: p,
            activitySort: c
        })).then(function(t) {
            a.getListData(t, e);
        });
    },
    getListData: function(a, i) {
        var r = this, o = r.data.dataList, c = a.idAndJoinerNumMap, l = void 0 === c ? {} : c, d = a.idAndDistanceMap, u = void 0 === d ? {} : d, g = a.activeIdAndJoinSameActiveUserCount, v = void 0 === g ? {} : g, p = a.joinedActivityIds, h = void 0 === p ? [] : p, I = a.list, L = void 0 === I ? [] : I, m = a.clubIdAndNameMap, f = void 0 === m ? {} : m, D = a.clubLogoUrl, S = void 0 === D ? "" : D, b = a.currentPage, w = a.pages, y = (a.typeIdAndTypeName, 
        a.parentTypeIdAndBackGroundColor), T = a.typeBackGroundImageUrl;
        i || (o = []), L.map(function(a) {
            var i = a.id, n = a.activityLabel, r = void 0 === n ? "" : n, c = a.gmtStart, d = a.gmtEnd, g = void 0 === d ? "" : d, p = a.activitySort, I = void 0 === p ? {} : p, L = a.belongType, m = void 0 === L ? {} : L, D = a.belongId, b = void 0 === D ? "" : D, w = a.typeId, U = a.parentTypeId, k = t.date.getTimeInterval(c, g), A = l[i], E = u[i], R = v[i], C = r.split(","), x = "" + s.globalData.raceDetailUrl + i, N = "", P = "", M = "", j = "", B = "", O = h.indexOf(i) > -1;
            N = y[U], P = T + w, new Date(c).toDateString() === e.date.getDay(0) ? B = "今天 " + e.date.getSubYear(c) : new Date(c).toDateString() === e.date.getDay(1) ? B = "明天 " + e.date.getSubYear(c) : (B = e.date.getSubYear(c), 
            new Date(c).getFullYear() !== new Date().getFullYear() && (B = c.substring(0, 4) + "年 " + e.date.getSubYear(c))), 
            "NORMAL" === I.name && (x = "" + s.globalData.activityDetailUrl + i, I.message = "活动"), 
            "CLUB" === m.name && (M = S + b, j = f[b]), Object.assign(a, {
                iconBack: N,
                iconUrl: P,
                navigateUrl: x,
                activityLabels: C,
                activityTimeInterval: k,
                joinerNum: A,
                distance: E,
                userCount: R,
                hasJoin: O,
                clubUrl: M,
                clubName: j,
                showDate: !1,
                dateMemo: B
            }), 0 === o.length ? (o[0] = {
                dateTitle: B,
                list: []
            }, o[0].list.push(a)) : B == o[o.length - 1].list[0].dateMemo ? o[o.length - 1].list.push(a) : (o.push({
                dateTitle: B,
                list: []
            }), o[o.length - 1].list.push(a));
        }), r.setData({
            dataList: o
        }), Object.assign(n, {
            currentPage: ++b,
            pages: w
        });
    },
    changeSort: function(t) {
        var e = n.dateList, a = n.classList, i = n.costList, s = n.positionList, r = t.currentTarget.dataset.id, o = a;
        1 === r ? o = s : 2 === r ? o = e : 3 === r && (o = i), this.setData({
            activeSort: r,
            activeSortList: o
        });
    },
    closeMask: function() {
        this.setData({
            activeSort: null
        });
    },
    selectSort: function(t) {
        var e = this, a = t.currentTarget.dataset, i = a.id, s = void 0 === i ? "" : i, n = a.val, r = void 0 === n ? "" : n, o = a.type, c = void 0 === o ? "" : o, l = r.slice(0, 4), d = this.data, u = d.activeSort, g = d.activeSortId;a
        "" === l && 0 === u ? l = "分类" : "" === l && 1 === u ? l = "位置" : "" === l && 2 === u ? l = "日期" : "" === l && 3 === u && (l = "费用"), 
        "NORMAL" !== c && "RACE" !== c && "" !== s || e.setData({
            activitySort: c
        });
        var v = this.data.sorts;
        v[u] = l, g[u] = s, this.setData({
            activeSortId: g,
            sorts: v,
            activeSort: null,
            dataList: []
        }), this.initPageData();
    },
    stopMove: function() {},
    bindSwiperChange: function(t) {
        var e = t.detail.current, a = void 0 === e ? 0 : e;
        this.setData({
            bannerCurrent: a + 1
        });
    }
});