var e = require("../../utils/util.js"), i = require("../../config.js"), t = getApp(), n = {};

Page({
    data: {
        info: {},
        fromLogin: !1,
        needLogin: !1
    },
    onShareAppMessage: function(i) {
        var t = this, o = n.title, a = void 0 === o ? "" : o, r = n.imageUrl, s = void 0 === r ? "/static/weixin.png" : r, d = n.pageOptions, l = void 0 === d ? {} : d, c = n.authedUserId, u = "/pages/info/infoDetail", g = [];
        if (Object.keys(l).map(function(e) {
            g.push(e + "=" + l[e]);
        }), u = u + "?" + g.join("&"), i.webViewUrl) {
            var f = i.webViewUrl;
            if (f.indexOf("luckyDraw") > -1) {
                var h = t.getQueryString(f, "id");
                e.request("service.json", e.MD5({
                    service: "USER_ACQUIRE_EXTRA_DRAW_CHANCE",
                    luckyDrawId: h,
                    authedUserId: c
                })).then(function(e) {
                    e.needReloadWebPage && t.setData({
                        webUrl: f
                    });
                });
            }
        }
        return {
            title: a,
            imageUrl: s,
            path: u,
            desc: "欢迎使用PAPA报名，点击打开!"
        };
    },
    getQueryString: function(e, i) {
        var t = new RegExp("(^|&)" + i + "=([^&]*)(&|$)");
        return null != (e = e.split("?")[1].match(t)) ? unescape(e[2]) : null;
    },
    onLoad: function(i) {
        var o = this;
        if (Object.assign(n, {
            pageOptions: i,
            infoId: i.infoId || "",
            id: i.id || "",
            title: i.title || ""
        }), o.setData({
            webUrl: decodeURIComponent(i.webUrl || ""),
            isIpx: t.globalData.isIpx
        }), i.pageType && "LUCKY_DRAW" === i.pageType && wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#f1a73c"
        }), (i.infoId || i.id) && o.setData({
            needLogin: !0
        }), i.shortTitle ? wx.setNavigationBarTitle({
            title: i.shortTitle || "PaPa报名"
        }) : wx.setNavigationBarTitle({
            title: "PaPa报名"
        }), i.q) {
            var a = i.q;
            -1 !== (a = decodeURIComponent(a)).indexOf("id=") && (n.id = e.string.getQueryString(a, "id"), 
            o.setData({
                needLogin: !0
            }));
        }
    },
    onShow: function() {
        var e = this, i = e.data, t = i.fromLogin, n = i.needLogin;
        (t || n) && e.initPageLogin();
    },
    onHide: function() {
        this.setData({
            fromLogin: !1
        });
    },
    initPageLogin: function(i) {
        var t = this;
        e.initPageLogin(i).then(function(i) {
            n.authedUserId = i, n.id ? e.request("service.json", e.MD5({
                service: "USER_LOGIN_VERIFY",
                authedUserId: i
            })).then(function(e) {
                var i = t.initWebPage();
                t.setData({
                    webUrl: i
                });
            }) : t.initPage();
        });
    },
    initWebPage: function() {
        var o = this, a = n.id, r = n.authedUserId, s = void 0 === r ? "" : r, d = e.MD5({
            authedUserId: s,
            id: a
        }), l = t.globalData.scene;
        1084 !== (l = parseInt(l)) && 1045 !== l && 1046 !== l || (d = e.MD5({
            authedUserId: s,
            id: a,
            scene: "noShare"
        }));
        var c = [];
        return Object.keys(d).map(function(e) {
            c.push(e + "=" + d[e]);
        }), o.downloadFile(), i.BANNER_VIEW_URL + "?" + c.join("&") + "#wechat_redirect";
    },
    downloadFile: function() {
        var i = n.id, t = void 0 === i ? "" : i, o = "";
        e.request("service.json", e.MD5({
            service: "GET_DOWNLOAD_FILE_URL",
            objectId: t,
            objectType: "BANNER_SHARE"
        })).then(function(i) {
            wx.downloadFile({
                url: i.downloadUrl,
                success: function(e) {
                    o = e.tempFilePath;
                },
                fail: function() {
                    e.showToast("图片下载失败，请下拉刷新重试！");
                },
                complete: function(e) {
                    Object.assign(n, {
                        imageUrl: e.tempFilePath || o
                    });
                }
            });
        });
    },
    onPullDownRefresh: function() {
        this.initPageLogin(), wx.stopPullDownRefresh();
    },
    getWebViewMessage: function(e) {
        console.log(e.detail.data);
    },
    initPage: function() {
        var i = this, t = n.authedUserId, o = n.infoId;
        e.request("service.json", e.MD5({
            service: "SYSTEM_MESSAGE_INFO_DETAIL_QUERY",
            infoId: o,
            authedUserId: t
        })).then(function(e) {
            var t = e.info, n = void 0 === t ? {} : t, o = e.longText, a = void 0 === o ? {} : o;
            i.setData({
                info: {
                    title: n.title,
                    content: a.content
                }
            });
        });
    }
});