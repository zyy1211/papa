var i = require("../../utils/util.js"), a = getApp(), t = {
    authedUserId: "",
    isIpx: !1,
    raceId: ""
};

Page({
    data: {
        userName: "",
        userCardNo: "",
        disabledSubmit: !0,
        imgList: [],
        downloadList: [],
        showCanvasContainer: !1
    },
    onLoad: function(i) {
        var e = t.raceId, s = void 0 === e ? "" : e, n = t.isIpx, o = void 0 !== n && n;
        s = i.raceId, o = a.globalData.isIpx, Object.assign(t, {
            raceId: s,
            isIpx: o
        });
    },
    onShow: function() {
        this.initPageLogin();
    },
    onPullDownRefresh: function() {
        this.setData({
            userName: "",
            userCardNo: "",
            disabledSubmit: !0,
            imgList: [],
            downloadList: [],
            showCanvasContainer: !1
        }), this.initPageLogin(), wx.stopPullDownRefresh();
    },
    initPageLogin: function() {
        i.initPageLogin().then(function(i) {
            var a = i;
            a && "" !== a && (t.authedUserId = a);
        });
    },
    bindUserNameInput: function(i) {
        var a = i.detail.value, t = this.data.userCardNo, e = void 0 === t ? "" : t;
        "" === a.trim() || "" === e.trim() ? this.setData({
            userName: a,
            disabledSubmit: !0
        }) : this.setData({
            userName: a,
            disabledSubmit: !1
        });
    },
    bindUserCardNoInput: function(i) {
        var a = i.detail.value, t = this.data.userName, e = void 0 === t ? "" : t;
        "" === a.trim() || "" === e.trim() ? this.setData({
            userCardNo: a,
            disabledSubmit: !0
        }) : this.setData({
            userCardNo: a,
            disabledSubmit: !1
        });
    },
    bindFormSubmit: function() {
        var i = this, a = i.data, t = a.disabledSubmit, e = void 0 === t || t, s = a.userName, n = void 0 === s ? "" : s, o = a.userCardNo, d = void 0 === o ? "" : o;
        if (e) {
            var r = "";
            return "" === n.trim() ? r = "姓名不能为空" : "" === d.trim() && (r = "身份证号不能为空"), void wx.showToast({
                title: r,
                icon: "none"
            });
        }
        i.getData();
    },
    getData: function() {
        var a = this, e = t.raceId, s = t.authedUserId, n = a.data, o = n.userName, d = n.userCardNo, r = n.imgList, u = n.downloadList;
        r = [], u = [];
        var h = {
            authedUserId: s,
            raceId: e,
            IDCard: d,
            name: o,
            service: "HN_RACE_MEMBER_CERTIFICATE_QUERY"
        };
        wx.showLoading({}), i.request("service.json", i.MD5(h)).then(function(i) {
            var t = i.memberCertificateUrlList;
            (r = t).map(function(i, t) {
                wx.downloadFile({
                    url: i,
                    success: function(i) {
                        u.push(i.tempFilePath), t === r.length - 1 && (wx.hideLoading(), a.setData({
                            imgList: r,
                            downloadList: u,
                            showCanvasContainer: !0
                        }));
                    },
                    fail: function() {
                        wx.showToast({
                            title: "证书获取失败，请刷新重试",
                            icon: "none"
                        });
                    }
                });
            });
        });
    },
    bindDownloadQrcode: function() {
        var i = this, a = i.data;
        a.imgList;
        a.downloadList.map(function(a) {
            i.selectComponent("#authorize").getPhotosAlbum(function(a) {
                i.hideCanvasContainer();
            }, a);
        });
    },
    hideCanvasContainer: function() {
        this.setData({
            showCanvasContainer: !1
        });
    }
});