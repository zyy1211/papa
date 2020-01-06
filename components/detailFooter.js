var e = require("../utils/util.js"), t = getApp();

Component({
    properties: {
        pageType: {
            type: String,
            value: ""
        },
        pageId: {
            type: String,
            value: ""
        },
        footerData: {
            type: Object,
            value: {}
        }
    },
    data: {
        isIpx: t.globalData.isIpx,
        authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "",
        actionSheetHidden: !0,
        modifyModalHidden: !0,
        showToIndex: !1,
        showHnToIndex: !1
    },
    methods: {
        initScene: function() {
            var e = this, a = e.data, i = a.pageType, n = void 0 === i ? "" : i;
            a.showToIndex;
            if ("activity" === n || "hnRace" === n) {
                var o = t.globalData.scene;
                1007 !== (o = parseInt(o)) && 1008 !== o && 1011 !== o && 1012 !== o && 1013 !== o && 1014 !== o && 1058 !== o && 1036 !== o || ("activity" === n ? e.setData({
                    showToIndex: !0
                }) : "hnRace" === n && e.setData({
                    showHnToIndex: !0
                }));
            }
        },
        redirectToIndex: function(a) {
            e.requestEmpty(a), wx.switchTab({
                url: t.globalData.indexUrl
            });
        },
        actionSheetChange: function(e) {
            this.setData({
                actionSheetHidden: !this.data.actionSheetHidden,
                modifyModalHidden: !0
            });
        },
        showModifyModal: function(e) {
            this.setData({
                modifyModalHidden: !1
            });
        },
        hideModifyModal: function(e) {
            this.setData({
                modifyModalHidden: !0
            });
        },
        createQrcode: function(e) {
            this.triggerEvent("createQrcode"), this.actionSheetChange();
        },
        navigate: function(e) {
            this.hideModifyModal();
            var t = {
                e: e
            };
            this.triggerEvent("navigate", t);
        },
        navigateToEnter: function(t) {
            var a = this, i = this;
            e.initPageLogin().then(function(n) {
                i.setData({
                    authedUserId: n
                }, function() {
                    var n = i.data, o = n.pageType, s = void 0 === o ? "" : o, d = n.pageId, r = void 0 === d ? "" : d, c = getCurrentPages(), g = c[c.length - 1], u = i.data.authedUserId, l = void 0 === u ? "" : u;
                    if (l = l || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "", 
                    a.hideModifyModal(), e.requestEmpty(t, l), "specialRace" !== s) {
                        var h = g.data, v = h.activityInfo, p = void 0 === v ? {} : v;
                        if (h.isLink) {
                            if (g.setData({
                                isLink: !1
                            }), p.clubUrl && !p.userInClub && !p.allowNotBelongMemberJoin) return e.downloadApp.downloadApp({
                                content: "该活动仅允许俱乐部成员参加，下载“PaPa体育”APP可以查看/申请加入该俱乐部！"
                            }), !1;
                            e.request("service.json", e.MD5({
                                service: "ACTIVE_ENTER_SINGLE_RECOVERY",
                                activeId: r,
                                authedUserId: l
                            }), null, !0, !0), wx.navigateTo({
                                url: "activity" === s ? "/pages/package-activity/activityEnter?id=" + r : "/pages/package-race/raceEnter?id=" + r
                            });
                        }
                    } else g.data.isLink && (g.setData({
                        isLink: !1
                    }), wx.navigateTo({
                        url: "/pages/package-specialRace/raceItemList?id=" + r
                    }));
                });
            });
        },
        navigateToEvent: function(t) {
            var a = this, i = a.data, n = i.pageType, o = void 0 === n ? "" : n, s = i.pageId, d = void 0 === s ? "" : s, r = getCurrentPages(), c = r[r.length - 1], g = a.data.authedUserId, u = void 0 === g ? "" : g;
            if (u = u || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
            this.hideModifyModal(), e.requestEmpty(t, u), "specialRace" === o) wx.showModal({
                title: "提示",
                content: "请下载PaPa体育app操作",
                showCancel: !1,
                confirmColor: "#00CD91"
            }); else {
                var l = c.data;
                l.activityInfo;
                l.isLink && (c.setData({
                    isLink: !1
                }), wx.navigateTo({
                    url: "activity" === o ? "/pages/package-activity/activityEvent?id=" + d : "/pages/package-race/raceEvent?id=" + d
                }));
            }
        },
        bindCancelActivity: function(t) {
            var a = this, i = a.data, n = i.pageType, o = void 0 === n ? "" : n, s = i.pageId, d = void 0 === s ? "" : s, r = getCurrentPages(), c = r[r.length - 1], g = a.data.authedUserId, u = void 0 === g ? "" : g;
            if (u = u || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
            this.hideModifyModal(), e.requestEmpty(t, u), "specialRace" !== o) {
                var l = c.data;
                l.activityInfo, l.isLink;
                wx.showModal({
                    title: "提示",
                    content: "您确定要取消该活动吗？",
                    cancelText: "取消",
                    confirmText: "确定",
                    confirmColor: "#00CD91",
                    success: function(t) {
                        t.confirm && e.request("service.json", e.MD5({
                            service: "CANCEL_ACTIVE",
                            activityId: d,
                            authedUserId: u
                        })).then(function(t) {
                            e.showToast("活动取消成功"), wx.navigateBack({
                                delta: 1
                            });
                        });
                    }
                });
            } else wx.showModal({
                title: "提示",
                content: "请下载PaPa体育app操作",
                showCancel: !1,
                confirmColor: "#00CD91"
            });
        },
        showTeamMember: function(e) {
            this.hideModifyModal();
            var t = {
                e: e
            };
            this.triggerEvent("showTeamMember", t);
        }
    }
});