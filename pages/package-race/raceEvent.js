var e = require("../../utils/util.js"), t = (require("../../config.js"), getApp());

Page({
    data: {
        authedUserId: "",
        isIpx: !1,
        activeId: "",
        activeTitle: "",
        activeTitleLength: 0,
        describeId: "",
        organizer: "",
        address: "",
        addressDescribe: "",
        startDate: "",
        startTime: "--:--",
        endDate: "",
        endTime: "--:--",
        closeDate: "",
        closeTime: "--:--",
        cancelDate: "",
        cancelTime: "--:--",
        publiced: !0,
        needIdCardNo: !1,
        needSignUp: !1,
        dataLabels: [],
        groupType: "",
        groupTypeMsg: "",
        limitMinAge: "0",
        limitMaxAge: "0",
        sexLimit: "",
        sexLimitMsg: "",
        groupMsgAndValueObject: [],
        limitSexMsgAndValueObject: [],
        fightModelMsgAndValueObject: [],
        limitMinAgeObject: [],
        limitMaxAgeObject: [],
        manFee: "",
        womanFee: "",
        limitNum: "",
        contactName: "",
        contactCall: "",
        creatorWeixinNo: "",
        addModalHidden: !0,
        newTagText: "",
        isdisabled: !1,
        isModify: !1,
        iModifyActivity: !0,
        disabledSubmit: !1,
        isEightTurn: !1,
        protocolModalHidden: !0,
        agreeProtocol: !0,
        showCreateSubject: !0,
        synchronizedCreateSubject: !0
    },
    createSubjectChange: function(e) {
        var t = this;
        "true" === e.detail.value[0] ? t.setData({
            synchronizedCreateSubject: !0
        }) : t.setData({
            synchronizedCreateSubject: !1
        });
    },
    checkboxChange: function(e) {
        var t = this;
        "true" === e.detail.value[0] ? t.setData({
            disabledSubmit: !1,
            agreeProtocol: !0
        }) : t.setData({
            disabledSubmit: !0,
            agreeProtocol: !1
        });
    },
    showProtocolModal: function() {
        this.setData({
            protocolModalHidden: !1
        });
    },
    closeProtocolModal: function() {
        this.setData({
            protocolModalHidden: !0
        });
    },
    bindActiveTitleInput: function(e) {
        var t = e.detail.value;
        this.setData({
            activeTitleLength: t.length
        });
    },
    navigatorToDescr: function() {
        var e = this.data, t = e.describeId, a = e.activeId, i = e.isFromTemplate, s = "";
        s = a ? i ? "/pages/package-template/activityRules?id=" + t + "&activityId=" + a + "&fromType=template" : "/pages/package-template/activityRules?id=" + t + "&activityId=" + a : t ? "/pages/package-template/activityRules?id=" + t : "/pages/package-template/activityRules", 
        wx.navigateTo({
            url: s
        });
    },
    bindStartDateChange: function(t) {
        var a = this, i = a.data, s = i.startTime, n = i.isChangeEndDate, d = i.isChangeCloseDate, o = i.isChangeCancelDate, r = i.isFromTemplate, c = t.detail.value;
        a.setData({
            startDate: c
        });
        var l = new Date(c), u = {};
        l.setDate(l.getDate() + 1), n || (u = {
            endDate: e.date.formatNoSecondTime(l)
        }, r || (u.endTime = s), a.setData(u)), d || (u = {
            closeDate: c
        }, r || (u.closeTime = e.date.minusOneMinTime(c + " " + s + ":00", 120)), a.setData(u)), 
        d || o || (u = {
            cancelDate: c
        }, r || (u.cancelTime = e.date.minusOneMinTime(c + " " + s + ":00", 120)), a.setData(u));
    },
    bindStartTimeChange: function(t) {
        var a = this, i = a.data, s = i.startDate, n = i.isChangeEndDate, d = i.isChangeCloseDate, o = i.isChangeCancelDate, r = i.isFromTemplate, c = t.detail.value;
        a.setData({
            startTime: c
        });
        var l = new Date(s), u = {};
        l.setDate(l.getDate() + 1), n || (u = {
            endTime: c
        }, r || (u.endDate = e.date.formatNoSecondTime(l)), a.setData(u)), d || (u = {
            closeTime: e.date.minusOneMinTime(s + " " + c + ":00", 120)
        }, r || (u.closeDate = s), a.setData(u)), d || o || (u = {
            cancelTime: e.date.minusOneMinTime(s + " " + c + ":00", 120)
        }, r || (u.cancelDate = s), a.setData(u));
    },
    bindEndDateChange: function(e) {
        var t = this, a = e.detail.value;
        t.setData({
            endDate: a,
            isChangeEndDate: !0
        });
    },
    bindEndTimeChange: function(e) {
        var t = this, a = e.detail.value;
        t.setData({
            endTime: a,
            isChangeEndDate: !0
        });
    },
    bindCloseDateChange: function(e) {
        var t = this, a = t.data, i = a.closeTime, s = a.isChangeCancelDate, n = e.detail.value;
        t.setData({
            closeDate: n,
            isChangeCloseDate: !0
        }), s || t.setData({
            cancelDate: n,
            cancelTime: i
        });
    },
    bindCloseTimeChange: function(e) {
        var t = this, a = t.data, i = a.closeDate, s = a.isChangeCancelDate, n = e.detail.value;
        t.setData({
            closeTime: n,
            isChangeCloseDate: !0
        }), s || t.setData({
            cancelDate: i,
            cancelTime: n
        });
    },
    bindCancelDateChange: function(e) {
        this.setData({
            cancelDate: e.detail.value,
            isChangeCancelDate: !0
        });
    },
    bindCancelTimeChange: function(e) {
        this.setData({
            cancelTime: e.detail.value,
            isChangeCancelDate: !0
        });
    },
    bindPickerChange: function(e) {
        var t = this, a = e.detail.value, i = {}, s = {}, n = e.target.dataset.datatype, d = t.data, o = d.groupMsgAndValueObject, r = d.limitMinAgeObject, c = d.limitMaxAgeObject, l = d.limitSexMsgAndValueMap, u = d.fightModelMsgAndValueMap, m = d.limitSexMsgAndValueObject, g = d.fightModelMsgAndValueObject, h = d.objectFeeType, p = d.objectLimitNum;
        switch (n) {
          case "groupType":
            s = o, i.groupTypeMsg = s[a].message;
            break;

          case "limitMinAge":
            s = r;
            break;

          case "limitMaxAge":
            s = c;
            break;

          case "sexLimit":
            s = m, i.sexLimitMsg = s[a].message;
            var v = s[a].name;
            g = [], Object.keys(u).map(function(e, t) {
                "MIX" === v ? "DOUBLE" === e && g.push({
                    name: e,
                    message: u[e]
                }) : g.push({
                    name: e,
                    message: u[e]
                });
            }), i.fightModelMsgAndValueObject = g;
            break;

          case "fightModel":
            s = g, i.fightModelMsg = s[a].message;
            var D = s[a].name;
            m = [], Object.keys(l).map(function(e, t) {
                "SINGLE" === D ? "MIX" !== e && m.push({
                    name: e,
                    message: l[e]
                }) : m.push({
                    name: e,
                    message: l[e]
                });
            }), i.limitSexMsgAndValueObject = m;
            break;

          case "feeTypeName":
            s = h, i.feeTypeMessage = s[a].message;
            break;

          case "limitNum":
            s = p, i.limitNumMessage = s[a].message;
        }
        i[n] = s[a].name, t.setData(i);
    },
    switchChange: function(e) {
        var t = this, a = e.currentTarget.dataset, i = e.detail.value;
        switch (a.type) {
          case "publiced":
            var s = t.data, n = s.activeId, d = s.isFromTemplate, o = s.showCreateSubject, r = s.synchronizedCreateSubject;
            n && !d ? (o = !1, r = !1) : (o = i, r = i), t.setData({
                publiced: i,
                showCreateSubject: o,
                synchronizedCreateSubject: r
            });
            break;

          case "needIdCardNo":
            t.setData({
                needIdCardNo: i
            });
            break;

          case "needSignUp":
            t.setData({
                needSignUp: i
            });
        }
    },
    showAddModal: function() {
        this.setData({
            addModalHidden: !1,
            newTagText: ""
        });
    },
    closeAddModal: function() {
        this.setData({
            addModalHidden: !0
        });
    },
    bindNewTagChange: function(e) {
        this.setData({
            newTagText: e.detail.value
        });
    },
    doAddModal: function() {
        var e = this, t = e.data, a = t.dataLabels, i = t.newTagText;
        a.map(function(t, a) {
            i !== t.name || e.wetoast.toast({
                title: "标签" + i + "已存在",
                duration: 1e3
            });
        }), "" !== i ? i.length > 8 ? e.wetoast.toast({
            title: "标签最多可输入8个字",
            duration: 1e3
        }) : a.length > 7 ? e.wetoast.toast({
            title: "最多只能增加8个标签",
            duration: 1e3
        }) : (a.push({
            id: i,
            name: i,
            activeClass: !1,
            editClass: !0
        }), e.setData({
            dataLabels: a,
            addModalHidden: !0
        })) : e.wetoast.toast({
            title: "标签不能为空",
            duration: 1e3
        });
    },
    deleteTab: function(e) {
        var t = this, a = e.currentTarget.dataset, i = (void 0 === a ? {} : a).id, s = t.data.dataLabels;
        s.map(function(e, t) {
            e.id === i && s.splice(t, 1);
        }), t.setData({
            dataLabels: s
        });
    },
    tagChoose: function(e) {
        var t = this, a = e.currentTarget.dataset, i = void 0 === a ? {} : a, s = i.id, n = (i.activeClass, 
        t.data.dataLabels), d = 0;
        n.map(function(e, t) {
            e.activeClass && d++;
        }), n.map(function(e, a) {
            if (e.id === s) {
                if (e.activeClass) d--; else {
                    if (d > 3 && !e.activeClass) return void t.wetoast.toast({
                        title: "最多只能选择4个标签",
                        duration: 1e3
                    });
                    d++;
                }
                e.activeClass = !e.activeClass;
            }
        }), t.setData({
            dataLabels: n
        });
    },
    bindChooseLocation: function() {
        var e = this;
        e.selectComponent("#authorize").getAuthorizeLocation(function(t) {
            wx.chooseLocation({
                type: "gcj02",
                success: function(t) {
                    var a = t.name, i = void 0 === a ? "" : a, s = t.longitude, n = void 0 === s ? "" : s, d = t.latitude, o = void 0 === d ? "" : d;
                    e.setData({
                        addressDescribe: i,
                        address: n + "@" + o
                    });
                }
            });
        });
    },
    bindLimitNumInput: function(e) {
        var t = parseInt(e.detail.value);
        t <= 0 && (this.wetoast.toast({
            title: "活动人数必须大于等于1",
            duration: 1e3
        }), t = this.data.limitNum), this.setData({
            limitNum: t || ""
        });
    },
    bindManFeeInput: function(e) {
        var t = e.detail.value;
        /^(\d+(\.\d{1,2})?)$/g.test(t) || (this.wetoast.toast({
            title: "请输入正确的费用",
            duration: 1e3
        }), t = this.data.manFee), this.setData({
            manFee: t
        });
    },
    bindWomanFeeInput: function(e) {
        var t = e.detail.value;
        /^(\d+(\.\d{1,2})?)$/g.test(t) || (this.wetoast.toast({
            title: "请输入正确的费用",
            duration: 1e3
        }), t = this.data.womanFee), this.setData({
            womanFee: t
        });
    },
    bindFormSubmit: function(e) {
        var t = this, a = e.detail.value, i = a.activeTitle, s = a.organizer, n = a.contactName, d = void 0 === n ? "" : n, o = a.contactCall, r = void 0 === o ? "" : o, c = a.creatorWeixinNo, l = void 0 === c ? "" : c, u = t.data, m = u.isModify, g = u.imageId, h = u.activeId, p = u.describeId, v = u.address, D = u.addressDescribe, b = u.startDate, T = u.startTime, f = u.endDate, M = u.endTime, I = u.closeDate, C = u.closeTime, w = u.cancelDate, A = u.cancelTime, y = u.dataLabels, S = u.publiced, x = u.needIdCardNo, N = u.needSignUp, j = u.groupType, L = u.sexLimit, O = u.limitMinAge, E = u.limitMaxAge, F = u.manFee, U = u.womanFee, k = u.agreeProtocol, R = u.authedUserId, V = u.ruleId, z = u.fightModel, P = u.feeTypeName, _ = u.isFromTemplate, W = u.userPreselectRuleId, G = void 0 === W ? "" : W, H = u.limitNum, X = u.synchronizedCreateSubject, B = void 0 === X || X, J = b + " " + T + ":00", $ = f + " " + M + ":00", q = I + " " + C + ":00", Y = w + " " + A + ":00", Z = J.replace(/-/g, "/"), K = $.replace(/-/g, "/"), Q = q.replace(/-/g, "/"), ee = Y.replace(/-/g, "/"), te = "", ae = "", ie = [];
        if (y.map(function(e, t) {
            e.activeClass && ie.push(e.name);
        }), L) switch (L) {
          case "MIX":
          case "U":
            "" === F ? te = "请输入男生的报名费用" : "" === U && (te = "请输入女生的报名费用"), 0 === parseFloat(F) && 0 === parseFloat(U) && (te = "男生和女生的费用不可以同时为0"), 
            ae = "M@" + F + ",W@" + U;
            break;

          case "M":
            "" === F && (te = "请输入男生的报名费用"), 0 === parseFloat(F) && (te = "费用不可以为0"), ae = "M@" + F + ",W@0";
            break;

          case "W":
            "" === U && (te = "请输入女生的报名费用"), 0 === parseFloat(U) && (te = "费用不可以为0"), ae = "W@" + U + ",M@0";
        }
        if ("FREE" === P && (te = ""), "" == i ? te = "赛事名称不能为空" : "" == s ? te = "请输入举办方名称" : "" === D ? te = "请选择活动举办地址" : -1 !== T.indexOf("-") ? te = "请输入赛事开始时间" : -1 !== C.indexOf("-") ? te = "请输入报名截止时间" : -1 !== A.indexOf("-") ? te = "请输入允许取消报名时间" : new Date(Z) > new Date() ? new Date(K) > new Date(Z) ? new Date(Z) > new Date(Q) ? new Date(Q) > new Date() ? new Date(Z) > new Date(ee) ? new Date(ee) > new Date() ? 0 === ie.length ? te = "至少选择一个标签" : "" === H ? te = "请输入总人数或总队伍数" : 0 === parseInt(H) ? te = "总人数不可以为0" : "" === d ? te = "请输入联系人名称" : /^([1][2-9][0-9]{9})|([9][0-9]{10})$/.test(r) ? "" !== l && (l.length < 6 && (te = "微信号太短"), 
        /^[a-zA-Z0-9\!\-\_\(\)]+$/.test(l) || (te = "请输入正确的微信号")) : te = "联系电话格式不正确" : te = "取消报名截止时间必须大于当前时间" : te = "取消报名截止时间必须小于活动开始时间" : te = "报名截止时间必须大于当前时间" : te = "报名截止时间必须小于活动开始时间" : te = "活动结束时间必须大于活动开始时间" : te = "活动开始时间必须大于当前时间", 
        "" !== te) return t.wetoast.toast({
            title: te,
            duration: 1e3
        }), !1;
        "UNLIMITED" === j && (O = 0, E = 100);
        var se = {
            service: "ACTIVE_INITIATE",
            sortCode: "RACE",
            imageId: g || "",
            activeTitle: i,
            describeId: p,
            organizer: s,
            choicedLabel: ie.join(","),
            gmtStart: J,
            gmtEnd: $,
            gmtRegisterEnd: q,
            gmtModifyRegisterEnd: Y,
            address: v,
            addressDescribe: D,
            publiced: S,
            needIdCardNo: x,
            needSignUp: N,
            groupType: j,
            sexLimit: L,
            limitMinAge: O,
            limitMaxAge: E,
            feeInfo: ae,
            contactName: d,
            contactCall: r,
            creatorWeixinNo: l,
            agreeProtocol: k,
            authedUserId: R,
            limitNum: H,
            fightModel: z,
            chargeFeeType: P,
            formId: e.detail.formId,
            synchronizedCreateSubject: B
        };
        m ? (se.service = "ACTIVE_MODIFIED", se.activeId = h, delete se.synchronizedCreateSubject) : se.userPreselectRuleId = V || G, 
        _ && (se.copyFromActiveId = h), t.formSubmitJson(se);
    },
    formSubmitJson: function(t) {
        var a = this, i = a.data, s = i.isModify, n = i.disabledSubmit, d = s ? "修改成功" : "发布成功";
        n || (e.AJAX("service.json", e.MD5(t), function(t) {
            if (t.data) {
                var i = t.data.response;
                i.success ? (wx.showToast({
                    title: d
                }), a.data.isModify ? wx.navigateBack({
                    delta: 1
                }) : wx.redirectTo({
                    url: "/pages/package-race/raceDetail?id=" + i.activeId + "&from=event"
                })) : "USER_NOT_LOGIN" === i.error.name ? (a.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), a.reGetStorage(!0)) : a.wetoast.toast({
                    title: e.showErrorResult(i),
                    duration: 1e3
                });
            } else a.wetoast.toast({
                title: t.errMsg,
                duration: 1e3
            });
            a.setData({
                disabledSubmit: !1
            });
        }, function(e) {
            a.wetoast.toast({
                title: e.errMsg,
                duration: 1e3
            });
        }), a.setData({
            disabledSubmit: !0
        }));
    },
    initRaceData: function(t) {
        var a = this, i = a.data, s = i.activeTitle, n = i.describeId, d = void 0 === n ? "" : n, o = i.organizer, r = i.addressDescribe, c = i.address, l = i.publiced, u = i.needIdCardNo, m = i.needSignUp, g = i.dataLabels, h = i.defaultLabels, p = void 0 === h ? [] : h, v = i.limitNum, D = i.contactName, b = i.contactCall, T = i.creatorWeixinNo, f = i.startDate, M = i.startTime, I = i.endDate, C = i.endTime, w = i.closeDate, A = i.closeTime, y = i.cancelDate, S = i.cancelTime, x = i.groupType, N = i.groupTypeMsg, j = i.limitMinAge, L = i.limitMaxAge, O = i.sexLimit, E = i.sexLimitMsg, F = i.fightModel, U = i.fightModelMsg, k = i.groupMsgAndValueObject, R = i.fightModelMsgAndValueObject, V = i.limitSexMsgAndValueObject, z = i.limitMinAgeObject, P = i.limitMaxAgeObject, _ = i.isFromTemplate, W = i.userPreselectRuleId, G = void 0 === W ? "" : W, H = i.objectLimitNum, X = void 0 === H ? [] : H, B = i.synchronizedCreateSubject, J = t.groupMsgAndValueMap, $ = t.limitSexMsgAndValueMap, q = t.defaultLabelList, Y = t.fightModelMsgAndValueMap, Z = t.activeImageJointUrl, K = t.defaultImageUrl, Q = t.ruleCode, ee = t.chargeFeeTypeMap, te = void 0 === ee ? {} : ee, ae = [], ie = "", se = "", ne = "", de = t.activeManageInfo || t.activeUpdateAssociationInfo, oe = "", re = "", ce = !1, le = !1, ue = "EIGHT_TURN" === Q;
        if (Object.keys(te).map(function(e) {
            "BEFORE_ACTIVITY" === e && (ie = e, se = te[e]), ae.push({
                name: e,
                message: te[e]
            });
        }), new Array(4).fill(0).map(function(e, t) {
            t + 5 === 8 && ue && (v = 8, ne = 8), X.push({
                name: t + 5,
                message: t + 5
            });
        }), q.map(function(e) {
            g.push({
                id: e,
                name: e,
                activeClass: !1,
                editClass: !1
            }), p.push(e);
        }), Object.keys(J).map(function(e, t) {
            k.push({
                name: e,
                message: J[e]
            }), "UNLIMITED" === e && (x = e, N = J[e]);
        }), Object.keys($).map(function(e, t) {
            V.push({
                name: e,
                message: $[e]
            }), "U" === e && (O = e, E = $[e]);
        }), Object.keys(Y).map(function(e, t) {
            R.push({
                name: e,
                message: Y[e]
            }), "DOUBLE" === e && (F = e, U = Y[e]);
        }), Array.from(new Array(100).keys()).map(function(e, t) {
            z.push({
                name: e,
                message: e
            }), P.push({
                name: e,
                message: e
            });
        }), de) {
            var me = void 0, ge = void 0, he = void 0, pe = void 0, ve = void 0, De = void 0, be = void 0, Te = void 0, fe = void 0, Me = void 0;
            s = de.activeTitle;
            var Ie = de.describeId;
            d = void 0 === Ie ? "" : Ie, o = de.organizer, r = de.addressDescribe, me = de.latitude, 
            ge = de.longitude, l = de.publiced, u = de.needIdCardNo, m = de.needSignUp, v = de.limitNum, 
            D = de.contactName, b = de.contactCall;
            var Ce = de.creatorWeixinNo;
            T = void 0 === Ce ? "" : Ce, he = de.gmtStart;
            var we = de.gmtEnd;
            pe = void 0 === we ? "" : we, ve = de.gmtRegisterEnd, De = de.gmtModifyRegisterEnd, 
            de.enterNum, be = de.changeFee, Te = de.userTypeAndFeeMap, fe = de.activeLabels, 
            x = de.groupType, O = de.sexLimit, F = de.fightModel, j = de.limitMinAge, L = de.limitMaxAge;
            var Ae = de.chargeFeeType;
            Me = void 0 === Ae ? {} : Ae;
            var ye = de.userPreselectRuleId;
            G = void 0 === ye ? "" : ye, _ ? (I = f = e.date.formatNoSecondTime(new Date()), 
            w = f, y = f, 0) : (f = he.substring(0, 10), I = pe.substring(0, 10), w = ve.substring(0, 10), 
            y = De.substring(0, 10), be || (ce = !0), le = !0), M = he.substring(11, 16), C = pe.substring(11, 16), 
            A = ve.substring(11, 16), S = De.substring(11, 16), c = ge ? ge + "@" + me : "", 
            oe = Te.M, re = Te.W, v = 0 === parseInt(v) ? "" : v, ne = v, N = x.message, E = O.message, 
            U = F.message, x = x.name, O = O.name, F = F.name, ie = Me.name, se = Me.message, 
            "SINGLE" === F && Object.keys($).map(function(e, t) {
                "MIX" !== e && V.push({
                    name: e,
                    message: $[e]
                });
            }), "MIX" === O && Object.keys(Y).map(function(e, t) {
                "DOUBLE" === e && (R = []).push({
                    name: e,
                    message: Y[e]
                });
            }), fe.length > 0 && (fe.map(function(e, t) {
                q.indexOf(e) < 0 && q.push(e);
            }), g = [], q.map(function(e, t) {
                g.push({
                    id: t,
                    name: e,
                    activeClass: fe.indexOf(e) > -1,
                    editClass: !(p.indexOf(e) > -1)
                });
            })), B = de.synchronizedCreateSubject;
        }
        Z ? a.setData({
            pagePreviewImageSrc: Z + a.data.activeId
        }) : K && a.setData({
            pagePreviewImageSrc: K
        }), ue && (F = "DOUBLE", U = "双打"), a.setData({
            activeTitle: s,
            activeTitleLength: s.length || 0,
            describeId: d,
            organizer: o,
            addressDescribe: r,
            address: c,
            startDate: f,
            startTime: M,
            endDate: I,
            endTime: C,
            closeDate: w,
            closeTime: A,
            cancelDate: y,
            cancelTime: S,
            publiced: l,
            needIdCardNo: u,
            needSignUp: m,
            dataLabels: g,
            groupType: x,
            groupTypeMsg: N,
            limitMinAge: j,
            limitMaxAge: L,
            sexLimit: O,
            sexLimitMsg: E,
            groupMsgAndValueObject: k,
            limitSexMsgAndValueObject: V,
            limitMinAgeObject: z,
            limitMaxAgeObject: P,
            fightModelMsgAndValueObject: R,
            fightModel: F,
            fightModelMsg: U,
            manFee: oe,
            womanFee: re,
            objectLimitNum: X,
            limitNum: v,
            limitNumMessage: ne,
            isEightTurn: ue,
            contactName: D,
            contactCall: b,
            creatorWeixinNo: T,
            isdisabled: ce,
            isModify: le,
            ruleCode: Q,
            fightModelMsgAndValueMap: Y,
            limitSexMsgAndValueMap: $,
            feeTypeName: ie,
            feeTypeMessage: se,
            objectFeeType: ae,
            chargeFeeTypeMap: te,
            userPreselectRuleId: G,
            synchronizedCreateSubject: B
        });
    },
    onLoad: function(e) {
        new t.WeToast();
        var a = !!e.fromType;
        this.setData({
            ruleId: e.ruleId || "",
            activeId: e.id || "",
            isIpx: t.globalData.isIpx,
            isFromTemplate: a
        }), this.reGetStorage();
    },
    navigateToUploadImage: function() {
        var e = this.data.authedUserId;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(t) {
                var a = t.tempFilePaths;
                wx.navigateTo({
                    url: "/pages/package-template/uploadImage?authedUserId=" + e + "&imageResouce=" + a[0]
                });
            }
        });
    },
    reGetStorage: function(e) {
        var t = this;
        wx.showLoading({
            title: "加载中"
        }), t.timer && clearTimeout(t.timer), t.timer = setTimeout(function() {
            t.getStorage(e);
        }, 1e3);
    },
    getStorage: function(t) {
        var a = this;
        try {
            var i = wx.getStorageSync("userInfo");
            i ? t ? (e.getUserInfo(a.reGetStorage), a.setData({
                authedUserId: ""
            })) : a.setData({
                authedUserId: i.user.userId
            }) : e.getUserInfo(a.reGetStorage);
        } catch (t) {
            e.getUserInfo(a.reGetStorage);
        }
        a.data.authedUserId && "" !== a.data.authedUserId && (clearTimeout(a.timer), a.initPage());
    },
    initPage: function() {
        var t = new Date(), a = new Date();
        t.setDate(t.getDate() + 1), a.setDate(a.getDate() + 2);
        var i = this, s = i.data, n = s.activeId, d = s.ruleId, o = s.authedUserId, r = s.isFromTemplate, c = void 0 !== r && r, l = {
            service: "ACTIVITY_RACE_CREATE_INIT_PAGE",
            authedUserId: o,
            ruleId: d
        };
        wx.showLoading({
            title: "加载中"
        }), i.setData({
            startDate: e.date.formatNoSecondTime(t),
            endDate: e.date.formatNoSecondTime(a),
            closeDate: e.date.formatNoSecondTime(t),
            cancelDate: e.date.formatNoSecondTime(t),
            startTime: "08:00",
            endTime: "08:00",
            closeTime: "06:00",
            cancelTime: "06:00"
        }), n ? (l.activeId = n, c ? l.service = "ACTIVE_CREATE_WITH_STENCIL_INIT" : (l.service = "ACTIVE_MODIFIED_INIT", 
        i.setData({
            showCreateSubject: !1,
            synchronizedCreateSubject: !1
        }))) : l.ruleId = d, e.AJAX("service.json", e.MD5(l), function(t) {
            if (t.data) {
                var a = t.data.response;
                a.success ? i.initRaceData(a) : "USER_NOT_LOGIN" === a.error.name ? (i.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), i.reGetStorage(!0)) : i.wetoast.toast({
                    title: e.showErrorResult(a),
                    duration: 1e3
                });
            } else i.wetoast.toast({
                title: t.errMsg,
                duration: 1e3
            });
            wx.hideLoading();
        });
    }
});