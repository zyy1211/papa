var e = require("../../utils/util.js");

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
        projectList: [],
        selectProjectId: "",
        currentPage: 1,
        pages: 1,
        tabList: [],
        tabIndex: 0,
        selectTabIndex: 0,
        allowViewEliminationTable: !1,
        hiddenModalStatus: !0,
        groupList: [],
        groupIndex: 0,
        matchList: [],
        confirmOutlineSideIds: [],
        teamIdAndTeamName: {}
    },
    methods: {
        chooseProject: function(e) {
            var t = e.detail.project.project;
            this.setData({
                selectProjectId: t.id,
                tabList: [],
                groupList: []
            }), this.initPageLogin();
        },
        initPageLogin: function() {
            var t = this;
            e.initPageLogin().then(function(e) {
                var a = e;
                a && "" !== a && (t.setData({
                    authedUserId: a
                }), t.getData(!0));
            });
        },
        getData: function(t) {
            var a = this, i = a.data, d = i.raceId, n = void 0 === d ? "" : d, o = i.selectProjectId, r = void 0 === o ? "" : o, s = i.authedUserId, c = void 0 === s ? "" : s, u = i.currentPage, I = void 0 === u ? 1 : u, m = i.pages, l = void 0 === m ? 1 : m, g = i.hiddenModalStatus, v = void 0 === g || g, h = i.tabList, p = void 0 === h ? [] : h, L = i.tabIndex, b = void 0 === L ? 0 : L, S = i.groupList, T = void 0 === S ? [] : S, f = i.groupIndex, x = void 0 === f ? 0 : f, P = {};
            t ? (I = 1, l = 1, v = !0, a.setData({
                currentPage: I,
                pages: l,
                hiddenModalStatus: v
            }), P = {
                service: "SPECIAL_RACE_SCHEDULE_AGAINST_PAGE_QUERY",
                authedUserId: c,
                raceId: n,
                currentPage: I,
                roundId: p[b] ? p[b].id : "",
                groupId: T[x] ? T[x].id : "",
                raceItemId: r
            }) : P = {
                service: "SPECIAL_RACE_SCHEDULE_AGAINST_PAGE_QUERY",
                authedUserId: c,
                raceId: n,
                currentPage: I,
                roundId: p[b] ? p[b].id : "",
                groupId: T[x] ? T[x].id : "",
                raceItemId: r
            }, "" === P.roundId && delete P.roundId, "" === P.groupId && delete P.groupId, "" === P.raceItemId && delete P.raceItemId, 
            I <= l && e.request("service.json", e.MD5(P)).then(function(e) {
                a.initData(e, t);
            });
        },
        initData: function(e, t) {
            var a = this, i = a.data, d = i.currentPage, n = void 0 === d ? 1 : d, o = i.tabList, r = void 0 === o ? [] : o, s = i.matchList, c = void 0 === s ? [] : s, u = i.confirmOutlineSideIds, I = void 0 === u ? [] : u, m = i.teamIdAndTeamName, l = void 0 === m ? {} : m, g = i.tabIndex, v = void 0 === g ? 0 : g, h = i.selectTabIndex, p = void 0 === h ? 0 : h, L = e.raceItemList, b = void 0 === L ? [] : L, S = e.pages, T = void 0 === S ? 1 : S, f = e.confirmMemberSideIds, x = void 0 === f ? [] : f, P = e.sideIdAndSideName, A = void 0 === P ? {} : P, D = e.allowViewEliminationTable, O = void 0 !== D && D, E = e.roundList, M = void 0 === E ? [] : E, N = e.currentRoundId, w = void 0 === N ? "" : N, j = e.groupList, _ = void 0 === j ? [] : j, C = e.list, U = void 0 === C ? [] : C;
            t ? (c = U, n++, I = x, l = A, (r = M).map(function(e, t) {
                w === e.id && (v = t, p = t);
            }), 0 === _.length ? a.setData({
                projectList: b,
                pages: T,
                tabList: r,
                matchList: c,
                currentPage: n,
                confirmOutlineSideIds: I,
                teamIdAndTeamName: l,
                allowViewEliminationTable: O,
                tabIndex: v,
                selectTabIndex: p
            }) : a.setData({
                projectList: b,
                pages: T,
                tabList: r,
                groupList: _,
                matchList: c,
                currentPage: n,
                confirmOutlineSideIds: I,
                teamIdAndTeamName: l,
                allowViewEliminationTable: O,
                tabIndex: v,
                selectTabIndex: p
            })) : (c = c.concat(U), n++, I = I.concat(x), l = Object.assign(l, A), 0 === _.length ? a.setData({
                projectList: b,
                pages: T,
                matchList: c,
                currentPage: n,
                confirmOutlineSideIds: I,
                teamIdAndTeamName: l,
                allowViewEliminationTable: O
            }) : a.setData({
                projectList: b,
                pages: T,
                groupList: _,
                matchList: c,
                currentPage: n,
                confirmOutlineSideIds: I,
                teamIdAndTeamName: l,
                allowViewEliminationTable: O
            })), a.initMatchCard();
        },
        initMatchCard: function() {
            for (var e = this, t = e.data, a = t.matchList, i = void 0 === a ? [] : a, d = t.confirmOutlineSideIds, n = void 0 === d ? [] : d, o = 0; o < i.length; o++) -1 === n.indexOf(i[o].sideId) ? i[o].leftOutLine = !1 : i[o].leftOutLine = !0, 
            -1 === n.indexOf(i[o].otherSideId) ? i[o].rightOutLine = !1 : i[o].rightOutLine = !0, 
            i[o].gmtPrepareStart && (i[o].gmtPrepareStart = i[o].gmtPrepareStart.slice(0, 16));
            e.setData({
                matchList: i
            });
        },
        switchPrevTab: function() {
            var e = this, t = e.data, a = t.tabIndex, i = void 0 === a ? 0 : a, d = t.currentPage, n = void 0 === d ? 1 : d, o = t.pages, r = void 0 === o ? 1 : o, s = t.matchList, c = void 0 === s ? [] : s, u = t.confirmOutlineSideIds, I = void 0 === u ? [] : u, m = t.teamIdAndTeamName, l = void 0 === m ? {} : m;
            i > 0 && (i--, n = 1, r = 1, c = [], I = [], l = {}, e.setData({
                tabIndex: i,
                currentPage: n,
                pages: r,
                matchList: c,
                confirmOutlineSideIds: I,
                teamIdAndTeamName: l
            }), e.getData());
        },
        switchNextTab: function() {
            var e = this, t = e.data, a = t.tabIndex, i = void 0 === a ? 0 : a, d = t.tabList, n = void 0 === d ? [] : d, o = t.currentPage, r = void 0 === o ? 1 : o, s = t.pages, c = void 0 === s ? 1 : s, u = t.matchList, I = void 0 === u ? [] : u, m = t.confirmOutlineSideIds, l = void 0 === m ? [] : m, g = t.teamIdAndTeamName, v = void 0 === g ? {} : g;
            i < n.length - 1 && (i++, r = 1, c = 1, I = [], l = [], v = {}, e.setData({
                tabIndex: i,
                currentPage: r,
                pages: c,
                matchList: I,
                confirmOutlineSideIds: l,
                teamIdAndTeamName: v
            }), e.getData());
        },
        openSelectModal: function() {
            var e = this, t = e.data, a = t.tabList, i = void 0 === a ? [] : a, d = t.hiddenModalStatus, n = void 0 === d || d, o = t.selectTabIndex, r = void 0 === o ? 0 : o, s = t.tabIndex, c = void 0 === s ? 0 : s;
            i.length > 1 && (r = c, n = !1, e.setData({
                hiddenModalStatus: n,
                selectTabIndex: r
            }));
        },
        closeModal: function() {
            var e = this;
            e.data.hiddenModalStatus;
            e.setData({
                hiddenModalStatus: !0
            });
        },
        selectTab: function(e) {
            var t = e.currentTarget.dataset.index, a = this, i = a.data.selectTabIndex, d = void 0 === i ? 0 : i;
            d = t, a.setData({
                selectTabIndex: d
            });
        },
        submitSelectTab: function() {
            var e = this, t = e.data, a = (t.hiddenModalStatus, t.selectTabIndex), i = void 0 === a ? 0 : a, d = t.tabIndex, n = void 0 === d ? 0 : d, o = (t.currentPage, 
            t.pages, t.matchList), r = void 0 === o ? [] : o, s = t.confirmOutlineSideIds, c = void 0 === s ? [] : s, u = t.teamIdAndTeamName, I = void 0 === u ? {} : u;
            n = i, r = [], c = [], I = {}, e.setData({
                hiddenModalStatus: !0,
                tabIndex: n,
                currentPage: 1,
                pages: 1,
                matchList: r,
                confirmOutlineSideIds: c,
                teamIdAndTeamName: I
            }), e.getData();
        },
        changeGroupIndex: function(e) {
            var t = e.currentTarget.dataset.groupIndex, a = this, i = a.data, d = i.groupIndex, n = void 0 === d ? 0 : d, o = (i.currentPage, 
            i.pages, i.matchList), r = void 0 === o ? [] : o, s = i.confirmOutlineSideIds, c = void 0 === s ? [] : s, u = i.teamIdAndTeamName, I = void 0 === u ? {} : u;
            n = t, r = [], c = [], I = {}, a.setData({
                groupIndex: n,
                currentPage: 1,
                pages: 1,
                matchList: r,
                confirmOutlineSideIds: c,
                teamIdAndTeamName: I
            }), a.getData();
        },
        navigateMatchInfo: function() {
            var e = this.data, t = e.tabIndex, a = void 0 === t ? 0 : t, i = e.raceId, d = void 0 === i ? "" : i, n = e.selectProjectId, o = void 0 === n ? "" : n, r = e.tabList, s = void 0 === r ? [] : r, c = e.groupList, u = void 0 === c ? [] : c, I = e.groupIndex;
            "LOOP_GAME" === s[a].stage.name ? wx.navigateTo({
                url: "groupRank?groupId=" + u[I].id
            }) : wx.navigateTo({
                url: "knockoutMatch?raceId=" + d + "&itemId=" + o
            });
        }
    }
});