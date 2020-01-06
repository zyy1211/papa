Object.defineProperty(exports, "__esModule", {
    value: !0
});

var e = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var i in a) Object.prototype.hasOwnProperty.call(a, i) && (e[i] = a[i]);
    }
    return e;
}, t = require("../utils/util.js"), a = (require("../utils/qqmap-wx-jssdk.js"), 
require("../config.js")), i = require("../utils/qrcode.js");

exports.activityDetailObj = {
    getActivityData: function(a, i) {
        var o = getApp(), n = this, r = n.data, s = r.id, c = r.footerData, d = void 0 === c ? {} : c, u = a.activityCreatorInfo, l = void 0 === u ? {} : u, g = a.userTypeAndFeeMap, v = void 0 === g ? {} : g, m = a.activityImageUrl, h = void 0 === m ? "" : m, w = a.activityInfo, f = void 0 === w ? {} : w, p = a.activityRaceInfo, C = void 0 === p ? {} : p, I = a.cifImageUrl, b = void 0 === I ? "" : I, S = a.inviteLetterId, y = void 0 === S ? "" : S, x = a.teamIsFull, N = void 0 !== x && x, T = a.teamModel, D = void 0 !== T && T, L = a.canCreateBill, U = void 0 !== L && L, j = a.canViewBill, E = void 0 !== j && j, M = a.canJoin, P = void 0 === M || M, R = a.hasJoinActivity, A = void 0 !== R && R, F = a.canModify, q = void 0 !== F && F, O = a.canCancle, Q = void 0 !== O && O, _ = a.paied, B = void 0 !== _ && _, J = a.creator, H = void 0 !== J && J, k = a.creatorName, V = void 0 === k ? "" : k, W = a.creatorSex, z = void 0 === W ? "M" : W, G = a.joinerNum, X = void 0 === G ? "" : G, Y = a.timesToRegisterEnd, K = void 0 === Y ? "" : Y, Z = a.joinerUserIds, $ = void 0 === Z ? [] : Z, ee = a.queueNum, te = void 0 === ee ? 0 : ee, ae = a.clubName, ie = void 0 === ae ? "" : ae, oe = a.clubLogoUrl, ne = void 0 === oe ? "" : oe, re = a.userInClub, se = void 0 !== re && re, ce = (a.allowNotBelongMemberJoin, 
        a.raceDetailMemo), de = void 0 === ce ? "" : ce, ue = a.description, le = void 0 === ue ? "" : ue, ge = a.followed, ve = void 0 !== ge && ge, me = (a.activityEnterStatus, 
        a.buttonContent, a.hasQueueActivity), he = void 0 !== me && me, we = a.allowQueue, fe = void 0 !== we && we, pe = f = e({}, f, C, l), Ce = pe.address, Ie = void 0 === Ce ? "" : Ce, be = pe.activityLabel, Se = void 0 === be ? "" : be, ye = pe.groupType, xe = pe.sexLimit, Ne = pe.limitNum, Te = pe.gmtModifyRegisterEnd, De = pe.activityStatus, Le = pe.gmtStart, Ue = pe.gmtEnd, je = void 0 === Ue ? "" : Ue, Ee = pe.chargeFeeType, Me = void 0 === Ee ? {} : Ee, Pe = pe.userId, Re = pe.belongType, Ae = void 0 === Re ? {} : Re, Fe = pe.belongId, qe = void 0 === Fe ? "" : Fe, Oe = t.date.getTimeInterval(Le, je), Qe = [], _e = Se.split(","), Be = v && v.M || 0, Je = v && v.W || 0, He = Me.message, ke = ye && ye.message, Ve = xe && xe.name, We = (t.unicodeNickname(V), 
        Ie.split("@")[0]), ze = Ie.split("@")[1], Ge = "", Xe = {};
        Te = Te.substring(0, 16).replace(new RegExp("-", "gm"), "/"), Ne = 0 === Ne ? "不限制" : Ne, 
        "CLUB" === Ae.name && (Ge = ne + qe), Object.assign(f, {
            activityLabels: _e,
            description: le,
            manFee: Be,
            womanFee: Je,
            groupTypeMsg: ke,
            chargeFeeMsg: He,
            sexLimitName: Ve,
            limitNum: Ne,
            creatorSex: z,
            creatorName: V,
            gmtModifyRegisterEnd: Te,
            activityStatus: De,
            timeInterval: Oe,
            creatorLogoUrl: b + Pe,
            joinerNum: X,
            timesToRegisterEnd: K,
            queueNum: te,
            longitude: We,
            latitude: ze,
            clubName: ie,
            clubUrl: Ge,
            userInClub: se,
            homePageUrl: "" + o.globalData.userHomePageUrl + Pe,
            inviteLetterId: y
        }), $.map(function(e) {
            Qe.push({
                imageUrl: b + e
            });
        });
        var Ye = !1, Ke = Ke || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId;
        ve || Pe === Ke || (Ye = !0), Object.assign(Xe, {
            homePageUrl: "" + o.globalData.userHomePageUrl + Pe,
            userLogoUrl: b + Pe,
            createUserName: V,
            createUserId: Pe,
            userSex: z,
            time: "",
            contactName: f.contactName,
            showAttentionButton: Ye,
            follwed: !1,
            beFollowed: !1
        }), n.setData({
            imageSrc: h + s,
            activityInfo: f,
            joinerList: Qe,
            inviteLetterId: y,
            showCreateQrcode: !0,
            enterListUrl: H ? "../package-activity/activityEnterList?id=" + s + "&form=isOrganizer" : "../package-activity/activityEnterList?id=" + s,
            raceDetailMemo: de,
            footerData: Object.assign(d, {
                canCreateBill: U,
                canViewBill: E,
                canJoin: P,
                hasJoinActivity: A,
                canModify: q,
                canCancle: Q,
                paied: B,
                creator: H,
                teamModel: D,
                teamIsFull: N,
                hasQueueActivity: he,
                limitNum: Ne,
                joinerNum: X,
                queueNum: te,
                allowQueue: fe,
                timesToRegisterEnd: K
            }),
            userHeaderInfo: Xe
        }), this.selectComponent("#createQrCode").initPageImage({
            imageUrl: h + s,
            shareImageUrl: h + s + "&areaName=SHARE_COVER"
        }), this.selectComponent("#userHeader").refreshData();
    },
    openClub: function() {
        var e = this;
        t.initPageLogin().then(function(a) {
            e.setData({
                authedUserId: a
            }, function() {
                t.downloadApp.openClub();
            });
        });
    },
    bindExcelList: function() {
        var e = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, a = this.data.id;
        t.AJAX("service.json", t.MD5({
            service: "GET_JOINER_FILE_URL",
            activeId: a,
            authedUserId: e
        }), function(e) {
            if (e.data) {
                var a = e.data.response;
                a.success ? wx.showModal({
                    title: "点击确定复制地址到浏览器里打开下载表格",
                    content: a.applicationListDowloadUrl,
                    showCancel: !1,
                    confirmText: "确定",
                    confirmColor: "#00CD91",
                    success: function(e) {
                        e.confirm && (wx.setClipboardData ? wx.setClipboardData({
                            data: a.applicationListDowloadUrl
                        }) : wx.showModal({
                            title: "提示",
                            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
                        }));
                    }
                }) : t.showToast(t.showErrorResult(a));
            } else t.showToast(e.errMsg);
        });
    }
}, exports.signUpObj = {
    touchStart: function() {},
    touchMove: function() {},
    touchEnd: function() {},
    hideSignCanvasContainer: function() {
        this.setData({
            showSignCanvasContainer: !1
        });
    },
    bindCreateSignQrcode: function() {
        var e = this, t = e.data.activityId;
        e.setData({
            showSignCanvasContainer: !0
        }), wx.showLoading({
            title: "生成中..."
        });
        var o = a.ACTIVITY_RACE_SIGN_QRCODE_URL;
        i.qrApi.draw(o + "?id=" + t, "signQRCode", 275, 275, null, "/static/logo.jpg"), 
        setTimeout(function() {
            e.signCanvasToTempImage();
        }, 1e3);
    },
    signCanvasToTempImage: function() {
        var e = this;
        wx.canvasToTempFilePath({
            canvasId: "signQRCode",
            success: function(t) {
                t.tempFilePath;
                e.drawSignCanvasContext({
                    imagePath: t.tempFilePath
                });
            },
            fail: function(t) {
                e.wetoast.toast({
                    title: "生成二维码图片失败，请重试",
                    duration: 1e3
                }), e.setData({
                    showSignCanvasContainer: !1
                }), wx.hideLoading && wx.hideLoading();
            }
        });
    },
    drawSignCanvasContext: function(e) {
        var t = this, a = this, i = (a.data.qrcodeBgSrc, wx.createCanvasContext("mySignCanvas"));
        i.drawImage("/static/qrcode-bg.png", 0, 0, a.getScaleNumber(353), a.getScaleNumber(378)), 
        i.drawImage(e.imagePath, a.getScaleNumber(45), a.getScaleNumber(70), a.getScaleNumber(264), a.getScaleNumber(264)), 
        i.draw(), setTimeout(function() {
            t.canvasToDownImage();
        }, 1e3);
    },
    canvasToDownImage: function() {
        var e = this;
        wx.canvasToTempFilePath({
            canvasId: "mySignCanvas",
            success: function(t) {
                var a = t.tempFilePath;
                e.setData({
                    downloadSignImagePath: a
                }), wx.hideLoading();
            },
            fail: function(a) {
                wx.hideLoading(), t.showToast("生成二维码图片失败，请重试"), e.setData({
                    showCanvasContainer: !1
                });
            }
        });
    },
    getScaleNumber: function(e) {
        var t = this.data, a = t.windowWRPX;
        return e * t.screenWidth / a;
    },
    bindDownloadSignQrcode: function() {
        var e = this;
        e.selectComponent("#authorize").getPhotosAlbum(function(t) {
            e.setData({
                showSignCanvasContainer: !1
            });
        }, e.data.downloadSignImagePath);
    }
};