var t = require("../../utils/util.js"), e = require("../../config.js"), a = require("../../utils/qqmap-wx-jssdk.js"), o = getApp(), i = void 0;

Page({
    data: {
        markers: [],
        scale: 14,
        northeast: {},
        southwest: {}
    },
    onLoad: function(t) {
        var e = this;
        e.setData({
            isIpx: o.globalData.isIpx
        }), e.initPageLogin();
    },
    initPageLogin: function(e) {
        var a = this;
        t.initPageLogin(e).then(function(t) {
            a.setData({
                authedUserId: t
            }), a.selectComponent("#authorize").getAuthorizeLocation(a.getLocationName), a.initPageData(), 
            a.setData({
                hasMarks: !0
            });
        });
    },
    initPageData: function() {
        var t = this;
        t.data.authedUserId;
        (i = wx.createMapContext("map")).getRegion({
            success: function(e) {
                var a = e.northeast, o = e.southwest, i = {
                    westSouthLon: o.longitude,
                    westSouthLat: o.latitude,
                    eastNorthLon: a.longitude,
                    eastNorthLat: a.latitude
                };
                t.getPageData(i);
            }
        });
    },
    getPageData: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, a = this, i = a.data, n = i.authedUserId, s = i.longitude, d = void 0 === s ? o.globalData.longitude : s, r = i.latitude, u = void 0 === r ? o.globalData.latitude : r;
        e.centerLon || (e.centerLon = d, e.centerLat = u), Object.assign(e, {
            service: "USER_FOOT_MARK_DATA_QUERY",
            authedUserId: n
        }), wx.showNavigationBarLoading(), t.AJAX("service.json", t.MD5(e), function(o) {
            if (o.data) {
                var i = o.data.response;
                if (i.success) {
                    var n = i.locationAndCount, s = void 0 === n ? {} : n, d = i.multiLocationGatherList, r = void 0 === d ? [] : d, u = [];
                    Object.keys(s).map(function(t, e) {
                        var a = t.split("@")[0], o = t.split("@")[1], i = {}, n = s[t];
                        n = n > 99 ? "99+" : n + "", i = r.indexOf(t) > -1 ? {
                            iconPath: "/static/transparent-bg.png",
                            address: "",
                            id: e,
                            latitude: o,
                            longitude: a,
                            width: 57,
                            height: 46,
                            label: {
                                content: n,
                                color: "#fff",
                                fontSize: 14,
                                bgColor: "#2DBC83",
                                borderRadius: 30,
                                borderWidth: 2,
                                borderColor: "#fff",
                                padding: 4,
                                x: -15,
                                y: -35,
                                anchorX: -15,
                                anchorY: -35
                            }
                        } : {
                            iconPath: "/static/map-mark.png",
                            address: "",
                            id: e,
                            latitude: o,
                            longitude: a,
                            width: 40,
                            height: 40,
                            label: {
                                content: n,
                                color: "#fff",
                                bgColor: "#2DBC83",
                                borderRadius: 30,
                                borderWidth: 2,
                                borderColor: "#fff",
                                padding: 2,
                                x: 0,
                                y: -45,
                                anchorX: 0,
                                anchorY: -45
                            }
                        }, u.push(i);
                    }), a.data.longitude === e.centerLon && a.data.latitude === e.centerLat && a.setData({
                        markers: u,
                        hasMarks: !0
                    });
                } else t.showToast(t.showErrorResult(i));
            } else t.showToast(o.errMsg);
            wx.hideNavigationBarLoading();
        });
    },
    getLocationName: function(t) {
        var i = this, n = new a({
            key: e.QQmapsdkKey
        }), s = t.latitude, d = t.longitude;
        t || (s = o.globalData.latitude, d = o.globalData.longitude), n.reverseGeocoder({
            location: {
                latitude: s,
                longitude: d
            },
            success: function(t) {
                if (t) {
                    (t = t && t.result).formatted_addresses;
                    i.setData({
                        longitude: t.location.lng,
                        latitude: t.location.lat
                    });
                }
            }
        });
    },
    getAddressName: function(t) {
        var o = this, i = o.data.markers, n = new a({
            key: e.QQmapsdkKey
        }), s = t.latitude, d = t.longitude, r = t.e;
        n.reverseGeocoder({
            location: {
                latitude: s,
                longitude: d
            },
            success: function(t) {
                if (t) {
                    var e = (t = t && t.result).formatted_addresses;
                    i.map(function(t) {
                        t.id === r.markerId && 40 === t.width && (t.callout = {
                            content: " " + e.recommend + " \n 活动次数  " + t.label.content + "次",
                            color: "#333",
                            display: "BYCLICK",
                            padding: 10,
                            bgColor: "#fff",
                            borderWidth: 2,
                            borderRadius: 8
                        });
                    }), setTimeout(function() {
                        o.setData({
                            markers: i
                        });
                    }, 200);
                }
            }
        });
    },
    markertap: function(t) {
        var e = this;
        e.data.markers.map(function(a) {
            var o = a.id, i = a.latitude, n = a.longitude;
            o === t.markerId && e.getAddressName({
                latitude: i,
                longitude: n,
                e: t
            });
        });
    },
    regionchange: function(t) {
        var e = this;
        "end" === t.type && e.getRegion();
    },
    getRegion: function() {
        var t = this;
        (i = wx.createMapContext("map")).getRegion({
            success: function(e) {
                var a = e.northeast, o = e.southwest;
                if (a) {
                    var n = {
                        westSouthLon: o.longitude,
                        westSouthLat: o.latitude,
                        eastNorthLon: a.longitude,
                        eastNorthLat: a.latitude
                    };
                    i.getCenterLocation({
                        success: function(e) {
                            var i = e.longitude, s = e.latitude;
                            i && (n.centerLon = i, n.centerLat = s, i === t.data.longitude && s === t.data.latitude && a.longitude === t.data.northeast.longitude && a.latitude === t.data.northeast.latitude && o.latitude === t.data.southwest.latitude && o.longitude === t.data.southwest.longitude || (t.getPageData(n), 
                            t.setData({
                                longitude: i,
                                latitude: s,
                                northeast: a,
                                southwest: o
                            })));
                        }
                    });
                }
            }
        });
    }
});