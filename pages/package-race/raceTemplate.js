var e = require("../../utils/util.js"), t = getApp(), i = {};

Page({
    data: {
        datalist: [],
        currentRuleName: "",
        currentDescribe: "",
        modalHidden: !0
    },
    onLoad: function(e) {
        this.initPageLogin(), this.setData({
            isIpx: t.globalData.isIpx
        });
    },
    initPageLogin: function(t) {
        var a = this;
        e.initPageLogin(t).then(function(e) {
            i.authedUserId = e, a.initPageQuery();
        });
    },
    initPageQuery: function() {
        var t = this, a = i.authedUserId;
        e.request("service.json", e.MD5({
            service: "RACE_DEFAULT_RULE_QUERY",
            authedUserId: a
        })).then(function(e) {
            t.initPageData(e);
        });
    },
    initPageData: function(e) {
        var t = this, i = t.data.datalist, a = e.notPublicedRules, r = void 0 === a ? [] : a, n = e.publicedRules, c = void 0 === n ? [] : n, s = e.ruleIdAndDescribe, u = void 0 === s ? {} : s;
        c.map(function(e, t) {
            var a = e.id, r = (e.limitMaxNum, e.limitMinNum, e.memo, e.ruleName, e.ruleCode), n = e.ruleType, c = void 0 === n ? {} : n, s = "/static/eight-people-race.png", l = "/static/blue-race-bg.png", d = !1, o = u[a] || "", g = !1;
            switch (t % 2 != 0 && (l = "/static/green-race-bg.png"), c && "POINT_RACE" === c.name && (d = !0), 
            r) {
              case "EIGHT_TURN":
                s = "/static/eight-people-race.png";
                break;

              case "LOOP_ELIMINATION":
                s = "/static/cycling-elimination-race.png", g = !0;
                break;

              case "ELIMINATION":
                s = "/static/elimination-race.png";
                break;

              case "LOOP":
                s = "/static/cycling-race.png";
                break;

              case "TEAM":
                s = "/static/team-race.png", e.ruleDescribe = "发布团体赛请下载PaPa体育app使用";
            }
            Object.assign(e, {
                titleUrl: s,
                titleBgUrl: l,
                isPointRace: d,
                describe: o,
                isMoreTitle: g,
                isNotPublic: !1
            }), i.push(e);
        }), r.map(function(e, t) {
            e.id, e.limitMaxNum, e.limitMinNum, e.memo, e.ruleName, e.ruleCode, e.ruleType;
            Object.assign(e, {
                titleUrl: "/static/team-race.png",
                titleBgUrl: "/static/gray-race-bg.png",
                isNotPublic: !0
            }), i.push(e);
        }), t.setData({
            datalist: i
        });
    },
    bindNavigate: function(t) {
        var i = t.currentTarget.dataset, a = i.id, r = i.isnotpublic, n = i.rulecode;
        r || "TEAM" === n ? e.downloadApp.getDownloadAppUrl() : wx.navigateTo({
            url: "/pages/package-race/raceEvent?ruleId=" + a
        });
    },
    showDescribe: function(e) {
        var t = this, i = t.data, a = i.datalist, r = void 0 === a ? [] : a, n = i.currentRuleName, c = void 0 === n ? "" : n, s = i.currentDescribe, u = void 0 === s ? "" : s, l = e.currentTarget.dataset.id;
        r.map(function(e, t) {
            var i = e.ruleName, a = e.describe;
            l === e.id && (c = i, u = a);
        }), t.setData({
            currentRuleName: c,
            currentDescribe: u,
            modalHidden: !1
        });
    },
    closeModal: function() {
        this.setData({
            modalHidden: !0
        });
    }
});