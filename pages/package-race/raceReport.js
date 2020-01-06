var e = require("../../utils/util.js"), t = (require("../../config.js"), getApp());

Page({
    data: {
        hidden: !1,
        imageSrc: "",
        SDKVersion: wx.getSystemInfoSync().SDKVersion
    },
    onPullDownRefresh: function() {
        this.reGetStorage(), wx.stopPullDownRefresh();
    },
    onLoad: function(e) {
        var a = this;
        new t.WeToast(), a.reGetStorage(), a.setData({
            id: e.id,
            isIpx: t.globalData.isIpx,
            canvasWidth: a.getScaleNumber(375),
            canvasHeight: a.getScaleNumber(602)
        }), t.globalData.isIpx && a.setData({
            windowHeight: wx.getSystemInfoSync().windowHeight - 68
        });
    },
    reGetStorage: function(e) {
        var t = this;
        t.timer && clearTimeout(t.timer), t.timer = setTimeout(function() {
            t.getStorage(e);
        }, 100);
    },
    getStorage: function(t) {
        var a = this;
        try {
            var r = wx.getStorageSync("userInfo");
            r ? t ? (e.getUserInfo(a.reGetStorage), a.setData({
                authedUserId: ""
            })) : a.setData({
                authedUserId: r.user.userId
            }) : e.getUserInfo(a.reGetStorage);
        } catch (t) {
            e.getUserInfo(a.reGetStorage);
        }
        a.data.authedUserId && "" !== a.data.authedUserId && (clearTimeout(a.timer), a.initPage());
    },
    initPage: function() {
        var t = this, a = t.data, r = a.id, l = a.authedUserId;
        e.AJAX("service.json", e.MD5({
            service: "RACE_USER_BATTLE_REPORT_QUERY",
            activityId: r,
            authedUserId: l
        }), function(a) {
            if (a.data) {
                var r = a.data.response;
                if (r.success) {
                    var l = r.raceReport, i = void 0 === l ? {} : l, n = r.bestResult, o = void 0 === n ? "" : n, s = r.reportOwnerNames, c = void 0 === s ? [] : s, u = r.strongestEnemyNames, g = void 0 === u ? [] : u, S = i.resultName, m = i.firstScoreRate, f = i.winRate, b = i.winRateOverPersonRate, N = "", d = "", m = (100 * m).toFixed(0) + "%", f = (100 * f).toFixed(0) + "%", b = (100 * b).toFixed(0) + "%";
                    switch (S && S.name) {
                      case "TOP_ONE":
                        N = "冠军", d = "/static/icon-result1.png";
                        break;

                      case "TOP_TWO":
                        N = "亚军", d = "/static/icon-result2.png";
                        break;

                      case "TOP_THREE":
                        N = "季军", d = "/static/icon-result3.png";
                        break;

                      default:
                        N = S && S.message || "";
                    }
                    Object.assign(i, {
                        result: N,
                        resultIcon: d,
                        reportOwnerNames: c,
                        strongestEnemyNames: g,
                        firstScoreRate: m,
                        winRate: f,
                        winRateOverPersonRate: b,
                        bestResult: o
                    }), t.drawCanvasContext(i);
                } else "USER_NOT_LOGIN" === r.error.name ? (t.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), t.reGetStorage(!0)) : t.wetoast.toast({
                    title: e.showErrorResult(r),
                    duration: 1e3
                });
            } else t.wetoast.toast({
                title: a.errMsg,
                duration: 1e3
            });
        });
    },
    drawCanvasContext: function(e) {
        var t = this, a = this, r = wx.createCanvasContext("myCanvas"), l = e.result, i = e.resultIcon, n = e.reportOwnerNames, o = e.strongestEnemyNames, s = e.firstScoreRate, c = e.winRate, u = e.winRateOverPersonRate, g = e.totalCount, S = e.totalScore, m = e.maxHotStreak, s = e.firstScoreRate, f = e.bestResult, b = n.join(" & "), N = o.join(" & "), d = 0 === o.length, T = d ? -44 : 0, h = 0;
        r.drawImage("/static/report-bg.png", 0, 0, a.getScaleNumber(375), a.getScaleNumber(602)), 
        r.setFillStyle("#333333"), r.font = "normal bold 27px Arial", r.setFontSize(27);
        var x = r.measureText && r.measureText(b).width;
        x > 410 && (b = (n.length > 1 ? [ a.getStrLength(n[0], 14).refStr, a.getStrLength(n[1], 13).refStr ] : [ a.getStrLength(n[0], 27).refStr ]).join(" & "), 
        x = r.measureText && r.measureText(b).width), r.setTextAlign("center"), r.fillText(b, a.getScaleNumber(187.5), a.getScaleNumber(223)), 
        r.setTextAlign("left"), "" !== l ? (a.roundRect(a.getScaleNumber(53), a.getScaleNumber(246), a.getScaleNumber(268), a.getScaleNumber(50), 6, r), 
        r.font = "normal bold 27px Arial", r.setFontSize(16), r.setFillStyle("#ffffff"), 
        r.fillText("本场成绩", a.getScaleNumber(90), a.getScaleNumber(278))) : h = -60, i ? (r.drawImage(i, a.getScaleNumber(190), a.getScaleNumber(255), a.getScaleNumber(22), a.getScaleNumber(30)), 
        r.setFillStyle("#fde778"), r.setFontSize(22), r.fillText(l, a.getScaleNumber(230), a.getScaleNumber(278))) : (r.setFillStyle("#333333"), 
        r.setFontSize(22), r.fillText(l, a.getScaleNumber(175), a.getScaleNumber(278))), 
        r.setFillStyle("#333333"), r.setFontSize(22), r.fillText(g, a.getScaleNumber(100), a.getScaleNumber(335 + h)), 
        r.fillText(S, a.getScaleNumber(295), a.getScaleNumber(335 + h)), r.fillText(c, a.getScaleNumber(85), a.getScaleNumber(380) + h), 
        r.setFontSize(16), r.fillText(u, a.getScaleNumber(260), a.getScaleNumber(380 + h)), 
        r.setFontSize(22), r.fillText(m, a.getScaleNumber(150), a.getScaleNumber(430 + h)), 
        r.setFontSize(20), (x = r.measureText && r.measureText(N).width) > 166 && (N = (o.length > 1 ? [ a.getStrLength(o[0], 11).refStr, a.getStrLength(o[1], 10).refStr ] : [ a.getStrLength(o[0], 21).refStr ]).join(" & ")), 
        r.fillText(N, a.getScaleNumber(150), a.getScaleNumber(470 + h)), r.setFontSize(22), 
        r.fillText(s, a.getScaleNumber(150), a.getScaleNumber(514 + h + T)), r.fillText(f, a.getScaleNumber(150), a.getScaleNumber(558 + h + T)), 
        r.font = "normal normal 14px Microsoft Yahei", r.setFontSize(14), a.line(a.getScaleNumber(190), a.getScaleNumber(320 + h), a.getScaleNumber(190), a.getScaleNumber(338 + h), r), 
        r.setFillStyle("#999999"), r.fillText("共打了", a.getScaleNumber(45), a.getScaleNumber(333 + h)), 
        r.fillText("场", a.getScaleNumber(128), a.getScaleNumber(333 + h)), r.fillText("累计得分", a.getScaleNumber(231), a.getScaleNumber(333 + h)), 
        r.fillText("胜率", a.getScaleNumber(45), a.getScaleNumber(378 + h)), r.fillText("最高连续得分", a.getScaleNumber(45), a.getScaleNumber(426 + h)), 
        d || r.fillText("本场劲敌", a.getScaleNumber(45), a.getScaleNumber(470 + h)), r.fillText("首球得分率", a.getScaleNumber(45), a.getScaleNumber(514 + h + T)), 
        r.fillText("本场最佳战绩", a.getScaleNumber(45), a.getScaleNumber(558 + h + T)), r.setFontSize(12), 
        r.fillText("超过", a.getScaleNumber(230), a.getScaleNumber(379 + h)), r.fillText("的球友", a.getScaleNumber(296), a.getScaleNumber(379 + h)), 
        r.draw(), setTimeout(function() {
            t.canvasToDownImage();
        }, 1e3);
    },
    line: function(e, t, a, r, l) {
        l.beginPath(), l.setStrokeStyle("#d6dfd9"), l.moveTo(e, t), l.lineTo(a, r), l.stroke(), 
        l.restore();
    },
    roundRect: function(e, t, a, r, l, i) {
        a < 2 * l && (l = a / 2), r < 2 * l && (l = r / 2), i.beginPath(), i.setFillStyle("#a9dbe9"), 
        i.moveTo(e, t), i.arcTo ? (i.arcTo(e + a, t, e + a, t + r, l), i.lineTo(e + a, t), 
        i.arcTo(e + a, t + r, e, t + r, l), i.lineTo(e + a, t + r), i.arcTo(e, t + r, e, t, l), 
        i.lineTo(e, t + r), i.arcTo(e, t, e + a, t, l)) : (i.lineTo(e + a, t), i.lineTo(e + a, t + r), 
        i.lineTo(e, t + r), i.lineTo(e, t)), i.fill(), i.closePath(), i.restore();
    },
    getStrLength: function(e, t) {
        for (var a = e.length, r = 0, l = "", i = "", n = 0; n < a; n++) e.charCodeAt(n) < 27 || e.charCodeAt(n) > 126 ? r += 2 : r++, 
        r < t && (l = e.substring(0, n + 1), i = e.substring(n + 1, a));
        return {
            refStr: l,
            relStr: i,
            reLen: r
        };
    },
    getScaleNumber: function(e) {
        return e;
    },
    canvasToDownImage: function() {
        var e = this;
        wx.canvasToTempFilePath({
            canvasId: "myCanvas",
            success: function(t) {
                var a = t.tempFilePath;
                e.setData({
                    imageSrc: a,
                    downloadImagePath: a,
                    hidden: !0
                });
            },
            fail: function(e) {
                wx.showModal({
                    title: "提示",
                    content: "图片生成失败，下拉刷新重试！",
                    showCancel: !1
                });
            }
        });
    },
    saveImage: function() {
        var e = this, t = e.data, a = (t.imageSrc, t.SDKVersion);
        if (a = a.replace(/\./g, ""), parseInt(a) < 120) return wx.showModal({
            title: "提示",
            content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
            showCancel: !1
        }), !1;
        wx.showModal({
            title: "提示",
            content: "点击确定保存图片到本地，请到相册查看",
            confirmText: "确定",
            success: function(t) {
                t.confirm && e.getPhotosAlbum(function() {
                    wx.showToast({
                        title: "保存成功",
                        icon: "success",
                        duration: 2e3
                    });
                });
            }
        });
    }
});