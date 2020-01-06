var e = require("../../utils/util.js");

Component({
    properties: {
        authedUserId: {
            type: String,
            value: ""
        },
        matchInfo: {
            type: Object,
            value: {}
        },
        teamIdAndTeamName: {
            type: Object,
            value: {}
        },
        confirmOutlineSideIds: {
            type: Array,
            value: []
        }
    },
    data: {
        showMember: !1,
        showAbstainInfo: !1,
        memberList: [],
        scheduleIdMatchResults: {},
        warnInfo: {}
    },
    methods: {
        showMemberToggle: function() {
            var t = this, a = t.data, s = a.showMember, r = void 0 !== s && s, i = a.authedUserId, n = void 0 === i ? "" : i, d = a.matchInfo, o = void 0 === d ? {} : d, h = a.memberList, u = void 0 === h ? [] : h;
            if (r) r = !r, t.setData({
                showMember: r
            }); else {
                var I = o.id;
                e.request("service.json", e.MD5({
                    service: "SPECIAL_RACE_MEMBER_SCHEDULE_IN_TEAM_QUERY",
                    authedUserId: n,
                    scheduleId: I
                })).then(function(e) {
                    for (var a = e.list, s = void 0 === a ? [] : a, i = e.sideIdAndMemberIdsMap, n = void 0 === i ? {} : i, d = e.memberIdAndNickNameMap, o = void 0 === d ? {} : d, h = e.scheduleIdMatchResults, I = void 0 === h ? {} : h, m = 0; m < s.length; m++) {
                        for (var c = [], l = [], v = "", b = 0; b < n[s[m].sideId].length; b++) c.push(o[n[s[m].sideId][b]]);
                        for (var f = 0; f < n[s[m].otherSideId].length; f++) l.push(o[n[s[m].otherSideId][f]]);
                        if (s[m].winSide) {
                            for (var w = 0; w < n[s[m].winSide].length; w++) v += o[n[s[m].winSide][w]] + "/";
                            v = v.slice(0, v.length - 1);
                        }
                        s[m] = Object.assign(s[m], {
                            sideMember: c,
                            otherSideMember: l,
                            winUsers: v
                        });
                    }
                    u = s, r = !r, t.setData({
                        showMember: r,
                        memberList: u,
                        scheduleIdMatchResults: I
                    });
                });
            }
        },
        openAbstainModal: function(e) {
            var t = e.currentTarget.dataset.warnName, a = e.currentTarget.dataset.warnInfo;
            t = e.currentTarget.dataset.bothAbstain ? "双方弃权" : "胜方：" + t;
            var s = this, r = s.data, i = (r.showAbstainInfo, r.warnInfo), n = void 0 === i ? {} : i;
            n = Object.assign(n, {
                warnName: t,
                warnMemo: a
            }), s.setData({
                showAbstainInfo: !0,
                warnInfo: n
            });
        },
        closeModal: function() {
            var e = this;
            e.data.showAbstainInfo;
            e.setData({
                showAbstainInfo: !1
            });
        }
    }
});