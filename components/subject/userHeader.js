var e = require("../../utils/util.js");

Component({
    properties: {
        userInfo: {
            type: Object,
            value: {
                follwed: !1,
                beFollowed: !1
            }
        }
    },
    data: {
        authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "",
        attentionBtnText: "关注",
        modalHidden: !0
    },
    attached: function() {
        this.refreshData();
    },
    methods: {
        refreshData: function() {
            var e = this, t = e.data, a = t.userInfo, n = void 0 === a ? {} : a, i = t.attentionBtnText, d = void 0 === i ? "关注" : i;
            if (n) {
                var s = n.follwed, o = void 0 !== s && s, r = n.beFollowed, u = void 0 !== r && r;
                d = o ? u ? "互相关注" : "已关注" : "关注", e.setData({
                    attentionBtnText: d
                });
            }
        },
        navigate: function(t) {
            var a = this, n = getCurrentPages(), i = n[n.length - 1], d = i.data.isLink;
            (void 0 === d || d) && e.initPageLogin().then(function(n) {
                a.setData({
                    authedUserId: n
                }), t.detail.e && (t = t.detail.e), e.requestEmpty(t), i.setData({
                    isLink: !1
                }), wx.navigateTo({
                    url: t.currentTarget.dataset.url
                });
            });
        },
        changeAttention: function() {
            var t = this;
            e.initPageLogin().then(function(a) {
                t.setData({
                    authedUserId: a
                });
                var n = t.data, i = n.authedUserId, d = void 0 === i ? "" : i, s = n.userInfo, o = n.attentionBtnText, r = void 0 === o ? "" : o, u = (n.modalHidden, 
                s.createUserId), c = void 0 === u ? "" : u, h = {};
                d = d || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
                "关注" === r ? (Object.assign(h, {
                    service: "SUBSCRIBE",
                    subscribeId: c,
                    authedUserId: d
                }), e.request("service.json", e.MD5(h)).then(function(e) {
                    t.handleData(e, "attention");
                })) : t.setData({
                    modalHidden: !1
                });
            });
        },
        handleData: function(e, t) {
            var a = this, n = a.data.attentionBtnText, i = void 0 === n ? "" : n;
            if ("attention" === t) {
                var d = e.subscribeEachOther;
                i = void 0 !== d && d ? "互相关注" : "已关注";
            } else "cancelAttention" === t && (i = "关注");
            a.setData({
                attentionBtnText: i
            });
        },
        submitModal: function() {
            var t = this;
            e.initPageLogin().then(function(a) {
                t.setData({
                    authedUserId: a
                });
                var n = t.data, i = n.authedUserId, d = void 0 === i ? "" : i, s = n.userInfo, o = (n.attentionBtnText, 
                n.modalHidden, s.createUserId), r = void 0 === o ? "" : o, u = {};
                d = d || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
                Object.assign(u, {
                    service: "CANCEL_SUBSCRIBE",
                    subscribeId: r,
                    authedUserId: d
                }), e.request("service.json", e.MD5(u)).then(function(e) {
                    t.setData({
                        modalHidden: !0
                    }), t.handleData(e, "cancelAttention");
                });
            });
        },
        hideModal: function() {
            var e = this;
            e.data.modalHidden;
            e.setData({
                modalHidden: !0
            });
        }
    }
});