var e = Object.assign || function(e) {
    for (var a = 1; a < arguments.length; a++) {
        var t = arguments[a];
        for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
    }
    return e;
}, a = require("../../utils/util.js"), t = getApp();

Component({
    properties: {
        raceId: {
            type: String,
            value: "4005139327874417470970012083"
        }
    },
    data: {
        isIpx: t.globalData.isIpx,
        groupTypeName: "",
        authedUserId: "",
        enterTypeName: "",
        groupId: "",
        groupList: [],
        memberList: [],
        teamList: []
    },
    methods: {
        getGroupId: function(e) {
            var a = this, t = e.detail.projectId.project.id;
            this.setData({
                groupId: t
            }, function() {
                a.getTeamMemberList();
            });
        },
        initPageLogin: function() {
            var e = this;
            a.initPageLogin().then(function(a) {
                var t = a;
                t && "" !== t && (e.setData({
                    authedUserId: t
                }), e.getGroup());
            });
        },
        getGroup: function() {
            var e = this, t = this.data, r = t.authedUserId, i = (t.groupId, {
                service: "HN_RACE_DETAIL_QUERY",
                authedUserId: r,
                raceId: wx.getStorageSync("raceId")
            });
            a.request("service.json", a.MD5(i)).then(function(a) {
                var t = a.race, r = void 0 === t ? {} : t, i = a.raceGroups, o = void 0 === i ? [] : i, n = r.enterType, d = void 0 === n ? {} : n, s = r.groupType, m = void 0 === s ? {} : s, u = d.name, p = void 0 === u ? "" : u, c = m.name, v = void 0 === c ? "" : c, g = o[0].id;
                e.setData({
                    enterTypeName: p,
                    groupTypeName: v,
                    groupId: g,
                    groupList: o
                }, function() {
                    e.getTeamMemberList();
                });
            });
        },
        getTeamMemberList: function() {
            var t = this, r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, i = {
                authedUserId: this.data.authedUserId,
                raceId: wx.getStorageSync("raceId"),
                groupId: this.data.groupId,
                currentPage: r
            };
            "SINGLE_GROUP" === this.data.groupTypeName && "TEAM_ENTER" === this.data.enterTypeName ? a.request("service.json", a.MD5(e({
                service: "HN_RACE_TEAM_PAGE_QUERY"
            }, i))).then(function(e) {
                t.TeamDataFormat(e);
            }) : a.request("service.json", a.MD5(e({
                service: "HN_RACE_MEMBER_PAGE_QUERY"
            }, i))).then(function(e) {
                t.memberDataFormat(e);
            });
        },
        TeamDataFormat: function(e) {
            var a = e.list, t = void 0 === a ? [] : a, r = e.paginator, i = void 0 === r ? {} : r, o = e.teamIdAndMembersMap, n = void 0 === o ? {} : o, d = t.map(function(e) {
                var a = e.id, t = void 0 === a ? "" : a, r = e.name, i = {
                    name: void 0 === r ? "" : r,
                    id: t,
                    leaderName: "",
                    coachName: "",
                    players: []
                };
                return n[t].forEach(function(e) {
                    e.id;
                    var a = e.roleType, t = void 0 === a ? {} : a, r = e.name, o = void 0 === r ? "" : r, n = t.name, d = void 0 === n ? "" : n;
                    "PLAYER" === d ? i.players.push(o) : "COACH" === d ? i.coachName = o : "LEADER" === d ? i.leaderName = o : "PLAYER_AND_LEADER" === d && (i.leaderName = o, 
                    i.players.push(o));
                }), i;
            }), s = this.data.teamList, m = [];
            m = i.page <= 1 ? d : s.concat(d), this.setData({
                teamList: m,
                paginator: i
            });
        },
        memberDataFormat: function(e) {
            var a = e.list, t = void 0 === a ? [] : a, r = e.paginator, i = void 0 === r ? {} : r, o = e.raceMemberIdAndNameMap, n = void 0 === o ? {} : o, d = t.map(function(e) {
                var a = e.raceMemberId, t = void 0 === a ? "" : a, r = e.auditStatus, i = (void 0 === r ? {} : r).name;
                return {
                    raceMemberId: t,
                    auditStatusName: void 0 === i ? "" : i,
                    name: n[t]
                };
            }), s = this.data.memberList, m = [];
            m = i.page <= 1 ? d : s.concat(d), this.setData({
                memberList: m,
                paginator: i
            });
        },
        onReachBottom: function() {
            var e = this.data.paginator, a = void 0 === e ? {} : e, t = a.page, r = void 0 === t ? "" : t, i = a.pages;
            r < (void 0 === i ? "" : i) ? this.getTeamMemberList(r + 1) : wx.showToast({
                title: "已经是最后一页了"
            });
        }
    }
});