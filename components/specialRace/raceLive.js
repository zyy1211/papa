function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

var a = e(require("../../utils/base64Code.js")), t = e(require("../../utils/xml/xml-dom-parser.js")), i = require("../../utils/util.js"), o = require("../../config.js");

Component({
    properties: {
        raceId: {
            type: String,
            value: ""
        },
        isIpx: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        authedUserId: "",
        openSocketId: "",
        projectList: [],
        selectProjectId: "",
        currentPage: 1,
        pages: "",
        groupIdMapGroupName: {},
        roundIdMapRoundName: {},
        showGroupName: !0,
        scheduleIdMapMemberScheduleIds: {},
        scheduleIdMapRaceMatchLiveData: {},
        liveList: [],
        isOnSocket: !1
    },
    methods: {
        chooseProject: function(e) {
            var a = e.detail.project.project;
            this.setData({
                selectProjectId: a.id
            }), this.initPageLogin();
        },
        initPageLogin: function() {
            var e = this, a = e.data.isOnSocket, t = void 0 !== a && a;
            i.initPageLogin().then(function(a) {
                var i = a;
                i && "" !== i && (e.setData({
                    authedUserId: i
                }), e.getData(!0), t && (wx.closeSocket(), e.setData({
                    isOnSocket: !1
                })), e.connectSocket());
            });
        },
        getData: function(e) {
            var a = this, t = a.data, o = t.raceId, d = void 0 === o ? "" : o, s = t.selectProjectId, n = void 0 === s ? "" : s, r = t.authedUserId, c = void 0 === r ? "" : r, u = t.currentPage, m = void 0 === u ? 1 : u, p = t.pages, v = void 0 === p ? 1 : p, l = t.liveList, I = void 0 === l ? [] : l, g = t.groupIdMapGroupName, h = void 0 === g ? {} : g, f = t.roundIdMapRoundName, S = void 0 === f ? {} : f, M = t.scheduleIdMapMemberScheduleIds, b = void 0 === M ? {} : M, L = t.scheduleIdMapRaceMatchLiveData, N = void 0 === L ? {} : L;
            e && (m = 1, v = 1, I = [], h = {}, S = {}, b = {}, N = {}, a.setData({
                currentPage: m,
                pages: v,
                liveList: I,
                groupIdMapGroupName: h,
                roundIdMapRoundName: S,
                scheduleIdMapMemberScheduleIds: b,
                scheduleIdMapRaceMatchLiveData: N
            }));
            var k = {
                service: "SPECIAL_RACE_SCHEDULE_MATCH_WORKING_LIST_PAGE_QUERY",
                authedUserId: c,
                raceId: d,
                raceItemId: n,
                currentPage: m
            };
            "" === n && delete k.raceItemId, m <= v && i.request("service.json", i.MD5(k)).then(function(e) {
                a.initData(e);
            });
        },
        initData: function(e) {
            var a = this, t = e.raceItemId, i = void 0 === t ? "" : t, o = e.raceItemList, d = void 0 === o ? [] : o, s = e.groupIdAndGroupName, n = void 0 === s ? {} : s, r = e.roundIdAndRoundName, c = void 0 === r ? {} : r, u = e.scheduleIdAndMemberScheduleIds, m = void 0 === u ? {} : u, p = e.scheduleIdAndRaceMatchLiveData, v = void 0 === p ? {} : p, l = e.list, I = void 0 === l ? [] : l, g = e.paginator, h = void 0 === g ? {} : g, f = e.showGroupName, S = void 0 === f || f, M = a.data, b = M.currentPage, L = void 0 === b ? 1 : b, N = M.pages, k = void 0 === N ? 1 : N, T = M.liveList, O = void 0 === T ? [] : T, E = M.groupIdMapGroupName, D = void 0 === E ? {} : E, j = M.roundIdMapRoundName, x = void 0 === j ? {} : j, _ = M.scheduleIdMapMemberScheduleIds, C = void 0 === _ ? {} : _, P = M.scheduleIdMapRaceMatchLiveData, R = void 0 === P ? {} : P;
            L = h.page + 1, k = h.pages, O = O.concat(I), D = Object.assign(D, n), x = Object.assign(x, c), 
            C = Object.assign(C, m), R = Object.assign(R, v);
            for (var w = 0; w < O.length; w++) !function(e) {
                O[e].roundId && (O[e].roundName = x[O[e].roundId]), O[e].groupId && (O[e].groupName = D[O[e].groupId]), 
                O[e].teamLiveInfo = R[O[e].id], O[e].memberLiveInfo = [], C[O[e].id] && C[O[e].id].map(function(t, i) {
                    var o = R[t].dateTime, d = R[t].startDateTime;
                    R[t].time = a.millisecondToMin(o - d), O[e].memberLiveInfo = O[e].memberLiveInfo.concat(R[t]);
                });
            }(w);
            a.setData({
                projectList: d,
                selectProjectId: i,
                groupIdAndGroupName: n,
                roundIdAndRoundName: c,
                showGroupName: S,
                scheduleIdMapMemberScheduleIds: C,
                scheduleIdMapRaceMatchLiveData: R,
                liveList: O,
                currentPage: L,
                pages: k
            });
        },
        millisecondToMin: function(e) {
            var a = parseFloat(e) / 1e3;
            return a = a > 60 && a < 3600 ? parseInt(a / 60) + 1 + "’" : a >= 3600 && a < 86400 ? parseInt(a / 3600 * 60) + parseInt(60 * (parseFloat(a / 3600) - parseInt(a / 3600))) + 1 + "’" : "1’";
        },
        updateData: function(e) {
            var a = this, t = a.data, i = t.groupIdMapGroupName, o = void 0 === i ? {} : i, d = t.roundIdMapRoundName, s = void 0 === d ? {} : d, n = t.liveList, r = void 0 === n ? [] : n, c = t.currentPage, u = void 0 === c ? 1 : c, m = t.pages, p = void 0 === m ? 1 : m, v = e, l = v.raceId, I = void 0 === l ? "" : l, g = v.raceItemId, h = void 0 === g ? "" : g, f = v.raceLiveDataType, S = void 0 === f ? "" : f, M = v.scheduleId, b = void 0 === M ? "" : M, L = v.dateTime, N = v.startDateTime, k = v.parentData, T = void 0 === k ? {} : k;
            if (I === a.data.raceId) {
                switch (S) {
                  case "MATCH_START":
                    if (h === a.data.selectProjectId) {
                        for (var O = !0, E = 0; E < r.length; E++) {
                            var D = r[E], j = D.memberLiveInfo, x = void 0 === j ? [] : j, _ = D.teamLiveInfo, C = void 0 === _ ? {} : _;
                            if (T && T.scheduleId === C.scheduleId) {
                                O = !1, T.roundId && (r[E] = Object.assign(r[E], {
                                    roundName: s[T.roundId]
                                })), T.groupId && (r[E] = Object.assign(r[E], {
                                    groupName: o[T.groupId]
                                })), C = Object.assign(C, T), e = Object.assign(e, {
                                    time: a.millisecondToMin(L - N)
                                }), x.push(e);
                                break;
                            }
                        }
                        if (O && u > p) {
                            var P = {};
                            P = Object.assign(P, T), T.roundId && (P = Object.assign(P, {
                                roundName: s[T.roundId]
                            })), T.groupId && (P = Object.assign(P, {
                                groupName: o[T.groupId]
                            }));
                            var R = T.siteNo, C = T;
                            e = Object.assign(e, {
                                time: a.millisecondToMin(L - N)
                            }), (x = []).push(e), P = Object.assign(P, {
                                matchSiteNo: R,
                                teamLiveInfo: C,
                                memberLiveInfo: x
                            }), r.push(P);
                        }
                    }
                    break;

                  case "MATCH_PROCESS":
                    for (var w = e.scheduleType, A = 0; A < r.length; A++) if ("SCHEDULE_WITH_MEMBER" === w) {
                        for (var y = r[A].memberLiveInfo, B = void 0 === y ? [] : y, G = 0; G < B.length; G++) if (B[G].scheduleId === b) {
                            if (B[G].dateTime && L <= B[G].dateTime) return;
                            B[G] = Object.assign(B[G], e), B[G] = Object.assign(B[G], {
                                time: a.millisecondToMin(L - B[G].startDateTime)
                            });
                            break;
                        }
                    } else if ("SCHEDULE_WITH_TEAM" === w && r[A].teamLiveInfo.scheduleId === b) {
                        var U = r[A].teamLiveInfo, H = void 0 === U ? {} : U;
                        H = Object.assign(H, e);
                        break;
                    }
                    break;

                  case "MATCH_END":
                    for (var W = 0; W < r.length; W++) {
                        var K = r[W], q = K.memberLiveInfo, F = void 0 === q ? [] : q, z = K.teamLiveInfo;
                        if (b === (void 0 === z ? {} : z).scheduleId) {
                            r.splice(W, 1);
                            break;
                        }
                        for (var J = 0; J < F.length; J++) if (F[J].scheduleId === b) {
                            if (F[J].dateTime && L <= F[J].dateTime) return;
                            F.splice(J, 1);
                            break;
                        }
                    }
                    break;

                  case "ROUND_CHANGE":
                    a.initPageLogin();
                }
                a.setData({
                    liveList: r
                });
            }
        },
        connectSocket: function() {
            var e = this, a = e.data.authedUserId, i = "miniprog_" + (void 0 === a ? "" : a);
            e.setData({
                isOnSocket: !0
            }), wx.connectSocket({
                url: o.WEBSOCKET_URL,
                protocols: [ "xmpp" ]
            }), wx.onSocketOpen(function(a) {
                wx.sendSocketMessage({
                    data: "<open to='" + o.WEBSOCKET_serviceName + "' from='" + i + "@" + o.WEBSOCKET_serviceName + "'  xmlns='urn:ietf:params:xml:ns:xmpp-framing' xml:lang='zh_CN' version='1.0'/>"
                }), e.authSocket();
            }), wx.onSocketMessage(function(a) {
                var i = a.data, o = new t.default.DOMParser().parseFromString(i);
                if (o.getElementsByTagName("open").length > 0) {
                    var d = o.documentElement.getAttribute("id");
                    d !== e.data.openSocketId && (e.setData({
                        openSocketId: d
                    }), e.sendSocketMessage());
                }
                if (o.getElementsByTagName("message").length > 0 && o.getElementsByTagName("body").length > 0) {
                    var s = o.getElementsByTagName("body")[0].firstChild.nodeValue;
                    e.updateData(JSON.parse(s));
                }
            }), wx.onSocketError(function(e) {
                console.log("WebSocket连接打开失败，请检查！");
            });
        },
        authSocket: function() {
            var e = this, t = e.data.authedUserId, i = void 0 === t ? "" : t, d = wx.getStorageSync("userInfo");
            if (d) {
                var s = "miniprog_" + i, n = d.loginKey, r = "<auth xmlns='urn:ietf:params:xml:ns:xmpp-sasl' mechanism='PLAIN'>" + new a.default.Base64().encode(s + "@" + o.WEBSOCKET_serviceName + "\0" + n) + "</auth>";
                wx.sendSocketMessage({
                    data: r
                });
            } else e.initPageLogin();
        },
        sendSocketMessage: function(e) {
            var a = this.data, t = a.openSocketId, i = void 0 === t ? "" : t, d = "miniprog_" + a.authedUserId, s = "<open to='" + o.WEBSOCKET_serviceName + "' from='" + d + "@" + o.WEBSOCKET_serviceName + "'  xmlns='urn:ietf:params:xml:ns:xmpp-framing' xml:lang='zh_CN' version='1.0' id='" + i + "'/>", n = "<iq type='set' id='" + i + "'><bind xmlns='urn:ietf:params:xml:ns:xmpp-bind' id='" + i + "'><resource>Showings</resource></bind></iq>", r = "<presence id='" + i + "'><status>Online</status><priority>1</priority></presence>";
            wx.sendSocketMessage({
                data: s
            }), wx.sendSocketMessage({
                data: n
            }), wx.sendSocketMessage({
                data: r
            });
        },
        controlCloseSocket: function() {
            var e = this, a = e.data.isOnSocket, t = void 0 === a || a;
            t && (wx.closeSocket(), t = !1, e.setData({
                isOnSocket: t
            }));
        }
    }
});