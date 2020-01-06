function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

function e(t) {
    if (Array.isArray(t)) {
        for (var e = 0, a = Array(t.length); e < t.length; e++) a[e] = t[e];
        return a;
    }
    return Array.from(t);
}

var a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, r = Object.assign || function(t) {
    for (var e = 1; e < arguments.length; e++) {
        var a = arguments[e];
        for (var r in a) Object.prototype.hasOwnProperty.call(a, r) && (t[r] = a[r]);
    }
    return t;
}, n = (getApp(), require("../../utils/util.js")), i = require("../../config.js");

Component({
    properties: {
        sectionList: {
            type: Array,
            value: []
        },
        entry: String
    },
    data: {
        formData: {},
        MAX_IMAGE_COUNT: 9,
        showAddImageBtn: !0,
        defaultValue: 0,
        showFullSizeImg: !1,
        currentSelectImg: ""
    },
    attached: function() {
        this.initPageLogin();
    },
    methods: {
        initPageLogin: function() {
            var t = this, e = this;
            n.initPageLogin().then(function(a) {
                var r = a;
                r && "" !== r && (e.setData({
                    authedUserId: r
                }), t.initFormData());
            });
        },
        initFormData: function() {
            var t = this, e = {}, a = this.properties;
            a.defaultRoleType;
            a.sectionList.forEach(function(a) {
                e[a.name] = a.value, "select" === a.type && a.options.forEach(function(e, r) {
                    e.value === a.value && t.setData({
                        defaultValue: r
                    });
                });
            }), this.setData({
                formData: e
            });
        },
        showFullImage: function(t) {
            this.setData({
                showFullSizeImg: !0,
                currentSelectImg: t.currentTarget.dataset.src
            });
        },
        hideFullSizeImg: function() {
            this.setData({
                showFullSizeImg: !1,
                currentSelectImg: ""
            });
        },
        bindPickerChange: function(t) {
            var e = t.detail.value, a = t.currentTarget.dataset, n = (a.name, a.options), i = Number(e);
            this.setData({
                formData: r({}, this.data.formData, {
                    roleType: n[i].value
                }),
                defaultValue: i
            }), this.triggerEvent("onPickerChange", {
                value: n[i].value
            });
        },
        testid: function(t) {
            var e = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
            if (!t) return {
                status: 0,
                msg: "请输入身份证"
            };
            if (!e.test(t)) return {
                status: 0,
                msg: "身份证格式错误"
            };
            var a = t.substr(6, 4), r = t.substr(10, 2), n = t.substr(12, 2), i = Date.parse(r + "-" + n + "-" + a), s = Date.parse(new Date()), o = new Date(a, r, 0).getDate();
            if (i > s || n > o) return {
                status: 0,
                msg: "出生日期不合规"
            };
            for (var u = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2), c = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"), l = t.split(""), m = 0, f = 0; f < 17; f++) m += parseInt(l[f]) * parseInt(u[f]);
            return l[17].toUpperCase() != c[m % 11].toUpperCase() ? {
                status: 0,
                msg: "身份证校验码错误"
            } : {
                1: "M",
                2: "W"
            }[t.slice(14, 17) % 2 ? "1" : "2"] !== this.data.formData.sex ? {
                status: 0,
                msg: "选择的性别和身份证性别不匹配"
            } : {
                status: 1,
                msg: "校验通过"
            };
        },
        validateForm: function() {
            var t = this, a = this.data.formData;
            return new Promise(function(r, n) {
                var i = [].concat(e(t.properties.sectionList)), s = t.testid(a.identityCardNumber);
                "team" === t.properties.entry ? "" === a.teamName ? n("请输入队名") : "" === a.creatorName ? n("请输入姓名") : "" === a.creatorCell ? n("请输入手机号") : /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(a.creatorCell) || n("手机号格式错误") : "enter" === t.properties.entry && ("" === a.name ? n("请输入姓名") : "" === a.sex ? n("请选择性别") : 0 === s.status && n(s.msg)), 
                i.splice("SINGLE_ENTER" === wx.getStorageSync("enterType") ? 3 : 4).forEach(function(t) {
                    "input" === t.type && "" === a[t.name] ? n("请输入" + t.label) : "input" === t.type && /手机号/.test(t.label) ? /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(a[t.name]) || n("手机号格式错误") : "input" === t.type && /微信号/.test(t.label) ? /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/.test(a[t.name]) || n("微信号格式错误") : "image" === t.type && 0 === a[t.name].length && n("请选择" + t.label);
                }), r(a);
            });
        },
        bindFormSubmit: function(t) {
            var e = this;
            this.validateForm().then(function(t) {
                e.triggerEvent("formSubmit", {
                    formData: t
                });
            }).catch(function(t) {
                wx.showToast({
                    title: t,
                    icon: "none",
                    duration: 2e3
                });
            });
        },
        selectSex: function(t) {
            var e = t.currentTarget.dataset.sex;
            this.setData({
                formData: r({}, this.data.formData, {
                    sex: e
                })
            });
        },
        onInputType: function(e) {
            var a = e.currentTarget.dataset.name, n = e.detail.value;
            this.setData({
                formData: r({}, this.data.formData, t({}, a, n))
            });
        },
        chooseImage: function(e) {
            var s = this, o = this.data.formData, u = e.currentTarget.dataset.name;
            wx.chooseImage({
                count: 9 - o[u].length,
                sizeType: [ "original", "compressed" ],
                sourceType: [ "album", "camera" ],
                success: function(e) {
                    e.tempFilePaths;
                    var c = e.tempFiles, l = [];
                    if (o[u].length + c.length > 9) wx.showToast({
                        title: "最多上传9张图片",
                        duration: 1e3
                    }); else {
                        for (var m in c) {
                            var f = function(t) {
                                var e = c[t];
                                if (e.size > 4194304) return wx.showToast({
                                    title: "单张图片最大为4M",
                                    duration: 1e3
                                }), {
                                    v: void 0
                                };
                                l[t] = new Promise(function(t, a) {
                                    wx.uploadFile({
                                        url: i.API_HOST + "service.json",
                                        filePath: e.path,
                                        name: "file",
                                        header: {
                                            "content-type": "multipart/form-data"
                                        },
                                        formData: n.MD5({
                                            service: "HN_RACE_IMAGE_UPLOAD",
                                            authedUserId: s.data.authedUserId
                                        }),
                                        success: function(n) {
                                            var i = JSON.parse(n.data).response;
                                            i.success ? t(r({}, i, {
                                                src: e.path
                                            })) : a(i);
                                        }
                                    });
                                });
                            }(m);
                            if ("object" === (void 0 === f ? "undefined" : a(f))) return f.v;
                        }
                        Promise.all(l).then(function(e) {
                            s.setData({
                                formData: r({}, o, t({}, u, o[u].concat(e.map(function(t) {
                                    return {
                                        imageSrc: t.src,
                                        imageId: t.fileNames[0]
                                    };
                                }))))
                            });
                        }).catch(function(t) {
                            n.showToast(n.showErrorResult(t));
                        });
                    }
                }
            });
        },
        deleteImage: function(e) {
            var a = this.data.formData, n = e.currentTarget.dataset, i = n.imageid, s = n.name;
            this.setData({
                formData: r({}, a, t({}, s, a[s].filter(function(t) {
                    return t.imageId !== i;
                })))
            });
        }
    }
});