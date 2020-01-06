function t(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a;
    }
    return Array.from(t);
}

var e = require("../../utils/util.js"), a = getApp();

Page({
    data: {
        isLink: !0,
        authedUserId: "",
        fromLogin: !1,
        userNickName: "",
        createUserId: ""
    },
    navigate: function(t) {
        var a = this, i = a.data.isLink;
        if (t.detail.e && (t = t.detail.e), i) if (a.setData({
            isLink: !1
        }), "noLogin" === t.currentTarget.dataset.urlType) {
            e.requestEmpty(t);
            var n = t.currentTarget.dataset.url, o = void 0 === n ? "" : n;
            "" !== o && wx.navigateTo({
                url: o
            });
        } else "needLogin" === t.currentTarget.dataset.urlType && e.initPageLogin().then(function(i) {
            a.setData({
                authedUserId: i
            }, function() {
                e.requestEmpty(t);
                var a = t.currentTarget.dataset.url, i = void 0 === a ? "" : a;
                "" !== i && wx.navigateTo({
                    url: i
                });
            });
        });
    },
    onHide: function() {
        this.setData({
            isLink: !0,
            fromLogin: !1
        });
    },
    onLoad: function(t) {
        var e = this;
        e.setData({
            id: t.id || "",
            subjectId: t.subjectId || "",
            createUserId: t.createUserId || "",
            isIpx: a.globalData.isIpx
        }), e.initPageLogin();
    },
    onShow: function() {
        var t = this;
        t.data.fromLogin && t.initPageLogin();
    },
    initPageLogin: function(t) {
        var a = this;
        a.setData({
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "",
            gmtCreateEnd: e.date.formatTime(new Date())
        }), a.initPageQuery();
    },
    initPageQuery: function(t) {
        var i = this, n = i.data, o = n.authedUserId, r = void 0 === o ? "" : o, d = n.id, s = void 0 === d ? "" : d, u = n.currentPage, m = void 0 === u ? 1 : u, l = n.gmtCreateEnd, g = void 0 === l ? "" : l, c = n.subjectId, v = void 0 === c ? "" : c;
        t || (m = 1), wx.showLoading({
            title: "加载中"
        }), e.request("service.json", e.MD5({
            service: "SUBJECT_COMMENT_DETAIL_QUERY",
            authedUserId: r,
            commentId: s,
            currentPage: m,
            gmtCreateEnd: g,
            subjectId: v
        })).then(function(e) {
            wx.hideLoading(), i.initListData(e, t);
        }).catch(function(t) {
            t.error && t.error.name === a.globalData.commentIsDeleteName && setTimeout(function() {
                var t = {
                    detail: {
                        id: s
                    }
                };
                i.deleteComment(t);
            }, 1500);
        });
    },
    initListData: function(t, i) {
        var n = this, o = n.data, r = o.dataList, d = void 0 === r ? [] : r, s = o.authedUserId, u = void 0 === s ? "" : s, m = o.createUserId, l = void 0 === m ? "" : m, g = t.commentReplyIdAndLikeCount, c = void 0 === g ? {} : g, v = t.likeCountStr, p = void 0 === v ? "" : v, I = t.likeReplyIds, f = void 0 === I ? [] : I, h = t.comment, C = void 0 === h ? {} : h, L = t.pages, y = void 0 === L ? 1 : L, D = t.userIdAndNickName, U = void 0 === D ? {} : D, k = t.likeComment, N = void 0 !== k && k, P = t.userLogoUrl, R = void 0 === P ? "" : P, T = t.totlaCommentReplyCount, b = void 0 === T ? "" : T, w = t.commentReplyList, x = void 0 === w ? [] : w, A = t.parentReplyIdAndUserId, S = void 0 === A ? {} : A, E = t.userNickName, j = t.creatorId, B = void 0 === j ? "" : j;
        n.setData({
            createUserId: B
        });
        var q = t.currentPage, H = void 0 === q ? 1 : q, O = C.userId, F = void 0 === O ? "" : O, Q = C.gmtCreate, M = void 0 === Q ? "" : Q;
        i || (d = []), x.map(function(t) {
            var i = t.id, n = void 0 === i ? "" : i, o = t.parentReplyId, r = void 0 === o ? "" : o, s = t.userId, m = void 0 === s ? "" : s, g = t.gmtCreate, v = void 0 === g ? "" : g;
            Object.assign(t, {
                canDelete: u === l || u === m,
                likeCountStr: c[n] || "0",
                isLike: -1 !== f.indexOf(n),
                homePageUrl: "" + a.globalData.userHomePageUrl + m,
                userLogoUrl: R + m,
                nickName: U[m],
                gmt: e.date.getFormatGmt(v),
                parentHomePageUrl: "" + a.globalData.userHomePageUrl + r,
                parentNickName: U[S[r] || ""]
            }), d.push(t);
        }), "{}" !== JSON.stringify(C) && (Object.assign(C, {
            canDelete: u === l || u === F,
            likeCountStr: p,
            isLike: N,
            nickName: U[F],
            userLogoUrl: R + F,
            gmt: e.date.getFormatGmt(M),
            homePageUrl: "" + a.globalData.userHomePageUrl + F
        }), n.setData({
            commentList: [ C ]
        })), d = e.uniqueArray(d), n.setData({
            dataList: d,
            userLogoUrl: R,
            totlaCommentReplyCount: b,
            currentPage: ++H,
            pages: y,
            userNickName: E
        }), wx.setNavigationBarTitle({
            title: b + "条回复"
        });
    },
    getCommentFocus: function() {
        this.selectComponent("#commentCard").getCommentFocus({
            id: this.data.id
        });
    },
    onReachBottom: function() {
        var t = this, e = t.data;
        e.currentPage <= e.pages && t.initPageQuery(!0);
    },
    createReply: function(e) {
        var a = this, i = a.data.dataList, n = void 0 === i ? [] : i;
        n = [ e.detail ].concat(t(n)), a.setData({
            dataList: n
        }), a.addReplyCount();
    },
    deleteComment: function(t) {
        var e = getCurrentPages(), a = e[e.length - 2];
        a && a.setData({
            deleteCommentId: t.detail.id
        }), setTimeout(function() {
            wx.navigateBack({
                delta: 1
            });
        }, 1500);
    },
    deleteReply: function(t) {
        this.setData({
            dataList: t.detail.dataList
        });
    },
    addReplyCount: function() {
        var t = this, a = t.data.totlaCommentReplyCount, i = void 0 === a ? "0" : a;
        e.math.isNumber(i) && (wx.setNavigationBarTitle({
            title: parseInt(i) + 1 + "条回复"
        }), t.setData({
            totlaCommentReplyCount: parseInt(i) + 1
        }));
    },
    minusReplyCount: function(t) {
        var a = this, i = a.data.totlaCommentReplyCount, n = void 0 === i ? "" : i;
        e.math.isNumber(n) && (wx.setNavigationBarTitle({
            title: parseInt(n) - 1 + "条回复"
        }), a.setData({
            totlaCommentReplyCount: parseInt(n) - 1
        }));
    }
});