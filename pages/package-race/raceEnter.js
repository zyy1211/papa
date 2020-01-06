var e = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        fixName: "",
        fixSex: "m",
        initFixSex: "",
        fixCell: "",
        idCardNo: "",
        parentJoinerBaseId: "",
        enterType: "ENTER",
        amount: "0",
        manPrice: 0,
        womanPrice: 0,
        isIpx: !1,
        isCanJoin: !0,
        isModify: !1,
        invitationModalHidden: !0,
        teamMemberModalHidden: !0,
        disabledSubmit: !0,
        protocolModalHidden: !0,
        agreeProtocol: !0,
        reliefModalHidden: !0
    },
    onShareAppMessage: function(e) {
        var t = this;
        return {
            title: "大神,求carry",
            desc: "欢迎使用PAPA报名，点击打开!",
            path: "/pages/letter/inviteLetter?id=" + t.data.joinerInviteLetterId,
            imageUrl: "/static/invite-letter.png",
            success: function(e) {
                t.reGetStorage();
            },
            fail: function() {
                t.reGetStorage();
            }
        };
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
    showReliefModal: function() {
        this.setData({
            reliefModalHidden: !1
        });
    },
    closeReliefModal: function() {
        this.setData({
            reliefModalHidden: !0
        });
    },
    getCountResult: function() {
        var t = this, a = t.data, i = a.isModify, o = a.manPrice, r = a.womanPrice, n = a.organizer, s = a.initFixSex, d = a.fixSex, l = "", c = n ? 0 : "m" === s ? o : r, u = n ? 0 : "m" === d ? o : r;
        i && (u = e.math.floatSub(u, c)), l = u < 0 ? "退款" + -u : "仍需" + u, t.setData({
            feeResult: l,
            amount: u
        });
    },
    bindCancelEnter: function() {
        var t = this, a = t.data, i = a.activeId, o = a.parentJoinerBaseId, r = a.authedUserId;
        t.data.disabledSubmit || wx.showModal({
            title: "提示",
            content: "确定取消报名？",
            cancelText: "取消",
            confirmText: "确定",
            confirmColor: "#00CD91",
            success: function(a) {
                a.confirm && (t.setData({
                    disabledSubmit: !0
                }), e.AJAX("service.json", e.MD5({
                    service: "CANCEL_ACTIVE_ENTER",
                    enterType: "ENTER",
                    activeId: i,
                    parentJoinerBaseId: o,
                    authedUserId: r
                }), function(a) {
                    if (a.data) {
                        var i = a.data.response;
                        i.success ? (wx.showToast({
                            title: "取消报名成功"
                        }), setTimeout(function() {
                            wx.navigateBack({
                                delta: 1
                            });
                        }.bind(this), 800)) : "USER_NOT_LOGIN" === i.error.name ? (t.wetoast.toast({
                            title: "您已在其他地方登陆，正在重新登陆...",
                            duration: 1e3
                        }), t.reGetStorage(!0)) : t.wetoast.toast({
                            title: e.showErrorResult(i),
                            duration: 1e3
                        });
                    } else t.wetoast.toast({
                        title: a.errMsg,
                        duration: 1e3
                    });
                    t.setData({
                        disabledSubmit: !1
                    });
                }, function(e) {
                    t.wetoast.toast({
                        title: e.errMsg,
                        duration: 1e3
                    });
                }));
            }
        });
    },
    bindFormSubmit: function(e) {
        var t = this, a = t.data, i = a.allowEnterSexWithTeam, o = void 0 === i ? [] : i, r = a.disabledSubmit, n = a.fixSex;
        if (!r) if (o.length < 2) {
            var s = o[0];
            s && (s.name.toLowerCase() !== n ? wx.showModal({
                title: "提示",
                content: "性别不匹配，是否继续报名，报名成功后可邀请好友组队",
                cancelText: "取消",
                confirmText: "确定",
                confirmColor: "#00CD91",
                success: function(a) {
                    a.confirm && t.ajaxFormSubmit(e, !0);
                }
            }) : t.ajaxFormSubmit(e));
        } else t.ajaxFormSubmit(e);
    },
    ajaxFormSubmit: function(t, a) {
        var i = this, o = t.detail.value, r = o.fixName, n = o.fixCell, s = o.idCardNo, d = void 0 === s ? "" : s, l = i.data, c = l.inviteLetterId, u = void 0 === c ? "" : c, m = l.enterType, f = l.activeId, I = l.parentJoinerBaseId, g = void 0 === I ? "" : I, h = l.authedUserId, v = l.fixSex, x = l.needIdCard, S = l.amount, w = l.agreeProtocol, M = "";
        if (a && (u = ""), "" === r ? M = "请填写姓名" : /^([1][2-9][0-9]{9})|([9][0-9]{10})$/.test(n) ? x && "" === d && (M = "请填写身份证号") : M = "手机号格式不正确", 
        "" !== M) return i.wetoast.toast({
            title: M,
            duration: 1e3
        }), !1;
        i.setData({
            disabledSubmit: !0
        }), e.AJAX("service.json", e.MD5({
            service: "ACTIVE_ENTER",
            activeId: f,
            enterType: m,
            inviteLetterId: u,
            fixName: r,
            fixCell: n,
            idCardNo: d,
            fixSex: v.toUpperCase(),
            parentJoinerBaseId: g,
            amount: S,
            agreeProtocol: w,
            authedUserId: h,
            formId: t.detail.formId
        }), function(t) {
            if (t.data) {
                var o = t.data.response;
                if (o.success) {
                    var r = o.parameterMap, n = o.inviteLetterId, s = r.timeStamp, d = r.nonceStr, l = r.signType, c = r.paySign;
                    r.timeStamp ? wx.requestPayment({
                        timeStamp: s,
                        nonceStr: d,
                        signType: l,
                        paySign: c,
                        package: r.package,
                        success: function(t) {
                            wx.showLoading({
                                title: "加载中"
                            });
                            var r = 0;
                            i.ajaxPoll.init({
                                url: "service.json",
                                requestData: e.MD5({
                                    service: "ACTIVE_ENTER_RETURN",
                                    depositNo: o.depositNo,
                                    authedUserId: i.data.authedUserId
                                }),
                                callback: function(t) {
                                    if (t.data) {
                                        var o = t.data.response;
                                        o.success ? (wx.hideLoading(), this.stop(), i.enterSuucessFunc(o.inviteLetterId, a)) : "FINISH_CHECK_FAILED_BUT_HAS_DEAL" === o.error.name && (wx.hideLoading(), 
                                        this.stop(), i.wetoast.toast({
                                            title: e.showErrorResult(o),
                                            duration: 1e3
                                        }));
                                    }
                                    ++r > 10 && (wx.hideLoading(), this.stop(), i.wetoast.toast({
                                        title: "调单恢复失败，请联系服务人员！",
                                        duration: 1e3
                                    }), setTimeout(function() {
                                        wx.navigateBack({
                                            delta: 1
                                        });
                                    }.bind(this), 1200));
                                }
                            });
                        },
                        fail: function(e) {
                            "requestPayment:fail cancel" == e.errMsg ? i.wetoast.toast({
                                title: "您已取消支付！",
                                duration: 1e3
                            }) : i.wetoast.toast({
                                title: e.errMsg,
                                duration: 1e3
                            });
                        }
                    }) : i.enterSuucessFunc(n, a);
                } else "ACTIVE_JOINER_BASE_IS_FULL_AND_CAN_QUEUE" === o.error.name ? wx.showModal({
                    title: "提示",
                    content: o.error.message,
                    cancelText: "取消",
                    confirmText: "确定",
                    confirmColor: "#00CD91",
                    success: function(e) {
                        e.confirm ? (wx.showLoading({
                            title: "加载中"
                        }), i.reGetStorage(!0)) : e.cancel;
                    }
                }) : "USER_NOT_LOGIN" === o.error.name ? (i.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), i.reGetStorage(!0)) : i.wetoast.toast({
                    title: e.showErrorResult(o),
                    duration: 1e3
                });
                i.setData({
                    disabledSubmit: !1
                });
            } else i.wetoast.toast({
                title: t.errMsg,
                duration: 1e3
            });
        }, function(e) {
            i.wetoast.toast({
                title: e.errMsg,
                duration: 1e3
            });
        });
    },
    showInvitationModal: function() {
        this.setData({
            invitationModalHidden: !1
        });
    },
    closeInvitationModal: function() {
        this.setData({
            invitationModalHidden: !0
        }), this.reGetStorage();
    },
    enterSuucessFunc: function(e, t) {
        var a = this, i = a.data, o = i.teamModel, r = i.hasTeamMember, n = i.isModify, s = i.inviteLetterId, d = i.activeId, l = "报名成功";
        t && (s = ""), !o || r || "" !== s || n ? (n && (l = "修改报名成功"), "" !== s ? (l = "组队成功", 
        setTimeout(function() {
            wx.redirectTo({
                url: "/pages/package-race/raceDetail?id=" + d
            });
        }.bind(this), 800)) : setTimeout(function() {
            wx.navigateBack({
                delta: 1
            });
        }.bind(this), 800), wx.showToast({
            title: l
        })) : (a.setData({
            joinerInviteLetterId: e
        }), a.showInvitationModal());
    },
    onLoad: function(e) {
        new t.WeToast(), new t.AjaxPoll();
        var a = this;
        a.setData({
            activeId: e.id || "",
            inviteLetterId: e.inviteLetterId || "",
            isIpx: t.globalData.isIpx
        }), a.reGetStorage(), wx.canIUse("hideShareMenu") && wx.hideShareMenu();
    },
    reGetStorage: function(e) {
        var t = this;
        t.timer && clearTimeout(t.timer), t.timer = setTimeout(function() {
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
        var t = this, a = t.data, i = a.activeId, o = a.inviteLetterId, r = void 0 === o ? "" : o, n = a.authedUserId;
        wx.showLoading({
            title: "加载中"
        }), e.AJAX("service.json", e.MD5({
            service: "ACTIVE_ENTER_INIT",
            activeId: i,
            inviteLetterId: r,
            authedUserId: n
        }), function(a) {
            if (a.data) {
                var i = a.data.response;
                if (i.success) {
                    var o = t.data, r = o.isModify, n = o.initFixSex, s = o.amount, d = i.activeJoinerBase, l = i.organizer, c = i.gmtModifyRegisterEnd, u = i.parentJoinerBaseId, m = void 0 === u ? "" : u, f = i.typeAndMoney, I = (i.quota, 
                    i.needIdCard), g = i.teamModel, h = i.hasTeamMember, v = i.joinerInviteLetterId, x = void 0 === v ? "" : v, S = i.allowEnterSexWithTeam, w = void 0 === S ? [] : S, M = d.fixName, T = d.fixCell, p = d.fixSex, E = d.idCardNo, b = void 0 === E ? "" : E, C = f && f.M || 0, L = f && f.W || 0;
                    p = n = p.name.toLowerCase(), s = l ? "0" : "m" === p ? C : L, m && (r = !0, s = 0), 
                    c = c.substring(5, 7) + "月" + c.substring(8, 10) + "日 " + c.substring(11, 16), t.setData({
                        disabledSubmit: !1,
                        organizer: l,
                        gmtModifyRegisterEnd: c,
                        fixName: M,
                        fixSex: p,
                        initFixSex: n,
                        fixCell: T,
                        idCardNo: b,
                        manPrice: C,
                        womanPrice: L,
                        isModify: r,
                        parentJoinerBaseId: m,
                        amount: s,
                        needIdCard: I,
                        teamModel: g,
                        hasTeamMember: h,
                        joinerInviteLetterId: x,
                        allowEnterSexWithTeam: w
                    });
                } else "USER_NOT_LOGIN" === i.error.name ? (t.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), t.reGetStorage(!0)) : ("ACTIVE_REGISTER_TIME_IS_END" !== i.error.name && "ACTIVE_QUOTA_IS_FULL" !== i.error.name || t.setData({
                    isCanJoin: !1
                }), t.wetoast.toast({
                    title: e.showErrorResult(i),
                    duration: 1e3
                }));
            } else t.wetoast.toast({
                title: a.errMsg,
                duration: 1e3
            });
            wx.hideLoading();
        });
    }
});