var i = require("../../utils/util.js"), a = getApp();

Page({
    data: {
        dataList: [],
        abnormalModalHidden: !0,
        winSideNames: "",
        abnormalMemo: ""
    },
    onLoad: function(i) {
        var e = this;
        new a.WeToast(), e.setData({
            id: i.id,
            isIpx: a.globalData.isIpx,
            fightModel: i.fightModel,
            userId: i.userId
        }), e.initPageLogin();
    },
    navigate: function(a) {
        i.requestEmpty(a), wx.navigateTo({
            url: a.currentTarget.dataset.url
        });
    },
    initPageLogin: function(a) {
        var e = this;
        i.initPageLogin(a).then(function(i) {
            wx.showLoading({
                title: "加载中"
            }), e.setData({
                authedUserId: i
            }), e.getListData();
        });
    },
    getListData: function() {
        var a = this, e = a.data, t = e.id, d = e.authedUserId, n = e.userId, o = void 0 === n ? "" : n, s = e.dataList;
        wx.showLoading({
            title: "加载中"
        }), i.request("service.json", i.MD5({
            service: "USER_POINT_RACE_DETAIL_QUERY",
            raceId: t,
            authedUserId: d,
            userId: o
        })).then(function(e) {
            var t = e.list, d = void 0 === t ? [] : t, n = e.sideIdAndMemberIdsMap, o = void 0 === n ? {} : n, r = e.memberIdAndNickNameMap, u = void 0 === r ? {} : r, l = e.scheduleIdAndFinalResult, m = void 0 === l ? "" : l, c = e.scheduleIdMatchResults, h = void 0 === c ? {} : c, g = e.scheduleIdAndChangePoint, v = void 0 === g ? {} : g, I = e.memberLogoUrl, L = void 0 === I ? "" : I, p = e.idAndWinnerSideIdWithAbnormalEnd, M = void 0 === p ? {} : p;
            d.map(function(a) {
                var e = a.id, t = a.sideId, d = a.otherSideId, n = a.bothAbstain, r = void 0 !== n && n, l = a.status, c = void 0 === l ? {} : l, g = o[t] || [], I = o[d] || [], p = [], f = [], b = [], A = v[a.id], D = A.indexOf("+") > -1, N = m[e], w = h[e] || "";
                w = "" !== w ? "(" + w.join(" ") + ")" : "", "EMPTY_SIDE" !== t && g.map(function(a) {
                    f.push({
                        name: i.unicodeNickname(u[a]),
                        logoUrl: L + a
                    });
                }), "EMPTY_SIDE" !== d && I.map(function(a) {
                    b.push({
                        name: i.unicodeNickname(u[a]),
                        logoUrl: L + a
                    });
                }), M[e] && o[M[e]].map(function(a, e) {
                    p.push(i.unicodeNickname(u[a]));
                }), r && (p = [ "双方弃权" ]), "ABNORMAL_END" === c.name && (N = "vs"), Object.assign(a, {
                    point: A,
                    isAdd: D,
                    sideListName: f,
                    otherSideListName: b,
                    result: N,
                    matchResult: w,
                    winSideList: p
                }), s.push(a);
            }), a.setData({
                dataList: s
            });
        });
    },
    showAbnormalModal: function(i) {
        var a = this, e = i.currentTarget.dataset.id, t = "", d = "";
        a.data.dataList.map(function(i, a) {
            e === i.id && (t = i.winSideList.join("/"), d = i.memo);
        }), a.setData({
            abnormalModalHidden: !1,
            winSideNames: t,
            abnormalMemo: d
        });
    },
    hideAbnormalModal: function() {
        this.setData({
            abnormalModalHidden: !0
        });
    }
});