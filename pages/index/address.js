var t = require("../../utils/util.js"), a = require("../../config.js"), e = require("../../utils/qqmap-wx-jssdk.js"), s = getApp(), i = void 0;

Page({
    data: {
        cityName: "选择城市",
        searchAddress: "",
        addressDescribe: "",
        locationDatalist: [],
        searchDatalist: [],
        toBack: !1,
        isBack: !1,
        prevDate: 0,
        searchBool: !0
    },
    navigate: function(a) {
        t.requestEmpty(a), wx.navigateTo({
            url: a.currentTarget.dataset.url
        });
    },
    onLoad: function(t) {
        var o = this;
        i = new e({
            key: a.QQmapsdkKey
        }), o.setData({
            addressDescribe: t.address || "",
            isIpx: s.globalData.isIpx
        });
    },
    onShow: function() {
        var t = this;
        t.data.isBack ? t.setData({
            isBack: !1
        }) : t.selectComponent("#authorize").getAuthorizeLocation(t.getLocationName), t.setData({
            toBack: !1
        });
    },
    getFixedLocation: function(a) {
        var e = this;
        t.requestEmpty(a), e.selectComponent("#authorize").getAuthorizeLocation(e.getLocationName), 
        e.setData({
            toBack: !0,
            addressDescribe: "定位中..."
        });
    },
    getLocationName: function(t) {
        var i = this, o = i.data.toBack, n = t.latitude, r = t.longitude;
        t || (n = s.globalData.latitude, r = s.globalData.longitude), new e({
            key: a.QQmapsdkKey
        }).reverseGeocoder({
            location: {
                latitude: n,
                longitude: r
            },
            get_poi: 1,
            success: function(t) {
                if (t) {
                    var a = t = t && t.result, e = (a.formatted_addresses, a.address_component), s = a.pois;
                    if (i.setData({
                        lon: t.location.lng,
                        lat: t.location.lat,
                        cityName: e.city,
                        locationDatalist: s
                    }), o) {
                        var n = getCurrentPages(), r = n[n.length - 2];
                        r && r.setData({
                            isAddressBack: !1
                        }), wx.navigateBack({
                            delta: 1
                        });
                    }
                }
            }
        });
    },
    bindAddressInput: function(t) {
        var a = this, e = (a.data.prevDate, t.detail.value), s = new Date(), i = a.data, o = i.searchBool, n = i.showDelete, r = void 0 !== n && n;
        "" === e ? (a.setData({
            searchDatalist: []
        }), r = !1) : (setTimeout(function() {
            o && (a.getSearchData(), a.setData({
                searchBool: !0
            }));
        }, 1200), r = !0), a.setData({
            searchAddress: e,
            showDelete: r,
            prevDate: s,
            searchBool: !1
        });
    },
    getSearchData: function() {
        var t = this, a = t.data, e = a.lon, s = a.lat, o = a.cityName, n = a.searchAddress, r = [];
        if ("" === n) return t.setData({
            searchDatalist: []
        }), !1;
        i.getSuggestion({
            keyword: n,
            region: o,
            success: function(a) {
                console.log(a)
                var i = a.data;
                i.map(function(a, i) {
                    var o = a.title, n = a.address, c = a.location, d = t.getFlatternDistance(s, e, c.lat, c.lng);
                    d = d > 1e3 ? (d / 1e3).toFixed(2) + "km" : d.toFixed(2) + "m", r.push({
                        title: o,
                        address: n,
                        location: c,
                        distance: d
                    });
                }), t.setData({
                    searchDatalist: r,
                    searchDatalistEmpty: 0 === i.length
                });
            },
            fail: function(t) {
                console.log(t);
            }
        });
    },
    getFlatternDistance: function(t, a, e, s) {
        var i = this.getRad((t + e) / 2), o = this.getRad((t - e) / 2), n = this.getRad((a - s) / 2), r = Math.sin(o), c = Math.sin(n), d = Math.sin(i), l = void 0, u = void 0, h = void 0, g = void 0, D = void 0, v = void 0, f = void 0;
        return r *= r, c *= c, d *= d, l = r * (1 - c) + (1 - d) * c, u = (1 - r) * (1 - c) + d * c, 
        h = Math.atan(Math.sqrt(l / u)), g = Math.sqrt(l * u) / h, D = 2 * h * 6378137, 
        v = (3 * g - 1) / 2 / u, f = (3 * g + 1) / 2 / l, D * (1 + 1 / 298.257 * (v * d * (1 - r) - f * (1 - d) * r));
    },
    getRad: function(t) {
        return t * Math.PI / 180;
    },
    chooseLocation: function(t) {
        var a = t.currentTarget.dataset, e = a.location, s = a.title, i = getCurrentPages(), o = i[i.length - 2];
        if (o) {
            var n = {
                lon: e.lng,
                lat: e.lat,
                addressDescribe: s
            };
            wx.setStorage({
                key: "location",
                data: n
            }), o.setData({
                isAddressBack: !0
            }), wx.navigateBack({
                delta: 1
            });
        }
    },
    deleteSearchInput: function() {
        this.setData({
            searchDatalist: [],
            searchAddress: "",
            showDelete: !1
        });
    }
});