var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {},
    onLoad: function(t) {
        var a = this;
        new e.WeToast(), a.setData({
            id: t.id,
            isIpx: e.globalData.isIpx
        }), a.reGetStorage();
    },
    reGetStorage: function(t) {
        var e = this;
        e.setData({
            hidden: !1,
            showCanvasContainer: !1,
            showCreateQrcode: !1
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
                authedUserId: r.user.userId,
                loginKey: r.loginKey
            }) : t.getUserInfo(a.reGetStorage);
        } catch (e) {
            t.getUserInfo(a.reGetStorage);
        }
        a.data.authedUserId && "" !== a.data.authedUserId && (clearTimeout(a.timer), a.initPage());
    },
    initPage: function() {
        this.getGroupResult();
    },
    getGroupResult: function() {
        var e = this, a = e.data, r = a.id, s = a.authedUserId, i = a.againstSideTab, o = void 0 === i ? 0 : i;
        t.AJAX("service.json", t.MD5({
            service: "RACE_GROUP_RESULT_LIST_QUERY",
            groupId: r,
            authedUserId: s
        }), function(a) {
            if (a.data) {
                var r = a.data.response;
                if (r.success) {
                    var s = r.groupList, i = r.objectIdAndEachNameList, n = r.resultIdAndResultDetail, u = [];
                    r.resultList.map(function(t, e) {
                        var a = t.id, r = t.resultObjectId, s = t.enterNextStage, o = n[a], d = o.victoryCount, g = o.totalCount, c = o.netVictoryScore, l = e + 1, h = l % 2 == 0 ? "odd-row" : "", S = [], I = i[r];
                        I.map(function(t, e) {
                            S.push({
                                nickName: t,
                                lineHeight: 90 / I.length
                            });
                        }), u.push({
                            enterNextStage: s,
                            victoryCount: d,
                            totalCount: g,
                            netVictoryScore: c,
                            index: l,
                            className: h,
                            nameList: S
                        });
                    }), e.setData({
                        groupResultList: u,
                        groupList: s,
                        againstSideTab: o,
                        groupResultListNone: 0 === u.length
                    });
                } else "USER_NOT_LOGIN" === r.error.name ? (e.wetoast.toast({
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
            e.setData({
                hidden: !0
            });
        });
    },
    switchMatchGroup: function(t) {
        var e = this, a = t.currentTarget.dataset, r = a.id, s = a.index;
        e.setData({
            id: r,
            againstSideTab: s
        }), e.setData({
            hidden: !1
        }), e.getGroupResult();
    },
    onPullDownRefresh: function() {}
});