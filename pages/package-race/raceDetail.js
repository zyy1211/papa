function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function t(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

function a(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = Array(e.length); t < e.length; t++) a[t] = e[t];
        return a;
    }
    return Array.from(e);
}

var n = e(require("../../utils/base64Code.js")), i = e(require("../../utils/xml/xml-dom-parser.js")), o = e(require("../../template/raceDetailTemplate.js")), r = require("../../template/template.js"), s = require("../../utils/util.js"), d = require("../../config.js"), u = getApp();

Page(Object.assign({
    data: {
        id: "",
        authedUserId: "",
        joinerBaseList: [],
        currentTab: 0,
        activityInfo: {},
        scheduleTab: 0,
        teamMemberModalHidden: !0,
        matchRoundModalHidden: !0,
        abnormalModalHidden: !0,
        currentRoundName: "",
        currentRoundId: "",
        prevCurrentRoundName: "",
        prevCurrentRoundId: "",
        firstGroupId: "",
        ruleCode: "",
        shareUrl: "",
        groupListNone: !0,
        againstListNone: !0,
        roundListNone: !0,
        modalHidden: !0,
        callPhone: "",
        successModalHidden: !0,
        footerData: {
            showAppButton: !1
        },
        pageType: "race",
        isLink: !0,
        isIos: -1 === wx.getSystemInfoSync().system.indexOf("Android"),
        fromLogin: !1
    },
    closeSuccessModal: function() {
        var e = this, t = e.data.noWarn1;
        e.setData({
            successModalHidden: !0
        }), wx.setStorage({
            key: "noWarn1",
            data: t
        });
    },
    changeWarn: function(e) {
        var t = this;
        "true" === e.detail.value[0] ? t.setData({
            noWarn1: !0
        }) : t.setData({
            noWarn1: !1
        });
    },
    navigate: function(e) {
        var t = this;
        t.data.isLink && s.initPageLogin().then(function(a) {
            t.setData({
                authedUserId: a,
                isLink: !1
            }), e.detail.e && (e = e.detail.e), s.requestEmpty(e);
            var n = e.currentTarget.dataset.url;
            n && wx.navigateTo({
                url: n
            });
        });
    },
    onShareAppMessage: function(e) {
        return this.selectComponent("#createQrCode").onShareAppMessage(e);
    },
    doDownloadApp: function() {
        this.setData({
            successModalHidden: !0
        }), s.downloadApp.getDownloadAppUrl();
    },
    openMap: function(e) {
        s.requestEmpty(e);
        var t = this.data.activityInfo, a = t.longitude, n = t.latitude;
        this.selectComponent("#authorize").getAuthorizeLocation(function(e) {
            wx.openLocation({
                longitude: parseFloat(a),
                latitude: parseFloat(n)
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
        var e = this;
        s.initPageLogin().then(function(t) {
            e.setData({
                authedUserId: t
            }, function() {
                s.downloadApp.doSetClipboardData({
                    content: "微信号已复制到剪切板",
                    data: e.data.activityInfo.creatorWeixinNo
                });
            });
        });
    },
    onPullDownRefresh: function() {
        this.pageRefresh("pull"), wx.stopPullDownRefresh();
    },
    swichNav: function(e) {
        s.requestEmpty(e);
        var t = this, a = t.data, n = a.currentTab, i = (a.raceResultData, e.target.dataset.current);
        if (n === i) return !1;
        0 === i ? t.pageRefresh() : s.initPageLogin().then(function(e) {
            t.setData({
                authedUserId: e,
                currentTab: i
            }), t.pageRefresh();
        });
    },
    pageRefresh: function(e) {
        var t = this, a = t.data, n = a.currentTab, i = a.raceResultData, o = void 0 === i ? {} : i, r = a.isOnSocket;
        a.joinerBaseList;
        r && (wx.closeSocket(), wx.onSocketClose(function(e) {}), t.setData({
            isOnSocket: !1
        })), o && (o.currentTab = parseInt(n), t.setData({
            raceResultData: o
        })), t.initPageLogin();
    },
    onLoad: function(e) {
        var t = this;
        if (new u.WeToast(), t.setData({
            id: e.id,
            currentTab: parseInt(e.currentTab) || 0,
            isIpx: u.globalData.isIpx
        }), e.q) {
            var a = e.q;
            -1 !== (a = decodeURIComponent(a)).indexOf("id=") && t.setData({
                id: s.string.getQueryString(a, "id")
            });
        }
        !wx.getStorageSync("noWarn1") && e.from && t.setData({
            successModalHidden: !1
        });
    },
    onShow: function() {
        var e = this;
        e.initPageLogin(), e.selectComponent("#appFooter").initScene(), e.setData({
            isLink: !0
        });
    },
    initPageLogin: function(e) {
        var t = this, a = t.data.currentTab;
        switch (t.setData({
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || ""
        }), parseInt(a)) {
          case 0:
            t.initPage();
            break;

          case 1:
            t.showAgainstMatch();
            break;

          case 2:
            t.showScheduleMatch();
            break;

          case 3:
            t.showRaceEnterList();
            break;

          case 4:
            t.showRaceResult();
        }
    },
    initPage: function() {
        var e = this, t = e.data, a = t.id, n = t.authedUserId;
        s.request("service.json", s.MD5({
            service: "ACTIVITY_RACE_DETAIL_VIEW",
            activityId: a,
            authedUserId: n
        })).then(function(t) {
            e.getActivityData(t, "race");
        });
    },
    showRaceEnterList: function() {
        var e = this;
        e.setData({
            enterListCurrentPage: 1
        }), e.getRaceEnterList();
    },
    getMoreRaceEnterList: function() {
        var e = this, t = e.data, a = t.enterListCurrentPage, n = t.enterListPages;
        t.enterListLoadingMore || a <= n && (e.setData({
            enterListLoadingMore: !0
        }), e.getRaceEnterList("isScroll"));
    },
    getRaceEnterList: function(e) {
        var n = this, i = n.data, o = i.id, r = i.authedUserId, d = i.enterListCurrentPage, c = i.joinerBaseList;
        e || (c = []), s.request("service.json", s.MD5({
            service: "ACTIVITY_RACE_ENTER_LIST_QUERY",
            activityId: o,
            authedUserId: r,
            currentPage: d
        })).then(function(e) {
            var i = e.teamList, o = void 0 === i ? [] : i, r = e.teamIdAndUserIdListMap, h = void 0 === r ? {} : r, l = e.userIdAndNickNameMap, g = void 0 === l ? {} : l, m = e.userIdAndSexMap, p = void 0 === m ? {} : m, f = e.cifImageJointUrl, v = void 0 === f ? "" : f, I = e.userIdAndCellMap, S = void 0 === I ? {} : I, M = e.currentPage, L = e.pages, N = e.creator, D = void 0 !== N && N, R = [], T = [], w = "";
            o.map(function(e, t) {
                T = [], (h[e.id] || []).map(function(e, t) {
                    T.push({
                        logoUrl: v + e,
                        nickName: s.unicodeNickname(g[e]),
                        sex: p[e].toLowerCase(),
                        cell: S[e],
                        homePageUrl: "" + u.globalData.userHomePageUrl + e
                    });
                }), w = t % 2 == 0 ? "" : "odd-row", R.push({
                    key: t + 1 + 20 * (d - 1),
                    className: w,
                    indexHeight: 90 * T.length,
                    list: T
                });
            }), c = [].concat(a(c), R), n.setData(t({
                joinerBaseList: c,
                enterListCurrentPage: ++M,
                enterListPages: L
            }, "footerData.creator", D)), n.setData({
                enterListLoadingMore: !1
            });
        });
    },
    showAgainstMatch: function() {
        var e = this;
        e.setData({
            againstCurrentPage: 1
        }), e.getAgainstMatch();
    },
    switchPrevMatchRound: function() {
        var e = this, t = e.data, a = t.roundList, n = void 0 === a ? [] : a, i = (t.currentRoundName, 
        t.currentRoundId);
        i !== n[0].id && (n.map(function(t, a) {
            t.id === i && e.setData({
                currentRoundName: n[a - 1].roundName,
                currentRoundId: n[a - 1].id,
                againstList: [],
                againstCurrentPage: 1
            });
        }), e.getAgainstMatch());
    },
    switchNextMatchRound: function() {
        var e = this, t = e.data, a = t.roundList, n = void 0 === a ? [] : a, i = (t.currentRoundName, 
        t.currentRoundId);
        i !== n[n.length - 1].id && (n.map(function(t, a) {
            t.id === i && e.setData({
                currentRoundName: n[a + 1].roundName,
                currentRoundId: n[a + 1].id,
                againstList: [],
                againstCurrentPage: 1
            });
        }), e.getAgainstMatch());
    },
    showMatchRoundModal: function() {
        var e = this, t = e.data.roundList;
        (void 0 === t ? [] : t).length < 2 || e.setData({
            matchRoundModalHidden: !1
        });
    },
    closeMatchRoundModal: function() {
        this.setData({
            matchRoundModalHidden: !0
        });
    },
    showAbnormalModal: function(e) {
        var t = this, a = e.currentTarget.dataset.id, n = "", i = "";
        t.data.againstList.map(function(e, t) {
            a === e.id && (n = e.winSideList.join("/"), i = e.memo);
        }), t.setData({
            abnormalModalHidden: !1,
            winSideNames: n,
            abnormalMemo: i
        });
    },
    showSchduleAbnormalModal: function(e) {
        var t = this, a = e.currentTarget.dataset.id, n = "", i = "";
        t.data.schduleWorkingList.map(function(e, t) {
            a === e.id && (n = e.winSideList.join("/"), i = e.memo);
        }), t.setData({
            abnormalModalHidden: !1,
            winSideNames: n,
            abnormalMemo: i
        });
    },
    hideAbnormalModal: function() {
        this.setData({
            abnormalModalHidden: !0
        });
    },
    switchMatchRoundModal: function(e) {
        var t = this, a = e.target.dataset.id, n = t.data.roundList;
        n.map(function(e, i) {
            e.id === a && t.setData({
                prevCurrentRoundName: n[i].roundName,
                prevCurrentRoundId: a
            });
        });
    },
    getMatchRoundModal: function() {
        var e = this, t = e.data, a = t.prevCurrentRoundName, n = t.prevCurrentRoundId;
        e.setData({
            currentRoundName: a,
            currentRoundId: n,
            againstList: [],
            againstCurrentPage: 1
        }), e.closeMatchRoundModal(), e.getAgainstMatch();
    },
    switchMatchGroup: function(e) {
        var t = this, a = e.target.dataset, n = a.id, i = a.index;
        t.setData({
            groupId: n,
            againstSideTab: i,
            againstList: [],
            againstCurrentPage: 1
        }), t.getAgainstMatch();
    },
    getMoreAgainstMatch: function() {
        var e = this, t = e.data, a = t.againstCurrentPage, n = t.againstPages;
        t.againstLoadingMore || a <= n && (e.setData({
            againstLoadingMore: !0
        }), e.getAgainstMatch("isScroll"));
    },
    getAgainstMatch: function(e) {
        var t = this, a = t.data, n = a.id, i = a.authedUserId, o = a.againstSideTab, r = void 0 === o ? 0 : o, d = a.groupId, u = void 0 === d ? "" : d, c = a.againstCurrentPage, h = void 0 === c ? 1 : c, l = a.currentRoundName, g = void 0 === l ? "" : l, m = a.currentRoundId, p = void 0 === m ? "" : m, f = a.prevCurrentRoundName, v = void 0 === f ? "" : f, I = a.prevCurrentRoundId, S = void 0 === I ? "" : I, M = a.againstList, L = void 0 === M ? [] : M, N = (a.roundList, 
        {
            service: "RACE_SCHEDULE_AGAINST_PAGE_QUERY",
            activityId: n,
            authedUserId: i
        });
        "" !== p && (N.roundId = p), "" !== u && (N.groupId = u), N.currentPage != h && (N.currentPage = h, 
        e || (L = []), s.request("service.json", s.MD5(N)).then(function(e) {
            var a = e.groupList, n = void 0 === a ? [] : a, i = e.list, o = void 0 === i ? [] : i, d = e.memberIdAndNickNameMap, u = void 0 === d ? {} : d, c = e.roundList, h = void 0 === c ? [] : c, l = e.idAndWinnerSideIdWithAbnormalEnd, m = void 0 === l ? {} : l, f = e.sideIdAndMemberIdsMap, I = void 0 === f ? {} : f, M = e.scheduleIdAndFinalResult, N = void 0 === M ? {} : M, D = e.scheduleIdMatchResults, R = void 0 === D ? {} : D, N = e.scheduleIdAndFinalResult, R = e.scheduleIdMatchResults, T = e.currentPage, w = e.pages, A = e.allowViewEliminationTable, C = void 0 !== A && A, b = e.ruleCode, k = void 0 === b ? "" : b, E = e.currentRoundId;
            if (o.map(function(e, t) {
                var a = e.id, n = e.sideId, i = e.otherSideId, o = e.status, r = e.totalMatchCount, d = e.memo, c = e.matchSiteNo, h = void 0 === c ? "" : c, l = e.bothAbstain, g = void 0 !== l && l, p = [], f = [], v = [], S = "vs", M = "", D = "", T = "", w = "", A = "";
                o && "END" === o.name && (S = N[a], r > 1 && (M = "(" + R[a].join(" ") + ")")), 
                "EMPTY_SIDE" !== n ? I[n].map(function(e, t) {
                    p.push(s.unicodeNickname(u[e]));
                }) : (p.push("轮空"), D = "#999", S = "vs"), "EMPTY_SIDE" !== i ? I[i].map(function(e, t) {
                    f.push(s.unicodeNickname(u[e]));
                }) : (f.push("轮空"), T = "#999", S = "vs"), m[a] && I[m[a]].map(function(e, t) {
                    v.push(s.unicodeNickname(u[e]));
                }), g && (v = [ "双方弃权" ]), w = 1 === p.length ? "100" : "", A = 1 === f.length ? "100" : "", 
                L.push({
                    id: a,
                    sideList: p,
                    otherSideList: f,
                    finalResult: S,
                    scheduleResult: M,
                    status: o,
                    winSideList: v,
                    memo: d,
                    sideLineHeight: w,
                    othersideLineHeight: A,
                    sideForceColor: D,
                    othersideForceColor: T,
                    matchSiteNo: h
                });
            }), "" === p) if (E) h.map(function(e, t) {
                E === e.id && (g = v = e.roundName, p = S = e.id);
            }); else {
                g = v = "", p = S = "";
                var P = h[0];
                P && (g = v = P.roundName, p = S = P.id);
            }
            t.setData({
                roundList: h,
                roundListNone: 0 === h.length,
                groupList: n,
                againstList: L,
                againstSideTab: r,
                currentRoundName: g,
                currentRoundId: p,
                prevCurrentRoundName: v,
                prevCurrentRoundId: S,
                groupListNone: 0 === n.length,
                againstListNone: 0 === L.length,
                againstCurrentPage: ++T,
                againstPages: w,
                firstGroupId: n[0] && n[0].id || "",
                allowViewEliminationTable: C,
                ruleCode: k
            }), t.setData({
                againstLoadingMore: !1
            });
        }));
    },
    showScheduleMatch: function() {
        var e = this, t = e.data.scheduleTab;
        e.setData({
            schduleCurrentPage: 1,
            schduleWorkingList: [],
            currentScheduleRoundId: "",
            currentScheduleGroupId: ""
        }), 0 === parseInt(t) ? e.getScheduleMatch("working") : e.getScheduleMatch("end"), 
        e.connectSocket();
    },
    swichSchduleNav: function(e) {
        var t = this, a = t.data.scheduleTab, n = e.target.dataset.schdulecurrent;
        parseInt(a) !== parseInt(n) && (t.setData({
            scheduleTab: parseInt(n),
            schduleCurrentPage: 1,
            schduleWorkingList: [],
            currentScheduleRoundId: "",
            currentScheduleGroupId: ""
        }), 0 === parseInt(n) ? t.getScheduleMatch("working") : t.getScheduleMatch("end"));
    },
    getMoreSchduleMatch: function() {
        var e = this, t = e.data, a = t.scheduleTab, n = t.schduleCurrentPage, i = t.schdulePages;
        t.schduleLoadingMore || n <= i && (e.setData({
            schduleLoadingMore: !0
        }), 0 === parseInt(a) ? e.getScheduleMatch("working", "isScroll") : e.getScheduleMatch("end", "isScroll"));
    },
    getScheduleMatch: function(e, t) {
        var a = this, n = a.data, i = n.id, o = n.authedUserId, r = n.scheduleTab, d = n.schduleWorkingList, u = void 0 === d ? [] : d, c = n.schduleCurrentPage, h = void 0 === c ? "" : c, l = n.currentScheduleRoundId, g = void 0 === l ? "" : l, m = n.currentScheduleGroupId, p = void 0 === m ? "" : m, f = {
            service: "RACE_SCHEDULE_MATCH_WORKING_LIST_PAGE_QUERY",
            activityId: i,
            authedUserId: o
        };
        "" !== h && (f.currentPage = h), "end" === e && (f.service = "RACE_SCHEDULE_MATCH_END_LIST_PAGE_QUERY"), 
        t || (u = []), s.request("service.json", s.MD5(f)).then(function(e) {
            a.setData({
                schduleLoadingMore: !1
            });
            var t = e.groupIdAndGroupName, n = e.list, i = void 0 === n ? [] : n, o = e.needShowGroupInfo, d = e.needShowRoundInfo, c = e.paginator, h = void 0 === c ? {} : c, l = e.roundIdAndRoundName, m = e.scheduleIdAndRaceMatchLiveData, f = e.userLogoUrlPrefix, v = h.page, I = h.pages;
            i.map(function(e, n) {
                var i = e.id, c = e.roundId, h = e.groupId, v = e.status, I = e.gmtStart, v = e.status, S = e.memo, M = e.matchSiteNo, L = void 0 === M ? "" : M, N = m[i], D = [], R = [], T = {}, w = [], A = "", C = "", b = [];
                if (d && g !== c && (A = l[c]), o && p !== h && (C = t[h]), 0 === parseInt(r) ? (A = l[c], 
                C = t[h]) : (g = c, p = h || ""), N) {
                    var k = N.dateTime, T = N.positionAndScore, E = N.scoreHis, w = void 0 === E ? [] : E, P = N.positionAndUserIds, x = N.userIdAndNickNameMap, U = N.winSide, _ = void 0 === U ? "" : U, y = "", H = P.LEFT || [], W = P.RIGHT || [];
                    H.map(function(e, t) {
                        D.push({
                            nickName: s.unicodeNickname(x[e]),
                            userLogoUrl: f + e,
                            marginTop: (160 / H.length - 40) / 2
                        });
                    }), W.map(function(e, t) {
                        R.push({
                            nickName: s.unicodeNickname(x[e]),
                            userLogoUrl: f + e,
                            marginTop: (160 / H.length - 40) / 2
                        });
                    }), (P[_] || []).map(function(e, t) {
                        b.push(s.unicodeNickname(x[e]));
                    });
                }
                y = w.length > 0 ? "(" + w.join(" ") + ")" : "";
                var j, O;
                I && (I = I.replace(new RegExp("-", "gm"), "/"), j = new Date(I).getTime(), O = a.millisecondToMin(k - j)), 
                u.push({
                    id: i,
                    roundId: c,
                    groupId: h,
                    leftList: D,
                    rightList: R,
                    roundName: A,
                    groupName: C,
                    positionAndScore: T,
                    scoreHisData: y,
                    show: !0,
                    roundSpread: !0,
                    groupSpread: !0,
                    dateTime: k,
                    startDateTime: j,
                    minDiff: O,
                    status: v,
                    memo: S,
                    winSideList: b,
                    matchSiteNo: L
                });
            }), a.setData({
                schduleWorkingList: u,
                userLogoUrlPrefix: f,
                schduleCurrentPage: ++v,
                schdulePages: I,
                schduleWorkingNoData: 0 === u.length,
                roundIdAndRoundName: l,
                groupIdAndGroupName: t,
                currentScheduleRoundId: g,
                currentScheduleGroupId: p
            });
        });
    },
    showTeamMember: function() {
        var e = this, t = e.data, a = t.id, n = t.authedUserId;
        s.request("service.json", s.MD5({
            service: "USER_ACTIVITY_RACE_TEAM_MEMBER_QUERY",
            activityId: a,
            authedUserId: n
        })).then(function(t) {
            var a = t.memberList, i = t.userIdAndNickNameMap, o = t.userLogoUrlPrefix, r = [];
            a.map(function(t, a) {
                var d = t.userId;
                n !== d && r.push({
                    nickName: s.unicodeNickname(i[d]),
                    userLogoUrl: o + d
                }), e.setData({
                    teamMemberList: r
                }), e.showTeamMemberModal();
            });
        });
    },
    showTeamMemberModal: function() {
        this.setData({
            teamMemberModalHidden: !1
        });
    },
    closeTeamMemberModal: function() {
        this.setData({
            teamMemberModalHidden: !0
        });
    },
    showSchduleRoundList: function(e) {
        var t = this, a = e.currentTarget.dataset.id, n = t.data.schduleWorkingList;
        n.map(function(e, t) {
            var n = e.roundSpread;
            a === e.roundId && (e.showSchduleRoundList = n, e.roundSpread = !n);
        }), t.setData({
            schduleWorkingList: n
        });
    },
    showSchduleGroupList: function(e) {
        var t = this, a = e.currentTarget.dataset.id, n = t.data.schduleWorkingList;
        n.map(function(e, t) {
            var n = e.groupSpread;
            a === e.groupId && (e.showSchduleGroupList = n, e.groupSpread = !n);
        }), t.setData({
            schduleWorkingList: n
        });
    },
    updateMatchData: function(e) {
        var t = this, n = t.data, i = n.id, o = n.schduleWorkingList, r = n.userLogoUrlPrefix, d = n.roundIdAndRoundName, u = n.groupIdAndGroupName, c = n.scheduleTab, h = e.dateTime, l = e.positionAndScore, g = e.positionAndUserIds, m = e.raceLiveDataType, p = void 0 === m ? "" : m, f = e.scheduleId, v = e.scoreHis, I = void 0 === v ? [] : v, S = e.userIdAndNickNameMap, M = e.roundId, L = e.groupId, N = e.activityId, D = e.siteNo, R = void 0 === D ? "" : D, T = {};
        if ((!N || N === i) && 1 !== parseInt(c)) {
            switch (p) {
              case "MATCH_START":
                var w = g.LEFT || [], A = g.RIGHT || [], C = [], b = [];
                w.map(function(e, t) {
                    C.push({
                        nickName: s.unicodeNickname(S[e]),
                        userLogoUrl: r + e,
                        marginTop: (160 / w.length - 40) / 2
                    });
                }), A.map(function(e, t) {
                    b.push({
                        nickName: s.unicodeNickname(S[e]),
                        userLogoUrl: r + e,
                        marginTop: (160 / w.length - 40) / 2
                    });
                }), Object.assign(T, {
                    id: f,
                    startDateTime: h,
                    dateTime: h,
                    minDiff: "1’",
                    leftList: C,
                    rightList: b,
                    positionAndScore: l,
                    show: !0,
                    roundSpread: !0,
                    groupSpread: !0,
                    roundName: d[M],
                    groupName: u[L],
                    matchSiteNo: "0" === R ? 0 : R
                }), I.length > 0 ? T.scoreHisData = "(" + I.join(" ") + ")" : T.scoreHisData = "", 
                o = [ T ].concat(a(o));
                break;

              case "MATCH_PROCESS":
                o.map(function(e, a) {
                    var n = e.id;
                    if (f === n) {
                        if (e.dateTime && h <= e.dateTime) return;
                        return e.positionAndScore = l, I.length > 0 ? e.scoreHisData = "(" + I.join(" ") + ")" : e.scoreHisData = "", 
                        e.dateTime = h, void (e.minDiff = t.millisecondToMin(e.dateTime - e.startDateTime));
                    }
                });
                break;

              case "MATCH_END":
                o.map(function(e, t) {
                    var a = e.id;
                    if (f !== a) ; else {
                        if (e.dateTime && h <= e.dateTime) return;
                        e.show = !1;
                    }
                });
                break;

              case "ROUND_CHANGE":
                t.showScheduleMatch();
            }
            t.setData({
                schduleWorkingList: o,
                schduleWorkingNoData: 0 === o.length
            });
        }
    },
    millisecondToMin: function(e) {
        var t = parseFloat(e) / 1e3;
        return t = t > 60 && t < 3600 ? parseInt(t / 60) + 1 + "’" : t >= 3600 && t < 86400 ? parseInt(t / 3600 * 60) + parseInt(60 * (parseFloat(t / 3600) - parseInt(t / 3600))) + 1 + "’" : "1’";
    },
    connectSocket: function() {
        var e = this, t = "miniprog_" + e.data.authedUserId;
        e.setData({
            isOnSocket: !0
        }), wx.connectSocket({
            url: d.WEBSOCKET_URL,
            protocols: [ "xmpp" ]
        }), wx.onSocketOpen(function(a) {
            wx.sendSocketMessage({
                data: "<open to='" + d.WEBSOCKET_serviceName + "' from='" + t + "@" + d.WEBSOCKET_serviceName + "'  xmlns='urn:ietf:params:xml:ns:xmpp-framing' xml:lang='zh_CN' version='1.0'/>"
            }), e.authSocket();
        }), wx.onSocketMessage(function(t) {
            var a = t.data, n = new i.default.DOMParser().parseFromString(a);
            if (n.getElementsByTagName("open").length > 0) {
                var o = n.documentElement.getAttribute("id");
                o !== e.data.openSocketId && (e.setData({
                    openSocketId: o
                }), e.sendSocketMessage());
            }
            if (n.getElementsByTagName("message").length > 0 && n.getElementsByTagName("body").length > 0) {
                a = n.getElementsByTagName("body")[0].firstChild.nodeValue;
                e.updateMatchData(JSON.parse(a));
            }
        }), wx.onSocketError(function(e) {
            console.log("WebSocket连接打开失败，请检查！");
        });
    },
    sendSocketMessage: function(e) {
        var t = this.data, a = t.openSocketId, n = void 0 === a ? "" : a, i = "miniprog_" + t.authedUserId, o = "<open to='" + d.WEBSOCKET_serviceName + "' from='" + i + "@" + d.WEBSOCKET_serviceName + "'  xmlns='urn:ietf:params:xml:ns:xmpp-framing' xml:lang='zh_CN' version='1.0' id='" + n + "'/>", r = "<iq type='set' id='" + n + "'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind' id='" + n + "'><resource>Showings</resource></bind></iq>", s = "<presence id='" + n + "'><status>Online</status><priority>1</priority></presence>";
        wx.sendSocketMessage({
            data: o
        }), wx.sendSocketMessage({
            data: r
        }), wx.sendSocketMessage({
            data: s
        });
    },
    authSocket: function() {
        var e = wx.getStorageSync("userInfo") && wx.getStorageSync("userInfo").loginKey, t = "miniprog_" + this.data.authedUserId, a = e, i = "<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" + new n.default.Base64().encode(t + "@" + d.WEBSOCKET_serviceName + "\0" + a) + "</auth>";
        wx.sendSocketMessage({
            data: i
        });
    },
    bindCallPhone: function(e) {
        var t = this;
        s.initPageLogin().then(function(a) {
            t.setData({
                authedUserId: a,
                modalHidden: !1,
                callPhone: e.currentTarget.dataset.phone
            });
        });
    },
    hideModal: function() {
        this.setData({
            modalHidden: !0,
            callPhone: ""
        });
    },
    submitModal: function() {
        var e = this.data.callPhone, t = void 0 === e ? "" : e;
        wx.makePhoneCall({
            phoneNumber: t + ""
        });
    }
}, o.default, r.activityDetailObj));