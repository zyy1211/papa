function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
        return n;
    }
    return Array.from(e);
}

var t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
    }
    return e;
}, n = (getApp(), require("../../utils/util.js")), a = {};

Page({
    data: {
        sectionList: [],
        showEnterTime: !0,
        footerData: {
            checked: !0,
            canEnter: !1,
            entry: "detail",
            canModify: !1,
            canCancel: !1,
            showProto: !1
        },
        currentRoleType: "PLAYER",
        noRejectName: "AUDIT_FAIL_AND_WAIT_MODIFY_INFO"
    },
    onLoad: function(e) {
        var t = this, n = "TEAM" === e.enterType || "DOUBLE" === e.enterType, i = "show" === e.scene, o = "modify" === e.scene, r = "TEAM" === e.enterType;
        Object.assign(a, e, {
            isTeam: r,
            isTeamEnter: n,
            isModify: o,
            isShow: i
        }), t.initPageLogin();
        var d = "报名详情";
        i || (d = n ? "添加成员" : "报名"), wx.setNavigationBarTitle({
            title: d
        });
    },
    initPageLogin: function() {
        var e = this;
        n.initPageLogin().then(function(t) {
            a.authedUserId = t, a.isModify || a.isShow ? e.backFillForm() : e.initEnterOptions();
        });
    },
    showRejectReason: function(e) {
        wx.showModal({
            title: "驳回理由",
            content: a.auditReason,
            showCancel: !1,
            confirmText: "知道了"
        });
    },
    backFillData: function(e) {
        e.auditStatus;
        var i = e.raceMemberWithExtInfo, o = void 0 === i ? {} : i, r = e.memberRoleTypeList, d = void 0 === r ? [] : r, s = e.extInfoIdAndMemoMap, c = void 0 === s ? {} : s, m = e.extInfoIdAndNameMap, u = void 0 === m ? {} : m, l = e.dataContentOwnerIdAndImageUrlMap, f = void 0 === l ? {} : l, v = e.dataContentOwnerIdAndTextContentMap, p = void 0 === v ? {} : v, E = e.extInfoTypeMap, I = void 0 === E ? {} : E, h = e.canCancelEnter, y = void 0 !== h && h, T = e.canManageEnter, M = void 0 !== T && T, x = e.hasEnter, g = void 0 !== x && x, A = this.data.noRejectName, b = void 0 === A ? "" : A, C = a.isTeamEnter, R = void 0 !== C && C, D = a.isTeam, w = void 0 !== D && D, L = a.teamName, j = void 0 === L ? "" : L, _ = a.isModify, P = void 0 !== _ && _, O = o.name, k = void 0 === O ? "" : O, S = o.sex, F = void 0 === S ? {} : S, U = o.cell, N = void 0 === U ? "" : U, B = o.extInfoList, q = void 0 === B ? [] : B, Y = o.roleType, X = void 0 === Y ? {} : Y, G = o.status, Q = void 0 === G ? {} : G, W = o.auditReason, H = void 0 === W ? "" : W, z = [ {
            type: "input",
            label: "姓名",
            name: "name",
            value: k,
            placeholder: "请输入姓名",
            inputType: "text",
            canModify: P = P || Q.name === b,
            validate: {
                max: 15
            }
        }, {
            type: "sex-select",
            label: "性别",
            name: "sex",
            value: F.name,
            canModify: P
        }, {
            type: "input",
            label: "手机号",
            name: "cell",
            value: N,
            placeholder: "请输入手机号",
            inputType: "number",
            canModify: P,
            validate: {
                max: 11
            }
        } ];
        q.forEach(function(e) {
            a.infoIdAndTypeMap[e.id] = e.extInfoDataType.name, a.infoIdAndConfigIdMap[e.id] = e.extInfoConfigId;
        }), w && z.unshift({
            type: "input",
            label: "队伍",
            name: "team",
            value: j,
            canModify: !1
        }, {
            type: "select",
            label: "角色",
            name: "roleType",
            value: X.name,
            options: d.map(function(e) {
                return {
                    name: e.message,
                    value: e.name
                };
            }),
            canModify: !g
        }), q.length && (q = q.map(function(e) {
            var t = e.dataContentOwnerIds, a = void 0 === t ? [] : t, i = e.extInfoConfigId, o = void 0 === i ? "" : i, r = e.id, d = void 0 === r ? "" : r, s = e.extInfoDataType, m = void 0 === s ? {} : s, l = "SYSTEM" === I[o].name, v = u[o], E = {
                isSystem: l,
                type: "TEXT" === m.name ? "input" : "image",
                label: v,
                name: d,
                value: "TEXT" === m.name ? p[a[0]] : a.map(function(e) {
                    return {
                        imageSrc: f[e],
                        imageId: n.string.getQueryString(f[e], "ownerId")
                    };
                }),
                placeholder: c[o],
                inputType: "text",
                canModify: P,
                validate: {
                    max: 30
                }
            };
            return /身份证/.test(v) && l ? (E.inputType = "idcard", E.validate = {
                max: 18
            }) : /年龄/.test(v) && l ? (E.inputType = "number", E.validate = {
                max: 3
            }) : /证件/.test(v) && l ? E.validate = {
                max: 20
            } : /尺码/.test(v) && l && (E.validate = {
                max: 10
            }), E;
        }));
        var J = {};
        J = R ? t({}, this.data.footerData, {
            entry: "teamDetail",
            canEnter: !1,
            hasEnter: g,
            noReject: Q.name === b
        }) : t({}, this.data.footerData, {
            entry: "detail",
            canEnter: !g && M,
            canModify: Q.name === b,
            showProto: !g && M,
            canCancel: g && M && y
        }), a.auditReason = H, a.canCancelEnter = y, this.setData({
            showAuditReason: Q.name === b,
            currentRoleType: X.name,
            sectionList: z.concat(q),
            footerData: J
        });
    },
    backFillForm: function() {
        var e = this;
        a.infoIdAndConfigIdMap = {}, a.infoIdAndTypeMap = {};
        var t = {
            service: "SPECIAL_RACE_MEMBER_MODIFY_INIT",
            id: a.memberId,
            authedUserId: a.authedUserId
        };
        a.isShow && a.isTeamenter && (t.service = "SPECIAL_RACE_MEMBER_DETAIL_QUERY"), n.request("service.json", n.MD5(t)).then(function(t) {
            e.backFillData(t);
        });
    },
    initForm: function(e) {
        var n = a.isTeamEnter, i = void 0 !== n && n, o = a.isTeam, r = void 0 !== o && o, d = a.teamName, s = void 0 === d ? "" : d, c = a.amount, m = void 0 === c ? 0 : c, u = e.userRaceEnterExtInfoCfgList, l = void 0 === u ? [] : u, f = e.memberRoleTypeList, v = void 0 === f ? [] : f, p = e.extInfoTypeMap, E = void 0 === p ? {} : p, I = e.canCancelEnter, h = void 0 !== I && I;
        a.infoIdAndTypeMap = {}, a.infoIdAndConfigIdMap = {}, a.canCancelEnter = h;
        var y = [ {
            type: "input",
            label: "姓名",
            name: "name",
            value: "",
            placeholder: "请输入姓名",
            inputType: "text",
            canModify: !0,
            validate: {
                max: 15
            }
        }, {
            type: "sex-select",
            label: "性别",
            name: "sex",
            value: "",
            canModify: !0
        }, {
            type: "input",
            label: "手机号",
            name: "cell",
            value: "",
            placeholder: "请输入手机号",
            inputType: "number",
            canModify: !0,
            validate: {
                max: 11
            }
        } ], T = l;
        T.forEach(function(e) {
            a.infoIdAndTypeMap[e.id] = e.dataType.name, a.infoIdAndConfigIdMap[e.id] = e.id;
        }), r && y.unshift({
            type: "input",
            label: "队伍",
            name: "team",
            value: s,
            canModify: !1
        }, {
            type: "select",
            label: "角色",
            name: "roleType",
            value: "PLAYER",
            options: v.map(function(e) {
                return {
                    name: e.message,
                    value: e.name
                };
            }),
            canModify: !0
        });
        var M = {}, x = !0;
        i ? (x = !1, M = t({}, this.data.footerData, {
            entry: "teamDetail",
            canEnter: !0,
            canModify: !1,
            canCancel: !1,
            showProto: !1
        })) : M = t({}, this.data.footerData, {
            entry: "detail",
            canEnter: !0,
            canCancel: !1,
            canModify: !1,
            showProto: !0,
            amount: m
        }), this.setData({
            showEnterTime: x,
            sectionList: y.concat(T.map(function(e) {
                var t = e.id, n = void 0 === t ? "" : t, a = e.name, i = void 0 === a ? "" : a, o = e.dataType, r = void 0 === o ? {} : o, d = "SYSTEM" === E[n].name, s = {
                    isSystem: d,
                    type: "IMAGE" === r.name ? "image" : "input",
                    label: i,
                    name: n,
                    value: "IMAGE" === r.name ? [] : "",
                    placeholder: e.memo,
                    inputType: "text",
                    canModify: !0,
                    validate: {
                        max: 30
                    }
                };
                return /身份证/.test(i) && d ? (s.inputType = "idcard", s.validate = {
                    max: 18
                }) : /年龄/.test(i) && d ? (s.inputType = "number", s.validate = {
                    max: 3
                }) : /证件/.test(i) && d ? s.validate = {
                    max: 20
                } : /尺码/.test(i) && d && (s.validate = {
                    max: 10
                }), s;
            })),
            footerData: M
        });
    },
    initEnterOptions: function() {
        var e = this, t = a.authedUserId, i = a.raceItemId;
        n.request("service.json", n.MD5({
            service: "SPECIAL_RACE_MEMBER_CREATE_INIT",
            authedUserId: t,
            raceItemId: i
        })).then(function(t) {
            e.initForm(t);
        });
    },
    onBtnClick: function(e) {
        var t = this, i = e.detail.type, o = t.selectComponent("#flexbleForm");
        "enter" === i ? o.validateForm().then(function(e) {
            a.isTeamEnter ? t.initEnterParams(e) : t.userEnter(e);
        }).catch(function(e) {
            n.showToast(e);
        }) : "cancelEnter" === i ? this.cancelEnter() : "reEnter" === i && o.validateForm().then(function(e) {
            a.isTeamEnter, t.initEnterParams(e, "modify");
        }).catch(function(e) {
            n.showToast(e);
        });
    },
    initEnterParams: function(e, t) {
        var n = this, i = e.name, o = e.sex, r = e.cell, d = e.roleType, s = a.authedUserId, c = void 0 === s ? "" : s, m = a.raceId, u = void 0 === m ? "" : m, l = a.teamId, f = void 0 === l ? "" : l, v = a.raceItemId, p = void 0 === v ? "" : v, E = a.isTeamEnter, I = void 0 !== E && E, h = {
            service: "SPECIAL_RACE_MEMBER_CREATE",
            authedUserId: c,
            raceId: u,
            raceItemId: p,
            name: i,
            sex: o,
            cell: r,
            belongType: I ? "TEAM" : "USER",
            belongId: I ? f : c
        };
        d && (h.roleType = d), "modify" === t ? n.reEnter(h, e) : n.validateRoleType(h, e);
    },
    validateRoleType: function(e, t) {
        var n = this, i = a.infoIdAndTypeMap, o = void 0 === i ? {} : i;
        if (Object.keys(o).length) {
            var r = [];
            Object.keys(o).forEach(function(e) {
                var n = "TEXT" === o[e] ? t[e] : t[e].map(function(e) {
                    return e.imageId;
                }).join("#");
                r.push(e + "@" + n);
            }), e.raceMemberExtInfoList = r.join(",");
        }
        "LEADER" === t.roleType ? wx.showModal({
            title: "提示",
            content: "单独设置领队的角色，领队不能参赛，如领队需参赛，请选择“队员兼领队的角色”，是否继续添加？",
            success: function(t) {
                t.confirm && n.teamEnter(e);
            }
        }) : n.teamEnter(e);
    },
    reEnter: function(e, t) {
        var i = a.infoIdAndTypeMap, o = void 0 === i ? {} : i, r = a.infoIdAndConfigIdMap, d = void 0 === r ? {} : r;
        if (Object.assign(e, {
            service: "SPECIAL_RACE_MEMBER_MODIFY",
            id: a.memberId
        }), Object.keys(o).length) {
            var s = [], c = [];
            Object.keys(o).forEach(function(e) {
                var n = "TEXT" === o[e] ? t[e] : t[e].filter(function(e) {
                    return /-/.test(e.imageId);
                }).map(function(e) {
                    return e.imageId;
                }).join("#");
                n && s.push(d[e] + "@" + n), (n = "IMAGE" === o[e] && t[e].filter(function(e) {
                    return !/-/.test(e.imageId);
                }).map(function(e) {
                    return e.imageId;
                }).join("#")) && c.push(d[e] + "@" + n);
            }), e.raceMemberExtInfoList = s.join(","), e.existedRaceMemberExtInfoImages = c.join(",");
        }
        n.request("service.json", n.MD5(e)).then(function(e) {
            n.showToast("修改成功"), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        });
    },
    cancelEnter: function() {
        var e = a.authedUserId, t = void 0 === e ? "" : e, i = a.memberId, o = void 0 === i ? "" : i;
        wx.showModal({
            title: "提示",
            content: "是否确认取消报名",
            success: function(e) {
                e.confirm && n.request("service.json", n.MD5({
                    service: "SPECIAL_RACE_CANCEL_ENTER",
                    authedUserId: t,
                    memberId: o
                })).then(function() {
                    n.showToast("取消报名成功"), setTimeout(function() {
                        wx.navigateBack();
                    }, 1e3);
                });
            }
        });
    },
    onPickerChange: function(e) {
        var t = e.detail.value;
        this.setData({
            currentRoleType: t
        });
    },
    checkboxChange: function(e) {
        this.setData({
            footerData: t({}, this.data.footerData, {
                checked: e.detail.checked
            })
        });
    },
    teamEnter: function(t) {
        n.request("service.json", n.MD5(t)).then(function(a) {
            var i = getCurrentPages(), o = i[i.length - 2];
            "COACH" === t.roleType ? o.setData({
                coachMember: {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                }
            }) : "LEADER" === t.roleType ? o.setData({
                leaderMember: {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                }
            }) : "PLAYER_AND_LEADER" === t.roleType ? o.setData({
                leaderMember: {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                },
                memberList: [].concat(e(o.data.memberList), [ {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                } ])
            }) : o.setData({
                memberList: [].concat(e(o.data.memberList), [ {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                } ])
            }), n.showToast("添加队员成功"), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        });
    },
    userEnter: function(e) {
        var t = this;
        a.canCancelEnter ? t.userEnterFunc(e) : wx.showModal({
            title: "提示",
            content: "请确保个人信息填写无误，报名成功后不能取消报名。",
            confirmText: "确定报名",
            cancelText: "我再想想",
            success: function(n) {
                n.confirm && t.userEnterFunc(e);
            }
        });
    },
    userEnterFunc: function(e) {
        var t = a.infoIdAndTypeMap, i = void 0 === t ? {} : t, o = a.authedUserId, r = void 0 === o ? "" : o, d = a.raceItemId, s = void 0 === d ? "" : d, c = a.amount, m = void 0 === c ? 0 : c, u = a.memberId, l = void 0 === u ? "" : u, f = a.infoIdAndConfigIdMap, v = void 0 === f ? {} : f, p = e.name, E = e.sex, I = e.cell, h = (e.roleType, 
        {
            service: "SPECIAL_RACE_ENTER",
            authedUserId: r,
            raceItemId: s,
            memberId: l,
            name: p,
            sex: E,
            cell: I,
            amount: m,
            agreeProtocol: !0
        });
        if (Object.keys(i).length) {
            var y = [], T = [];
            Object.keys(i).forEach(function(t) {
                var n = "TEXT" === i[t] ? e[t] : e[t].filter(function(e) {
                    return /-/.test(e.imageId);
                }).map(function(e) {
                    return e.imageId;
                }).join("#");
                n && y.push(v[t] + "@" + n), (n = "IMAGE" === i[t] && e[t].filter(function(e) {
                    return !/-/.test(e.imageId);
                }).map(function(e) {
                    return e.imageId;
                }).join("#")) && T.push(v[t] + "@" + n);
            }), h.raceMemberExtInfoList = y.join(","), h.existedRaceMemberExtInfoImages = T.join(",");
        }
        n.request("service.json", n.MD5(h)).then(function(e) {
            var t = e.parameterMap, a = void 0 === t ? {} : t, i = e.depositNo;
            n.requestPayment.requestPayment(Object.assign(a, {
                depositNo: i,
                authedUserId: r
            })).then(function(e) {
                n.showToast("报名成功"), setTimeout(function() {
                    wx.navigateBack();
                }, 1e3);
            });
        });
    }
});