var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        currentTab: 1,
        helpModalHidden: !0
    },
    swichNav: function(e) {
        t.requestEmpty(e);
        var a = this, i = a.data.currentTab, r = e.target.dataset.current;
        if (i === r) return !1;
        a.setData({
            currentTab: parseInt(r)
        });
    },
    reGetStorage: function(t) {
        var e = this;
        e.setData({
            dataList: [],
            isDataEmpty: !0,
            currentPage: 1,
            pages: 1
        }), e.timer && clearTimeout(e.timer), e.timer = setTimeout(function() {
            e.getStorage(t);
        }, 100);
    },
    getStorage: function(e) {
        var a = this;
        try {
            var i = wx.getStorageSync("userInfo");
            i ? e ? (t.getUserInfo(a.reGetStorage), a.setData({
                authedUserId: ""
            })) : a.setData({
                authedUserId: i.user.userId
            }) : t.getUserInfo(a.reGetStorage);
        } catch (e) {
            t.getUserInfo(a.reGetStorage);
        }
        a.data.authedUserId && "" !== a.data.authedUserId && (clearTimeout(a.timer), a.initPageData(), 
        a.initPageData("joiner"));
    },
    initPageData: function(e) {
        var a = this, i = {
            service: "USER_ACTIVITY_STATISTICS_CREATOR_DATA_QUERY",
            authedUserId: a.data.authedUserId
        };
        "joiner" === e && (i.service = "USER_ACTIVITY_STATISTICS_JOINER_DATA_QUERY"), wx.showLoading({
            title: "加载中"
        }), t.AJAX("service.json", t.MD5(i), function(i) {
            if (i.data) {
                var r = i.data.response;
                if (r.success) if ("joiner" === e) {
                    var s = r.gmtFirstJoinActivity, n = void 0 === s ? "" : s, o = r.maxJoinTogetherUserId, d = void 0 === o ? "" : o, u = r.maxJoinActivityOwnerId, c = void 0 === u ? "" : u, g = r.userIdAndNickName, l = r.totalJoinActivityMinutes, v = void 0 === l ? 0 : l;
                    r.gmtFirstJoinActivity = n.substring(0, 4) + "年" + n.substring(5, 7) + "月" + n.substring(8, 10) + "日", 
                    r.maxJoinTogether = t.unicodeNickname(g[d]), r.maxJoinActivity = t.unicodeNickname(g[c]), 
                    r.totalJoinActivityMinutes = (v / 60).toFixed(0), a.initJoinData(r);
                } else {
                    var I = r.gmtFirstCreateActivity, T = void 0 === I ? "" : I, h = r.totalCreateActivityMinutes, A = void 0 === h ? 0 : h;
                    r.gmtFirstCreateActivity = T.substring(0, 4) + "年" + T.substring(5, 7) + "月" + T.substring(8, 10) + "日", 
                    r.totalCreateActivityMinutes = (A / 60).toFixed(0), a.initCreateData(r);
                } else "USER_NOT_LOGIN" === r.error.name ? (a.wetoast.toast({
                    title: "您已在其他地方登陆，正在重新登陆...",
                    duration: 1e3
                }), a.reGetStorage(!0)) : "USER_STATISTICS_DATA_IS_EMPTY" === r.error.name ? "joiner" === e ? a.initJoinData(r) : a.initCreateData(r) : a.wetoast.toast({
                    title: t.showErrorResult(r),
                    duration: 1e3
                });
            } else a.wetoast.toast({
                title: i.errMsg,
                duration: 1e3
            });
            wx.hideLoading();
        });
    },
    initCreateData: function(t) {
        this.setData({
            createData: t
        });
    },
    initJoinData: function(t) {
        this.setData({
            joinData: t
        });
    },
    showHelpModal: function(e) {
        t.requestEmpty(e);
        var a = "只统计线上支付金额（自行收取不做统计）";
        "create" === e.currentTarget.dataset.type && (a = "由于系统更新，只展示三月份之后到账的数据（单笔小于1元的不计入总账）"), 
        this.setData({
            helpModalcontent: a,
            helpModalHidden: !1
        });
    },
    closeHelpModal: function() {
        this.setData({
            helpModalHidden: !0
        });
    },
    onLoad: function(t) {
        var a = this;
        new e.WeToast(), a.setData({
            isIpx: e.globalData.isIpx
        }), a.reGetStorage();
    }
});