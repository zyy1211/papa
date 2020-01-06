var e = require("../utils/util.js"), a = require("../config.js"), t = require("../utils/qrcode.js"), r = getApp(), i = {};

Component({
    properties: {
        pageType: {
            type: String,
            value: ""
        },
        pageData: {
            type: Object,
            value: {}
        },
        pageId: {
            type: String,
            value: ""
        }
    },
    data: {
        downloadImagePath: "",
        shareUrl: ""
    },
    methods: {
        initPageImage: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = this, s = t.data, c = s.pageType, g = void 0 === c ? "" : c, l = s.pageId, n = void 0 === l ? "" : l, m = e.imageUrl, o = void 0 === m ? "" : m, h = e.shareImageUrl, d = void 0 === h ? "" : h, u = getCurrentPages(), I = (u[u.length - 1], 
            ""), v = "";
            switch (g) {
              case "activity":
                I = "" + r.globalData.activityDetailUrl + n, v = a.ACTIVITY_QRCODE_URL + "?id=" + n;
                break;

              case "race":
                I = "" + r.globalData.raceDetailUrl + n, v = a.RACE_QRCODE_URL + "?id=" + n;
                break;

              case "specialRace":
                I = "" + r.globalData.specialRaceDetailUrl + n, v = a.SPECIAL_RACE_QRCODE_URL + "?id=" + n;
                break;

              case "hnRaceDetail":
                I = "" + r.globalData.hnRaceDetailUrl + n, v = a.HN_RACE_DETAIL_QRCODE_URL + "?raceId=" + n;
            }
            Object.assign(i, {
                pageUrl: I,
                qrcodeUrl: v,
                imageUrl: o,
                shareImageUrl: d
            }), "specialRace" !== g && "hnRaceDetail" !== g && t.getDescribeContent(), t.downloadFile();
        },
        downloadFile: function() {
            var a = this, t = a.data, r = t.pageType, i = t.pageId, s = "", c = "", g = "";
            switch (r) {
              case "activity":
              case "race":
                g = "ACTIVITY_INDEX";
                break;

              case "specialRace":
                g = "SPECIAL_RACE_INDEX";
                break;

              case "hnRaceDetail":
                g = "HN_RACE_INDEX";
            }
            switch (e.request("service.json", e.MD5({
                service: "GET_DOWNLOAD_FILE_URL",
                objectId: i,
                objectType: g
            })).then(function(t) {
                wx.downloadFile({
                    url: t.downloadUrl,
                    success: function(e) {
                        s = e.tempFilePath;
                    },
                    fail: function() {
                        e.showToast("图片下载失败，请下拉刷新重试！");
                    },
                    complete: function(e) {
                        a.setData({
                            imageSrc: e.tempFilePath || s
                        });
                    }
                });
            }), r) {
              case "activity":
              case "race":
                g = "ACTIVITY_SHARE";
                break;

              case "specialRace":
                g = "SPECIAL_RACE_SHARE";
                break;

              case "hnRaceDetail":
                g = "HN_RACE_SHARE";
            }
            e.request("service.json", e.MD5({
                service: "GET_DOWNLOAD_FILE_URL",
                objectId: i,
                objectType: g
            })).then(function(t) {
                wx.downloadFile({
                    url: t.downloadUrl,
                    success: function(e) {
                        c = e.tempFilePath;
                    },
                    fail: function() {
                        e.showToast("图片下载失败，请下拉刷新重试！");
                    },
                    complete: function(e) {
                        e.tempFilePath;
                        "hnRaceDetail" === r ? a.setData({
                            shareUrl: e.tempFilePath || c
                        }) : a.getShareImage(e.tempFilePath || c);
                    }
                });
            });
        },
        getShareImage: function() {
            var a = this, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", r = this, i = r.data, s = i.pageType, c = void 0 === s ? "" : s, g = i.pageData, l = void 0 === g ? {} : g, n = i.teamModel, m = void 0 !== n && n, o = l.joinerNum, h = void 0 === o ? "" : o, d = l.limitNum, u = void 0 === d ? "" : d, I = (l.enterNumberLimitMaxCount, 
            wx.createCanvasContext("shareImage", this)), v = "报名人数：" + h + "/" + u;
            switch (c) {
              case "activity":
              case "race":
                m && (v = "报名队伍数：" + h + "/" + u);
                break;

              case "specialRace":
                v = "";
            }
            I.drawImage(t, 0, 0, 750, 600), I.setFontSize(e.shareImg.getScaleNumber(40)), I.setFillStyle("#707373"), 
            I.fillText(v, 15, 570), I.draw(), setTimeout(function() {
                wx.canvasToTempFilePath({
                    canvasId: "shareImage",
                    x: 0,
                    y: 0,
                    width: 750,
                    height: 600,
                    destWidth: 750,
                    destHeight: 600,
                    success: function(e) {
                        r.setData({
                            shareUrl: e.tempFilePath
                        });
                    }
                }, a);
            }, 1e3);
        },
        onShareAppMessage: function(e) {
            var a = this, t = e.target, r = (void 0 === t ? {} : t).dataset, s = (void 0 === r ? {} : r).sharetype, c = void 0 === s ? "" : s, g = a.data, l = g.pageType, n = g.pageData, m = g.shareUrl, o = void 0 === m ? "/static/weixin.png" : m;
            if ("hnRaceDetail" === l) {
                var h = {
                    title: n.raceTitle,
                    desc: "欢迎使用PAPA报名，点击打开!",
                    imageUrl: o
                };
                return h.path = i.pageUrl, h;
            }
            var d = n.inviteLetterId, u = {
                title: n.title || n.activityTitle,
                desc: "欢迎使用PAPA报名，点击打开!",
                imageUrl: o
            };
            return u.path = i.pageUrl, "button" === e.from && "invite" === c && (u.path = "/pages/letter/inviteLetter?id=" + d, 
            u.title = "大神,求carry", u.desc = "欢迎使用PAPA报名，点击打开!", u.imageUrl = "/static/invite-letter.png"), 
            u;
        },
        getDescribeContent: function() {
            var a = this.data, t = a.pageType, r = void 0 === t ? "" : t, i = a.pageData, s = void 0 === i ? "" : i, c = wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", g = getCurrentPages(), l = g[g.length - 1], n = s.describeId, m = s.ruleDescribeId;
            "race" === r && (n = m), n ? e.request("service.json", e.MD5({
                service: "ACTIVITY_DESCRIBE_QUERY",
                describeId: n,
                authedUserId: c
            })).then(function(e) {
                var a = e.describe, t = void 0 === a ? {} : a, r = e.textContent, i = void 0 === r ? "" : r, s = e.imageIds, c = void 0 === s ? [] : s, g = e.descrImageUrl, n = void 0 === g ? "" : g, m = t.type || {}, o = [], h = "";
                "TEXT" === m.name ? h = i : c.map(function(e) {
                    o.push({
                        imageUrl: n + e
                    });
                }), l.setData({
                    describeType: m,
                    describeImageList: o,
                    describeText: h
                });
            }) : l.setData({
                describeType: {},
                describeImageList: [],
                describeText: ""
            });
        },
        createQrCode: function() {
            var a = this;
            i.qrcodeUrl ? (wx.showLoading({
                title: "生成中..."
            }), a.setData({
                showCanvasContainer: !0
            }), t.qrApi.draw(i.qrcodeUrl, "logoQRCode", 275, 275, null, "/static/logo.jpg", a), 
            setTimeout(function() {
                a.canvasToTempImage();
            }, 1e3)) : e.showToast("生成地址失败");
        },
        canvasToTempImage: function() {
            var a = this;
            wx.canvasToTempFilePath({
                canvasId: "logoQRCode",
                success: function(e) {
                    a.createCanvasContext({
                        imagePath: e.tempFilePath
                    });
                },
                fail: function(t) {
                    e.showToast("生成二维码图片失败，请重试"), a.hideCanvasContainer();
                }
            }, this);
        },
        createCanvasContext: function(a) {
            var t = this, r = t.data, i = r.pageData, s = void 0 === i ? {} : i, c = r.imageSrc, g = void 0 === c ? "" : c, l = r.pageType;
            if ("hnRaceDetail" === (void 0 === l ? "" : l)) {
                var n = s.raceTitle, m = s.addressDescribe, o = s.raceDate, h = e.shareImg.getStrLength(n, 33), d = h.reLen, u = e.shareImg.getStrLength(m, 42), I = u.reLen, v = {
                    titleObject: h,
                    addressObject: u,
                    timeInterval: o,
                    imagePath: a.imagePath
                };
                d > 33 && I > 42 ? v.height = 30 : d > 33 && I <= 42 ? v.height = 17 : d <= 33 && I > 42 ? v.height = 10 : d <= 33 && I <= 42 && (v.height = 0), 
                v.imgPath = g || "", t.drawCanvasContext(v);
            } else {
                var b = s.title, S = s.activityTitle, p = void 0 === S ? "" : S, f = s.addressDescribe, T = s.timeInterval, N = e.shareImg.getStrLength(b || p, 33), C = N.reLen, D = e.shareImg.getStrLength(f, 42), w = D.reLen, R = {
                    titleObject: N,
                    addressObject: D,
                    timeInterval: T,
                    imagePath: a.imagePath
                };
                C > 33 && w > 42 ? R.height = 30 : C > 33 && w <= 42 ? R.height = 17 : C <= 33 && w > 42 ? R.height = 10 : C <= 33 && w <= 42 && (R.height = 0), 
                R.imgPath = g || "", t.drawCanvasContext(R);
            }
        },
        drawCanvasContext: function() {
            var a = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = this, r = wx.createCanvasContext("myCanvas", this), i = a.imgPath, s = a.height, c = a.titleObject, g = a.addressObject;
            r.setFillStyle("#ffffff"), r.fillRect(0, 0, e.shareImg.getScaleNumber(606), e.shareImg.getScaleNumber(870)), 
            r.drawImage(i, e.shareImg.getScaleNumber(8), e.shareImg.getScaleNumber(8), e.shareImg.getScaleNumber(288), e.shareImg.getScaleNumber(105)), 
            r.setFontSize(e.shareImg.getScaleNumber(16)), r.setFillStyle("#55666d"), 30 === s || 17 === s || 10 === s ? (r.fillText(c.refStr, e.shareImg.getScaleNumber(17), e.shareImg.getScaleNumber(143)), 
            r.fillText(c.relStr, e.shareImg.getScaleNumber(17), e.shareImg.getScaleNumber(170))) : 0 === s && r.fillText(c.refStr, e.shareImg.getScaleNumber(17), e.shareImg.getScaleNumber(143)), 
            r.setFontSize(e.shareImg.getScaleNumber(12)), 30 === s || 17 === s ? (r.drawImage("/static/icon-address.png", e.shareImg.getScaleNumber(17), e.shareImg.getScaleNumber(180), e.shareImg.getScaleNumber(16), e.shareImg.getScaleNumber(16)), 
            r.fillText(g.refStr, e.shareImg.getScaleNumber(40), e.shareImg.getScaleNumber(193)), 
            r.fillText(g.relStr, e.shareImg.getScaleNumber(40), e.shareImg.getScaleNumber(213))) : 10 !== s && 0 !== s || (r.drawImage("/static/icon-address.png", e.shareImg.getScaleNumber(17), e.shareImg.getScaleNumber(160), e.shareImg.getScaleNumber(16), e.shareImg.getScaleNumber(16)), 
            r.fillText(g.refStr, e.shareImg.getScaleNumber(40), e.shareImg.getScaleNumber(173)), 
            r.fillText(g.relStr, e.shareImg.getScaleNumber(40), e.shareImg.getScaleNumber(193))), 
            r.drawImage("/static/icon-time-clock.png", e.shareImg.getScaleNumber(17), e.shareImg.getScaleNumber(190 + s), e.shareImg.getScaleNumber(16), e.shareImg.getScaleNumber(16)), 
            r.fillText(a.timeInterval, e.shareImg.getScaleNumber(40), e.shareImg.getScaleNumber(203 + s)), 
            r.setFillStyle("#efefef"), r.fillRect(e.shareImg.getScaleNumber(12), e.shareImg.getScaleNumber(225 + s), e.shareImg.getScaleNumber(280), e.shareImg.getScaleNumber(2)), 
            r.stroke(), r.setFillStyle("#55666d"), r.drawImage(a.imagePath, e.shareImg.getScaleNumber(102), e.shareImg.getScaleNumber(265), e.shareImg.getScaleNumber(100), e.shareImg.getScaleNumber(100)), 
            r.fillText("长按识别二维码加入", e.shareImg.getScaleNumber(98), e.shareImg.getScaleNumber(380)), 
            r.draw(), setTimeout(function() {
                t.canvasToDownImage();
            }, 1e3);
        },
        canvasToDownImage: function() {
            var a = this;
            wx.canvasToTempFilePath({
                canvasId: "myCanvas",
                success: function(e) {
                    var t = e.tempFilePath;
                    a.setData({
                        downloadImagePath: t
                    }), wx.hideLoading();
                },
                fail: function(t) {
                    e.showToast("生成二维码图片失败，请重试"), a.hideCanvasContainer();
                }
            }, this);
        },
        bindDownloadQrcode: function() {
            var e = {
                e: this.data.downloadImagePath
            };
            this.triggerEvent("getPhotosAlbum", e);
        },
        hideCanvasContainer: function() {
            this.setData({
                showCanvasContainer: !1
            });
        },
        touchStart: function() {},
        touchMove: function() {},
        touchEnd: function() {}
    }
});