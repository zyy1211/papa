var t = require("../utils/util.js"), e = getApp();

Component({
    properties: {
        pageType: {
            type: String,
            value: ""
        },
        pageId: {
            type: String,
            value: ""
        },
        currentTab: {
            type: Number,
            value: 0
        }
    },
    data: {
        isIpx: e.globalData.isIpx,
        showToIndex: !1,
        canOpenApp: !1
    },
    methods: {
        initScene: function() {
            var t = this, a = t.data.pageType, p = void 0 === a ? "" : a, n = getCurrentPages(), o = n[n.length - 1], s = e.globalData.scene;
            1007 !== (s = parseInt(s)) && 1008 !== s && 1011 !== s && 1012 !== s && 1013 !== s && 1014 !== s && 1058 !== s && 1036 !== s || "activity" === p || t.setData({
                showToIndex: !0
            }), 1036 === s || 1069 === s ? (t.setData({
                showAppButton: !0
            }), o.setData({
                "footerData.showAppButton": !0
            }), wx.setStorage({
                key: "canOpenApp",
                data: !0
            })) : 1038 === s || 1089 === s || 1090 === s ? wx.getStorageSync("canOpenApp") && (t.setData({
                showAppButton: !0
            }), o.setData({
                "footerData.showAppButton": !0
            })) : wx.setStorage({
                key: "canOpenApp",
                data: !1
            });
        },
        redirectToIndex: function(a) {
            t.requestEmpty(a), wx.switchTab({
                url: e.globalData.indexUrl
            });
        },
        closeApp: function(e) {
            var a = this, p = getCurrentPages(), n = p[p.length - 1];
            a.setData({
                showAppButton: !1
            }), n.setData({
                "footerData.showAppButton": !1
            }), t.requestEmpty(e);
        },
        launchAppError: function() {
            t.downloadApp.downloadApp({
                content: "未找到相关应用或应用异常，请重新下载安装（下载地址已复制到剪切板，用浏览器打开即可下载）"
            });
        }
    }
});