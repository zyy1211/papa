function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = Array(e.length); t < e.length; t++) a[t] = e[t];
        return a;
    }
    return Array.from(e);
}

var t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var n in a) Object.prototype.hasOwnProperty.call(a, n) && (e[n] = a[n]);
    }
    return e;
}, a = (getApp(), require("../../utils/util.js"));

Page({
    data: {
        canEnter: !0,
        canCancel: !1,
        canModify: !1,
        sectionList: [],
        groupList: [],
        hideModal: !0,
        leaderMember: {},
        memberList: [],
        defaultValue: 0,
        showEnterTime: !0,
        selectedGroupIds: [],
        multiSelectTitle: "赛事组别",
        groupType: "",
        footerData: {
            checked: !0,
            canEnter: !1,
            entry: "detail",
            canModify: !1,
            canCancel: !1,
            showProto: !1
        },
        idAndFailReasonMap: {},
        currentRoleType: "PLAYER"
    },
    onLoad: function(e) {
        this.scene = e.scene, this.roleTypeCodeAndNameMap = {
            LEADER: "领队 ",
            COACH: "教练",
            PLAYER_AND_LEADER: "队员兼领队",
            PLAYER: "队员"
        }, this.teamId = e.teamId, this.memberId = e.memberId, this.teamEntered = e.teamEntered;
        var t = e.leaderMember, a = void 0 === t ? JSON.stringify({}) : t, n = e.memberList, i = void 0 === n ? JSON.stringify([]) : n;
        this.setData({
            leaderMember: JSON.parse(a),
            memberList: JSON.parse(i)
        }), this.initPageLogin();
    },
    onUnload: function() {
        var e = getCurrentPages(), t = e[e.length - 2];
        "pages/package-hnRace/hnRaceIndex" !== t.route && "pages/package-hnRace/teamDetail" !== t.route || t.initPageLogin();
    },
    initPageLogin: function() {
        var e = this, t = this;
        a.initPageLogin().then(function(a) {
            var n = a;
            n && "" !== n && (e.setData({
                groupType: wx.getStorageSync("groupType")
            }), t.setData({
                authedUserId: n
            }), "create" === e.scene ? t.initEnterOptions() : "modify" === e.scene && t.backFillForm());
        });
    },
    getQueryVariable: function(e, t) {
        for (var a = (e = e.split("?")[1]).split("&"), n = 0; n < a.length; n++) {
            var i = a[n].split("=");
            if (i[0] == t) return i[1];
        }
        return "";
    },
    initGroupList: function(e) {
        var t = this, a = e.canModifyInfo, n = e.raceGroups, i = void 0 === n ? [] : n, r = e.linkGroupIds, o = void 0 === r ? [] : r, d = e.groupIdAndLinkInfo, s = void 0 === d ? {} : d, c = e.groupIdAndHasEnterCount, u = void 0 === c ? {} : c, l = wx.getStorageSync("groupType"), p = [], m = {};
        return p = "modify" === this.scene ? a ? i : i.filter(function(e) {
            return o.indexOf(e.id) > -1;
        }) : i, this.setData({
            selectedGroupIds: o
        }), p.map(function(e) {
            var a = "", n = !1;
            return e.gmtLatestBirth && e.gmtEarliestBirth ? a = e.gmtEarliestBirth.split(" ")[0] + "-" + e.gmtLatestBirth.split(" ")[0] : e.gmtEarliestBirth ? a = e.gmtEarliestBirth.split(" ")[0] + "后出生" : e.gmtLatestBirth && (a = e.gmtLatestBirth.split(" ")[0] + "前出生"), 
            "MULTIPART_GROUP" === l && (n = !!s[e.id] && "AUDIT_FAIL_AND_WAIT_MODIFY_INFO" === s[e.id].auditStatus.name) && (m[e.id] = s[e.id].auditReason), 
            t.setData({
                idAndFailReasonMap: m
            }), {
                canSelect: "false" === t.teamEntered || "create" === t.scene,
                id: e.id,
                name: e.name,
                raceMemberId: s[e.id] ? s[e.id].raceMemberId : "",
                ageRequirement: a,
                registered: u[e.id] ? u[e.id] : 0,
                total: e.enterNumber,
                sexRequirement: e.sexLimit.message,
                rejected: n,
                checked: o.indexOf(e.id) > -1
            };
        });
    },
    needResetLeader: function() {
        var e = this;
        return new Promise(function(t, a) {
            e.memberId === e.data.leaderMember.id && t(), a();
        });
    },
    removeGroup: function(e) {
        var t = this, a = e.detail, n = a.id, i = a.racememberid;
        this.params = {
            service: "HN_RACE_ENTER_CANCEL_WITH_MEMBER_GROUP",
            raceGroupId: n,
            raceMemberId: i,
            authedUserId: this.data.authedUserId
        }, i === this.data.leaderMember.id && this.data.groupList.length <= 1 && this.data.memberList.length > 1 ? this.setData({
            hideModal: !1
        }) : t.removeOperation();
    },
    removeOperation: function() {
        var e = this;
        a.request("service.json", a.MD5(this.params)).then(function() {
            e.data.groupList.length > 1 ? e.initPageLogin() : wx.navigateBack();
        });
    },
    initRejectInfo: function(e) {
        var t = wx.getStorageSync("groupType"), a = wx.getStorageSync("raceId"), n = {};
        e.auditStatus && "AUDIT_FAIL_AND_WAIT_MODIFY_INFO" === e.auditStatus.name && "SINGLE_GROUP" === t && (n[a] = e.auditReason, 
        this.setData({
            idAndFailReasonMap: n
        }), wx.showModal({
            title: "驳回理由",
            content: e.auditReason,
            showCancel: !1,
            confirmText: "知道了"
        }));
    },
    showErrorInfo: function(e) {
        var t = e.detail.id, a = void 0 === t ? wx.getStorageSync("raceId") : t;
        this.showRejectReason(a);
    },
    showRejectReason: function(e) {
        wx.showModal({
            title: "驳回理由",
            content: this.data.idAndFailReasonMap[e],
            showCancel: !1,
            confirmText: "知道了"
        });
    },
    backFillData: function(e) {
        var a = this, n = (e.auditStatus, e.raceMemberWithExtInfo), i = e.canCancelEnter, r = e.canModifyInfo, o = e.gmtEnterEnd, d = e.nowDate, s = e.roleTypes, c = e.extInfoCfgIdAndDescribeMap, u = e.extInfoCfgIdAndNameMap, l = e.extInfoIdAndImageUrlsMap, p = n.extInfoList, m = void 0 === p ? [] : p, f = n.roleType, h = void 0 === f ? {} : f, g = wx.getStorageSync("enterType"), y = wx.getStorageSync("groupType"), T = [ {
            type: "input",
            label: "姓名",
            name: "name",
            value: n.name,
            placeholder: "请输入姓名",
            inputType: "text",
            canModify: r,
            validate: {
                max: 15
            }
        }, {
            type: "sex-select",
            label: "性别",
            name: "sex",
            value: n.sex.name,
            canModify: r
        }, {
            type: "input",
            label: "身份证",
            name: "identityCardNumber",
            value: n.identityCardNumber,
            placeholder: "请输入身份证",
            inputType: "idcard",
            canModify: r,
            validate: {
                max: 18
            }
        } ];
        "TEAM_ENTER" === g ? ("false" === this.teamEntered ? wx.setNavigationBarTitle({
            title: "添加队员"
        }) : wx.setNavigationBarTitle({
            title: "查看资料"
        }), this.setData({
            showEnterTime: !1
        })) : "SINGLE_ENTER" === g && (wx.setNavigationBarTitle({
            title: "报名详情"
        }), this.setData({
            showEnterTime: !0
        })), m.forEach(function(e) {
            a.infoIdAndTypeMap[e.id] = e.dataType.name, a.infoIdAndConfigIdMap[e.id] = e.raceEnterExtInfoConfigId;
        }), "MULTIPART_GROUP" === y && this.setData({
            groupList: this.initGroupList(e)
        }), "TEAM_ENTER" === g && T.unshift({
            type: "select",
            label: "角色",
            name: "roleType",
            value: h.name,
            options: s.map(function(e) {
                return {
                    name: e.message,
                    value: e.name
                };
            }),
            canModify: "false" === this.teamEntered
        }), m.length && (m = m.map(function(e) {
            var t = {
                type: "TEXT" === e.dataType.name ? "input" : "image",
                label: u[e.raceEnterExtInfoConfigId],
                name: e.id,
                value: "TEXT" === e.dataType.name ? e.raceEnterExtInfoValue : l[e.id].map(function(e) {
                    return {
                        imageSrc: e,
                        imageId: a.getQueryVariable(e, "objectId")
                    };
                }),
                placeholder: c[e.raceEnterExtInfoConfigId],
                inputType: "text",
                canModify: r
            };
            return /手机号/.test(u[e.raceEnterExtInfoConfigId]) && "input" === t.type ? (t.inputType = "number", 
            t.validate = {
                max: 11
            }) : /微信号/.test(u[e.raceEnterExtInfoConfigId]) && "input" === t.type && (t.validate = {
                max: 20
            }), t;
        }));
        var E = {}, I = !1;
        o && d && (I = new Date(o.replace(/-/g, "/")).getTime() < new Date(d.replace(/-/g, "/")).getTime()), 
        E = "TEAM_ENTER" === g ? t({}, this.data.footerData, {
            entry: "teamDetail",
            canEnter: !1,
            canModify: r,
            entered: "true" === this.teamEntered
        }) : t({}, this.data.footerData, {
            entry: "detail",
            canEnter: !1,
            canModify: r,
            showProto: (r || i) && !I,
            canCancel: i && !I
        });
        var M = "赛事组别";
        "MULTIPART_GROUP" === y && "SINGLE_ENTER" === g ? M = "参赛组别" : "MULTIPART_GROUP" === y && "TEAM_ENTER" === g && (M = "true" === this.teamEntered ? "参赛组别" : "赛事组别"), 
        this.setData({
            currentRoleType: h.name,
            raceMemberWithExtInfoId: n.id,
            sectionList: T.concat(m),
            footerData: E,
            multiSelectTitle: M
        });
    },
    backFillForm: function() {
        var e = this;
        this.infoIdAndConfigIdMap = {}, this.infoIdAndTypeMap = {}, "SINGLE_ENTER" === wx.getStorageSync("enterType") ? a.request("service.json", a.MD5({
            service: "HN_RACE_MEMBER_WITH_USER_DETAIL_QUERY",
            raceId: wx.getStorageSync("raceId"),
            authedUserId: this.data.authedUserId
        })).then(function(t) {
            e.initRejectInfo(t), e.backFillData(t);
        }) : a.request("service.json", a.MD5({
            service: "HN_RACE_MEMBER_WITH_TEAM_DETAIL_QUERY",
            memberId: this.memberId,
            authedUserId: this.data.authedUserId
        })).then(function(t) {
            e.initRejectInfo(t), e.backFillData(t);
        });
    },
    initForm: function(e) {
        var a = this, n = e.userRaceEnterExtInfoCfgList, i = void 0 === n ? [] : n;
        this.infoIdAndTypeMap = {};
        var r = [ {
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
            label: "身份证",
            name: "identityCardNumber",
            value: "",
            placeholder: "请输入身份证",
            inputType: "idcard",
            canModify: !0,
            validate: {
                max: 18
            }
        } ], o = i.splice(3);
        o.forEach(function(e) {
            a.infoIdAndTypeMap[e.id] = e.dataType.name;
        }), "MULTIPART_GROUP" === wx.getStorageSync("groupType") && this.setData({
            groupList: this.initGroupList(e)
        }), "TEAM_ENTER" === wx.getStorageSync("enterType") ? wx.setNavigationBarTitle({
            title: "添加队员"
        }) : wx.setNavigationBarTitle({
            title: "报名详情"
        }), wx.getStorageSync("roleTypes") && "TEAM_ENTER" === wx.getStorageSync("enterType") && r.unshift({
            type: "select",
            label: "角色",
            name: "roleType",
            value: "PLAYER",
            options: wx.getStorageSync("roleTypes").split(",").map(function(e) {
                return {
                    name: a.roleTypeCodeAndNameMap[e],
                    value: e
                };
            }),
            canModify: !0
        });
        var d = {}, s = !0;
        "TEAM_ENTER" === wx.getStorageSync("enterType") ? (s = !1, d = t({}, this.data.footerData, {
            entry: "teamDetail",
            canEnter: !0,
            canModify: !1,
            canCancel: !1,
            showProto: !1
        })) : d = t({}, this.data.footerData, {
            entry: "detail",
            canEnter: !0,
            canCancel: !1,
            canModify: !1,
            showProto: !0
        }), this.setData({
            showEnterTime: s,
            multiSelectTitle: "赛事组别",
            sectionList: r.concat(o.map(function(e) {
                return "TEXT" === e.dataType.name ? /手机/.test(e.name) ? {
                    type: "input",
                    label: e.name,
                    name: e.id,
                    value: "",
                    placeholder: e.description,
                    inputType: "number",
                    canModify: !0,
                    validate: {
                        max: 11
                    }
                } : /微信号/.test(e.name) ? {
                    type: "input",
                    label: e.name,
                    name: e.id,
                    value: "",
                    placeholder: e.description,
                    inputType: "text",
                    canModify: !0,
                    validate: {
                        max: 20
                    }
                } : {
                    type: "input",
                    label: e.name,
                    name: e.id,
                    value: "",
                    placeholder: e.description,
                    inputType: "text",
                    canModify: !0
                } : "IMAGE" === e.dataType.name ? {
                    type: "image",
                    label: e.name,
                    name: e.id,
                    value: [],
                    placeholder: e.description,
                    canModify: !0
                } : void 0;
            })),
            footerData: d
        });
    },
    initEnterOptions: function() {
        var e = this, t = this.data.authedUserId;
        a.request("service.json", a.MD5({
            authedUserId: t,
            service: "HN_RACE_MEMBER_CREATE_INIT",
            raceId: wx.getStorageSync("raceId")
        })).then(function(t) {
            e.initForm(t);
        });
    },
    onBtnClick: function(e) {
        var t = this, a = e.detail.type, n = this.selectComponent("#flexbleForm");
        "MULTIPART_GROUP" !== wx.getStorageSync("groupType") || this.data.selectedGroupIds.length || "LEADER" === n.data.formData.roleType || "COACH" === n.data.formData.roleType ? "enter" === a ? n.bindFormSubmit() : "cancelEnter" === a ? this.cancelEnter() : "reEnter" === a && n.validateForm().then(function(e) {
            t.reEnter(e);
        }).catch(function(e) {
            wx.showToast({
                title: e,
                icon: "none",
                duration: 2e3
            });
        }) : wx.showToast({
            title: "请选择组别",
            icon: "none",
            duration: 1500
        });
    },
    reEnter: function(e) {
        var t = this, n = e.name, i = e.sex, r = e.identityCardNumber, o = e.roleType, d = wx.getStorageSync("enterType"), s = {
            service: "HN_RACE_MEMBER_MODIFY",
            sex: i,
            name: n,
            identityCardNumber: r,
            belongId: "TEAM_ENTER" === d ? this.teamId : this.data.authedUserId,
            authedUserId: this.data.authedUserId,
            id: this.data.raceMemberWithExtInfoId,
            roleType: o || "NORMAL",
            belongType: "TEAM_ENTER" === d ? "TEAM" : "USER",
            raceId: wx.getStorageSync("raceId")
        };
        if ("MULTIPART_GROUP" === wx.getStorageSync("groupType") && (s.groupIds = this.data.selectedGroupIds.filter(function(e) {
            return "" !== e;
        }).join(",")), Object.keys(this.infoIdAndTypeMap).length) {
            var c = {}, u = [];
            Object.keys(this.infoIdAndTypeMap).forEach(function(a) {
                c[t.infoIdAndConfigIdMap[a]] = "TEXT" === t.infoIdAndTypeMap[a] ? e[a] : e[a].filter(function(e) {
                    return /-/.test(e.imageId);
                }).map(function(e) {
                    return e.imageId;
                }).join("#"), "IMAGE" === t.infoIdAndTypeMap[a] && u.push(t.infoIdAndConfigIdMap[a] + "@" + e[a].filter(function(e) {
                    return !/-/.test(e.imageId);
                }).map(function(e) {
                    return e.imageId;
                }).join("#"));
            }), s.raceMemberExtInfos = JSON.stringify(c), s.existedRaceMemberExtInfoImages = u.join(",");
        }
        a.request("service.json", a.MD5(s)).then(function(e) {
            a.showToast("修改成功"), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        });
    },
    cancelEnter: function() {
        var e = this;
        wx.showModal({
            title: "提示",
            content: "是否确认取消报名",
            success: function(t) {
                t.confirm && a.request("service.json", a.MD5({
                    service: "HN_RACE_ENTER_CANCEL",
                    objectType: "single",
                    objectId: e.data.authedUserId,
                    authedUserId: e.data.authedUserId,
                    raceId: wx.getStorageSync("raceId")
                })).then(function() {
                    a.showToast("取消报名成功"), setTimeout(function() {
                        wx.navigateBack();
                    }, 1e3);
                });
            }
        });
    },
    onGroupCheck: function(e) {
        this.setData({
            selectedGroupIds: e.detail.ids,
            groupList: this.data.groupList.map(function(a) {
                return e.detail.ids.indexOf(a.id) > -1 ? t({}, a, {
                    checked: !0
                }) : t({}, a, {
                    checked: !1
                });
            })
        });
    },
    onPickerChange: function(e) {
        var t = e.detail.value;
        this.setData({
            currentRoleType: t
        });
    },
    onSettingConfirm: function() {
        var e = this.data, t = e.memberList, a = e.defaultValue, n = (e.authedUserId, e.leaderMember);
        this.params.moveLeaderToId = t.filter(function(e) {
            return e.id !== n.id;
        })[a].id, this.removeOperation();
    },
    onSettingCancel: function() {
        this.setData({
            hideModal: !0
        });
    },
    bindMemberPickerChange: function(e) {
        this.setData({
            defaultValue: e.detail.value
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
        a.request("service.json", a.MD5(t)).then(function(a) {
            var n = getCurrentPages(), i = n[n.length - 2];
            "COACH" === t.roleType ? i.setData({
                coachMember: {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                }
            }) : "LEADER" === t.roleType ? i.setData({
                leaderMember: {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                }
            }) : "PLAYER_AND_LEADER" === t.roleType ? i.setData({
                leaderMember: {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                },
                memberList: [].concat(e(i.data.memberList), [ {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                } ])
            }) : i.setData({
                memberList: [].concat(e(i.data.memberList), [ {
                    id: a.id,
                    name: t.name,
                    sex: t.sex
                } ])
            }), wx.showToast({
                title: "添加队员成功",
                icon: "none",
                duration: 1500
            }), setTimeout(function() {
                wx.navigateBack();
            }, 1e3);
        });
    },
    validateRoleType: function(e) {
        var t = e.e, a = e.name, n = e.sex, i = e.identityCardNumber, r = e.roleType, o = this, d = {
            service: "HN_RACE_MEMBER_CREATE",
            name: a,
            sex: n,
            identityCardNumber: i,
            roleType: r,
            belongType: "TEAM",
            belongId: o.teamId,
            authedUserId: o.data.authedUserId,
            raceId: wx.getStorageSync("raceId")
        };
        if ("MULTIPART_GROUP" === wx.getStorageSync("groupType") && (d.groupIds = o.data.selectedGroupIds.filter(function(e) {
            return "" !== e;
        }).join(",")), Object.keys(o.infoIdAndTypeMap).length) {
            var s = {};
            Object.keys(o.infoIdAndTypeMap).forEach(function(e) {
                s[e] = "TEXT" === o.infoIdAndTypeMap[e] ? t.detail.formData[e] : t.detail.formData[e].map(function(e) {
                    return e.imageId;
                }).join("#");
            }), d.raceMemberExtInfos = JSON.stringify(s);
        }
        "LEADER" === r ? wx.showModal({
            title: "提示",
            content: "单独设置领队的角色，领队不能参赛，如领队需参赛，请选择“队员兼领队的角色”，是否继续添加？",
            success: function(e) {
                e.confirm && o.teamEnter(d);
            }
        }) : o.teamEnter(d);
    },
    userEnter: function(e) {
        var t = this, n = e.e, i = e.name, r = e.sex, o = e.identityCardNumber, d = e.roleType, s = {
            service: "HN_RACE_ENTER",
            name: i,
            sex: r,
            identityCardNumber: o,
            roleType: d || "NORMAL",
            belongType: "USER",
            belongId: this.data.authedUserId,
            authedUserId: this.data.authedUserId,
            raceId: wx.getStorageSync("raceId")
        };
        if (Object.keys(this.infoIdAndTypeMap).length) {
            var c = {};
            Object.keys(this.infoIdAndTypeMap).forEach(function(e) {
                c[e] = "TEXT" === t.infoIdAndTypeMap[e] ? n.detail.formData[e] : n.detail.formData[e].map(function(e) {
                    return e.imageId;
                }).join("#");
            }), s.raceMemberExtInfos = JSON.stringify(c);
        }
        "MULTIPART_GROUP" === wx.getStorageSync("groupType") && (s.groupIds = this.data.selectedGroupIds.filter(function(e) {
            return "" !== e;
        }).join(",")), a.request("service.json", a.MD5(s)).then(function() {
            wx.showToast({
                title: "报名成功",
                icon: "success",
                duration: 1500
            }), setTimeout(function() {
                wx.navigateBack();
            }, 1500);
        });
    },
    onFormSubmit: function(e) {
        var t = e.detail.formData, a = t.name, n = t.sex, i = t.identityCardNumber, r = t.roleType, o = wx.getStorageSync("enterType");
        "TEAM_ENTER" === o ? this.validateRoleType({
            e: e,
            name: a,
            sex: n,
            identityCardNumber: i,
            roleType: r
        }) : "SINGLE_ENTER" === o && this.userEnter({
            e: e,
            name: a,
            sex: n,
            identityCardNumber: i,
            roleType: r
        });
    }
});