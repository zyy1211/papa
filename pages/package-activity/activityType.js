var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        authedUserId: "",
        activeSort: null,
        hotList: {
            title: "热门",
            subList: []
        },
        sortList: []
    },
    selectSort: function(t) {
        var e = this.data.sortList, a = t.currentTarget.dataset.id, r = t.currentTarget.dataset.name;
        this.setData({
            activeSort: a
        });
        var s = "";
        e.forEach(function(t, e) {
            t.subList.forEach(function(e, r) {
                e.id === a && (s = t.title);
            });
        });
        var i = {
            id: a,
            val: s + "-" + r
        }, o = getCurrentPages(), n = o[o.length - 2];
        n && n.setData({
            type: i
        }), wx.navigateBack({
            delta: 1
        });
    },
    reGetStorage: function(t) {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), e.timer && clearTimeout(e.timer), e.timer = setTimeout(function() {
            e.getStorage(t);
        }, 1e3);
    },
    getStorage: function(e) {
        var a = this;
        try {
            var r = wx.getStorageSync("userInfo");
            r ? e ? (t.getUserInfo(a.reGetStorage), a.setData({
                authedUserId: ""
            })) : a.setData({
                authedUserId: r.user.userId
            }) : t.getUserInfo(a.reGetStorage);
        } catch (e) {
            t.getUserInfo(a.reGetStorage);
        }
        a.data.authedUserId && "" !== a.data.authedUserId && (clearTimeout(a.timer), a.initPage());
    },
    initPage: function() {
        var e = this, a = (e.data.authedUserId, {
            service: "ACTIVITY_TYPE_LIST_QUERY"
        });
        t.AJAX("service.json", t.MD5(a), function(a) {
            if (a.data) {
                var r = a.data.response;
                r.success ? e.initSortsData(r) : "USER_NOT_LOGIN" === r.error.name ? (e.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), e.reGetStorage(!0)) : e.wetoast.toast({
                    title: t.showErrorResult(r),
                    duration: 1e3
                });
            } else e.wetoast.toast({
                title: a.errMsg,
                duration: 1e3
            });
            wx.hideLoading();
        });
    },
    initSortsData: function(t) {
        var e = this, a = e.data, r = a.hotList, s = a.sortList, i = t.hotImageUrl, o = t.hotTypeIds, n = t.typeIdAndName, d = t.topIdAndSecondTypeIds, u = t.topTypeIds;
        o.forEach(function(t, e) {
            r.subList.push({
                id: t,
                name: n[t],
                img: i + t
            });
        }), u.map(function(t, e) {
            var a = [];
            d[t] && (d[t].map(function(t, e) {
                a.push({
                    id: t,
                    name: n[t]
                });
            }), s.push({
                title: n[t],
                subList: a
            }));
        }), e.setData({
            hotList: r,
            sortList: s
        });
    },
    onLoad: function(t) {
        new e.WeToast(), this.setData({
            activeSort: t.id || "",
            isIpx: e.globalData.isIpx || !1
        }), this.reGetStorage();
    }
});