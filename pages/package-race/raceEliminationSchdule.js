var t = require("../../utils/util.js"), e = (require("../../config.js"), getApp());

Page({
    data: {
        scduleList: [],
        defaultItem: {
            finalResult: "vs",
            otherSideId: "",
            otherSideList: [],
            sideId: "",
            sideList: [],
            winSideId: ""
        },
        distanceList: [ 0, 0 ],
        disPoint: {
            x: 0,
            y: 0
        },
        scaleInfo: {
            top: 0,
            left: 0,
            x: 0,
            y: 0,
            width: "100%",
            scale: 1
        }
    },
    onLoad: function(t) {
        var i = this;
        new e.WeToast(), i.setData({
            id: t.id,
            isIpx: e.globalData.isIpx
        }), i.reGetStorage();
    },
    touchmove: function(t) {
        var e = this, i = e.data, s = i.distanceList, a = i.disPoint, n = i.scaleInfo;
        if (1 == t.touches.length && (n.left = t.touches[0].clientX - a.x, n.top = t.touches[0].clientY - a.y), 
        2 == t.touches.length) {
            var d = t.touches[1].clientX - t.touches[0].clientX, o = t.touches[1].clientY - t.touches[0].clientY, r = Math.sqrt(d * d + o * o);
            if (s.shift(), s.push(r), 0 == s[0]) return;
            var u = s[1] - s[0], c = n.scale + .005 * u;
            if (c = Math.max(c, .5), (c = Math.min(c, 1.2)) > 0) {
                n.scale = c;
                parseInt(n.width), parseInt(n.height);
            } else n.scale = 0;
        }
        e.setData({
            distanceList: s,
            scaleInfo: n
        });
    },
    touchend: function(t) {},
    touchstart: function(t) {
        var e = this, i = e.data, s = i.distanceList, a = i.disPoint, n = i.scaleInfo;
        s = [ 0, 0 ], a = {
            x: 0,
            y: 0
        }, 1 == t.touches.length && (a.x = t.touches[0].clientX - n.left, a.y = t.touches[0].clientY - n.top), 
        e.setData({
            distanceList: s,
            disPoint: a
        });
    },
    reGetStorage: function(t) {
        var e = this;
        e.setData({
            hidden: !1
        }), e.timer && clearTimeout(e.timer), e.timer = setTimeout(function() {
            e.getStorage(t);
        }, 1e3);
    },
    getStorage: function(e) {
        var i = this;
        try {
            var s = wx.getStorageSync("userInfo");
            s ? e ? (t.getUserInfo(i.reGetStorage), i.setData({
                authedUserId: ""
            })) : i.setData({
                authedUserId: s.user.userId
            }) : t.getUserInfo(i.reGetStorage);
        } catch (e) {
            t.getUserInfo(i.reGetStorage);
        }
        i.data.authedUserId && "" !== i.data.authedUserId && (clearTimeout(i.timer), i.initPage());
    },
    initPage: function() {
        var e = this, i = e.data, s = i.id, a = i.authedUserId;
        t.AJAX("service.json", t.MD5({
            service: "RACE_SCHEDULE_WITH_ELIMINATION_TABLE_INIT",
            activityId: s,
            authedUserId: a
        }), function(i) {
            if (i.data) {
                var s = i.data.response;
                if (s.success) {
                    var a = [];
                    s.roundList.map(function(t, e) {
                        var i = t.id, s = t.stage;
                        s && "LOOP_GAME" !== s.name && a.push(i);
                    }), e.getScduleList(a), e.setData({
                        scduleList: a,
                        scduleListLong: a.length > 5
                    });
                } else "USER_NOT_LOGIN" === s.error.name ? (e.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), e.reGetStorage(!0)) : e.wetoast.toast({
                    title: t.showErrorResult(s),
                    duration: 1e3
                });
            } else e.wetoast.toast({
                title: i.errMsg,
                duration: 1e3
            });
        });
    },
    getScduleList: function(e) {
        var i = this, s = i.data, a = s.id, n = s.authedUserId, d = [];
        e.map(function(e, s) {
            t.AJAX("service.json", t.MD5({
                service: "RACE_SCHEDULE_WITH_ELIMINATION_TABLE_QUERY",
                activityId: a,
                authedUserId: n,
                roundId: e,
                currentPage: 1
            }), function(a) {
                if (a.data) {
                    var n = a.data.response;
                    n.success ? (d[s] = i.getAgainstData(n, e), d[0] && i.getAgainstListData(d)) : "USER_NOT_LOGIN" === n.error.name ? (i.wetoast.toast({
                        title: "您已在其他地方登陆，正在重新登陆...",
                        duration: 1e3
                    }), i.reGetStorage(!0)) : i.wetoast.toast({
                        title: t.showErrorResult(n),
                        duration: 1e3
                    });
                } else i.wetoast.toast({
                    title: a.errMsg,
                    duration: 1e3
                });
                i.setData({
                    hidden: !0
                });
            });
        });
    },
    getAgainstListData: function(t) {
        var e = this, i = e.data, s = i.scduleList, a = (i.againstListData, []), n = {
            finalResult: "vs",
            otherSideId: "",
            otherSideList: [],
            sideId: "",
            sideList: [],
            winSideId: "",
            winSideList: []
        };
        t.map(function(e, i) {
            var d = e.roundId, o = e.againstList, r = s.indexOf(d), u = s.length, c = 1;
            o.length;
            r !== u - 1 && (c = Math.pow(2, u - 2 - r));
            var h = [];
            if (0 === o.length) for (var l = 0; l < c; l++) {
                var g = t[r - 1] ? t[r - 1].againstList : [], I = [], L = [];
                g.length > 0 && (I = g[2 * (l + 1) - 1].winSideList, L = g[2 * (l + 1) - 2].winSideList), 
                r === u - 1 ? (g = t[r - 2] ? t[r - 2].againstList : []).length > 0 && (I = g[2 * (l + 1) - 1].winSideList, 
                L = g[2 * (l + 1) - 2].winSideList) : r === u - 2 && g.length > 0 && (I = g[2 * (l + 1) - 1].loseSideList, 
                L = g[2 * (l + 1) - 2].loseSideList), g.length > 0 ? h[l] = {
                    finalResult: "vs",
                    otherSideId: "",
                    otherSideList: I,
                    sideId: "",
                    sideList: L,
                    winSideId: "",
                    winSideList: [],
                    loseSideList: []
                } : h[l] = n;
            } else h = o;
            a[i] = h;
        }), e.getAgainstList(a);
    },
    getAgainstList: function(t) {
        var e = [], i = t.length;
        t.map(function(t, s) {
            var a = t.length;
            if (a > 1) e[s] = {
                length: a / 2,
                index: s,
                direction: "left",
                data: t.slice(0, a / 2)
            }, e[2 * (i - 2) + 1 - s] = {
                length: a / 2,
                index: 2 * (i - 2) + 1 - s,
                direction: "right",
                data: t.slice(a / 2, a)
            }; else {
                var n = "one";
                s === i - 2 && (n = "three"), e[s] = {
                    dataType: n,
                    length: a,
                    index: s,
                    direction: "",
                    data: t
                };
            }
        }), this.setData({
            againstList: e
        });
    },
    getAgainstData: function(t, e) {
        var i = t.list, s = void 0 === i ? [] : i, a = t.memberIdAndNickNameMap, n = void 0 === a ? {} : a, d = t.sideIdAndMemberIdsMap, o = void 0 === d ? {} : d, r = t.scheduleIdAndWinSideIdMap, u = void 0 === r ? {} : r, c = [];
        return s.map(function(t, e) {
            var i = t.id, s = t.sideId, a = t.otherSideId, d = t.status, r = t.bothAbstain, h = void 0 !== r && r, l = [], g = [], I = "", L = "", f = u[i], S = [], v = [];
            d && d.name, "EMPTY_SIDE" !== s ? o[s].map(function(t, e) {
                l.push(n[t]);
            }) : l.push("轮空"), "EMPTY_SIDE" !== a ? o[a].map(function(t, e) {
                g.push(n[t]);
            }) : g.push("轮空"), f && (f === s ? (S = l, v = g) : (S = g, v = l)), h && (f = []), 
            I = 1 === l.length ? "52" : "", L = 1 === g.length ? "52" : "", c.push({
                id: i,
                sideId: s,
                otherSideId: a,
                winSideId: f,
                sideList: l,
                otherSideList: g,
                finalResult: "vs",
                status: d,
                sideLineHeight: I,
                othersideLineHeight: L,
                winSideList: S,
                loseSideList: v
            });
        }), {
            roundId: e,
            againstList: c
        };
    }
});