var e = require("../../utils/util.js");

Component({
    properties: {
        raceInfo: {
            type: Object,
            value: {}
        }
    },
    data: {
        authedUserId: wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId
    },
    methods: {
        navigate: function(t) {
            var r = getCurrentPages(), a = r[r.length - 1], s = a.data.isLink, u = void 0 === s || s, n = this.data, o = n.authedUserId, i = void 0 === o ? "" : o, d = n.raceInfo;
            i = i || wx.getStorageSync("userInfo").user && wx.getStorageSync("userInfo").user.userId, 
            u && (t.detail.e && (t = t.detail.e), a.setData({
                isLink: !1
            }), e.requestEmpty(t, i), wx.navigateTo({
                url: t.currentTarget.dataset.url,
                success: function() {
                    wx.setStorageSync("raceId", d.id);
                }
            }));
        }
    }
});