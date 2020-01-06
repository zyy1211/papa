var e = require("../config.js"), t = require("tool.js"), n = require("md5.js"), o = {
    AJAX: function() {
        var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "", o = arguments[2], r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "", i = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "", s = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : "get", a = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : {};
        wx.request({
            url: e.API_HOST + t,
            method: s || "get",
            data: n,
            header: a || {
                "Content-Type": "application/json"
            },
            success: function(e) {
                wx.hideLoading(), o && o(e);
            },
            fail: function(e) {
                l.showToast(e.errMsg), r && "" !== r && r(e);
            },
            complete: function(e) {
                "" === i || i(e);
            }
        });
    },
    request: function(t, n, o, i, s) {
        return new Promise(function(a, u) {
            i || wx.showLoading({
                title: "加载中"
            }), wx.request({
                url: e.API_HOST + t,
                method: o || "get",
                data: n,
                header: {
                    "Content-Type": "application/json"
                },
                success: function(e) {
                    if (e.data) {
                        var t = e.data.response || e.data || {};
                        if (t) if (t.success) a(t), i || wx.hideLoading(); else {
                            s || l.showToast(r.getError(t));
                            var n = getApp().globalData, o = n.subjectIsDeleteName, c = void 0 === o ? "" : o, g = n.commentIsDeleteName, d = void 0 === g ? "" : g, h = n.commentReplyIsDeleteName, f = void 0 === h ? "" : h, p = t.error, v = (void 0 === p ? {} : p).name, m = void 0 === v ? "" : v;
                            m === c ? setTimeout(function() {
                                wx.navigateBack(), u(t);
                            }, 1500) : m !== d && m !== f || u(t), t.needBack && setTimeout(function() {
                                wx.navigateBack();
                            }, 1500);
                        } else s || l.showToast("系统正忙：" + e.statusCode);
                    } else s || l.showToast(e.errMsg);
                },
                fail: function(e) {
                    i || wx.hideLoading(), s || l.showToast("网络出错");
                }
            });
        });
    },
    requestEmpty: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
        if (e.detail) {
            var n = getCurrentPages(), r = n[n.length - 1];
            o.AJAX("service.json", {
                formId: e.detail.formId,
                authedUserId: t || r.data.authedUserId
            });
        }
    }
}, r = {
    reCount: 1,
    getError: function(e) {
        return e ? e.error && "USER_NOT_LOGIN" === e.error.name ? (s.miniProgramUserLogin(), 
        "您已在其他地方登陆，正在重新登陆...") : e.errorMessage ? e.errorMessage.message || e.errorMessage : e.errorEnum ? e.errorEnum.message : e.errorCode ? e.errorCode : e.error ? e.error.message || e.error.code : e.detailMessage ? e.detailMessage : e.fieldErrors ? $.isArray(e.fieldErrors) ? e.fieldErrors.join("<br>") : e.fieldErrors : "系统错误" : "网络正忙，请稍后重试";
    }
}, i = {
    initUserLogin: function(e) {
        var t = i;
        wx.login({
            success: function(n) {
                n.code ? (t.code = n.code, t.getUserInfo(e)) : console.log("获取用户登录态失败！" + n.errMsg);
            }
        });
    },
    getUserInfo: function(e) {
        var t = i;
        wx.getUserInfo({
            success: function(n) {
                if (n.userInfo) {
                    var i = n.encryptedData, a = n.iv, u = n.rawData, c = n.signature;
                    o.AJAX("service.json", {
                        service: "MINI_PROGRAM_USER_LOGIN",
                        jsCode: t.code,
                        encryptedData: i,
                        iv: a,
                        rawData: u,
                        signature: c
                    }, function(t) {
                        var n = t.data.response, o = null;
                        n && n.success ? (o = {
                            signKey: n.signKey,
                            loginKey: n.loginKey,
                            user: {
                                userId: n.user.userId,
                                nickName: n.user.nickName
                            }
                        }, n.userInfoComplete || s.openUserInfo(n.user.userId), wx.setStorage({
                            key: "userInfo",
                            data: o
                        })) : l.showToast(r.getError(n)), e && e();
                    });
                } else r.getError("获取用户信息失败！" + n.errMsg);
            },
            fail: function() {
                s.openUserAuthorize();
            }
        });
    }
}, s = {
    initPageLogin: function(e) {
        return new Promise(function(t, n) {
            var o = s;
            if (!o.doInitLogin) {
                o.doInitLogin = !0;
                var r = wx.getStorageSync("userInfo");
                r && r.user && !e ? (t(r.user.userId), o.doInitLogin = !1) : (o.miniProgramUserLogin().then(function(e) {
                    e ? (e.user && (t(e.user.userId), o.hasAuthorize = !1), o.doInitLogin = !1) : o.doInitLogin = !1;
                }), o.doInitLogin = !1);
            }
        });
    },
    initUserLogin: function() {
        return new Promise(function(e, t) {
            return wx.login({
                success: e,
                fail: t
            });
        });
    },
    getUserInfo: function() {
        return s.initUserLogin().then(function(e) {
            return new Promise(function(t, n) {
                s.code = e.code, wx.getUserInfo({
                    success: t,
                    fail: n
                });
            });
        });
    },
    miniProgramUserLogin: function() {
        var e = s;
        return e.getUserInfo().then(function(t) {
            return new Promise(function(n, i) {
                if (t.userInfo) {
                    wx.showLoading({
                        title: "加载中"
                    });
                    var s = t.encryptedData, a = t.iv, u = t.rawData, c = t.signature;
                    o.AJAX("service.json", {
                        service: "MINI_PROGRAM_USER_LOGIN",
                        jsCode: e.code,
                        encryptedData: s,
                        iv: a,
                        rawData: u,
                        signature: c,
                        appVersion: "2.6.0"
                    }, function(t) {
                        var o = t.data.response, i = null;
                        o && o.success ? (i = {
                            signKey: o.signKey,
                            loginKey: o.loginKey
                        }, o.userInfoComplete ? e.hasAuthorize ? i.user = {
                            userId: o.user.userId,
                            nickName: o.user.nickName
                        } : e.openUserAuthorize("authorize") : e.openUserInfo(o.user.userId), wx.setStorage({
                            key: "userInfo",
                            data: i
                        })) : o.error.name && "CALL_NOT_FOUND" === o.error.name ? e.openUserAuthorize("phone", o.userId) : l.showToast(r.getError(o)), 
                        setTimeout(function() {
                            n(i);
                        }, 100);
                    });
                } else l.showToast("获取用户信息失败！" + t.errMsg);
            });
        }).catch(function(t) {
            l.showToast("用户未授权！"), e.openUserAuthorize("authorize");
        });
    },
    openUserAuthorize: function(e, t) {
        var n = this.getPageArrRoute() || {};
        if (this.hasAuthorize = !0, "authorize" === e) wx.navigateTo({
            url: "/pages/user/userAuthorize?route=" + n.route + "&type=" + e
        }); else if ("phone" === e) {
            var o = getCurrentPages(), r = o[o.length - 1];
            (r.route || r.__route__).indexOf("pages/user/userAuthorize") > -1 ? r.setData({
                showBindPhone: !0,
                userId: t
            }) : wx.navigateTo({
                url: "/pages/user/userAuthorize?route=" + n.route + "&type=" + e + "&userId=" + t
            });
        }
    },
    openUserInfo: function(e) {
        var t = getApp(), n = this.getPageArrRoute() || {};
        t.globalData.openUserInfo || (wx.navigateTo({
            url: "/pages/user/userInfo?authedUserId=" + e + "&route=" + n.route + "&prevRoute=" + n.prevRoute
        }), t.globalData.openUserInfo = !0);
    },
    getPageArrRoute: function() {
        var e = getCurrentPages(), t = e[e.length - 1], n = e[e.length - 2], o = t.options, r = t.route || t.__route__, i = [], s = "";
        return Object.keys(o).map(function(e) {
            i.push(e + "=" + o[e]);
        }), r = 0 === i.length ? encodeURIComponent("" + r) : encodeURIComponent(r + "?" + i.join("&")), 
        n && (o = n.options, i = [], s = n.route || n.__route__, Object.keys(o).map(function(e) {
            i.push(e + "=" + o[e]);
        }), s = 0 === i.length ? encodeURIComponent("" + s) : encodeURIComponent(s + "?" + i.join("&"))), 
        {
            route: r,
            prevRoute: s
        };
    }
}, a = {
    sign: function(e) {
        var t = [], n = [];
        Object.keys(e).forEach(function(o) {
            "" === e[o] ? t.push(o) : n.push(o);
        });
        var o = {};
        (n = n.sort()).forEach(function(t) {
            o[t] = e[t];
        });
        var r = "";
        for (var i in o) r += "&" + i + "=" + o[i];
        return r = r.substr(1);
    }
}, u = {
    MD5: function(e) {
        var t = "", o = "";
        try {
            var r = wx.getStorageSync("userInfo");
            r && (t = r.loginKey || "", o = r.signKey || "");
        } catch (e) {}
        return wx.getSystemInfo({
            success: function(t) {
                e.clientVersion = t.version, e.libVersion = t.SDKVersion;
            }
        }), e.appVersion = "2.7.0", e.loginKey = t, e.sign = n.md5(o + "" + a.sign(e)), 
        e;
    }
}, c = {
    isNumber: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "";
        return !!/^[0-9]+$/.test(e);
    },
    floatAdd: function(e, t) {
        var n = void 0, o = void 0, r = void 0, i = void 0;
        try {
            n = ("" + e).split(".")[1].length;
        } catch (e) {
            n = 0;
        }
        try {
            o = ("" + t).split(".")[1].length;
        } catch (e) {
            o = 0;
        }
        return r = Math.pow(10, Math.max(n, o)), i = n >= o ? n : o, ((e * r + t * r) / r).toFixed(i);
    },
    floatSub: function(e, t) {
        var n = void 0, o = void 0, r = void 0, i = void 0;
        try {
            n = ("" + e).split(".")[1].length;
        } catch (e) {
            n = 0;
        }
        try {
            o = ("" + t).split(".")[1].length;
        } catch (e) {
            o = 0;
        }
        return r = Math.pow(10, Math.max(n, o)), i = n >= o ? n : o, ((e * r - t * r) / r).toFixed(i);
    },
    floatMul: function(e, t) {
        var n = 0, o = "" + e, r = "" + t;
        try {
            n += o.split(".")[1].length;
        } catch (e) {}
        try {
            n += r.split(".")[1].length;
        } catch (e) {}
        return Number(o.replace(".", "")) * Number(r.replace(".", "")) / Math.pow(10, n);
    },
    floatDiv: function(e, t) {
        var n = 0, o = 0, r = void 0, i = void 0;
        try {
            n = ("" + e).split(".")[1].length;
        } catch (e) {}
        try {
            o = ("" + t).split(".")[1].length;
        } catch (e) {}
        return r = Number(("" + e).replace(".", "")), i = Number(("" + t).replace(".", "")), 
        r / i * Math.pow(10, o - n);
    }
}, g = {
    getUnicodeNickname: function() {
        for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = e.match(/\\u([0-9a-fA-F]{4})/g); t && t.length > 0; ) t = (e = e.replace(t[0], unescape(t[0].replace(/\\/g, "%")))).match(/\\u([0-9a-fA-F]{4})/g);
        return e;
    }
}, d = {
    uniqueArray: function(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "id", n = [], o = [];
        return e.map(function(e) {
            -1 === o.indexOf(e[t]) && (n.push(e), o.push(e[t]));
        }), n;
    }
}, l = {
    showToast: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "none", n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1500;
        "" !== e && wx.showToast({
            title: e,
            icon: t,
            duration: n
        });
    }
}, h = {
    openSubject: function() {
        this.downloadApp({
            content: "发布动态请使用papa体育app"
        });
    },
    openSpecialRace: function() {
        this.downloadApp({
            content: "发布赛事请下载papa体育app"
        });
    },
    openClub: function() {
        this.downloadApp({
            content: "下载“PaPa体育”APP可以查看俱乐部详情"
        });
    },
    downloadApp: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = this;
        wx.showModal({
            title: "提示",
            content: e.content || "请下载“PaPa体育”APP进行操作",
            confirmText: "立即下载",
            confirmColor: "#00CD91",
            success: function(e) {
                e.confirm && t.getDownloadAppUrl();
            }
        });
    },
    getDownloadAppUrl: function() {
        var t = this, n = "";
        n = wx.getSystemInfoSync().system.indexOf("Android") > -1 ? e.ANDROID_DOWNLOAD_URL : e.IOS_DOWNLOAD_URL, 
        t.doSetClipboardData({
            data: n
        });
    },
    doSetClipboardData: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        wx.getSystemInfoSync().system;
        wx.showModal({
            title: e.title || "提示",
            content: e.content || "下载地址已复制到剪切板，请用浏览器打开进行下载！",
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#00CD91",
            success: function(t) {
                t.confirm && (wx.setClipboardData ? wx.setClipboardData({
                    data: e.data
                }) : wx.showModal({
                    title: "提示",
                    content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
                }));
            }
        });
    }
}, f = {
    getStrLength: function() {
        for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments[1], n = e.length, o = 0, r = "", i = "", s = 0; s < n; s++) e.charCodeAt(s) < 27 || e.charCodeAt(s) > 126 ? o += 2 : o++, 
        o < t && (r = e.substring(0, s + 1), i = e.substring(s + 1, n));
        return {
            refStr: r,
            relStr: i,
            reLen: o
        };
    },
    getScaleNumber: function(e) {
        var t = wx.getSystemInfoSync().screenWidth;
        wx.getSystemInfoSync().screenHeight;
        return e * t / 375;
    }
}, p = {
    getQueryString: function(e, t) {
        var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)");
        return null != (e = e.split("?")[1].match(n)) ? unescape(e[2]) : null;
    }
}, v = {
    requestPayment: function(e) {
        var t = getApp();
        return new Promise(function(n) {
            var o = e.timeStamp, i = e.nonceStr, s = e.signType, a = e.paySign, c = e.depositNo, g = e.authedUserId;
            o ? wx.requestPayment({
                timeStamp: o,
                nonceStr: i,
                signType: s,
                paySign: a,
                package: e.package,
                success: function(e) {
                    wx.showLoading({
                        title: "加载中"
                    });
                    var o = 0;
                    new t.AjaxPoll().init({
                        url: "service.json",
                        requestData: u.MD5({
                            service: "ACTIVE_ENTER_RETURN",
                            depositNo: c,
                            authedUserId: g
                        }),
                        callback: function(e) {
                            if (e.data) {
                                var t = e.data.response;
                                wx.hideLoading(), this.stop(), t.success ? n() : "FINISH_CHECK_FAILED_BUT_HAS_DEAL" === t.error.name && l.showToast(r.getError(t));
                            }
                            ++o > 10 && (wx.hideLoading(), this.stop(), l.showToast("调单恢复失败，请联系服务人员！"), setTimeout(function() {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }, 1200));
                        }
                    });
                },
                fail: function(e) {
                    "requestPayment:fail cancel" == e.errMsg ? l.showToast("您已取消支付！") : l.showToast(e.errMsg);
                }
            }) : n();
        });
    }
};

module.exports = {
    date: t.date,
    AJAX: o.AJAX,
    request: o.request,
    requestEmpty: o.requestEmpty,
    getUserInfo: i.initUserLogin,
    initPageLogin: s.initPageLogin,
    showErrorResult: r.getError,
    MD5: u.MD5,
    math: c,
    unicodeNickname: g.getUnicodeNickname,
    uniqueArray: d.uniqueArray,
    showToast: l.showToast,
    downloadApp: h,
    shareImg: f,
    string: p,
    requestPayment: v
};