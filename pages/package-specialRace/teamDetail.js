function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
    }
    return e;
}, a = require("../../utils/util.js"), n = (getApp(), {});

Page({
    data: {
        hideModal: !0,
        teamName: "",
        enter: !1,
        leaderMember: null,
        coachMember: null,
        memberList: [],
        defaultValue: 0,
        firstEnterSpecialTeam: !1,
        noRejectName: "AUDIT_FAIL_AND_WAIT_MODIFY_INFO",
        footerData: {
            checked: !0,
            canEnter: !0
        }
    },
    onLoad: function(t) {
        var a, i = this, r = wx.getStorageSync("firstEnterSpecialTeam");
        Object.assign(n, t), i.setData((a = {}, e(a, "footerData.isTeam", "TEAM" === t.enterType), 
        e(a, "footerData.amount", t.amount), e(a, "isTeam", "TEAM" === t.enterType), e(a, "isDouble", "DOUBLE" === t.enterType), 
        a)), r || !1 === r ? this.setData({
            firstEnterSpecialTeam: r
        }) : this.setData({
            firstEnterSpecialTeam: !0
        });
    },
    onShow: function() {
        n.isLink = !0, this.initPageLogin();
    },
    navigate: function(e, t) {
        var i = n.authedUserId, r = n.isLink;
        void 0 !== r && r && (e.detail.e && (e = e.detail.e), n.isLink = !1, a.requestEmpty(e, i), 
        wx.navigateTo({
            url: t
        }));
    },
    navigateToModifyTeam: function(e) {
        var t = n.raceTeam, a = void 0 === t ? {} : t, i = "/pages/package-specialRace/createTeam?raceTeam=" + encodeURIComponent(JSON.stringify(a));
        this.navigate(e, i);
    },
    addMember: function(e) {
        var t = "/pages/package-specialRace/userEnter?raceId=" + n.raceId + "&raceItemId=" + n.raceItemId + "&teamId=" + n.teamId + "&enterType=" + n.enterType + "&teamName=" + this.data.teamName;
        this.navigate(e, t);
    },
    queryMember: function(e) {
        var t = e.currentTarget.dataset.memberid, a = n.hasEnter ? "show" : "modify", i = "/pages/package-specialRace/userEnter?raceId=" + n.raceId + "&raceItemId=" + n.raceItemId + "&teamId=" + n.teamId + "&enterType=" + n.enterType + "&teamName=" + this.data.teamName + "&memberId=" + t + "&scene=" + a;
        this.navigate(e, i);
    },
    initPageLogin: function() {
        var e = this, t = this.data.isTeam, i = void 0 !== t && t;
        a.initPageLogin().then(function(t) {
            n.authedUserId = t, i ? e.initTeamInfo() : e.initDoubleInfo();
        });
    },
    onClickGuide: function() {
        this.setData({
            firstEnterSpecialTeam: !1
        }), wx.setStorageSync("firstEnterSpecialTeam", !1);
    },
    initDoubleInfo: function() {
        var e = this, i = this, r = n.authedUserId, o = void 0 === r ? "" : r, s = n.raceItemId, d = void 0 === s ? "" : s, c = n.teamId, m = void 0 === c ? "" : c, u = n.amount, h = void 0 === u ? 0 : u;
        a.request("service.json", a.MD5({
            service: "SPECIAL_RACE_DOUBLE_ENTER_INIT",
            authedUserId: o,
            raceItemId: d,
            id: m
        })).then(function(a) {
            var r = a.canManageEnter, o = void 0 !== r && r, s = a.canCancelEnter, d = void 0 !== s && s, c = a.hasEnter, m = void 0 !== c && c, u = a.raceMemberList, l = void 0 === u ? [] : u, f = a.teamId, v = void 0 === f ? "" : f;
            l = l.length ? l.map(function(e) {
                return t({}, e);
            }) : [ {} ], n.teamId = v, n.canCancelEnter = d, n.hasEnter = m, i.setData({
                memberList: l,
                footerData: t({}, e.data.footerData, {
                    amount: h,
                    entry: "double",
                    canMange: o,
                    hasEnter: m,
                    showProto: !m && o
                })
            }), m || wx.setNavigationBarTitle({
                title: "报名"
            });
        });
    },
    initTeamInfo: function() {
        var e = this, i = n.authedUserId, r = void 0 === i ? "" : i, o = n.teamId, s = void 0 === o ? "" : o;
        a.request("service.json", a.MD5({
            service: "SPECIAL_RACE_TEAM_DETAIL_QUERY",
            authedUserId: r,
            id: s
        })).then(function(a) {
            var i = a.raceTeam, r = void 0 === i ? {} : i, o = a.memberList, s = void 0 === o ? [] : o, d = a.memberRoleTypeList, c = void 0 === d ? [] : d, m = a.leaderMember, u = a.coachMember, h = a.race, l = void 0 === h ? {} : h, f = a.canModifyTeamInfo, v = void 0 !== f && f, I = a.canCancelEnter, E = void 0 !== I && I, M = a.canManageEnter, g = void 0 !== M && M, T = a.hasEnter, b = void 0 !== T && T, p = a.needHideAddMember, D = void 0 !== p && p, L = l.teamNumLimitMinCount, C = void 0 === L ? 0 : L, y = l.teamManNumLimitMinCount, w = void 0 === y ? 0 : y, A = l.teamWomanNumLimitMinCount, _ = void 0 === A ? 0 : A, x = (l.chargeModel, 
            l.gmtEnterEnd), N = void 0 === x ? "" : x;
            Object.assign(n, {
                canCancelEnter: E,
                raceTeam: r,
                teamMin: C,
                teamManMin: w,
                teamWomanMin: _
            }), m && (m.sex = m.sex.name), u && (u.sex = u.sex.name), s.length && (s = s.map(function(e) {
                return t({}, e, {
                    sex: e.sex.name
                });
            }));
            var P = [];
            c.map(function(e) {
                P.push(e.name);
            }), e.setData({
                canModifyTeamInfo: v,
                needHideAddMember: D,
                teamName: r.name,
                enter: b,
                leaderMember: m || null,
                coachMember: u || null,
                memberList: s,
                roleTypeList: P,
                enterTime: N.substring(5, 7) + "月" + N.substring(8, 10) + "日 " + N.substring(11, 16),
                footerData: t({}, e.data.footerData, {
                    entry: "team",
                    canMange: g,
                    hasEnter: b,
                    cancelEnter: E,
                    showProto: !b && g
                })
            }), n.hasEnter = b, b || wx.setNavigationBarTitle({
                title: "报名"
            });
        });
    },
    dissMissTeam: function() {
        wx.showModal({
            title: "解散队伍",
            content: "点击确认后，所有队员均会自动从队伍移除。同时队伍将会解散，是否确认解散？",
            success: function(e) {
                e.confirm && a.request("service.json", a.MD5({
                    service: "SPECIAL_RACE_TEAM_DELETE",
                    id: n.teamId,
                    authedUserId: n.authedUserId
                })).then(function() {
                    wx.navigateBack();
                });
            }
        });
    },
    onBtnClick: function(e) {
        switch (e.detail.type) {
          case "enter":
            this.teamEnter();
            break;

          case "cancelEnter":
            this.cancelEnter();
            break;

          case "dissmissTeam":
            this.dissMissTeam();
        }
    },
    checkboxChange: function(e) {
        this.setData({
            footerData: t({}, this.data.footerData, {
                checked: e.detail.checked
            })
        });
    },
    teamEnter: function() {
        var e = this;
        n.canCancelEnter ? e.teamEnterFunc() : wx.showModal({
            title: "提示",
            content: "请确保队员信息填写无误，报名成功后不能取消报名。",
            confirmText: "确定报名",
            cancelText: "我再想想",
            success: function(t) {
                t.confirm && e.teamEnterFunc();
            }
        });
    },
    teamEnterFunc: function() {
        this.data.footerData;
        var e = n.authedUserId, t = void 0 === e ? "" : e, i = n.raceId, r = void 0 === i ? "" : i, o = n.teamId, s = void 0 === o ? "" : o, d = n.raceItemId, c = void 0 === d ? "" : d, m = n.amount, u = void 0 === m ? 0 : m;
        a.request("service.json", a.MD5({
            service: "SPECIAL_RACE_ENTER",
            raceId: r,
            authedUserId: t,
            teamId: s,
            amount: u,
            raceItemId: c,
            agreeProtocol: !0
        })).then(function(e) {
            var n = e.parameterMap, i = void 0 === n ? {} : n, r = e.depositNo;
            a.requestPayment.requestPayment(Object.assign(i, {
                depositNo: r,
                authedUserId: t
            })).then(function(e) {
                a.showToast("报名成功"), setTimeout(function() {
                    wx.navigateBack();
                }, 1e3);
            });
        });
    },
    cancelEnter: function() {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "是否确定取消报名?",
            success: function(t) {
                t.confirm && a.request("service.json", a.MD5({
                    service: "SPECIAL_RACE_CANCEL_ENTER",
                    teamId: n.teamId,
                    authedUserId: n.authedUserId
                })).then(function() {
                    e.initPageLogin();
                });
            }
        });
    },
    validateMemberCount: function(e) {
        var t = this, a = this.data.memberList, i = void 0 === a ? [] : a, r = i.filter(function(t) {
            return t.id === e;
        })[0].sex, o = 0, s = 0;
        return i.forEach(function(e) {
            "M" === e.sex ? o += 1 : s += 1;
        }), new Promise(function(e, a) {
            t.data.enter && (i.length <= n.teamMin ? a("移除后队伍人数不足，无法移除") : "M" === r && o <= n.teamManMin ? a("移除后男性队员人数不足，无法移除") : "W" === r && s <= n.teamWomanMin && a("移除后女性队员人数不足，无法移除")), 
            e();
        });
    },
    needResetLeader: function(e) {
        var t = this, i = this.data, r = i.leaderMember, o = i.footerData, s = e.currentTarget.dataset.memberid;
        n.deleteMemberId = s, this.validateMemberCount(s).then(function() {
            o.hasEnter && r && r.id === s ? t.setData({
                hideModal: !1
            }) : t.deleteMember(e);
        }).catch(function(e) {
            a.showToast(e);
        });
    },
    onSettingConfirm: function() {
        var e = this.data, t = e.memberList, a = e.defaultValue, i = e.leaderMember;
        this.doDeleteMember({
            id: n.deleteMemberId,
            moveLeaderToId: t.filter(function(e) {
                return e.id !== i.id;
            })[a].id
        });
    },
    deleteMember: function(e) {
        var t = this, i = e.currentTarget.dataset.memberid;
        a.requestEmpty(e, n.authedUserId), wx.showModal({
            title: "提示",
            content: "是否移除该成员？",
            success: function(e) {
                e.confirm && t.doDeleteMember({
                    id: i
                });
            }
        });
    },
    doDeleteMember: function(e) {
        var t = this;
        Object.assign(e, {
            service: "SPECIAL_RACE_MEMBER_DELETE",
            authedUserId: n.authedUserId
        }), a.request("service.json", a.MD5(e)).then(function() {
            t.setData({
                hideModal: !0
            }), t.initPageLogin();
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
    }
});