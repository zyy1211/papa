function e(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var a = require("../../utils/util.js"), t = getApp();

Page({
    data: {
        userInfo: {},
        modalHidden: !0,
        changeText: "",
        authedUserId: ""
    },
    onLoad: function(e) {
        this.setData({
            isIpx: t.globalData.isIpx
        }), this.initPageLogin();
    },
    initPageLogin: function(e) {
        var t = this;
        a.initPageLogin(e).then(function(e) {
            wx.showLoading({
                title: "加载中"
            }), t.setData({
                authedUserId: e
            }), t.initPage();
        });
    },
    initPage: function() {
        var e = this, t = {
            service: "USER_INFO_MODIFY_INIT",
            authedUserId: e.data.authedUserId
        };
        a.request("service.json", a.MD5(t)).then(function(a) {
            var t = a.nickName, i = a.addressCityName, s = a.addressProvinceName, n = a.sex, d = void 0 === n ? {} : n, o = a.userLogoUrl, c = a.description, r = void 0 === c ? "" : c;
            e.setData({
                description: r,
                userInfo: {
                    nickName: t,
                    userLogoUrl: o,
                    sex: d
                },
                address: s ? s + " " + i : "请选择"
            });
        });
    },
    showNickNameModal: function() {
        var e = this, a = e.data.userInfo, t = void 0 === a ? {} : a;
        e.setData({
            maxlength: 16,
            modalTitle: "昵称",
            changeNickName: !0,
            changeDescription: !1,
            modalHidden: !1,
            changeText: t.nickName
        });
    },
    showDescriptionModal: function() {
        var e = this, a = e.data.description;
        e.setData({
            maxlength: 30,
            modalTitle: "个人简介",
            changeNickName: !1,
            changeDescription: !0,
            modalHidden: !1,
            changeText: a
        });
    },
    getChangeText: function(e) {
        this.setData({
            changeText: e.detail.value
        });
    },
    hideModal: function() {
        this.setData({
            modalHidden: !0,
            changeText: ""
        });
    },
    submitModal: function(e) {
        var t = this, i = t.data, s = (i.authedUserId, i.changeText), n = void 0 === s ? "" : s, d = i.changeNickName, o = void 0 !== d && d, c = i.changeDescription, r = void 0 !== c && c, u = wx.getSystemInfoSync().system, h = {};
        if (o) {
            if ("" === n) return void a.showToast("请输入昵称");
            h = {
                nickName: n
            }, u.indexOf("Android") > -1 && (h = {
                nickName: e.detail.value.changeText && e.detail.value.changeText.substring(0, 30) || e.detail.value.substring(0, 30)
            });
        }
        r && (h = {
            description: n
        }, u.indexOf("Android") > -1 && (h = {
            description: e.detail.value.changeText && e.detail.value.changeText.substring(0, 30) || e.detail.value.substring(0, 30)
        })), t.submitUserInfo(h);
    },
    submitUserInfo: function(t) {
        var i = this, s = i.data, n = s.authedUserId, d = s.changeNickName, o = void 0 !== d && d, c = s.changeDescription, r = void 0 !== c && c;
        Object.assign(t, {
            service: "USER_INFO_MODIFY",
            authedUserId: n
        }), a.request("service.json", a.MD5(t)).then(function(s) {
            i.setData({
                modalHidden: !0
            }), o && i.setData(e({}, "userInfo.nickName", t.nickName)), r && i.setData({
                description: t.description
            }), a.showToast("修改成功", "success");
        });
    },
    navigateToUploadImage: function() {
        var e = this.data.authedUserId;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var t = a.tempFilePaths;
                wx.navigateTo({
                    url: "/pages/package-template/uploadHeader?authedUserId=" + e + "&imageResouce=" + t[0]
                });
            }
        });
    },
    showCityModal: function() {
        this.selectComponent("#cityModal").initData(), this.setData({
            cityModalVisible: !0
        });
    },
    hideCityModal: function() {
        this.setData({
            cityModalVisible: !1
        });
    },
    doCityModal: function(e) {
        var a = e.detail, t = a.address, i = void 0 === t ? "" : t, s = a.addressId, n = void 0 === s ? "" : s;
        this.setData({
            address: i,
            addressId: n
        });
        var d = {
            addressId: n
        };
        this.submitUserInfo(d);
    }
});