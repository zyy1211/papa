function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t = require("../utils/util.js"), a = getApp();

Component({
    properties: {
        pageType: {
            type: String,
            value: ""
        },
        likeId: {
            type: String,
            value: ""
        },
        type: {
            type: String,
            value: ""
        },
        likeCountStr: {
            type: String,
            value: ""
        },
        isLike: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId
    },
    methods: {
        getLikeStatus: function(e, a) {
            var i = this, r = i.data.likeCountStr, s = void 0 === r ? "" : r, n = i.data.authedUserId, u = void 0 === n ? "" : n;
            u = u || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "";
            var o = e.currentTarget.dataset, c = o.type, l = void 0 === c ? "" : c, d = o.id, m = void 0 === d ? "" : d, g = o.like, p = void 0 !== g && g;
            if ("" !== l) if ("" !== u) {
                var k = {
                    service: "LIKE",
                    authedUserId: u,
                    likeObjectId: m,
                    likeObjectType: "SUBJECT"
                };
                switch (p && (k.service = "CANCLE_LIKE"), a && (p = !p), p ? (t.math.isNumber(s) && parseInt(s) > 0 && i.setData({
                    likeCountStr: parseInt(s) - 1
                }), i.setData({
                    isLike: !1
                })) : (t.math.isNumber(s) && i.setData({
                    likeCountStr: parseInt(s) + 1
                }), i.setData({
                    isLike: !0,
                    doLike: !0
                })), l) {
                  case "subject":
                    break;

                  case "comment":
                    k.likeObjectType = "COMMENT";
                    break;

                  case "reply":
                    k.likeObjectType = "COMMENT_REPLY";
                }
                a || i.getLike(e, k);
            } else t.initPageLogin().then(function(e) {
                i.setData({
                    authedUserId: e
                });
            });
        },
        getLike: function(i, r) {
            var s = this, n = s.data, u = n.pageType, o = void 0 === u ? "" : u, c = n.type, l = void 0 === c ? "" : c, d = n.likeId, m = void 0 === d ? "" : d;
            t.requestEmpty(i), t.request("service.json", t.MD5(r), null, !0).then(function(a) {
                if ("subject" === o || "subjectDetail" === o || "comment" === o) {
                    var i = getCurrentPages(), s = i[i.length - 1], n = [], u = "";
                    switch (o) {
                      case "subject":
                      case "subjectDetail":
                        "comment" === l && (n = s.data.commentsList || [], u = "commentsList");
                        break;

                      case "comment":
                        "comment" === l ? (n = s.data.commentList || [], u = "commentList") : "reply" === l && (n = s.data.dataList || [], 
                        u = "dataList");
                    }
                    n.map(function(e) {
                        e.id === m && (e.isLike = "LIKE" === r.service, t.math.isNumber(e.likeCountStr) && (e.likeCountStr = "LIKE" === r.service ? parseInt(e.likeCountStr) + 1 : parseInt(e.likeCountStr) - 1));
                    }), "subject" !== l && s.setData(e({}, "" + u, n));
                }
            }).catch(function(e) {
                if (e.error && e.error.name === a.globalData.subjectIsDeleteName && "discovery" !== o && "comment" === o) {
                    var t = getCurrentPages(), r = t[t.length - 2];
                    r && r.setData({
                        subjectIsDelete: !0
                    });
                }
                s.getLikeStatus(i, !0);
            });
        }
    }
});