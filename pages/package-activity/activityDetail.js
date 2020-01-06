var t = require("../../template/template.js"), e = require("../../utils/util.js"), i = getApp();

Page(Object.assign({
    data: {
        id: "",
        joinerList: [],
        activityInfo: {},
        footerData: {
            showAppButton: !1
        },
        pageType: "activity",
        isLink: !0,
        isIos: -1 === wx.getSystemInfoSync().system.indexOf("Android")
    },
    onHide: function() {
        this.setData({
            isLink: !0
        });
    },
    navigate: function(t) {
        var i = this, n = i.data.isLink;
        t.detail.e && (t = t.detail.e);
        var a = t.currentTarget.dataset.url, o = void 0 === a ? "" : a;
        n && (o.indexOf("package-activity/activityEnterList") > -1 ? (e.requestEmpty(t), 
        i.setData({
            isLink: !1
        }), o && wx.navigateTo({
            url: o
        })) : e.initPageLogin().then(function(n) {
            e.requestEmpty(t, n), i.setData({
                authedUserId: n,
                isLink: !1
            }), o && wx.navigateTo({
                url: o
            });
        }));
    },
    onShareAppMessage: function(t) {
        return this.selectComponent("#createQrCode").onShareAppMessage(t);
    },
    doDownloadApp: function() {
        e.downloadApp.getDownloadAppUrl();
    },
    openMap: function(t) {
        e.requestEmpty(t, "");
        var i = this.data.activityInfo, n = i.longitude, a = i.latitude;
        this.selectComponent("#authorize").getAuthorizeLocation(function(t) {
            wx.openLocation({
                longitude: parseFloat(n),
                latitude: parseFloat(a)
            });
        });
    },
    getPhotosAlbum: function(t) {
        var e = this;
        e.selectComponent("#authorize").getPhotosAlbum(function(t) {
            e.selectComponent("#createQrCode").hideCanvasContainer();
        }, t.detail.e);
    },
    bindCreateQrcode: function() {
        this.selectComponent("#createQrCode").createQrCode();
    },
    bindAddWeixin: function() {
        var t = this, i = this;
        e.initPageLogin().then(function(n) {
            i.setData({
                authedUserId: n
            }, function() {
                e.downloadApp.doSetClipboardData({
                    content: "微信号已复制到剪切板",
                    data: t.data.activityInfo.creatorWeixinNo
                });
            });
        });
    },
    bindCallPhone: function() {
        var t = this, i = this;
        e.initPageLogin().then(function(e) {
            i.setData({
                authedUserId: e
            }, function() {
                wx.makePhoneCall({
                    phoneNumber: t.data.activityInfo.contactCall + ""
                });
            });
        });
    },
    onPullDownRefresh: function() {
        this.onShow(), wx.stopPullDownRefresh();
    },
    onShow: function() {
        var t = this;
        t.initPageLogin(), t.selectComponent("#appFooter").initScene(), t.selectComponent("#detailFooter").initScene();
    },
    initPageLogin: function(t) {
        var e = this;
        e.setData({
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || ""
        }), e.initPageQuery();
    },
    initPageQuery: function() {
        var t = this, i = t.data, n = i.id, a = i.authedUserId;
        wx.showLoading({
            title: "加载中"
        }), e.request("service.json", e.MD5({
            service: "ACTIVE_DATAIL_VIEW",
            activityId: n,
            authedUserId: a
        })).then(function(e) {
            t.getActivityData(e, "activity");
        });
    },
    onLoad: function(t) {
        var n = this;
        if (n.setData({
            id: t.id,
            isIpx: i.globalData.isIpx
        }), t.q) {
            var a = t.q;
            -1 !== (a = decodeURIComponent(a)).indexOf("id=") && n.setData({
                id: e.string.getQueryString(a, "id")
            });
        }
    }
}, t.activityDetailObj));