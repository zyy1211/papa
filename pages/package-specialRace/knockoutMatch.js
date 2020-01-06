var t = require("../../utils/util.js"), i = getApp();

Page({
    data: {
        authedUserId: "",
        raceId: "",
        itemId: "",
        isIpx: !1,
        roundList: [],
        leftRound: [],
        rightRound: [],
        threeFourRound: {},
        semifinal: {}
    },
    onLoad: function(t) {
        this.setData({
            raceId: t.raceId,
            itemId: t.itemId,
            isIpx: i.globalData.isIpx
        });
    },
    onShow: function() {
        this.initPageLogin();
    },
    onHide: function() {
        var t = this, i = t.data, e = i.roundList, s = void 0 === e ? [] : e, n = i.leftRound, a = void 0 === n ? [] : n, d = i.rightRound, o = void 0 === d ? [] : d, r = i.threeFourRound, u = void 0 === r ? {} : r, h = i.semifinal, L = void 0 === h ? {} : h;
        s = [], a = [], o = [], u = {}, L = {}, t.setData({
            roundList: s,
            leftRound: a,
            rightRound: o,
            threeFourRound: u,
            semifinal: L
        });
    },
    initPageLogin: function(i) {
        var e = this;
        t.initPageLogin().then(function(t) {
            var i = t;
            i && "" !== i && (e.setData({
                authedUserId: i
            }), e.getData());
        });
    },
    getData: function() {
        var i = this, e = i.data, s = e.raceId, n = void 0 === s ? "" : s, a = e.itemId, d = void 0 === a ? "" : a, o = e.authedUserId, r = void 0 === o ? "" : o, u = e.roundList, h = void 0 === u ? [] : u, L = {
            service: "SPECIAL_RACE_SCHEDULE_WITH_ELIMINATION_TABLE_INIT",
            authedUserId: r,
            raceId: n,
            itemId: d
        };
        t.request("service.json", t.MD5(L)).then(function(t) {
            t.roundList && t.roundList.length > 0 && (h = t.roundList, i.setData({
                roundList: h
            }), i.initTeamList());
        });
    },
    initTeamList: function() {
        for (var i = this, e = i.data, s = e.authedUserId, n = void 0 === s ? "" : s, a = e.roundList, d = void 0 === a ? [] : a, o = [], r = d.length - 1; r >= 0; r--) !function(e) {
            var s = {
                service: "SPECIAL_RACE_SCHEDULE_WITH_ELIMINATION_TABLE_QUERY",
                roundId: d[e].id,
                authedUserId: n
            };
            o[e] = t.request("service.json", t.MD5(s)).then(function(t) {
                var s = t.list, n = void 0 === s ? [] : s, a = t.sideIdAndSideName, o = void 0 === a ? {} : a, r = n;
                d[e] = Object.assign(d[e], {
                    teamList: r,
                    sideIdAndSideName: o
                }), i.setData({
                    roundList: d
                });
            });
        }(r);
        Promise.all(o).then(function() {
            i.initData();
        });
    },
    initData: function() {
        for (var t = this, i = t.data, e = (i.authedUserId, i.roundList), s = void 0 === e ? [] : e, n = i.threeFourRound, a = void 0 === n ? {} : n, d = i.semifinal, o = void 0 === d ? {} : d, r = i.leftRound, u = void 0 === r ? [] : r, h = i.rightRound, L = void 0 === h ? [] : h, l = s.length - 1; l >= 0; l--) "THIRD_FOURTH_FINAL_GAME" === s[l].roundCode && (a = s[l], 
        s.splice(l, 1), t.setData({
            roundList: s,
            threeFourRound: a
        })), "ONE_HALF_IN_FINAL_GAME" === s[l].roundCode && (o = s[l], t.setData({
            semifinal: o
        }));
        for (var I = JSON.parse(JSON.stringify(s)), g = 0; g < I.length; g++) {
            var v = I[g].teamList.length;
            if (0 === v && I[g - 1]) if (I[g].teamList.length = I[g - 1].teamList.length / 2, 
            I[g].teamList.length % 2) u.push(I[g]), L.push(I[g]); else {
                var f = JSON.parse(JSON.stringify(I)), c = JSON.parse(JSON.stringify(I));
                u.push(f[g]), L.push(c[g]), u[g].teamList.splice(u[g].teamList.length / 2, u[g].teamList.length / 2), 
                L[g].teamList.splice(0, L[g].teamList.length / 2);
            } else if (1 === v) {
                var m = JSON.parse(JSON.stringify(I));
                u.push(m[g]), L.push(m[g]);
            } else {
                var N = JSON.parse(JSON.stringify(I)), p = JSON.parse(JSON.stringify(I));
                u = u.concat(N[g]), L = L.concat(p[g]), u[g].teamList.splice(u[g].teamList.length / 2, u[g].teamList.length / 2), 
                L[g].teamList.splice(0, L[g].teamList.length / 2);
            }
        }
        L.reverse(), t.setData({
            leftRound: u,
            rightRound: L
        });
    }
});