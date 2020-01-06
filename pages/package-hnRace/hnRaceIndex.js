var t = require("../../utils/util.js"), e = getApp();

Page({
    data: {
        isIpx: e.globalData.isIpx,
        isLink: !0,
        currentTab: 0,
        raceId: "",
        footerData: {
            canJoin: !1,
            hasJoinActivity: !1,
            status: "ABNORMAL"
        }
    },
    onLoad: function(t) {
        var e = "";
        t.raceId ? e = t.raceId : t.q && (e = decodeURIComponent(t.q).split("raceId=")[1].trim()), 
        e = e.trim(), this.setData({
            raceId: e
        });
    },
    onShow: function() {
        this.initPageLogin();
    },
    onHide: function() {
        this.setData({
            isLink: !0
        });
    },
    onShareAppMessage: function(t) {
        return this.selectComponent("#hnRaceDetail").onShareAppMessage(t);
    },
    initPageLogin: function(t) {
        var e = this.data.currentTab;
        switch (void 0 === e ? 0 : e) {
          case 0:
            this.hnRaceDetail = this.selectComponent("#hnRaceDetail"), this.hnRaceDetail.initPageLogin();
            break;

          case 1:
            this.hnTeamMemberList = this.selectComponent("#hnTeamMemberList"), this.hnTeamMemberList.initPageLogin();
            break;

          case 2:
            this.hnRaceResult = this.selectComponent("#hnRaceResult"), this.hnRaceResult.initPageLogin();
        }
    },
    swichNav: function(e) {
        var i = this, a = this.data.currentTab, n = e.target.dataset.current;
        n !== a && t.initPageLogin().then(function(t) {
            i.setData({
                currentTab: n
            }, function() {
                i.pageRefresh();
            });
        });
    },
    pageRefresh: function() {
        wx.showLoading({
            title: "加载中"
        }), this.initPageLogin();
    },
    onReachBottom: function() {
        var t = this, e = t.data.currentTab, i = void 0 === e ? 0 : e;
        1 == i ? t.hnTeamMemberList.onReachBottom() : 2 == i && t.hnRaceResult.onReachBottom();
    },
    onPullDownRefresh: function() {
        var t = this, e = t.data.currentTab, i = void 0 === e ? 0 : e;
        0 === i ? t.hnRaceDetail.initPageLogin() : 1 == i ? t.hnTeamMemberList.getTeamMemberList() : 2 == i && t.initPageLogin(), 
        wx.stopPullDownRefresh();
    }
});