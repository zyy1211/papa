var t = require("../utils/util.js");

Component({
    properties: {
        showCityModal: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        addressList: [],
        contains: [ "北京", "上海", "重庆", "天津" ],
        provinceId: "",
        provinceName: "",
        cityId: "",
        cityName: "",
        countyId: "",
        countyName: "",
        showCity: !1,
        showCounty: !1,
        steps: 0
    },
    created: function() {
        this.initDataQuery(0);
    },
    methods: {
        initData: function() {
            this.setData({
                provinceId: "",
                provinceName: "",
                cityId: "",
                cityName: "",
                countyId: "",
                countyName: "",
                showCity: !1,
                showCounty: !1,
                steps: 0,
                dataList: this.data.provinceList
            });
        },
        initDataQuery: function(i) {
            var a = this, e = [];
            t.request("service.json", t.MD5({
                service: "ADDRESS_QUERY",
                parentId: i
            })).then(function(t) {
                var s = t.addressMap, n = void 0 === s ? {} : s;
                Object.keys(n).map(function(t) {
                    n[t].map(function(i, a) {
                        0 === a && (i.letterName = t), e.push(i);
                    });
                }), a.setData({
                    dataList: e
                }), 0 === i && a.setData({
                    provinceList: e
                });
            });
        },
        changeCity: function(i) {
            var a = this, e = a.data, s = e.steps, n = void 0 === s ? 0 : s, o = e.contains, d = e.provinceName, c = void 0 === d ? "" : d, r = (e.cityName, 
            i.currentTarget.dataset), y = void 0 === r ? {} : r, u = y.id, v = void 0 === u ? "" : u, p = y.name, h = void 0 === p ? "" : p;
            t.requestEmpty(i), 0 === n ? (a.setData({
                provinceId: v,
                provinceName: h,
                cityId: "",
                cityName: "请选择城市",
                showCity: !0,
                showCounty: !1,
                steps: 1
            }), a.initDataQuery(v)) : 1 === n ? (a.setData({
                cityId: v,
                cityName: h,
                countyId: "",
                countyName: "请选择城市"
            }), -1 !== o.indexOf(c) ? (a.setData({
                showCounty: !0,
                steps: 2
            }), a.initDataQuery(v)) : a.doCityModal(c, h, v)) : 2 === n && (a.setData({
                countyId: v,
                countyName: h
            }), a.doCityModal(c, h, v));
        },
        initProvince: function() {
            this.setData({
                dataList: this.data.provinceList,
                steps: 0
            });
        },
        initCity: function() {
            var t = this, i = t.data.provinceId, a = void 0 === i ? "" : i;
            t.initDataQuery(a), t.setData({
                steps: 1
            });
        },
        initCounty: function() {
            var t = this, i = t.data.cityId, a = void 0 === i ? "" : i;
            t.initDataQuery(a), t.setData({
                steps: 2
            });
        },
        hideCityModal: function(i) {
            t.requestEmpty(i), this.triggerEvent("hideCityModal");
        },
        doCityModal: function(t, i, a) {
            var e = {
                address: t + " " + i,
                addressId: a
            };
            this.triggerEvent("hideCityModal"), this.triggerEvent("doCityModal", e);
        }
    }
});