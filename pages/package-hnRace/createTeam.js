var e = require("../../utils/util.js");

Page({
    data: {
        createFormList: [ {
            type: "input",
            label: "队伍名称",
            name: "teamName",
            value: "",
            placeholder: "请输入队伍名称",
            inputType: "text",
            validate: {
                max: 15
            },
            canModify: !0
        }, {
            type: "input",
            label: "创建者姓名",
            name: "creatorName",
            value: "",
            placeholder: "请输入创建者姓名",
            inputType: "text",
            validate: {
                max: 15
            },
            canModify: !0
        }, {
            type: "input",
            label: "联系电话",
            name: "creatorCell",
            value: "",
            placeholder: "请输入联系电话",
            inputType: "number",
            validate: {
                max: 11
            },
            canModify: !0
        } ],
        hasCreated: !1,
        footerData: {
            entry: "createTeam"
        }
    },
    onShow: function() {
        this.data.hasCreated && wx.navigateBack();
    },
    onLoad: function() {
        this.initPageLogin();
    },
    onUnload: function() {
        var e = getCurrentPages();
        e[e.length - 2].initPageLogin();
    },
    onHide: function() {
        this.setData({
            hasCreated: !1
        });
    },
    initPageLogin: function() {
        var a = this;
        e.initPageLogin().then(function(e) {
            var t = e;
            t && "" !== t && a.setData({
                authedUserId: t
            });
        });
    },
    onBtnClick: function() {
        this.selectComponent("#flexbleForm").bindFormSubmit();
    },
    onFormSubmit: function(a) {
        e.request("service.json", e.MD5({
            service: "HN_RACE_TEAM_CREATE",
            name: a.detail.formData.teamName,
            creatorName: a.detail.formData.creatorName,
            creatorCell: a.detail.formData.creatorCell,
            raceId: wx.getStorageSync("raceId"),
            authedUserId: this.data.authedUserId
        })).then(function(e) {
            var a = getCurrentPages();
            a[a.length - 2].initPageLogin(), wx.showToast({
                title: "创建队伍成功",
                icon: "none",
                duration: 1e3
            }), setTimeout(function() {
                wx.navigateTo({
                    url: "/pages/package-hnRace/teamDetail?raceTeamId=" + e.teamId + "&scene=createTeam"
                });
            }, 1500);
        });
    }
});