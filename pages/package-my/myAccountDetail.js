var e = require("../../utils/util.js"), t = getApp(), a = {};

Page({
    data: {
        helpModalHidden: !0
    },
    onLoad: function(e) {
        var a = this;
        a.setData({
            isIpx: t.globalData.isIpx
        }), a.initPageLogin();
    },
    onPullDownRefresh: function() {
        this.initPageLogin(), wx.stopPullDownRefresh();
    },
    showHelpModal: function(t) {
        e.requestEmpty(t), this.setData({
            helpModalHidden: !1
        });
    },
    closeHelpModal: function() {
        this.setData({
            helpModalHidden: !0
        });
    },
    initPageLogin: function(t) {
        var i = this;
        e.initPageLogin(t).then(function(e) {
            a.authedUserId = e, i.initPageQuery();
        });
    },
    initPageQuery: function(t) {
        var i = this, n = i.data, s = n.recordList, r = n.currentPage, o = void 0 === r ? 1 : r;
        t || (o = 1, s = []), e.request("service.json", e.MD5({
            service: "ACTIVITY_FUND_DETAIL_PAGE_QUERY",
            authedUserId: a.authedUserId,
            currentPage: o
        })).then(function(e) {
            var t = e.fundList, a = void 0 === t ? [] : t, n = e.settlementAmount, r = e.waitingSettlementAmount, o = e.createFromObjectIdAndTitle, u = void 0 === o ? {} : o, d = e.currentPage, c = e.pages;
            a.map(function(e) {
                var t = e.amount, a = e.fundType, i = e.gmtCreate, n = (e.id, e.payerUserId, e.sellerUserId, 
                e.title, e.createFromObjectId), r = "", o = u[void 0 === n ? "" : n];
                switch (a = a.name, i = i.replace(/\-/g, "/").substring(0, 16), a) {
                  case "PAY":
                    t = "+" + t;
                    break;

                  case "REFUND":
                    t = "-" + t;
                    break;

                  case "SETTLEMENT":
                    t = "-" + t, r = "(结算至微信钱包)";
                }
                Object.assign(e, {
                    memo: r,
                    activityTitle: o,
                    gmtCreate: i,
                    amount: t,
                    fundType: a
                }), s.push(e);
            }), i.setData({
                recordList: s,
                settlementAmount: n,
                waitingSettlementAmount: r,
                currentPage: ++d,
                pages: c
            });
        });
    },
    onReachBottom: function() {
        this.getMoreListData();
    },
    getMoreListData: function() {
        var e = this, t = e.data;
        t.currentPage <= t.pages && e.initPageQuery(!0);
    }
});