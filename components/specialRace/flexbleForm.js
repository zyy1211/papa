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
}, n = (getApp(), require("../../utils/util.js")), i = require("../../utils/validator.js"), o = require("../../config.js");

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
                e.setData({
                    authedUserId: a
                }), t.initFormData();
            });
        },
        initFormData: function() {
            var t = this, e = {};
            this.properties.sectionList.forEach(function(a) {
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
        validateForm: function() {
            var t = this, a = this.data.formData;
            return new Promise(function(r, n) {
                var o = [].concat(e(t.properties.sectionList));
                "team" === t.properties.entry ? "" === a.name ? n("请输入队名") : "" === a.creatorFixName ? n("请输入姓名") : "" === a.creatorCell ? n("请输入手机号") : i.cell.test(a.creatorCell) || n("手机号格式错误") : "enter" === t.properties.entry && ("" === a.name ? n("请输入姓名") : "" === a.sex ? n("请选择性别") : "" === a.cell ? n("请输入手机号") : i.cell.test(a.cell) || n("手机号格式错误")), 
                o.splice(3).forEach(function(t) {
                    var e = t.isSystem, r = void 0 !== e && e, o = t.name, s = void 0 === o ? "" : o, u = t.label, c = void 0 === u ? "" : u, l = a[s];
                    "input" === t.type && "" === l ? n("请输入" + c) : r && /年龄/.test(c) ? "" === l && n("请输入" + c) : r && /身份证/.test(c) ? "" === l && n("请输入" + c) : r && /证件/.test(c) ? "" === l ? n("请输入" + c) : i.letterAndNumber.test(l) || n("证件格式错误") : r && /衣服尺码/.test(c) ? "" === l && n("请输入" + c) : "image" === t.type && 0 === l.length && n("请上传" + t.label);
                }), r(a);
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
            var i = this, s = this.data.formData, u = e.currentTarget.dataset.name;
            wx.chooseImage({
                count: 9 - s[u].length,
                sizeType: [ "original", "compressed" ],
                sourceType: [ "album", "camera" ],
                success: function(e) {
                    e.tempFilePaths;
                    var c = e.tempFiles, l = [];
                    if (s[u].length + c.length > 9) n.showToast("最多上传9张图片"); else {
                        for (var f in c) {
                            var m = function(t) {
                                var e = c[t];
                                if (e.size > 4194304) return n.showToast("单张图片最大为4M"), {
                                    v: void 0
                                };
                                l[t] = new Promise(function(t, a) {
                                    wx.uploadFile({
                                        url: o.API_HOST + "service.json",
                                        filePath: e.path,
                                        name: "file",
                                        header: {
                                            "content-type": "multipart/form-data"
                                        },
                                        formData: n.MD5({
                                            service: "SPECIAL_RACE_IMAGE_UPLOAD",
                                            authedUserId: i.data.authedUserId
                                        }),
                                        success: function(n) {
                                            var i = JSON.parse(n.data).response;
                                            i.success ? t(r({}, i, {
                                                src: e.path
                                            })) : a(i);
                                        }
                                    });
                                });
                            }(f);
                            if ("object" === (void 0 === m ? "undefined" : a(m))) return m.v;
                        }
                        Promise.all(l).then(function(e) {
                            i.setData({
                                formData: r({}, s, t({}, u, s[u].concat(e.map(function(t) {
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
            var a = this.data.formData, n = e.currentTarget.dataset, i = n.imageid, o = n.name;
            this.setData({
                formData: r({}, a, t({}, o, a[o].filter(function(t) {
                    return t.imageId !== i;
                })))
            });
        }
    }
});