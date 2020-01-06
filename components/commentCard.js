function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = Array(e.length); t < e.length; t++) a[t] = e[t];
        return a;
    }
    return Array.from(e);
}

var t = require("../utils/util.js"), a = getApp();

Component({
    properties: {
        actionSheetHidden: {
            type: Boolean,
            value: !0
        },
        dataList: {
            type: Array,
            value: []
        },
        pageType: {
            type: String,
            value: ""
        },
        type: {
            type: String,
            value: ""
        },
        userLogoUrl: {
            type: String,
            value: ""
        },
        userNickName: {
            type: String,
            value: ""
        },
        commentId: {
            type: String,
            value: ""
        },
        subjectId: {
            type: String,
            value: ""
        }
    },
    data: {
        inputHeight: "",
        operation: {},
        commentFocus: !1,
        inputContent: "",
        authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId,
        disabledSubmit: !0,
        windowWRPX: 375,
        windowWidth: wx.getSystemInfoSync().windowWidth,
        windowHeight: wx.getSystemInfoSync().windowHeight,
        isSubjectComment: !1,
        placeholderContent: "评论一下吧"
    },
    methods: {
        navigate: function(e) {
            var t = {
                e: e
            };
            this.triggerEvent("navigate", t);
        },
        getCommentFocus: function() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, a = this;
            t.initPageLogin().then(function(t) {
                a.setData({
                    authedUserId: t
                }, function() {
                    var t = e.isSubjectComment, i = void 0 !== t && t, n = a.data, o = n.id, r = void 0 === o ? "" : o, d = n.operation, s = void 0 === d ? {} : d, u = n.placeholderContent, c = void 0 === u ? "" : u;
                    e.id && (r = e.id, s = {}), "{}" !== JSON.stringify(s) && (c = "回复" + s.nickName + "："), 
                    a.setData({
                        id: r,
                        placeholderContent: c,
                        commentFocus: !0,
                        inputContent: "",
                        actionSheetHidden: !0,
                        isSubjectComment: i
                    });
                    var l = getCurrentPages();
                    l[l.length - 1].setData({
                        hideFooter: !0
                    });
                });
            });
        },
        bindCommentInput: function(e) {
            var a = this, i = e.detail.value, n = /\ud83c[\udc00-\udfff]|\ud83d[\udc00-\udfff]|\ud83e[\udc00-\udfff]|[\u2600-\u27ff]/g;
            i.match(n) && (t.showToast("不能输入表情！"), i = i.replace(n, "")), "" === i.trim() ? a.setData({
                disabledSubmit: !0
            }) : a.setData({
                disabledSubmit: !1
            }), a.setData({
                inputContent: i
            });
        },
        bindCommentFocus: function(e) {
            var t = this, i = t.data.windowHeight, n = e.detail.height, o = void 0 === n ? 265 : n;
            t.setData({
                inputHeight: Math.max(o, 265) + 10 - (a.globalData.windowHeight - i)
            });
        },
        bindCommentBlur: function() {
            this.setData({
                disabledSubmit: !0,
                commentFocus: !1
            });
            var e = getCurrentPages();
            e[e.length - 1].setData({
                hideFooter: !1
            });
        },
        showActionSheet: function(e) {
            var a = this, i = this;
            t.initPageLogin().then(function(n) {
                i.setData({
                    authedUserId: n
                }, function() {
                    var n = e.currentTarget.dataset, o = void 0 === n ? {} : n, r = o.operation, d = void 0 === r ? {} : r;
                    o.type;
                    t.requestEmpty(e), "{}" !== JSON.stringify(d) ? i.setData({
                        operation: d,
                        id: d.id,
                        actionSheetHidden: !a.data.actionSheetHidden
                    }) : i.setData({
                        actionSheetHidden: !i.data.actionSheetHidden
                    });
                });
            });
        },
        bindReply: function() {
            this.getCommentFocus();
        },
        bindCopy: function() {
            var e = this, a = e.data.operation, i = void 0 === a ? {} : a;
            e.setData({
                actionSheetHidden: !0
            }), wx.setClipboardData ? (wx.setClipboardData({
                data: i.content
            }), t.showToast("复制成功!", "success")) : wx.showModal({
                title: "提示",
                content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
            });
        },
        getInputContent: function() {
            var e = this, a = e.data, i = a.inputContent, n = void 0 === i ? "" : i, o = a.isSubjectComment, r = void 0 !== o && o, d = a.id, s = void 0 === d ? "" : d, u = (a.userLogoUrl, 
            a.commentId), c = void 0 === u ? "" : u, l = (a.operation, a.subjectId), g = void 0 === l ? "" : l, m = e.data.authedUserId, v = void 0 === m ? "" : m, p = {
                service: "SUBJECT_COMMENT_REPLY_CREATE",
                authedUserId: v = v || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId,
                content: n,
                subjectId: g
            };
            "" !== n.trim() && (r ? p.service = "SUBJECT_COMMENT_CREATE" : "" === c ? p.commentId = s : (p.parentCommentReplyId = s, 
            p.commentId = c), "" !== v ? (e.getReplyData(p), e.setData({
                commentFocus: !1
            })) : t.showToast("您已在其他地方登陆，请退出小程序重新登陆！"));
        },
        bindDelete: function() {
            var e = this, a = e.data, i = a.type, n = void 0 === i ? "" : i, o = a.id, r = void 0 === o ? "" : o, d = a.subjectId, s = void 0 === d ? "" : d, u = e.data.authedUserId, c = void 0 === u ? "" : u, l = {
                service: "COMMENT_DELETE",
                authedUserId: c = c || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId,
                subjectId: s,
                commentId: r
            };
            "reply" === n && (l.service = "COMMENT_REPLY_DELETE", l.replyId = r, delete l.commentId), 
            e.setData({
                actionSheetHidden: !0
            }), "" !== c ? wx.showModal({
                title: "提示",
                content: "确认删除此评论吗？",
                confirmColor: "#00CD91",
                success: function(t) {
                    t.confirm && e.getDeleteData(l);
                }
            }) : t.showToast("您已在其他地方登陆，请退出小程序重新登陆！");
        },
        getReplyData: function(e) {
            var i = this, n = i.data, o = n.isSubjectComment, r = void 0 !== o && o, d = n.pageType, s = void 0 === d ? "" : d, u = n.commentId, c = void 0 === u ? "" : u, l = n.id, g = n.inputContent, m = void 0 === g ? "" : g, v = n.userLogoUrl, p = void 0 === v ? "" : v, h = n.userNickName, y = void 0 === h ? "" : h, f = n.operation, D = void 0 === f ? {} : f, S = n.subjectId, C = void 0 === S ? "" : S, I = i.data.authedUserId, b = void 0 === I ? "" : I;
            b = b || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
            wx.showLoading({
                title: "加载中"
            }), t.request("service.json", t.MD5(e)).then(function(e) {
                wx.hideLoading(), t.showToast("评论成功！", "success");
                var n = e.nowDate, o = void 0 === n ? "" : n, d = e.id, u = void 0 === d ? "" : d, l = {
                    id: u,
                    nickName: y,
                    content: m,
                    gmt: t.date.getFormatGmt(o),
                    userLogoUrl: p + b + "&" + 100 * Math.random(),
                    likeCountStr: "0",
                    isLike: !1,
                    canDelete: !0,
                    homePageUrl: "" + a.globalData.userHomePageUrl + b
                };
                r ? (l.replyCount = 0, l.commentPageUrl = "" + a.globalData.commentPageUrl + u + "&subjectId=" + C + "&createUserId=" + b, 
                i.createReply(l), i.triggerEvent("createReply", l)) : "subjectDetail" === s ? i.createReply(l) : "" === c ? i.triggerEvent("createReply", l) : (l.parentNickName = D.nickName, 
                i.triggerEvent("createReply", l));
            }).catch(function(e) {
                if (e.error && e.error.name === a.globalData.subjectIsDeleteName && "comment" === s) {
                    var t = getCurrentPages(), i = t[t.length - 2];
                    i && i.setData({
                        subjectIsDelete: !0
                    });
                }
            });
        },
        getDeleteData: function(e) {
            var i = this, n = i.data, o = n.pageType, r = void 0 === o ? "" : o, d = n.commentId, s = void 0 === d ? "" : d, u = n.id, c = void 0 === u ? "" : u;
            wx.showLoading({
                title: "加载中"
            }), t.request("service.json", t.MD5(e)).then(function(e) {
                wx.hideLoading(), t.showToast("删除成功！", "success");
                var a = {
                    id: c
                };
                "subjectDetail" === r ? i.deleteReply() : "" === s ? i.triggerEvent("deleteComment", a) : i.deleteReply();
            }).catch(function(e) {
                if (e.error && e.error.name === a.globalData.subjectIsDeleteName && "comment" === r) {
                    var t = getCurrentPages(), n = t[t.length - 2];
                    n && n.setData({
                        subjectIsDelete: !0
                    });
                }
                if (e.error && (e.error.name === a.globalData.commentIsDeleteName || e.error.name === a.globalData.commentReplyIsDeleteName)) {
                    var o = {
                        id: c
                    };
                    "subjectDetail" === r ? i.deleteReply() : "" === s ? i.triggerEvent("deleteComment", o) : i.deleteReply();
                }
            });
        },
        createReply: function(t) {
            var a = this, i = a.data, n = i.id, o = void 0 === n ? "" : n, r = i.pageType, d = void 0 === r ? "" : r, s = i.isSubjectComment, u = void 0 !== s && s, c = a.data.dataList, l = void 0 === c ? [] : c;
            "subjectDetail" !== d || u ? l = [ t ].concat(e(l)) : l.map(function(a) {
                if (o === a.id) {
                    var i = a.replyList, n = void 0 === i ? [] : i;
                    a.replyCount = parseInt(a.replyCount || "0") + 1, a.replyList = [ t ].concat(e(n));
                }
            }), "subjectDetail" !== d || u ? a.setData({
                dataList: l
            }) : (a.triggerEvent("addReply", {
                dataList: l
            }), a.triggerEvent("addReplyCount"));
        },
        deleteReply: function() {
            var e = this, a = e.data, i = a.id, n = void 0 === i ? "" : i, o = a.pageType, r = void 0 === o ? "" : o, d = (a.isSubjectComment, 
            e.data.dataList), s = void 0 === d ? [] : d, u = 1;
            s.map(function(e, a) {
                n === e.id && ("subjectDetail" === r && t.math.isNumber(e.replyCount || "0") && (u = parseInt(e.replyCount) + 1), 
                s.splice(a, 1));
            }), e.triggerEvent("deleteReply", {
                dataList: s
            }), e.triggerEvent("minusReplyCount", {
                count: u
            });
        }
    }
});