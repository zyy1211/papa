function e(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var a, t = require("utils/wetoast.js").WeToast, n = require("utils/ajaxPoll.js").AjaxPoll;

require("utils/util.js");

App({
    WeToast: t,
    AjaxPoll: n,
    onLaunch: function(e) {
        var a = this;
        wx.getSystemInfo({
            success: function(e) {
                e.model.indexOf("iPhone X") > -1 && (a.globalData.isIpx = !0);
            }
        });
        
        var t = wx.getSystemInfoSync().SDKVersion;
        if (t = t.replace(/\./g, ""), parseInt(t) < 164) return wx.showModal({
            title: "提示",
            content: "你的微信版本过低，可能无法使用此小程序的部分功能，请升级到最新微信版本后重试。",
            showCancel: !1
        }), !1;
        if (wx.canIUse("getUpdateManager")) {
            var n = wx.getUpdateManager();
            n.onCheckForUpdate(function(e) {}), n.onUpdateReady(function() {
                wx.showModal({
                    title: "更新提示",
                    content: "新版本已经准备好，是否重启应用？",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && n.applyUpdate();
                    }
                });
            }), n.onUpdateFailed(function() {});
        }
    },
    onShow: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        this.globalData.scene = e.scene || "";
    },
    globalData: (a = {
        userInfo: null,
        userInfoData: null,
        isIpx: !1,
        isUserInfoBack: !1,
        isLogin: !1,
        subjectIsDeleteName: "THE_SUBJECT_BE_DELETED",
        commentIsDeleteName: "THE_COMMENT_BE_DELETED",
        commentReplyIsDeleteName: "THE_COMMENT_REPLY_BE_DELETED",
        needLoginName: "USER_ID_REQUIRED",
        latitude: 30.21231,
        longitude: 120.21269,
        indexUrl: "/pages/index/index",
        userHomePageUrl: "/pages/package-my/homePage?userId=",
        subjectDetailUrl: "/pages/package-subject/subjectDetail?id=",
        activityDetailUrl: "/pages/package-activity/activityDetail?id=",
        raceDetailUrl: "/pages/package-race/raceDetail?id=",
        specialRaceDetailUrl: "/pages/package-specialRace/specialRaceDetail?id=",
        clubDetailUrl: "/pages/package-club/clubDetail?id=",
        commentPageUrl: "/pages/package-subject/comments?id=",
        hnRaceDetailUrl: "/pages/package-hnRace/hnRaceIndex?raceId=",
        userEnter: "/pages/package-hnRace/userEnter",
        teamEnter: "/pages/package-hnRace/teamEnter"
    },
    e(a, "clubDetailUrl", "/pages/package-club/clubDetail?id="),
    e(a, "commentPageUrl", "/pages/package-subject/comments?id="), 
    e(a, "attentionListPageUrl", "/pages/package-my/attentionList?pageType=attention&&userId="), 
    e(a, "fansListPageUrl", "/pages/package-my/attentionList?pageType=fans&&userId="), 
    e(a, "windowHeight", wx.getSystemInfoSync().windowHeight), a)
});