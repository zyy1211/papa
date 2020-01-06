var t = require("../utils/util.js");

getApp();

Component({
    data: {
        timeSpan: 100,
        showAddModal: !1,
        userInfo: wx.getStorageSync("userInfo"),
        userPermisssion: wx.getStorageSync("userPermisssion"),
        dataList: [ {
            pagePath: "/pages/package-activity/activityEvent",
            text: "活动",
            memo: "发布新活动",
            iconPath: "/static/icon-publish-activity.png",
            type: "activity"
        }, {
            pagePath: "/pages/package-activity/activityTemplate",
            text: "历史模板",
            memo: "选择历史活动/赛事模板，快速发布",
            iconPath: "/static/icon-publish-template.png",
            type: "template"
        }, {
            pagePath: "/pages/package-race/raceTemplate",
            text: "积分赛",
            memo: "可选择不同的赛事，发布比赛",
            iconPath: "/static/icon-publish-race.png",
            type: "race"
        }, {
            pagePath: "",
            text: "动态",
            memo: "发布新动态",
            iconPath: "/static/icon-publish-subject.png",
            type: "subject"
        }, {
            pagePath: "",
            text: "赛事",
            memo: "",
            iconPath: "/static/icon-publish-specialRace.png",
            type: "specialRace"
        } ]
    },
    methods: {
        bindShowAddModal: function() {
            var e = this;
            t.initPageLogin().then(function(t) {
                var a = getCurrentPages(), i = a[a.length - 1], s = e, n = s.data, o = n.showAddModal, c = void 0 !== o && o, r = n.timeSpan;
                s.setData({
                    userPermisssion: wx.getStorageSync("userPermisssion")
                }, function() {
                    c ? (s.setData({
                        animation: !1
                    }), setTimeout(function() {
                        s.setData({
                            showAddModal: !1
                        }), i.setData({
                            blur: !1
                        });
                    }, r)) : (s.setData({
                        userInfo: wx.getStorageSync("userInfo"),
                        showAddModal: !0,
                        animation: !0
                    }), i.setData({
                        blur: !0
                    }));
                });
            });
        },
        catchTap: function() {
            return !1;
        },
        navigateToPublish: function(e) {
            var a = this;
            a.setData({
                userPermisssion: wx.getStorageSync("userPermisssion")
            }, function() {
                var i = a.data.userPermisssion, s = i.inWhiteList, n = void 0 !== s && s, o = i.allowCreateRace, c = void 0 !== o && o, r = e.currentTarget.dataset.type, p = void 0 === r ? "" : r, u = !0;
                switch (a.bindShowAddModal(), p) {
                  case "subject":
                    t.downloadApp.openSubject();
                    break;

                  case "specialRace":
                    t.downloadApp.openSpecialRace();
                    break;

                  case "activity":
                    n || (u = !1);
                    break;

                  case "race":
                    c || (u = !1);
                    break;

                  case "template":
                    n && c || (u = !1);
                }
                u ? a.navigate(e) : t.showToast("暂无发布权限，有疑问请联系官方客服");
            });
        },
        navigate: function(t) {
            var e = t.currentTarget.dataset.url;
            if ("" !== (void 0 === e ? "" : e)) {
                var a = {
                    e: t
                };
                this.triggerEvent("navigate", a);
            }
        }
    }
});