var e = require("../../utils/util.js"), t = getApp(), a = {
    isLink: !0
};

Component({
    properties: {
        raceId: {
            type: String,
            value: ""
        }
    },
    data: {
        isIpx: t.globalData.isIpx,
        authedUserId: "",
        raceGroupType: "",
        resultBelongType: "",
        groupList: [],
        groupId: "",
        resultType: "",
        resultList: [],
        resultImg: [],
        imageUrl: "",
        currentPage: 1,
        pages: 1,
        showDownloadBtn: !1,
        showListType: ""
    },
    methods: {
        initPageLogin: function() {
            var t = this;
            e.initPageLogin().then(function(e) {
                var a = e;
                a && "" !== a && (t.setData({
                    authedUserId: a
                }), t.getGroup());
            });
        },
        getGroup: function() {
            var t = this, a = t.data, r = a.raceId, i = a.authedUserId, s = (a.groupId, {
                service: "HN_RACE_RESULT_GROUP_QUERY",
                authedUserId: i,
                raceId: r
            });
            e.request("service.json", e.MD5(s)).then(function(e) {
                var a = e.resultBelongType, r = void 0 === a ? {} : a, i = e.raceGroupType, s = void 0 === i ? {} : i, o = e.raceGroupList, n = void 0 === o ? [] : o, u = e.showDownloadBtn;
                t.setData({
                    showDownloadBtn: u
                }), n[0] && t.setData({
                    raceGroupType: s.name,
                    resultBelongType: r.name,
                    groupId: n[0].id,
                    groupList: n
                }, function() {
                    t.getData(!0);
                });
            });
        },
        switchGroup: function(e) {
            var t = e.detail.projectId.project.id, a = this;
            a.setData({
                groupId: t
            }, function() {
                a.getData(!0);
            });
        },
        getData: function(t) {
            var a = this, r = a.data, i = (r.raceId, r.authedUserId), s = void 0 === i ? "" : i, o = r.currentPage, n = void 0 === o ? 1 : o, u = r.pages, d = void 0 === u ? 1 : u, g = r.groupId, p = r.resultList, l = void 0 === p ? [] : p, c = r.resultImg, v = void 0 === c ? [] : c;
            t && (n = 1, d = 1, l = [], v = [], a.setData({
                currentPage: n,
                pages: d,
                resultList: l,
                resultImg: v
            }));
            var h = {
                service: "HN_RACE_RESULT_QUERY",
                authedUserId: s,
                groupId: g,
                currentPage: n
            };
            n <= d && e.request("service.json", e.MD5(h)).then(function(e) {
                a.initData(e);
            });
        },
        initData: function(e) {
            var t = this, a = t.data, r = a.currentPage, i = a.pages, s = a.resultList, o = void 0 === s ? [] : s, n = a.resultImg, u = void 0 === n ? [] : n, d = a.resultType, g = void 0 === d ? "" : d, p = a.showListType, l = void 0 === p ? "" : p, c = e.raceResultBelongInfos, v = void 0 === c ? [] : c, h = e.paginator, I = void 0 === h ? {} : h, T = e.raceResultContentType, D = void 0 === T ? {} : T, L = e.racePictureResults, f = void 0 === L ? {} : L, y = e.hasRank, R = e.haeGrade, m = e.imageUrl, P = void 0 === m ? "" : m;
            r = I.page + 1, i = I.pages, "TEXT" === (g = D.name) ? o = o.concat(v) : "IMAGE" === g && (u = f), 
            y ? (l = "RANK", R && (l = "BOTH")) : l = "SCORE", t.setData({
                currentPage: r,
                pages: i,
                resultList: o,
                resultImg: u,
                resultType: g,
                showListType: l,
                imageUrl: P
            });
        },
        onReachBottom: function() {
            var e = this, t = e.data.resultType;
            if ("TEXT" === (void 0 === t ? "" : t)) {
                var r = a.currentPage, i = void 0 === r ? 1 : r, s = a.pages;
                i <= (void 0 === s ? 1 : s) && e.getData();
            }
        },
        onPullDownRefresh: function() {
            this.initPageLogin(), wx.stopPullDownRefresh();
        },
        navigate: function(t) {
            var a = getCurrentPages(), r = a[a.length - 1], i = r.data.isLink;
            (void 0 === i || i) && (t.detail.e && (t = t.detail.e), e.requestEmpty(t), r.setData({
                isLink: !1
            }), wx.navigateTo({
                url: t.currentTarget.dataset.url
            }));
        }
    }
});