var e = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        fixName: "",
        fixSex: "m",
        initFixSex: "",
        fixCell: "",
        memo: "",
        parentJoinerBaseId: "",
        typeNum: "",
        typeNumChange: "",
        amount: "",
        historyManInputValue: 0,
        historyWomanInputValue: 0,
        manInputValue: 0,
        womanInputValue: 0,
        manPrice: 0,
        womanPrice: 0,
        maxCounts: 0,
        countResultObj: {},
        countResultFee: "0*0 + 0*0",
        feeResult: 0,
        reFeeResult: "仍需0",
        organizerPriceFee: "0",
        isManAddDisable: !1,
        isManMinusDisable: !0,
        isWomanAddDisable: !1,
        isWomanMinusDisable: !0,
        isCanJoin: !0,
        isModify: !1,
        organizer: !1,
        disabledSubmit: !0,
        protocolModalHidden: !0,
        agreeProtocol: !0,
        reliefModalHidden: !0
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
    bindNameInput: function(e) {
        this.setData({
            fixName: e.detail.value
        });
    },
    bindRemarkInput: function(e) {
        this.setData({
            memo: e.detail.value
        });
    },
    bindPhoneInput: function(e) {
        this.setData({
            fixCell: e.detail.value
        });
    },
    bindKeyInput: function(e, t) {
        var a = this, i = a.data, n = i.manInputValue, o = i.womanInputValue, s = i.historyManInputValue, r = i.historyWomanInputValue, u = i.maxCounts, d = i.isModify, l = n, m = o, c = 0, f = !1;
        if (e.detail) c = parseInt(e.detail.value, 10), f = "man" === e.currentTarget.dataset.type; else {
            var h = (f = "man" === e) ? l : m;
            "add" === t ? h++ : "minus" === t && h--, c = h;
        }
        var p = (c = a.getNumber(c, f)) + (f ? m : l) - s - r;
        if (d || (p += 1), p > u) return f ? a.setData({
            manInputValue: a.getNumber(l, f)
        }) : a.setData({
            womanInputValue: a.getNumber(m, f)
        }), void a.wetoast.toast({
            title: "最大可报名人数为" + u,
            duration: 1e3
        });
        f ? a.setData({
            manInputValue: c
        }) : a.setData({
            womanInputValue: c
        }), a.getCountResult();
    },
    getCountResult: function() {
        var t = this, a = t.data, i = a.manInputValue, n = a.womanInputValue, o = a.historyManInputValue, s = a.historyWomanInputValue, r = a.manPrice, u = a.womanPrice, d = a.organizer, l = void 0 !== d && d, m = i, c = n, f = o, h = s, p = m - f, I = c - h, w = "M@" + m + ",W@" + c, g = "M@" + p + ",W@" + I, x = {}, M = [], b = [], S = "", v = 0, D = 0, y = l ? 0 : "m" === t.data.fixSex ? r : u, E = y;
        p >= 0 ? x.man = {
            memo: "增加" + p + "名男生",
            fee: r + "*" + p
        } : p < 0 && (x.man = {
            memo: "减少" + -p + "名男生",
            fee: r + "*(" + p + ")"
        }), I >= 0 ? x.woman = {
            memo: "增加" + I + "名女生",
            fee: u + "*" + I
        } : I < 0 && (x.woman = {
            memo: "减少" + -I + "名女生",
            fee: u + "*(" + I + ")"
        }), x.man && (M.push(x.man.memo), b.push(x.man.fee)), x.woman && (M.push(x.woman.memo), 
        b.push(x.woman.fee)), l || (v = e.math.floatAdd(e.math.floatMul(r, m), e.math.floatMul(u, c)), 
        v = e.math.floatAdd(v, y), D = e.math.floatAdd(e.math.floatMul(r, f), e.math.floatMul(u, h)), 
        t.data.isModify && ("m" === t.data.initFixSex ? (D = e.math.floatAdd(D, r), E = "w" === t.data.fixSex ? "(-" + r + ") + " + u : "0.00") : "w" === t.data.initFixSex && (D = e.math.floatAdd(D, u), 
        E = "m" === t.data.fixSex ? "(-" + u + ") + " + r : "0.00"))), S = (v = e.math.floatSub(v, D)) < 0 ? "退款" + -v : "仍需" + v, 
        t.setData({
            countResultMemo: M.join("，"),
            countResultFee: b.join(" + "),
            typeNum: w,
            typeNumChange: g,
            feeResult: v,
            reFeeResult: S,
            organizerPriceFee: E
        });
    },
    getNumber: function(e, t) {
        return e = parseInt(e, 10), isNaN(e) || 0 === e ? (t ? this.setData({
            isManMinusDisable: !0
        }) : this.setData({
            isWomanMinusDisable: !0
        }), 0) : (t ? this.setData({
            isManMinusDisable: !1
        }) : this.setData({
            isWomanMinusDisable: !1
        }), e);
    },
    manAddOne: function() {
        this.data.isManAddDisable || this.bindKeyInput("man", "add");
    },
    manMinusOne: function() {
        this.data.isManMinusDisable || this.bindKeyInput("man", "minus");
    },
    womanAddOne: function() {
        this.data.isWomanAddDisable || this.bindKeyInput("woman", "add");
    },
    womanMinusOne: function() {
        this.data.isWomanMinusDisable || this.bindKeyInput("woman", "minus");
    },
    bindCancelEnter: function() {
        var t = this, a = t.data, i = a.enterType, n = a.disabledSubmit, o = a.activeId, s = a.parentJoinerBaseId, r = a.authedUserId, u = "取消报名成功", d = "确定取消报名？";
        "QUEUE" === i && (u = "取消排队成功", d = "确定取消排队？"), n || wx.showModal({
            title: "提示",
            content: d,
            cancelText: "取消",
            confirmText: "确定",
            confirmColor: "#00CD91",
            success: function(a) {
                a.confirm && (t.setData({
                    disabledSubmit: !0
                }), e.AJAX("service.json", e.MD5({
                    service: "CANCEL_ACTIVE_ENTER",
                    activeId: o,
                    enterType: i,
                    parentJoinerBaseId: s,
                    authedUserId: r
                }), function(a) {
                    if (a.data) {
                        var i = a.data.response;
                        i.success ? (wx.showToast({
                            title: u
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
        var t = this, a = t.data, i = a.enterType, n = a.disabledSubmit, o = a.isModify, s = "QUEUE" === i;
        n || (s && !o ? wx.showModal({
            title: "提示",
            content: "该活动报名人员已满，您确认后将进入排队状态。截至活动开始时间若您尚未进入正常报名名单，系统将退还您的报名费用。",
            cancelText: "取消",
            confirmText: "确定",
            confirmColor: "#00CD91",
            success: function(a) {
                a.confirm ? t.ajaxFormSubmit(e) : a.cancel;
            }
        }) : t.ajaxFormSubmit(e));
    },
    ajaxFormSubmit: function(t) {
        var a = this, i = a.data, n = i.activeId, o = i.enterType, s = i.fixName, r = i.fixCell, u = i.fixSex, d = i.memo, l = i.isModify, m = i.parentJoinerBaseId, c = i.typeNum, f = i.typeNumChange, h = i.feeResult, p = i.agreeProtocol, I = i.authedUserId, w = "", g = "QUEUE" === o, x = "报名成功";
        if (g && (x = "排队成功"), l && (x = "修改报名成功", g && (x = "修改排队成功")), /^([1][2-9][0-9]{9})|([9][0-9]{10})$/.test(r) || (w = "手机号格式不正确"), 
        "" !== w) return a.wetoast.toast({
            title: w,
            duration: 1e3
        }), !1;
        a.setData({
            disabledSubmit: !0
        }), e.AJAX("service.json", e.MD5({
            service: g ? "ACTIVE_ENTER_QUEUE" : "ACTIVE_ENTER",
            activeId: n,
            enterType: o,
            fixName: s,
            fixCell: r,
            fixSex: u.toUpperCase(),
            memo: d,
            parentJoinerBaseId: m,
            typeNum: c,
            typeNumChange: f,
            amount: h,
            agreeProtocol: p,
            authedUserId: I,
            formId: t.detail.formId
        }), function(t) {
            if (t.data) {
                var i = t.data.response;
                if (i.success) {
                    var n = i.parameterMap, o = void 0 === n ? {} : n, s = i.depositNo, r = o.timeStamp, u = o.nonceStr, d = o.signType, l = o.paySign;
                    r ? wx.requestPayment({
                        timeStamp: r,
                        nonceStr: u,
                        package: o.package,
                        signType: d,
                        paySign: l,
                        success: function(t) {
                            wx.showLoading({
                                title: "加载中"
                            });
                            var i = 0;
                            a.ajaxPoll.init({
                                url: "service.json",
                                requestData: e.MD5({
                                    service: "ACTIVE_ENTER_RETURN",
                                    depositNo: s,
                                    authedUserId: I
                                }),
                                callback: function(t) {
                                    if (t.data) {
                                        var n = t.data.response;
                                        n.success ? (wx.hideLoading(), wx.showToast({
                                            title: x
                                        }), this.stop(), setTimeout(function() {
                                            wx.navigateBack({
                                                delta: 1
                                            });
                                        }.bind(this), 800)) : "FINISH_CHECK_FAILED_BUT_HAS_DEAL" === n.error.name && (wx.hideLoading(), 
                                        this.stop(), a.wetoast.toast({
                                            title: e.showErrorResult(n),
                                            duration: 1e3
                                        }));
                                    }
                                    ++i > 10 && (wx.hideLoading(), this.stop(), a.wetoast.toast({
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
                            "requestPayment:fail cancel" == e.errMsg ? a.wetoast.toast({
                                title: "您已取消支付！",
                                duration: 1e3
                            }) : a.wetoast.toast({
                                title: e.errMsg,
                                duration: 1e3
                            });
                        }
                    }) : (wx.showToast({
                        title: x
                    }), setTimeout(function() {
                        wx.navigateBack({
                            delta: 1
                        });
                    }.bind(this), 800));
                } else "ACTIVE_JOINER_BASE_IS_FULL_AND_CAN_QUEUE" === i.error.name ? wx.showModal({
                    title: "提示",
                    content: i.error.message,
                    cancelText: "取消",
                    confirmText: "确定",
                    confirmColor: "#00CD91",
                    success: function(e) {
                        e.confirm ? (wx.showLoading({
                            title: "加载中"
                        }), a.reGetStorage(!0)) : e.cancel;
                    }
                }) : "USER_NOT_LOGIN" === i.error.name ? (a.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), a.reGetStorage(!0)) : a.wetoast.toast({
                    title: e.showErrorResult(i),
                    duration: 1e3
                });
                a.setData({
                    disabledSubmit: !1
                });
            } else a.wetoast.toast({
                title: t.errMsg,
                duration: 1e3
            });
        }, function(e) {
            a.wetoast.toast({
                title: e.errMsg,
                duration: 1e3
            });
        });
    },
    onLoad: function(e) {
        new t.WeToast(), new t.AjaxPoll();
        var a = this;
        a.setData({
            activeId: e.id,
            isIpx: t.globalData.isIpx
        }), a.reGetStorage();
    },
    onPullDownRefresh: function() {
        var e = this;
        e.onShow(), wx.stopPullDownRefresh(), e.reGetStorage();
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
        "" === a.data.authedUserId || (clearTimeout(a.timer), a.initPage());
    },
    initPage: function() {
        var t = this, a = t.data, i = a.activeId, n = a.authedUserId;
        wx.showLoading({
            title: "加载中"
        }), e.AJAX("service.json", e.MD5({
            service: "ACTIVE_ENTER_INIT",
            activeId: i,
            authedUserId: n
        }), function(a) {
            if (a.data) {
                var i = a.data.response;
                if (i.success) {
                    var n = i.allowCarry, o = i.enterType, s = i.parentJoinerBaseId, r = void 0 === s ? "" : s, u = i.quota, d = void 0 === u ? 0 : u, l = i.organizer, m = void 0 !== l && l, c = i.typeAndNumMap, f = void 0 === c ? {} : c, h = i.typeAndMoney, p = void 0 === h ? {} : h, I = i.gmtModifyRegisterEnd, w = i.fixName, g = void 0 === w ? "" : w, x = i.memo, M = void 0 === x ? "" : x, b = 0, S = 0, v = !1, D = m ? 0 : p.M || 0, y = m ? 0 : p.W || 0, E = D, T = E, N = "m", C = "", A = "", R = !0, _ = !0;
                    f && (R = 0 === (b = f.M || 0), _ = 0 === (S = f.W || 0)), "" !== r ? v = !0 : g = "", 
                    N = C = i.fixSex.toLowerCase(), A = i.fixCell, T = E = "w" === N ? y : D, (m || v) && (E = 0, 
                    T = "0"), I = I.substring(5, 7) + "月" + I.substring(8, 10) + "日 " + I.substring(11, 16), 
                    t.setData({
                        disabledSubmit: !1,
                        allowCarry: n,
                        enterType: o,
                        gmtModifyRegisterEnd: I,
                        fixName: g,
                        fixSex: N,
                        initFixSex: C,
                        fixCell: A,
                        memo: M,
                        parentJoinerBaseId: r,
                        manInputValue: b,
                        womanInputValue: S,
                        isManMinusDisable: R,
                        isWomanMinusDisable: _,
                        manPrice: D,
                        womanPrice: y,
                        isModify: v,
                        organizerPriceFee: T,
                        feeResult: E,
                        organizer: m,
                        historyManInputValue: b || 0,
                        historyWomanInputValue: S || 0,
                        maxCounts: d,
                        countResultFee: D + "*0 + " + y + "*0"
                    });
                } else "USER_NOT_LOGIN" === i.error.name ? (t.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), t.reGetStorage(!0)) : "ACTIVE_REGISTER_TIME_IS_END" === i.error.name || "ACTIVE_QUOTA_IS_FULL" === i.error.name ? t.setData({
                    isCanJoin: !1
                }) : t.wetoast.toast({
                    title: e.showErrorResult(i),
                    duration: 1e3
                });
            } else t.wetoast.toast({
                title: a.errMsg,
                duration: 1e3
            });
            wx.hideLoading();
        });
    }
});