var e = require("../../utils/util.js"), t = getApp(), a = {
    authedUserId: ""
};

Page({
    data: {
        id: "",
        currentTab: 0,
        footerData: {
            showAppButton: !1
        },
        badmintonRace: !1,
        raceInfo: {},
        isLink: !0,
        currentPage: 1,
        pages: "",
        projectList: [],
        selectProjectId: "",
        teamMembers: []
    },
    onLoad: function(a) {
        var o = this;
        if (o.setData({
            id: a.id,
            currentTab: parseInt(a.currentTab) || 0,
            isIpx: t.globalData.isIpx
        }), a.q) {
            var i = a.q;
            -1 !== (i = decodeURIComponent(i)).indexOf("id=") && o.setData({
                id: e.string.getQueryString(i, "id")
            });
        }
        !wx.getStorageSync("noWarn1") && a.from && o.setData({
            successModalHidden: !1
        });
    },
    onShow: function() {
        var e = this;
        e.initPageLogin(), e.selectComponent("#appFooter").initScene();
    },
    initPageLogin: function(e) {
        var t = this, o = t.data.currentTab;
        switch (a.authedUserId = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
        parseInt(o)) {
          case 0:
            t.initPage(), t.raceLive && t.raceLive.controlCloseSocket();
            break;

          case 1:
            t.specialRaceMatch = t.selectComponent("#specialRaceMatch"), t.specialRaceMatch.initPageLogin(), 
            t.raceLive && t.raceLive.controlCloseSocket();
            break;

          case 2:
            t.raceLive = t.selectComponent("#raceLive"), t.raceLive.controlCloseSocket(), t.raceLive.initPageLogin();
            break;

          case 3:
            t.showRaceEnterList(!0);
            break;

          case 4:
            t.raceResult = t.selectComponent("#raceResult"), t.raceResult.initPageLogin(), t.raceLive && t.raceLive.controlCloseSocket();
        }
    },
    initPage: function() {
        var t = this, o = a.authedUserId, i = t.data.id;
        e.request("service.json", e.MD5({
            service: "SPECIAL_RACE_DETAIL_QUERY",
            id: i,
            authedUserId: o
        })).then(function(e) {
            t.initSpecialRaceData(e);
        });
    },
    initSpecialRaceData: function(a) {
        var o = this, i = o.data, r = (i.id, i.footerData), n = void 0 === r ? {} : r, c = a.race, s = void 0 === c ? {} : c, d = a.chargeTypeAndFeeMap, l = void 0 === d ? {
            TEAM: ""
        } : d, u = a.indexImageUrl, g = void 0 === u ? "" : u, m = (a.canJoin, a.canModify, 
        a.canCancle, a.canSign, a.creator, a.cifImageUrl), p = void 0 === m ? "" : m, v = a.userTeamId, h = void 0 === v ? "" : v, f = a.creatorSex, L = void 0 === f ? "M" : f, I = a.timesToRegisterEnd, b = void 0 === I ? "" : I, C = a.joinerNum, D = void 0 === C ? 0 : C, S = a.creatorName, E = void 0 === S ? "" : S, R = a.description, P = void 0 === R ? "" : R, T = a.raceDescribeTextContent, w = void 0 === T ? "" : T, A = a.raceDescribeImageUrlList, M = void 0 === A ? [] : A, N = a.followed, U = void 0 !== N && N, x = a.hasEnter, y = void 0 !== x && x, j = a.badmintonRace, k = void 0 === j || j, Q = a.nowDate, _ = void 0 === Q ? "" : Q, q = s.gmtStart, F = void 0 === q ? "" : q, H = s.gmtEnd, O = void 0 === H ? "" : H, B = s.gmtEnterStart, z = void 0 === B ? "" : B, W = s.gmtEnterEnd, G = void 0 === W ? "" : W, Y = s.ageLimitType, J = s.sexLimit, V = (s.gmtModifyEnterEnd, 
        s.address), K = void 0 === V ? "" : V, X = s.creatorId, Z = s.status, $ = void 0 === Z ? {} : Z, ee = e.date.getTimeInterval(F, O), te = e.date.getTimeInterval(z, G), ae = e.unicodeNickname(E) || "", oe = e.unicodeNickname(s.creatorName) || "", ie = Y && Y.message, re = J && J.name, ne = K.split("@")[0], ce = K.split("@")[1], se = {};
        Object.assign(s, {
            timeInterval: ee,
            ageLimitTypeMsg: ie,
            sexLimitName: re,
            creatorNickName: ae,
            creatorRaceName: oe,
            creatorLogoUrl: p + X,
            userTeamId: h,
            creatorSex: L,
            timesToRegisterEnd: b,
            joinerNum: D,
            longitude: ne,
            latitude: ce,
            description: P,
            chargeTypeAndFeeMap: l,
            raceDescribeTextContent: w,
            raceDescribeImageUrlList: M,
            enterInterval: te
        }), wx.setStorageSync("enterRange", te);
        var de = !1;
        U || (de = !0), Object.assign(se, {
            homePageUrl: "" + t.globalData.userHomePageUrl + X,
            userLogoUrl: p + X,
            createUserName: E,
            createUserId: X,
            userSex: L,
            time: "",
            contactName: oe,
            showAttentionButton: de,
            follwed: !1,
            beFollowed: !1
        }), o.setData({
            badmintonRace: k,
            imageSrc: g,
            raceInfo: s,
            footerData: Object.assign(n, {
                status: $,
                hasEnter: y,
                gmtEnterStart: z,
                gmtEnterEnd: G,
                nowDate: _
            }),
            userHeaderInfo: se
        }), this.selectComponent("#createQrCode").initPageImage({
            imageUrl: g,
            shareImageUrl: g + "&areaName=SHARE_COVER"
        }), this.selectComponent("#userHeader").refreshData();
    },
    showRaceEnterList: function(t) {
        var o = this, i = a.authedUserId, r = o.data.id, n = o.data, c = n.selectProjectId, s = void 0 === c ? "" : c, d = n.currentPage, l = void 0 === d ? 1 : d, u = n.pages, g = void 0 === u ? "" : u, m = n.teamMembers, p = void 0 === m ? [] : m;
        t && (l = 1, g = 1, p = [], o.setData({
            currentPage: l,
            pages: g,
            teamMembers: p
        }));
        var v = {
            service: "SPECIAL_RACE_ENTER_LIST_QUERY",
            id: r,
            raceItemId: s,
            authedUserId: i,
            currentPage: l
        };
        "" === s && delete v.raceItemId, l <= g && e.request("service.json", e.MD5(v)).then(function(e) {
            var t = e.raceItemList, a = void 0 === t ? [] : t, i = e.raceTeamList, r = void 0 === i ? [] : i, n = e.teamIdAndLeaderName, c = void 0 === n ? {} : n, s = e.teamIdAndMemberNameList, d = void 0 === s ? {} : s, u = e.teamIdAndCoachNameList, m = void 0 === u ? {} : u, v = e.raceMemberList, h = void 0 === v ? [] : v, f = e.enterType, L = void 0 === f ? {} : f, I = e.paginator, b = void 0 === I ? {} : I, C = L.name;
            "SINGLE" === C ? h.map(function(e) {
                e.raceType = "personal";
                var t = [];
                t.push(e.name), e.players = t;
            }) : "TEAM" === C ? r.map(function(e) {
                e.raceType = "team", e.leaderName = c[e.id], e.coachName = m[e.id], e.players = d[e.id];
            }) : "DOUBLE" === C && r.map(function(e) {
                e.raceType = "personal", e.players = d[e.id];
            }), l = b.page + 1, g = b.pages, o.setData({
                projectList: a,
                teamMembers: "SINGLE" === C ? p.concat(h) : p.concat(r),
                currentPage: l,
                pages: g
            });
        });
    },
    chooseProject: function(e) {
        var t = e.detail.project.project;
        this.setData({
            selectProjectId: t.id
        }), this.initPageLogin();
    },
    onHide: function() {
        this.raceLive && this.raceLive.controlCloseSocket(), this.setData({
            isLink: !0
        });
    },
    onPullDownRefresh: function() {
        this.pageRefresh("pull"), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var e = this, t = e.data.currentTab, a = void 0 === t ? 0 : t;
        1 == a ? e.specialRaceMatch.getData() : 2 == a ? e.raceLive.getData() : 3 == a ? e.showRaceEnterList() : 4 == a && e.raceResult.getData();
    },
    pageRefresh: function(e) {
        var t = this;
        t.data.currentTab;
        wx.showLoading({
            title: "加载中"
        }), t.initPageLogin();
    },
    swichNav: function(t) {
        e.requestEmpty(t);
        var o = this, i = o.data.currentTab, r = t.target.dataset.current;
        if (i === r) return !1;
        e.initPageLogin().then(function(e) {
            a.authedUserId = e, o.setData({
                currentTab: r
            }), o.pageRefresh();
        });
    },
    onShareAppMessage: function(e) {
        return this.selectComponent("#createQrCode").onShareAppMessage(e);
    },
    doDownloadApp: function() {
        e.downloadApp.getDownloadAppUrl();
    },
    openMap: function(t) {
        e.requestEmpty(t);
        var a = this.data.raceInfo, o = a.longitude, i = a.latitude;
        this.selectComponent("#authorize").getAuthorizeLocation(function(e) {
            wx.openLocation({
                longitude: parseFloat(o),
                latitude: parseFloat(i)
            });
        });
    },
    getPhotosAlbum: function(e) {
        var t = this;
        t.selectComponent("#authorize").getPhotosAlbum(function(e) {
            t.selectComponent("#createQrCode").hideCanvasContainer();
        }, e.detail.e);
    },
    bindCreateQrcode: function() {
        this.selectComponent("#createQrCode").createQrCode();
    },
    bindAddWeixin: function() {
        e.downloadApp.doSetClipboardData({
            content: "微信号已复制到剪切板",
            data: this.data.raceInfo.creatorWeixinNo
        });
    },
    bindCallPhone: function() {
        wx.makePhoneCall({
            phoneNumber: this.data.raceInfo.creatorCell + ""
        });
    },
    allActionTotal: function(t) {
        e.downloadApp.downloadApp();
    }
});