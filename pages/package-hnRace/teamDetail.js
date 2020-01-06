var e = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
    }
    return e;
}, t = require("../../utils/util.js"), a = getApp();

Page({
    data: {
        hideModal: !0,
        teamName: "",
        enter: !1,
        enterType: "",
        groupType: "",
        leaderMember: null,
        coachMember: null,
        memberList: [],
        defaultValue: 0,
        auditFailMemberIds: [],
        firstEnterTeam: !1,
        footerData: {
            checked: !0,
            canEnter: !0
        }
    },
    onLoad: function(e) {
        var t = wx.getStorageSync("firstEnterTeam");
        this.scene = e.scene, this.raceTeamId = e.raceTeamId, this.manMemberCount = 0, this.womanMemberCount = 0, 
        this.roleTypes = wx.getStorageSync("roleTypes"), this.initPageLogin(), this.ifFromCreateTeam(), 
        this.initTeamMemberLimit(), t || !1 === t ? this.setData({
            firstEnterTeam: t
        }) : this.setData({
            firstEnterTeam: !0
        });
    },
    onUnload: function() {
        var e = getCurrentPages(), t = e[e.length - 2];
        "pages/package-hnRace/hnRaceIndex" === t.route ? t.initPageLogin() : e[e.length - 3].initPageLogin();
    },
    ifFromCreateTeam: function() {
        var e = getCurrentPages();
        "pages/package-hnRace/createTeam" === e[e.length - 2].route && e[e.length - 2].setData({
            hasCreated: !0
        });
    },
    initTeamMemberLimit: function() {
        var e = JSON.parse(wx.getStorageSync("raceGroups")), t = (e = e.length ? e : [ {} ])[0], a = t.teamNumLimitMinCount, n = void 0 === a ? 0 : a, i = t.teamNumLimitMaxCount, r = void 0 === i ? 0 : i, s = t.teamManNumLimitMinCount, o = void 0 === s ? 0 : s, c = t.teamManNumLimitMaxCount, d = void 0 === c ? 0 : c, m = t.teamWomanNumLimitMinCount, u = void 0 === m ? 0 : m, h = t.teamWomanNumLimitMaxCount, g = void 0 === h ? 0 : h;
        this.teamMin = n, this.teamMax = r, this.teamManMin = o, this.teamManMax = d, this.teamWomanMin = u, 
        this.teamWomanMax = g;
    },
    initPageLogin: function() {
        var e = this, a = this;
        t.initPageLogin().then(function(t) {
            var n = t;
            n && "" !== n && (a.setData({
                authedUserId: n,
                groupType: e.groupType
            }), e.initTeamInfo());
        });
    },
    onClickGuide: function() {
        this.setData({
            firstEnterTeam: !1
        }), wx.setStorageSync("firstEnterTeam", !1);
    },
    initTeamInfo: function() {
        var a = this;
        t.request("service.json", t.MD5({
            service: "HN_RACE_TEAM_DETAIL_QUERY",
            raceId: wx.getStorageSync("raceId"),
            authedUserId: this.data.authedUserId,
            teamId: this.raceTeamId
        })).then(function(t) {
            var n = t.raceTeam, i = void 0 === n ? {} : n, r = t.memberList, s = void 0 === r ? [] : r, o = t.canKickOutMember, c = t.canCancelEnter, d = t.gmtEnterStart, m = t.gmtEnterEnd, u = t.nowDate, h = t.auditFailMemberIds, g = void 0 === h ? [] : h, l = t.leaderMember, M = t.coachMember;
            l && (l.sex = l.sex.name), M && (M.sex = M.sex.name), s.length && (s = s.map(function(t) {
                return e({}, t, {
                    sex: t.sex.name
                });
            }));
            var f = new Date(m.replace(/-/g, "/")).getTime() < new Date(u.replace(/-/g, "/")).getTime();
            a.setData({
                id: i.id,
                teamName: i.name,
                enter: i.enter,
                leaderMember: l || null,
                coachMember: M || null,
                memberList: s,
                canKickOutMember: o,
                canCancelEnter: c,
                gmtEnterStart: d,
                gmtEnterEnd: m,
                enterType: wx.getStorageSync("enterType"),
                groupType: wx.getStorageSync("groupType"),
                auditFailMemberIds: g,
                roleTypeList: a.roleTypes.split(","),
                footerData: e({}, a.data.footerData, {
                    entry: "team",
                    canEnter: !i.enter,
                    canCancel: c && !f,
                    showProto: (!i.enter || c) && !f
                })
            });
        });
    },
    dissMissTeam: function() {
        var e = this;
        wx.showModal({
            title: "解散队伍",
            content: "点击确认后，所有队员均会自动从队伍移除。同时队伍将会解散，是否确认解散？",
            success: function(a) {
                a.confirm && t.request("service.json", t.MD5({
                    service: "HN_RACE_TEAM_DELETE",
                    teamId: e.data.id,
                    authedUserId: e.data.authedUserId
                })).then(function() {
                    wx.navigateBack();
                });
            }
        });
    },
    onBtnClick: function(e) {
        var t = e.detail.type;
        "enter" === t ? this.teamEnter() : "cancelEnter" === t ? this.cancelEnter() : "dissmissTeam" === t && this.dissMissTeam();
    },
    checkboxChange: function(t) {
        this.setData({
            footerData: e({}, this.data.footerData, {
                checked: t.detail.checked
            })
        });
    },
    teamEnter: function() {
        var e = this;
        t.request("service.json", t.MD5({
            service: "HN_RACE_ENTER",
            raceId: wx.getStorageSync("raceId"),
            authedUserId: e.data.authedUserId,
            belongId: e.data.id,
            belongType: "TEAM"
        })).then(function() {
            wx.showToast({
                content: "报名成功",
                icon: "success",
                duration: 1500
            }), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        });
    },
    cancelEnter: function() {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "是否确定取消报名?",
            success: function(a) {
                a.confirm && t.request("service.json", t.MD5({
                    service: "HN_RACE_ENTER_CANCEL",
                    objectType: "team",
                    objectId: e.data.id,
                    authedUserId: e.data.authedUserId,
                    raceId: wx.getStorageSync("raceId"),
                    belongType: "TEAM"
                })).then(function() {
                    e.initPageLogin();
                });
            }
        });
    },
    addMember: function() {
        wx.navigateTo({
            url: a.globalData.userEnter + "?scene=create&teamId=" + this.data.id
        });
    },
    setLeaderAndMember: function(e) {
        this.setData({
            hideModal: !1
        });
    },
    validateMemberCount: function(e) {
        var t = this, a = this.data.memberList, n = void 0 === a ? [] : a, i = n.filter(function(t) {
            return t.id === e;
        })[0].sex, r = 0, s = 0;
        return n.forEach(function(e) {
            "M" === e.sex ? r += 1 : s += 1;
        }), new Promise(function(e, a) {
            t.data.enter && (n.length <= t.teamMin ? a("移除后队伍人数不足，无法移除") : "M" === i && r <= t.teamManMin ? a("移除后男性队员人数不足，无法移除") : "W" === i && s <= t.teamWomanMin && a("移除后女性队员人数不足，无法移除")), 
            e();
        });
    },
    needResetLeader: function(e) {
        var a = this, n = this.data, i = n.leaderMember, r = n.footerData, s = e.currentTarget.dataset.memberid;
        this.memberid = s, this.validateMemberCount(s).then(function() {
            "SINGLE_GROUP" === wx.getStorageSync("groupType") && !r.canEnter && i && i.id === s ? a.setData({
                hideModal: !1
            }) : a.deleteMember(e);
        }).catch(function(e) {
            t.showToast(e);
        });
    },
    onSettingConfirm: function() {
        var e = this, a = this.data, n = a.memberList, i = a.defaultValue, r = a.authedUserId, s = a.leaderMember;
        t.request("service.json", t.MD5({
            service: "HN_RACE_MEMBER_DELETE",
            raceMemberId: this.memberid,
            moveLeaderToId: n.filter(function(e) {
                return e.id !== s.id;
            })[i].id,
            authedUserId: r
        })).then(function() {
            e.initPageLogin(), e.setData({
                hideModal: !0
            });
        });
    },
    onSettingCancel: function() {
        this.setData({
            hideModal: !0
        });
    },
    bindPickerChange: function(e) {
        this.setData({
            defaultValue: e.detail.value
        });
    },
    deleteMember: function(e) {
        var a = this, n = e.currentTarget.dataset.memberid;
        wx.showModal({
            title: "提示",
            content: "是否移除该成员？",
            success: function(e) {
                e.confirm && t.request("service.json", t.MD5({
                    service: "HN_RACE_MEMBER_DELETE",
                    raceMemberId: n,
                    authedUserId: a.data.authedUserId
                })).then(function() {
                    a.setData({
                        memberList: a.data.memberList.filter(function(e) {
                            return e.id !== n;
                        })
                    }), a.initPageLogin();
                });
            }
        });
    },
    queryMember: function(e) {
        var t = e.currentTarget.dataset.memberid, a = JSON.stringify(this.data.memberList), n = JSON.stringify(this.data.leaderMember);
        wx.navigateTo({
            url: "/pages/package-hnRace/userEnter?memberId=" + t + "&scene=modify&teamId=" + this.data.id + "&teamEntered=" + this.data.enter + "&memberList=" + a + "&leaderMember=" + n
        });
    }
});