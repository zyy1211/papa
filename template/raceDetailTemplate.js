function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

Object.defineProperty(exports, "__esModule", {
    value: !0
});

var t = require("../utils/util.js");

new (getApp().WeToast)();

var a = {
    bindNavigateButton: function(e) {
        var a = this, r = e.detail.formId, s = a.data, i = s.id, n = s.authedUserId;
        wx.showLoading({
            title: "加载中"
        }), t.request("service.json", t.MD5({
            service: "RACE_USER_BATTLE_REPORT_QUERY",
            activityId: i,
            formId: r,
            check: !0,
            authedUserId: n
        })).then(function(e) {
            wx.hideLoading(), wx.navigateTo({
                url: "/pages/package-race/raceReport?id=" + i
            });
        });
    },
    showRaceResult: function() {
        var t, a = this;
        a.setData((t = {}, e(t, "raceResultData.raceResultList", []), e(t, "raceResultData.resultCurrentPage", 1), 
        t)), a.getRaceResult();
    },
    getMoreRaceResult: function() {
        var e = this, t = e.data.resultLoadingMore, a = e.data.raceResultData, r = a.resultCurrentPage, s = a.resultPages;
        t || r <= s && (e.setData({
            resultLoadingMore: !0
        }), e.getRaceResult("isScroll"));
    },
    getRaceResult: function(e) {
        var a = this, r = a.data, s = r.id, i = r.authedUserId, n = r.currentTab, u = r.isIpx, o = a.data.raceResultData, c = o.resultCurrentPage, d = void 0 === c ? 1 : c, l = o.raceResultList, R = void 0 === l ? [] : l;
        e || (R = []), t.request("service.json", t.MD5({
            service: "RACE_RESULT_LIST_PAGE_QUERY",
            activityId: s,
            authedUserId: i,
            currentPage: d
        })).then(function(e) {
            a.setData({
                resultLoadingMore: !1
            });
            var r = e.resultList, s = void 0 === r ? [] : r, i = e.resultIdAndResultDetail, o = void 0 === i ? {} : i, c = e.objectIdAndEachNameList, d = void 0 === c ? [] : c, l = (e.objectIdAndObjectName, 
            e.paginator), g = void 0 === l ? {} : l, v = e.showResultSequence, h = void 0 !== v && v, p = e.showResultReport, P = void 0 !== p && p, b = e.pointRace, I = void 0 !== b && b, T = e.objectIdAndPointChanges, f = void 0 === T ? {} : T, L = g.page, _ = g.pages;
            s.map(function(e, a) {
                var r = e.id, s = e.resultObjectId, i = e.resultName, n = e.resultSequence, u = o[r], c = u.victoryCount, l = u.totalCount, g = u.netVictoryScore, v = I % 2 == 0 ? "odd-row" : "", p = [], P = d[s], b = f[s] || 0, I = "", T = "";
                switch (i && i.name) {
                  case "TOP_ONE":
                    T = "/static/icon-result1.png";
                    break;

                  case "TOP_TWO":
                    T = "/static/icon-result2.png";
                    break;

                  case "TOP_THREE":
                    T = "/static/icon-result3.png";
                    break;

                  case "TOP_FOUR":
                    I = "四强";
                    break;

                  case "TOP_EIGHT":
                    I = "八强";
                }
                h && (I = n, T = ""), P.map(function(e, a) {
                    p.push({
                        nickName: t.unicodeNickname(e),
                        lineHeight: 90 / P.length
                    });
                }), R.push({
                    victoryCount: c,
                    totalCount: l,
                    netVictoryScore: g,
                    index: I,
                    className: v,
                    nameList: p,
                    indexUrl: T,
                    itemPointRace: b
                });
            }), a.setData({
                raceResultData: {
                    currentTab: n,
                    isIpx: u,
                    raceResultList: R,
                    raceResultListNone: 0 === R.length,
                    resultCurrentPage: ++L,
                    resultPages: _,
                    showResultReport: P,
                    pointRace: I
                }
            });
        });
    }
};

exports.default = a;