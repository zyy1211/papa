function e(e) {
    if (Array.isArray(e)) {
        for (var t = 0, a = Array(e.length); t < e.length; t++) a[t] = e[t];
        return a;
    }
    return Array.from(e);
}

var t = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var a = arguments[t];
        for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r]);
    }
    return e;
}, a = require("../../utils/util.js"), r = getApp();

Component({
    properties: {
        raceId: {
            type: String,
            default: ""
        }
    },
    data: {
        isIpx: r.globalData.isIpx,
        raceTopInfo: "",
        imageSrc: "",
        raceInfo: {
            raceId: "",
            hasCreateTeam: !1,
            enterType: "",
            groupType: "",
            raceTitle: "",
            enterAmount: 0,
            totalAmount: 0,
            address: "",
            addressDescribe: "",
            registerDate: "",
            raceDate: "",
            tags: [],
            creatorName: "",
            creatorCell: "",
            creatorWeixinNo: "",
            commissionerLogoUrl: "",
            contactName: "",
            raceDetail: {
                type: "",
                content: []
            },
            haveTeamRoleCodes: []
        },
        footerData: {
            btnText: "报名",
            hasJoinActivity: !1,
            status: "",
            canJoin: !1
        },
        isShowMore: !1,
        allSubjects: [],
        registerSubjects: []
    },
    methods: {
        initPageLogin: function() {
            var e = this;
            e.setData({
                authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || ""
            }), e.selectComponent("#hnRaceFooter").initScene(), e.initData(), wx.setStorageSync("raceId", this.properties.raceId);
        },
        getPhotosAlbum: function(e) {
            var t = this;
            t.selectComponent("#authorize").getPhotosAlbum(function(e) {
                t.selectComponent("#createQrCode").hideCanvasContainer();
            }, e.detail.e);
        },
        bindCreateQrcode: function() {
            this.selectComponent("#createQrCode").createQrCode();
        },
        onShareAppMessage: function(e) {
            return this.selectComponent("#createQrCode").onShareAppMessage(e);
        },
        initRaceDetail: function(e) {
            var a = e.describeData, r = void 0 === a ? [] : a, n = e.describeDataMap, i = e.raceDescribe, o = e.titlePictureUrl;
            i ? this.setData({
                raceInfo: t({}, this.data.raceInfo, {
                    raceDetail: {
                        type: "TEXT",
                        content: [ i ]
                    }
                })
            }) : r.length ? this.setData({
                raceInfo: t({}, this.data.raceInfo, {
                    raceDetail: {
                        type: "IMAGE",
                        content: r.map(function(e) {
                            return n[e.id];
                        })
                    }
                })
            }) : this.setData({
                raceInfo: t({}, this.data.raceInfo, {
                    raceDetail: {
                        type: "",
                        content: []
                    }
                })
            }), this.setData({
                imageSrc: o
            }), this.selectComponent("#createQrCode").initPageImage({
                imageUrl: o,
                shareImageUrl: o + "&areaName=SHARE_COVER"
            });
        },
        initBaseRaceInfo: function(e) {
            var r = e.race, n = void 0 === r ? {} : r, i = e.hasCreateTeam, o = e.raceTeamId, s = n.allowPlayerInTwoMatcher, c = n.enterType, l = n.groupType, u = n.name, d = n.raceLabel, h = void 0 === d ? [] : d, g = n.address, m = n.addressDescribe, p = n.gmtEnterStart, f = n.gmtEnterEnd, I = n.gmtStart, S = n.gmtEnd, v = n.creatorName, T = n.creatorCell, D = n.creatorWeixinNo, y = n.haveTeamRoleCodes, C = void 0 === y ? [] : y;
            return wx.setStorageSync("allowPlayerInTwoMatcher", s), wx.setStorageSync("roleTypes", C.join(",")), 
            wx.setStorageSync("enterType", c.name), wx.setStorageSync("groupType", l.name), 
            wx.setStorageSync("enterRange", a.date.getTimeInterval(p, f)), m = m.slice(6, m.length), 
            t({}, this.data.raceInfo, {
                raceId: this.properties.raceId,
                hasCreateTeam: i,
                enterType: c.name,
                groupType: l.name,
                raceTitle: u,
                tags: h,
                address: g,
                addressDescribe: m,
                registerDate: a.date.getTimeInterval(p, f),
                raceDate: a.date.getTimeInterval(I, S),
                creatorName: v,
                creatorCell: T,
                creatorWeixinNo: D,
                raceTeamId: o,
                haveTeamRoleCodes: C
            });
        },
        formatBirthDate: function(e) {
            var t = "";
            return e.gmtLatestBirth && e.gmtEarliestBirth ? t = e.gmtEarliestBirth.split(" ")[0].replace(/-/g, "/") + "-" + e.gmtLatestBirth.split(" ")[0].replace(/-/g, "/") : e.gmtEarliestBirth ? t = e.gmtEarliestBirth.split(" ")[0].replace(/-/g, "/") + "后出生" : e.gmtLatestBirth && (t = e.gmtLatestBirth.split(" ")[0].replace(/-/g, "/") + "前出生"), 
            t;
        },
        initSingleGroup: function(e) {
            var a = e.raceGroups, r = void 0 === a ? [] : a, n = e.enterCount, i = void 0 === n ? 0 : n, o = r[0], s = o.enterNumber, c = {
                U: "性别不限",
                M: "仅男性",
                W: "仅女性"
            }[o.sexLimit.name] + ",出生日期" + (this.formatBirthDate(r[0]) ? this.formatBirthDate(r[0]) : "不限");
            this.setData({
                raceTopInfo: c,
                raceInfo: t({}, this.data.raceInfo, this.initBaseRaceInfo(e), {
                    enterAmount: i,
                    totalAmount: s
                })
            });
        },
        initMultiGroup: function(e) {
            var a = this, r = e.raceGroups, n = void 0 === r ? [] : r, i = e.groupEnterCountMap, o = void 0 === i ? {} : i;
            this.setData({
                raceInfo: t({}, this.data.raceInfo, this.initBaseRaceInfo(e)),
                allSubjects: n.map(function(e) {
                    return {
                        canSelect: !1,
                        name: e.name,
                        ageRequirement: a.formatBirthDate(e),
                        registered: o[e.id] ? o[e.id] : 0,
                        total: e.enterNumber,
                        sexRequirement: e.sexLimit.message,
                        rejected: !1,
                        canRemove: !1
                    };
                })
            });
        },
        initFooterData: function(e) {
            var t = e.race, a = t.gmtEnterStart, r = t.gmtEnterEnd, n = t.status, i = e.enterFull, o = e.hasEnter, s = e.canEnter, c = e.hasReject, l = i ? "报名已满额" : "报名", u = {
                hasJoinActivity: !1,
                status: "",
                canJoin: !1
            }, d = new Date(a.replace(/-/g, "/")).getTime(), h = new Date(r.replace(/-/g, "/")).getTime(), g = new Date().getTime();
            g < d ? l = "报名未开始" : g > h ? l = "报名已结束" : "CANCEL" === n.name && (l = "赛事已取消"), 
            u = {
                btnText: l,
                hasJoinActivity: o,
                status: c ? "ABNORMAL" : "NORMAL",
                canJoin: s
            }, this.setData({
                footerData: u
            });
        },
        initData: function() {
            var e = this, t = this.data.authedUserId, r = {
                service: "HN_RACE_DETAIL_QUERY",
                authedUserId: t = t || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId || "",
                raceId: this.properties.raceId
            };
            a.request("service.json", a.MD5(r)).then(function(t) {
                var a = t.race, r = void 0 === a ? {} : a, n = t.raceGroups, i = void 0 === n ? [ {} ] : n, o = r.groupType;
                e.initRaceDetail(t), e.initFooterData(t), "SINGLE_GROUP" === o.name ? (e.initSingleGroup(t), 
                wx.setStorageSync("raceGroups", JSON.stringify(i))) : "MULTIPART_GROUP" === o.name && (e.initMultiGroup(t), 
                e.initSubjects(), wx.setStorageSync("raceGroups", JSON.stringify([])));
            });
        },
        openMap: function() {
            var e = this.data.raceInfo.address.split("@");
            wx.openLocation({
                latitude: parseFloat(e[0]),
                longitude: parseFloat(e[1])
            });
        },
        makePhoneCall: function() {
            wx.makePhoneCall({
                phoneNumber: this.data.raceInfo.creatorCell
            });
        },
        copyToClipBoard: function() {
            wx.setClipboardData({
                data: this.data.raceInfo.creatorWeixinNo,
                success: function() {
                    wx.showModal({
                        title: "提示",
                        content: "微信号已复制到剪切板",
                        showCancel: !1,
                        confirmText: "知道了"
                    });
                }
            });
        },
        initSubjects: function() {
            var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], a = this.data.allSubjects;
            if (t) this.setData({
                isShowMore: !0,
                registerSubjects: [].concat(e(a))
            }); else {
                var r = [].concat(e(a));
                r.splice(2), this.setData({
                    isShowMore: !1,
                    registerSubjects: r
                });
            }
        },
        toggleShowMore: function() {
            var e = this.data.isShowMore;
            this.initSubjects(!e);
        },
        navigate: function() {
            var e = this;
            a.initPageLogin().then(function(t) {
                if (e.setData({
                    authedUserId: t
                }), e.data.footerData.canJoin || e.data.footerData.hasJoinActivity) {
                    var a = e.data.raceInfo.enterType, n = e.data.footerData.hasJoinActivity ? "modify" : "create", i = void 0;
                    "SINGLE_ENTER" === a ? i = r.globalData.userEnter + "?scene=" + n : "TEAM_ENTER" === a && (e.data.raceInfo.hasCreateTeam ? i = "/pages/package-hnRace/teamDetail?scene=" + n + "&raceTeamId=" + e.data.raceInfo.raceTeamId : wx.showModal({
                        title: "创建队伍",
                        content: "您还没有自己的队伍，请先创建队伍。拥有队伍后，在赛事详情页再次点击报名按钮会跳转至报名详情页。",
                        confirmText: "创建",
                        success: function(e) {
                            e.confirm && wx.navigateTo({
                                url: "/pages/package-hnRace/createTeam"
                            });
                        }
                    })), i && wx.navigateTo({
                        url: i
                    });
                }
            });
        }
    }
});