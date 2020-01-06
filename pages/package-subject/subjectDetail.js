function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

function t(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = Array(e.length); t < e.length; t++) a[t] = e[t];
        return a;
    }
    return Array.from(e);
}

var a = require("../../utils/util.js"), i = getApp();

Page({
    data: {
        commentsList: [],
        isLink: !0,
        commentFocus: !1,
        imageCurrent: 1,
        imageHeight: 750,
        authedUserId: "",
        fromLogin: !1
    },
    navigate: function(e) {
        var t = this, i = t.data.isLink;
        e.detail.e && (e = e.detail.e), i && (t.setData({
            isLink: !1
        }), "noLogin" === e.currentTarget.dataset.urlType ? (a.requestEmpty(e), wx.navigateTo({
            url: e.currentTarget.dataset.url
        })) : "needLogin" === e.currentTarget.dataset.urlType && a.initPageLogin().then(function(i) {
            t.setData({
                authedUserId: i
            }, function() {
                a.requestEmpty(e), wx.navigateTo({
                    url: e.currentTarget.dataset.url
                });
            });
        }));
    },
    onHide: function() {
        this.setData({
            isLink: !0,
            fromLogin: !1
        });
    },
    onLoad: function(e) {
        var t = this;
        t.setData({
            id: e.id,
            isIpx: i.globalData.isIpx
        }), t.initPageLogin();
    },
    onShow: function() {
        var e = this, t = e.data, i = t.commentsList, r = void 0 === i ? [] : i, o = t.deleteCommentId, n = void 0 === o ? "" : o, s = t.subjectIsDelete;
        if (t.fromLogin && e.initPageLogin(), s && wx.navigateBack({
            delta: 1
        }), "" !== n) {
            var d = {};
            r.map(function(e, t) {
                n === e.id && (r.splice(t, 1), a.math.isNumber(e.replyCount) && (d = {
                    detail: {
                        count: parseInt(e.replyCount) + 1
                    }
                }));
            }), e.setData({
                commentsList: r
            }), e.minusReplyCount(d);
        }
        e.selectComponent("#appFooter").initScene();
    },
    initPageLogin: function(e) {
        var t = this;
        t.setData({
            gmtCreateEnd: a.date.formatTime(new Date()),
            authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || ""
        }), t.initPageQuery();
    },
    initPageQuery: function(e) {
        var t = this, i = t.data, r = i.authedUserId, o = void 0 === r ? "" : r, n = i.id, s = void 0 === n ? "" : n, d = i.currentPage, c = void 0 === d ? 1 : d, u = i.gmtCreateEnd, m = void 0 === u ? "" : u;
        e || (c = 1), a.request("service.json", a.MD5({
            service: "SUBJECT_DETAIL_QUERY",
            authedUserId: o,
            subjectId: s,
            currentPage: c,
            gmtCreateEnd: m
        })).then(function(a) {
            t.initListData(a, e);
        });
    },
    initListData: function(e, t) {
        var r = this, o = r.data, n = o.commentsList, s = void 0 === n ? [] : n, d = o.authedUserId, c = void 0 === d ? "" : d, u = o.imageHeight, m = r.data.id, l = e.activityIdAndActivityBaseMap, g = void 0 === l ? {} : l, p = e.commentIdAndReplyList, v = void 0 === p ? {} : p, h = e.subjectDetailEntry, f = void 0 === h ? {} : h, y = e.commentList, b = void 0 === y ? [] : y, I = e.pages, D = void 0 === I ? 1 : I, L = e.commentIdAndLikeCount, U = void 0 === L ? {} : L, C = e.userIdAndNickName, w = void 0 === C ? {} : C, P = e.activityImageUrl, j = void 0 === P ? "" : P, S = e.userLogoUrl, k = void 0 === S ? "" : S, A = e.clubName, T = void 0 === A ? "" : A, N = e.clubLogoUrl, E = void 0 === N ? "" : N, R = e.typeIdAndTypeName, F = void 0 === R ? {} : R, H = e.parentTypeIdAndBackGroundColor, x = void 0 === H ? {} : H, O = e.parentReplyIdAndUserId, B = void 0 === O ? {} : O, M = e.commentIdAndReplyCount, q = void 0 === M ? {} : M, Y = e.likeCommentIds, _ = void 0 === Y ? [] : Y, G = e.likeSubject, W = void 0 !== G && G, X = e.subscribeCreator, Q = void 0 !== X && X, J = e.userNickName, z = void 0 === J ? "" : J, K = (f.clubId, 
        f.createFromActivityId, f.gmtCreate), V = void 0 === K ? "" : K, Z = f.createUserId, $ = void 0 === Z ? "" : Z, ee = f.createUserName, te = void 0 === ee ? "" : ee, ae = f.linkActivityIds, ie = void 0 === ae ? [] : ae, re = f.imageSizeRate, oe = void 0 === re ? "" : re, ne = e.currentPage, se = void 0 === ne ? 1 : ne, de = [], ce = {};
        t || (s = [], r.selectComponent("#userHeader").refreshData());
        var ue = a.date.getFormatGmt(V), me = !1;
        Q || $ === c || (me = !0), b.map(function(e) {
            var t = e.id, r = void 0 === t ? "" : t, o = e.userId, n = void 0 === o ? "" : o, d = e.gmtCreate, u = void 0 === d ? "" : d, l = [];
            v[r] && v[r].map(function(e) {
                var t = e.parentReplyId, a = void 0 === t ? "" : t, r = e.userId, o = void 0 === r ? "" : r;
                "" !== a ? l.push(Object.assign(e, {
                    parentHomePageUrl: "" + i.globalData.userHomePageUrl + o,
                    nickName: w[o],
                    parentNickName: w[B[a]]
                })) : l.push(Object.assign(e, {
                    homePageUrl: "" + i.globalData.userHomePageUrl + o,
                    nickName: w[o]
                }));
            });
            var g = q[r] || "0";
            Object.assign(e, {
                canDelete: c === $ || c === n,
                replyList: l,
                replyCount: g,
                showReplyCount: a.math.isNumber(g) && parseInt(g) > 3,
                likeCountStr: U[r] || "0",
                isLike: -1 !== _.indexOf(r),
                homePageUrl: "" + i.globalData.userHomePageUrl + n,
                commentPageUrl: "" + i.globalData.commentPageUrl + r + "&subjectId=" + m + "&createUserId=" + $,
                userLogoUrl: k + n + "&" + 100 * Math.random(),
                nickName: w[n],
                gmt: a.date.getFormatGmt(u)
            }), s.push(e);
        }), ie.map(function(e) {
            var t = Object.assign({}, g[e]), r = t.gmtStart, o = void 0 === r ? "" : r, n = t.gmtEnd, s = void 0 === n ? "" : n, d = t.typeId, c = void 0 === d ? "" : d, u = t.parentTypeId, m = void 0 === u ? "" : u;
            Object.assign(t, g[e], {
                typeName: F[c],
                typeBack: x[m],
                navigateUrl: "" + i.globalData.activityDetailUrl + e,
                imageUrl: "" + j + e,
                gmt: a.date.getTimeInterval(o, s)
            }), de.push(t);
        });
        var le = u;
        switch (oe) {
          case "3:4":
            le = u * (4 / 3);
            break;

          case "1:1":
            le = u;
            break;

          case "4:3":
            le = .75 * u;
        }
        "{}" !== JSON.stringify(f) && (Object.assign(f, {
            swiperHeight: le,
            linkActivityList: de,
            clubName: T,
            clubLogoUrl: E,
            isLike: W,
            userLogoUrl: k + $ + "&" + 100 * Math.random(),
            gmtSubject: a.date.getFormatGmt(V),
            homePageUrl: "" + i.globalData.userHomePageUrl + $
        }), Object.assign(ce, {
            homePageUrl: "" + i.globalData.userHomePageUrl + $,
            userLogoUrl: "" + k + $ + "&" + 100 * Math.random(),
            createUserName: te,
            createUserId: $,
            userSex: "",
            time: ue,
            contactName: "",
            showAttentionButton: me,
            follwed: !1,
            beFollowed: !1
        }), r.setData({
            subjectDetailEntry: f,
            userHeaderInfo: ce
        })), s = a.uniqueArray(s), r.setData({
            commentsList: s,
            userLogoUrl: k,
            userNickName: z,
            currentPage: ++se,
            pages: D
        });
    },
    imageOnload: function(e) {
        var t = this, a = e.currentTarget.dataset.index, i = {
            type: "subjectImage"
        };
        0 === (void 0 === a ? "" : a) && (i.width = e.detail.width, i.height = e.detail.height, 
        t.getShareImageUrl(i));
    },
    getShareImageUrl: function(e) {
        var t = this, a = t.data.subjectDetailEntry, i = void 0 === a ? {} : a, r = i.imageUrlList, o = void 0 === r ? [] : r, n = i.imageSizeRate, s = void 0 === n ? "1:1" : n, d = e.width, c = void 0 === d ? 0 : d, u = e.height, m = void 0 === u ? 0 : u, l = 1;
        if (0 !== o.length) {
            switch (s) {
              case "3:4":
                l = c / 250, e.cropperWidth = 250, e.cropperY = -(m - 200 * l) / 2 / l, e.cropperHeight = 200 - 2 * e.cropperY, 
                e.cropperX = 0;
                break;

              case "1:1":
                e.cropperWidth = 250, e.cropperHeight = 250, e.cropperX = 0, e.cropperY = 0;
                break;

              case "4:3":
                l = m / 200, e.cropperHeight = 200, e.cropperX = -(c - 250 * l) / 2 / l, e.cropperY = 0, 
                e.cropperWidth = 250 - 2 * e.cropperX;
            }
            e.imageSrc = o[0], t.downloadFile(e);
        }
    },
    downloadFile: function(e) {
        var t = this, i = t.data.id, r = void 0 === i ? "" : i, o = "";
        a.request("service.json", a.MD5({
            service: "GET_DOWNLOAD_FILE_URL",
            objectId: r,
            objectType: "SUBJECT_SHARE"
        })).then(function(i) {
            wx.downloadFile({
                url: i.downloadUrl,
                success: function(e) {
                    o = e.tempFilePath;
                },
                fail: function() {
                    a.showToast("图片下载失败，请下拉刷新重试！");
                },
                complete: function(a) {
                    e.imageSrc = a.tempFilePath || o, t.doCropper(e);
                }
            });
        });
    },
    doCropper: function(e) {
        var t = this, a = e.imageSrc, i = void 0 === a ? "" : a, r = e.cropperX, o = void 0 === r ? 0 : r, n = e.cropperY, s = void 0 === n ? 0 : n, d = e.cropperWidth, c = void 0 === d ? 250 : d, u = e.cropperHeight, m = void 0 === u ? 200 : u, l = wx.createCanvasContext("myCanvas");
        l.width = 250, l.height = 200, l.drawImage(i, o, s, c, m), l.draw(), setTimeout(function() {
            t.canvasToDownImage();
        }, 1e3);
    },
    canvasToDownImage: function() {
        var e = this;
        wx.canvasToTempFilePath({
            canvasId: "myCanvas",
            success: function(t) {
                var a = t.tempFilePath;
                e.setData({
                    shareImageUrl: a
                });
            }
        });
    },
    onPullDownRefresh: function() {
        this.initPageLogin(), wx.stopPullDownRefresh();
    },
    onReachBottom: function() {
        var e = this, t = e.data;
        t.currentPage <= t.pages && e.initPageQuery(!0);
    },
    onShareAppMessage: function() {
        var e = this.data, t = e.subjectDetailEntry, a = void 0 === t ? {} : t, r = e.id, o = void 0 === r ? "" : r, n = e.shareImageUrl, s = void 0 === n ? "" : n;
        return {
            title: a.content || "给你分享一个超赞的动态，快点开看！",
            desc: "欢迎使用PAPA报名，点击打开!",
            path: "" + i.globalData.subjectDetailUrl + o,
            imageUrl: s || "/static/weixin.png"
        };
    },
    bindSwiperChange: function(e) {
        var t = e.detail.current, a = void 0 === t ? 0 : t;
        this.setData({
            imageCurrent: a + 1
        });
    },
    getCommentFocus: function() {
        this.selectComponent("#commentCard").getCommentFocus({
            id: this.data.id,
            isSubjectComment: !0
        });
    },
    createReply: function(e) {
        var a = this, i = a.data.commentsList, r = void 0 === i ? [] : i;
        r = [ e.detail ].concat(t(r)), a.setData({
            commentsList: r
        }), a.addReplyCount(e);
    },
    addReplyCount: function(t, i) {
        var r = this, o = r.data.subjectDetailEntry, n = (void 0 === o ? {} : o).commentCountStr, s = void 0 === n ? "0" : n;
        a.math.isNumber(s) && r.setData(e({}, "subjectDetailEntry.commentCountStr", parseInt(s) + 1));
    },
    addReply: function(e) {
        this.setData({
            commentsList: e.detail.dataList
        });
    },
    deleteReply: function(e) {
        this.setData({
            commentsList: e.detail.dataList
        });
    },
    minusReplyCount: function(t) {
        var i = this, r = i.data.subjectDetailEntry, o = (void 0 === r ? {} : r).commentCountStr, n = void 0 === o ? "0" : o;
        if (a.math.isNumber(n)) {
            var s = parseInt(n) - 1;
            t.detail.count && (s = parseInt(n) - t.detail.count), i.setData(e({}, "subjectDetailEntry.commentCountStr", s));
        }
    },
    openClub: function() {
        var e = this;
        a.initPageLogin().then(function(t) {
            e.setData({
                authedUserId: t
            }, function() {
                a.downloadApp.openClub();
            });
        });
    }
});