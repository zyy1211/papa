var e = require("../../utils/util.js"), a = getApp(), t = {
    authedUserId: "",
    id: "",
    currentPage: 0,
    pages: 0
};

Page({
    data: {
        isIpx: !1,
        dataList: []
    },
    onLoad: function(e) {
        this.setData({
            isIpx: a.globalData.isIpx
        }), t.id = e.id;
    },
    onShow: function() {
        t.isLink = !0, this.setData({
            dataList: []
        }), this.initPageLogin();
    },
    navigate: function(a, i) {
        var n = t.authedUserId, r = t.isLink;
        void 0 !== r && r && (a.detail.e && (a = a.detail.e), t.isLink = !1, e.requestEmpty(a, n), 
        wx.navigateTo({
            url: i
        }));
    },
    navigateToEnter: function(a) {
        var i = this, n = t.id, r = void 0 === n ? "" : n, o = a.currentTarget.dataset, d = o.type, s = void 0 === d ? "" : d, c = o.enter, m = void 0 !== c && c, u = o.itemid, v = void 0 === u ? "" : u, g = o.enterid, p = void 0 === g ? "" : g, I = o.createteam, h = o.amount, l = void 0 === h ? "" : h, T = "/pages/package-specialRace/userEnter?raceItemId=" + v + "&memberId=" + p + "&raceId=" + r;
        switch (m ? T += "&scene=show" : p && (T += "&scene=modify"), s) {
          case "TEAM":
            if (I) return wx.showModal({
                title: "创建队伍",
                content: "您还没有自己的队伍，请先创建队伍。拥有队伍后，在赛事详情页再次点击报名按钮会跳转至报名详情页。",
                confirmText: "创建",
                success: function(e) {
                    e.confirm && wx.navigateTo({
                        url: "/pages/package-specialRace/createTeam?raceItemId=" + v + "&raceId=" + r + "&amount=" + (l || "")
                    });
                }
            }), void e.requestEmpty(a, t.authedUserId);
            T = "/pages/package-specialRace/teamDetail?raceItemId=" + v + "&teamId=" + p + "&raceId=" + r;
            break;

          case "DOUBLE":
            T = "/pages/package-specialRace/teamDetail?raceItemId=" + v + "&teamId=" + p + "&raceId=" + r;
        }
        (T = T + "&enterType=" + s + "&amount=" + (l || "")) && i.navigate(a, T);
    },
    initPageLogin: function(a) {
        var i = this;
        t.authedUserId;
        e.initPageLogin(a).then(function(e) {
            Object.assign(t, {
                authedUserId: e
            }), i.initPageQuery();
        });
    },
    initPageQuery: function(a) {
        var i = this, n = (i.data.dataList, t.authedUserId), r = void 0 === n ? "" : n, o = t.id, d = void 0 === o ? "" : o, s = t.currentPage, c = void 0 === s ? 1 : s, m = {}, u = "";
        a || (c = 1), u = "SPECIAL_RACE_ITEM_QUERY_WITH_ENTER", Object.assign(m, {
            authedUserId: r,
            service: u,
            raceId: d,
            currentPage: c
        }), e.request("service.json", e.MD5(m)).then(function(e) {
            i.handleData(e, a);
        });
    },
    handleData: function(e, a) {
        var i = this, n = i.data.dataList, r = void 0 === n ? [] : n, o = e.hasEnterMap, d = void 0 === o ? {} : o, s = e.raceItemDetailModels, c = void 0 === s ? [] : s, m = e.enterMap, u = void 0 === m ? {} : m, v = e.enterCountMap, g = void 0 === v ? {} : v, p = e.itemTypeMap, I = void 0 === p ? {} : p, h = e.needTeamMap, l = void 0 === h ? {} : h, T = e.rejectMap, M = void 0 === T ? {} : T, L = e.raceItemChargeInfoMap, E = void 0 === L ? {} : L, b = e.paginator, f = b.page, C = void 0 === f ? 1 : f, P = b.pages, x = void 0 === P ? 1 : P;
        a || (r = []), c.map(function(e) {
            var a = e.id, t = void 0 === a ? "" : a, i = e.gmtEarliestBirth, n = void 0 === i ? "" : i, o = e.gmtLatestBirth, s = void 0 === o ? "" : o, c = e.chargeModel, m = void 0 === c ? {} : c, v = e.memberInTeamLimitMaxCount, p = void 0 === v ? 0 : v, h = e.memberInTeamLimitMinCount, T = void 0 === h ? 0 : h, L = e.manNumberInTeamMaxCount, b = void 0 === L ? 0 : L, f = e.manNumberInTeamMinCount, C = void 0 === f ? 0 : f, P = e.womanNumberInTeamMaxCount, x = void 0 === P ? 0 : P, R = e.womanNumberInTeamMinCount, y = void 0 === R ? 0 : R, D = e.enterNumberLimitMaxCount, N = void 0 === D ? 0 : D, U = (e.enterNumberLimitType, 
            e.fightModel), w = void 0 === U ? {} : U, j = e.sexLimit, k = "U" === (void 0 === j ? {} : j).name ? "总" + T + "-" + p + "，男" + C + "-" + b + "，女" + y + "-" + x : "总" + T + "-" + p;
            Object.assign(e, {
                fightModel: w,
                enterId: u[t],
                isEnter: d[t],
                memberCount: g[t] + "/" + N,
                itemType: I[t] && I[t].name,
                createTeam: l[t],
                noReject: M[t],
                teamCount: k,
                birth: n.replace(/-/g, "/").substring(0, 10) + " - " + s.replace(/-/g, "/").substring(0, 10),
                amount: "ENTERING_CHARGE" === m.name ? E[t].TEAM || E[t].PERSONAL || 0 : 0
            }), r.push(e);
        }), i.setData({
            dataList: r
        }), Object.assign(t, {
            currentPage: ++C,
            pages: x
        });
    },
    onReachBottom: function() {
        var e = t.currentPage, a = void 0 === e ? 1 : e, i = t.pages;
        a <= (void 0 === i ? 1 : i) && this.initPageQuery(!0);
    }
});