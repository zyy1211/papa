var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        authedUserId: "",
        groupId: "",
        isIpx: !1,
        hasRuling: !1,
        groupList: [],
        groupIndex: 0,
        resultIdMapResultDetail: {},
        objectIdMapObjectName: {},
        teamList: []
    },
    onLoad: function(t) {
        this.setData({
            groupId: t.groupId,
            isIpx: e.globalData.isIpx
        });
    },
    onShow: function() {
        this.initPageLogin();
    },
    onPullDownRefresh: function() {
        wx.stopPullDownRefresh();
    },
    initPageLogin: function() {
        var e = this;
        t.initPageLogin().then(function(t) {
            var a = t;
            a && "" !== a && (e.setData({
                authedUserId: a
            }), e.getData());
        });
    },
    getData: function() {
        var e = this, a = e.data, i = a.groupId, o = void 0 === i ? "" : i, d = a.authedUserId, s = void 0 === d ? "" : d, u = a.teamList, n = void 0 === u ? [] : u, r = a.objectIdMapObjectName, I = void 0 === r ? {} : r, g = a.resultIdMapResultDetail, p = void 0 === g ? {} : g;
        n = [], I = {}, p = {}, e.setData({
            teamList: n,
            objectIdMapObjectName: I,
            resultIdMapResultDetail: p
        });
        var c = {
            service: "SPECIAL_RACE_GROUP_RESULT_LIST_QUERY",
            authedUserId: s,
            groupId: o
        };
        t.request("service.json", t.MD5(c)).then(function(t) {
            e.initData(t);
        });
    },
    initData: function(t) {
        var e = this, a = e.data, i = a.teamList, o = void 0 === i ? [] : i, d = a.objectIdMapObjectName, s = void 0 === d ? {} : d, u = a.resultIdMapResultDetail, n = void 0 === u ? {} : u, r = a.hasRuling, I = void 0 !== r && r, g = a.groupIndex, p = void 0 === g ? 0 : g, c = a.groupId, l = void 0 === c ? "" : c, v = t.groupList, D = void 0 === v ? [] : v, h = t.resultList, j = void 0 === h ? [] : h, L = t.objectIdAndObjectName, b = void 0 === L ? {} : L, m = t.resultIdAndResultDetail, R = void 0 === m ? {} : m;
        n = Object.assign(n, R), s = Object.assign(s, b), (o = o.concat(j)).map(function(t, e) {
            t.resultInfo = n[t.id], t.teamName = s[t.resultObjectId];
        }), D.map(function(t, e) {
            t.id === l && (p = e), t.needDraw && (I = !0);
        }), e.setData({
            groupList: D,
            teamList: o,
            resultIdMapResultDetail: n,
            objectIdMapObjectName: s,
            hasRuling: I,
            groupIndex: p
        });
    },
    changeGroupIndex: function(t) {
        var e = t.currentTarget.dataset.groupIndex, a = this, i = a.data, o = i.groupIndex, d = void 0 === o ? 0 : o, s = i.groupId, u = void 0 === s ? "" : s, n = i.groupList;
        u = (void 0 === n ? [] : n)[d = e].id, a.setData({
            groupIndex: d,
            groupId: u
        }), a.getData();
    }
});