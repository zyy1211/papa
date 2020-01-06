var e = require("../../utils/util.js"), a = {
    authedUserId: "",
    raceId: "",
    raceItemId: "",
    hasCreate: !1
};

Page({
    data: {
        footerData: {
            entry: "createTeam"
        }
    },
    onShow: function() {
        a.hasCreate = !1;
    },
    onLoad: function(e) {
        var t = e.raceTeam, i = void 0 === t ? "{}" : t;
        i = JSON.parse(decodeURIComponent(i)), Object.assign(a, e, {
            raceTeam: i
        }), this.initPageLogin(), i.id && wx.setNavigationBarTitle({
            title: "队伍资料"
        });
    },
    initPageLogin: function() {
        var t = this;
        e.initPageLogin().then(function(e) {
            a.authedUserId = e, t.initPageQuery();
        });
    },
    initPageQuery: function() {
        var e = a.raceTeam, t = void 0 === e ? {} : e, i = [ {
            type: "input",
            label: "队伍名称",
            name: "name",
            value: t.name,
            placeholder: "请输入队伍名称",
            inputType: "text",
            validate: {
                max: 15
            },
            canModify: !0
        }, {
            type: "input",
            label: "创建者姓名",
            name: "creatorFixName",
            value: t.creatorFixName,
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
            value: t.creatorCell,
            placeholder: "请输入联系电话",
            inputType: "number",
            validate: {
                max: 11
            },
            canModify: !0
        } ];
        this.setData({
            createFormList: i
        });
    },
    onBtnClick: function() {
        var t = this;
        a.hasCreate || (a.hasCreate = !0, setTimeout(function() {
            a.hasCreate = !1;
        }, 1e3), this.selectComponent("#flexbleForm").validateForm().then(function(e) {
            t.onFormSubmit(e);
        }).catch(function(a) {
            e.showToast(a);
        }));
    },
    onFormSubmit: function(t) {
        var i = a.raceId, r = void 0 === i ? "" : i, n = a.authedUserId, o = void 0 === n ? "" : n, c = a.raceItemId, d = void 0 === c ? "" : c, s = a.raceTeam, u = void 0 === s ? {} : s, m = a.amount, l = void 0 === m ? 0 : m, v = t.name, h = void 0 === v ? "" : v, I = t.creatorFixName, p = void 0 === I ? "" : I, T = t.creatorCell, f = "创建队伍成功", C = {
            service: "SPECIAL_RACE_TEAM_CREATE",
            authedUserId: o,
            name: h,
            creatorFixName: p,
            creatorCell: void 0 === T ? "" : T
        };
        u.id ? (C.teamId = u.id, C.service = "SPECIAL_RACE_TEAM_INFO_MODIFY", f = "修改队伍成功") : (C.raceId = r, 
        C.raceItemId = d), e.request("service.json", e.MD5(C)).then(function(a) {
            e.showToast(f, "success"), u.id ? wx.navigateBack() : setTimeout(function() {
                wx.redirectTo({
                    url: "/pages/package-specialRace/teamDetail?teamId=" + a.id + "&raceItemId=" + d + "&raceId=" + r + "&amount=" + l + "&enterType=TEAM"
                });
            }, 1500);
        });
    }
});