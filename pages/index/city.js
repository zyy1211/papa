var t = require("../../utils/util.js"), e = require("../../config.js"), a = require("../../utils/qqmap-wx-jssdk.js"), i = getApp();

Page({
    data: {
        searchAddress: "",
        cityName: "",
        hotCitylist: [ {
            name: "北京"
        }, {
            name: "杭州"
        }, {
            name: "上海"
        }, {
            name: "南京"
        }, {
            name: "厦门"
        }, {
            name: "广州"
        } ],
        keyWords: [],
        cityList: [],
        searchDataList: [],
        searchDataListEmpty: !1,
        intoView: "A",
        seletedId: "A",
        
        windowWRPX: 375,
        screenWidth: wx.getSystemInfoSync().screenWidth
    },
    onLoad: function(t) {
        var e = this;
        e.initPageData(), e.selectComponent("#authorize").getAuthorizeLocation(e.getLocationName), 
        e.setData({
            cityName: t.cityName || "",
            isIpx: i.globalData.isIpx
        });
    },
    getLocationName: function(t) {
        var s = this, n = s.data.hotCitylist, c = new a({
            key: e.QQmapsdkKey
        }), o = t.latitude, r = t.longitude;
        t || (o = i.globalData.latitude, r = i.globalData.longitude), c.reverseGeocoder({
            location: {
                latitude: o,
                longitude: r
            },
            success: function(t) {
                if (t) {
                    var e = (t = t && t.result).address_component.city || "";
                    n.map(function(t) {
                        e.indexOf(t.name) > -1 ? t.active = !0 : t.active = !1;
                    }), s.setData({
                        cityName: e,
                        hotCitylist: n
                    });
                }
            }
        });
    },
    bindCityInput: function(t) {
        var e = t.detail.value, a = this, i = a.data.cityList, s = !0, n = [], c = !0;
        (void 0 === i ? [] : i).map(function(t) {
            t.data.map(function(t) {
                0 === t.indexOf(e) && (n.push(t), c = !1);
            });
        }), "" === e && (n = [], s = !1), a.setData({
            searchDataList: n,
            searchDataListEmpty: c,
            showDelete: s
        });
    },
    bindscroll: function(t) {
        var e = this, a = e.data, i = a.cityList, s = void 0 === i ? [] : i, n = a.seletedId, c = a.windowWRPX, o = a.screenWidth, r = t.detail.scrollTop, d = 0;
        s.map(function(t) {
            var e = 51 * t.data.length * o / c;
            r >= d + 100 * o / c && (n = t.letter), d += e;
        }), e.setData({
            seletedId: n
        });
    },
    getKeyWord: function(t) {
        this.setData({
            intoView: t.currentTarget.dataset.id,
            seletedId: t.currentTarget.dataset.id
        });
    },
    getCity: function(t) {
        var e = t.currentTarget.dataset.city, a = getCurrentPages(), i = a[a.length - 2];
        i && (i.setData({
            cityName: e,
            isBack: !0
        }), wx.navigateBack({
            delta: 1
        }));
    },
    deleteSearchInput: function() {
        this.setData({
            searchDatalist: [],
            searchAddress: "",
            searchDataListEmpty: !1,
            showDelete: !1
        });
    },
    initPageData: function() {
        var e = this;
        wx.showLoading({
            title: "加载中"
        }), t.request("service.json", t.MD5({
            service: "CITY_QUERY"
        })).then(function(t) {
            var a = t.cityMap, i = [];
            Object.keys(a).map(function(t) {
                i.push({
                    letter: t,
                    data: a[t]
                });
            }), e.setData({
                cityList: i
            });
        }); 
    }
});