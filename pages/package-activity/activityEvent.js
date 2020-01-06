var e = require("../../utils/util.js"), a = getApp();

Page({
    data: {
        authedUserId: "",
        activeId: "",
        activeTitle: "",
        dataLabels: [],
        dataLabelsLength: 0,
        startDate: "",
        endDate: "",
        startTime: "--:--",
        endTime: "--:--",
        closeTime: "--:--",
        addressDescribe: "",
        limitNum: "",
        manFee: "",
        womanFee: "",
        activeCount: 0,
        addModalHidden: !0,
        newTagText: "",
        address: "",
        activeTitleLength: 0,
        isdisabled: !1,
        isModify: !1,
        iModifyActivity: !0,
        disabledSubmit: !1,
        contactName: "",
        contactCall: "",
        chargeFeeType: "",
        publiced: !0,
        allowQueue: !0,
        allowCarry: !0,
        needSignUp: !1,
        objectArrayFeeType: [],
        feeTypeName: "",
        feeTypeMessage: "",
        protocolModalHidden: !0,
        agreeProtocol: !0,
        creatorWeixinNo: "",
        describeId: "",
        type: {
            id: 0,
            val: "请选择活动类型"
        },
        showCreateSubject: !0,
        synchronizedCreateSubject: !0
    },
    checkboxChange: function(e) {
        var a = this;
        "true" === e.detail.value[0] ? a.setData({
            disabledSubmit: !1,
            agreeProtocol: !0
        }) : a.setData({
            disabledSubmit: !0,
            agreeProtocol: !1
        });
    },
    createSubjectChange: function(e) {
        var a = this;
        "true" === e.detail.value[0] ? a.setData({
            synchronizedCreateSubject: !0
        }) : a.setData({
            synchronizedCreateSubject: !1
        });
    },
    showProtocolModal: function() {
        this.setData({
            protocolModalHidden: !1
        });
    },
    closeProtocolModal: function() {
        this.setData({
            protocolModalHidden: !0
        });
    },
    bindActiveTitleInput: function(e) {
        var a = e.detail.value;
        this.setData({
            activeTitleLength: a.length
        });
    },
    bindStartDateChange: function(a) {
        var t = this, i = t.data, s = i.startTime, n = i.isChangeEndDate, o = i.isChangeCloseDate, d = i.isChangeCancelDate, c = i.isFromTemplate, l = a.detail.value, r = {};
        if (t.setData({
            startDate: l
        }), !n) {
            var u = new Date(l), m = e.date.addOneMinTime(l + " " + s + ":00", 120);
            "00" !== m.substring(0, 2) && "01" !== m.substring(0, 2) || u.setDate(u.getDate() + 1), 
            r = {
                endDate: u = e.date.formatNoSecondTime(u)
            }, c || (r.endTime = m), t.setData(r);
        }
        o || (r = {
            closeDate: l
        }, c || (r.closeTime = e.date.minusOneMinTime(l + " " + s + ":00", 120)), t.setData(r)), 
        o || d || (r = {
            cancelCloseDate: l
        }, c || (r.cancelCloseTime = e.date.minusOneMinTime(l + " " + s + ":00", 120)), 
        t.setData(r));
    },
    bindStartTimeChange: function(a) {
        var t = this, i = t.data, s = i.startDate, n = i.isChangeEndDate, o = i.isChangeCloseDate, d = i.isChangeCancelDate, c = i.isFromTemplate, l = a.detail.value, r = {};
        if (t.setData({
            startTime: l
        }), !n) {
            var u = new Date(s), m = e.date.addOneMinTime(s + " " + l + ":00", 120);
            "00" !== m.substring(0, 2) && "01" !== m.substring(0, 2) || u.setDate(u.getDate() + 1), 
            u = e.date.formatNoSecondTime(u), r = {
                endTime: m
            }, c || (r.endDate = u), t.setData(r);
        }
        o || (r = {
            closeTime: e.date.minusOneMinTime(s + " " + l + ":00", 120)
        }, c || (r.closeDate = s), t.setData(r)), o || d || (r = {
            cancelCloseTime: e.date.minusOneMinTime(s + " " + l + ":00", 120)
        }, c || (r.cancelCloseDate = s), t.setData(r));
    },
    bindEndDateChange: function(e) {
        var a = this, t = e.detail.value;
        a.setData({
            endDate: t,
            isChangeEndDate: !0
        });
    },
    bindEndTimeChange: function(e) {
        var a = this, t = e.detail.value;
        a.setData({
            endTime: t,
            isChangeEndDate: !0
        });
    },
    bindCloseDateChange: function(e) {
        var a = this, t = a.data.isChangeCancelDate;
        a.setData({
            closeDate: e.detail.value,
            isChangeCloseDate: !0
        }), t || a.setData({
            cancelCloseDate: e.detail.value
        });
    },
    bindCloseTimeChange: function(e) {
        var a = this, t = a.data.isChangeCancelDate;
        a.setData({
            closeTime: e.detail.value,
            isChangeCloseDate: !0
        }), t || a.setData({
            cancelCloseTime: e.detail.value
        });
    },
    bindCancelCloseDateChange: function(e) {
        this.setData({
            cancelCloseDate: e.detail.value,
            isChangeCancelDate: !0
        });
    },
    bindCancelCloseTimeChange: function(e) {
        this.setData({
            cancelCloseTime: e.detail.value,
            isChangeCancelDate: !0
        });
    },
    switchChange: function(e) {
        var a = this, t = e.currentTarget.dataset, i = e.detail.value;
        switch (t.type) {
          case "publiced":
            var s = a.data, n = s.activeId, o = s.isFromTemplate, d = s.showCreateSubject, c = s.synchronizedCreateSubject;
            n && !o ? (d = !1, c = !1) : (d = i, c = i), a.setData({
                publiced: i,
                showCreateSubject: d,
                synchronizedCreateSubject: c
            });
            break;

          case "allowQueue":
            a.setData({
                allowQueue: i
            });
            break;

          case "allowCarry":
            a.setData({
                allowCarry: i
            });
            break;

          case "needSignUp":
            a.setData({
                needSignUp: i
            });
        }
    },
    showAddModal: function() {
        this.setData({
            addModalHidden: !1,
            newTagText: ""
        });
    },
    closeAddModal: function() {
        this.setData({
            addModalHidden: !0
        });
    },
    bindNewTagChange: function(e) {
        this.setData({
            newTagText: e.detail.value
        });
    },
    doAddModal: function() {
        var a = this, t = a.data, i = t.dataLabels, s = t.newTagText, n = t.dataLabelsLength, o = "";
        if (i.map(function(e) {
            s === e.name && (o = "标签" + s + "已存在");
        }), "" === s && (o = "标签不能为空"), s.length > 8 && (o = "标签最多可输入8个字"), i.length > 4 && (o = "最多只能增加5个标签"), 
        "" !== o) return e.showToast(o), !1;
        n++, i[i.length] = {
            id: n + "",
            name: s,
            activeClass: !1,
            editClass: !0
        }, a.setData({
            dataLabels: i,
            dataLabelsLength: n,
            addModalHidden: !0
        });
    },
    deleteTab: function(e) {
        var a = this, t = a.data, i = t.dataLabels, s = t.activeCount, n = e.currentTarget.dataset.name;
        i.map(function(e, a) {
            e.name === n && (i.splice(a, 1), e.activeClass && s--);
        }), a.setData({
            dataLabels: i,
            activeCount: s
        });
    },
    tagChoose: function(a) {
        var t = this, i = t.data, s = i.dataLabels, n = i.activeCount, o = a.currentTarget.dataset, d = o.name;
        o.activeClass;
        s.map(function(a) {
            if (a.name === d) {
                if (a.activeClass) n--; else {
                    if (n > 3 && !a.activeClass) return void e.showToast("最多只能选择4个标签");
                    n++;
                }
                a.activeClass = !a.activeClass;
            }
        }), t.setData({
            dataLabels: s,
            activeCount: n
        });
    },
    bindChooseLocation: function() {
        var e = this;
        e.selectComponent("#authorize").getAuthorizeLocation(function(a) {
            wx.chooseLocation({
                type: "gcj02",
                success: function(a) {
                    var t = a.name, i = void 0 === t ? "" : t, s = a.longitude, n = void 0 === s ? "" : s, o = a.latitude, d = void 0 === o ? "" : o;
                    e.setData({
                        addressDescribe: i,
                        address: n + "@" + d
                    });
                }
            });
        });
    },
    bindContactNameInput: function(e) {
        this.setData({
            contactName: e.detail.value
        });
    },
    bindContactCallInput: function(e) {
        this.setData({
            contactCall: e.detail.value
        });
    },
    bindWeixinInput: function(e) {
        this.setData({
            creatorWeixinNo: e.detail.value
        });
    },
    bindLimitNumInput: function(a) {
        var t = this, i = t.data.limitNum, s = parseInt(a.detail.value);
        s <= 0 && (e.showToast("活动人数必须大于等于1"), s = i), t.setData({
            limitNum: s || ""
        });
    },
    bindFeeTypeChange: function(e) {
        var a = this, t = a.data.objectArrayFeeType, i = e.detail.value;
        a.setData({
            feeTypeName: t[i].name,
            feeTypeMessage: t[i].message
        });
    },
    bindManFeeInput: function(a) {
        var t = this, i = t.data.manFee, s = a.detail.value;
        /^(\d+(\.\d{1,2})?)$/g.test(s) || (e.showToast("请输入正确的费用"), s = i), t.setData({
            manFee: s
        });
    },
    bindWomanFeeInput: function(a) {
        var t = this, i = t.data.womanFee, s = a.detail.value;
        /^(\d+(\.\d{1,2})?)$/g.test(s) || (e.showToast("请输入正确的费用"), s = i), t.setData({
            womanFee: s
        });
    },
    bindFormSubmit: function(a) {
        var t = this, i = a.detail.value.activeTitle, s = t.data, n = s.startDate, o = s.endDate, d = s.startTime, c = s.endTime, l = s.closeDate, r = s.closeTime, u = s.cancelCloseDate, m = s.cancelCloseTime, v = s.creatorWeixinNo, g = void 0 === v ? "" : v, h = s.manFee, T = s.womanFee, D = s.dataLabels, C = void 0 === D ? [] : D, p = s.feeTypeName, b = s.address, f = void 0 === b ? "" : b, y = s.addressDescribe, I = s.contactName, w = s.contactCall, S = s.limitNum, M = s.imageId, N = void 0 === M ? "" : M, F = s.publiced, L = s.allowQueue, A = s.allowCarry, E = s.agreeProtocol, x = s.authedUserId, j = s.isModify, U = s.activeId, P = s.isFromTemplate, z = s.needSignUp, O = s.describeId, R = s.type, _ = void 0 === R ? {} : R, k = s.synchronizedCreateSubject, W = void 0 === k || k, H = n + " " + d + ":00", V = o + " " + c + ":00", Q = l + " " + r + ":00", J = u + " " + m + ":00", $ = H.replace(/-/g, "/"), B = V.replace(/-/g, "/"), X = Q.replace(/-/g, "/"), Y = J.replace(/-/g, "/"), q = "", G = "M@" + h + ",W@" + T, Z = [], K = [];
        if (C.map(function(e, a) {
            e.editClass && Z.push(e.name), e.activeClass && K.push(e.name);
        }), "BEFORE_ACTIVITY" === p && ("" === h ? q = "请输入男生的报名费用" : "" === T && (q = "请输入女生的报名费用"), 
        0 === parseFloat(h) && 0 === parseFloat(T) && (q = "男生和女生的费用不可以同时为0")), 0 === _.id ? q = "活动类型不能为空" : "" == i ? q = "活动主题不能为空" : -1 !== d.indexOf("-") ? q = "请输入活动开始时间" : -1 !== c.indexOf("-") ? q = "请输入活动结束时间" : -1 !== r.indexOf("-") ? q = "请输入报名截止时间" : new Date($) > new Date() ? new Date($) < new Date(B) ? new Date($) > new Date(X) ? new Date(X) > new Date() ? new Date($) > new Date(Y) ? new Date(Y) > new Date() ? "" === f ? q = "请选择活动地点" : "" === S ? q = "请输入报名人数" : "" === I ? q = "请输入联系人名称" : /^([1][2-9][0-9]{9})|([9][0-9]{10})$/.test(w) ? "" !== g && (g.length < 6 && (q = "微信号太短"), 
        /^[a-zA-Z0-9\!\-\_\(\)]+$/.test(g) || (q = "请输入正确的微信号")) : q = "联系电话格式不正确" : q = "取消报名截止时间必须大于当前时间" : q = "取消报名截止时间必须小于活动开始时间" : q = "报名截止时间必须大于当前时间" : q = "报名截止时间必须小于活动开始时间" : q = "活动开始时间必须小于活动结束时间" : q = "活动开始时间必须大于当前时间", 
        "" !== q) return e.showToast(q), !1;
        var ee = {
            service: "ACTIVE_INITIATE",
            sortCode: "NORMAL",
            choicedLabel: K.join(","),
            definedLabel: Z.join(","),
            chargeFeeType: p,
            imageId: N,
            activeTitle: i,
            gmtStart: H,
            gmtEnd: V,
            gmtRegisterEnd: Q,
            gmtModifyRegisterEnd: J,
            address: f,
            addressDescribe: y,
            limitNum: S,
            contactName: I,
            contactCall: w,
            creatorWeixinNo: g,
            publiced: F,
            allowQueue: L,
            allowCarry: A,
            needSignUp: z,
            feeInfo: G,
            agreeProtocol: E,
            authedUserId: x,
            describeId: O,
            typeId: _.id,
            formId: a.detail.formId,
            synchronizedCreateSubject: W
        };
        j && (ee.service = "ACTIVE_MODIFIED", ee.activeId = U, delete ee.synchronizedCreateSubject), 
        P && (ee.copyFromActiveId = U), t.formSubmitJson(ee);
    },
    formSubmitJson: function(a) {
        var t = this, i = t.data, s = i.isModify, n = i.disabledSubmit, o = s ? "修改成功" : "发布成功";
        n || (e.AJAX("service.json", e.MD5(a), function(a) {
            var i = a.data.response;
            i.success ? (e.showToast(o), s ? wx.navigateBack({
                delta: 1
            }) : wx.redirectTo({
                url: "/pages/package-activity/activityDetail?id=" + i.activeId
            })) : e.showToast(e.showErrorResult(i)), t.setData({
                disabledSubmit: !1
            });
        }, function(a) {
            e.showToast(a.errMsg);
        }), t.setData({
            disabledSubmit: !0
        }));
    },
    initActivityData: function(e) {
        var a = this, t = a.data, i = t.activeId, s = t.isFromTemplate, n = t.startDate, o = t.startTime, d = t.endDate, c = t.endTime, l = t.closeDate, r = t.closeTime, u = t.cancelCloseDate, m = t.cancelCloseTime, v = t.activeTitle, g = void 0 === v ? "" : v, h = t.describeId, T = t.type, D = t.addressDescribe, C = t.address, p = t.pagePreviewImageSrc, b = void 0 === p ? "" : p, f = t.enterNum, y = void 0 === f ? 0 : f, I = t.synchronizedCreateSubject, w = e.chargeFeeTypeMap, S = e.chargeFeeTypeList, M = e.activeImageJointUrl, N = void 0 === M ? "" : M, F = e.activeUpdateAssociationInfo || e.activeManageInfo, L = e.customeLabelList || [], A = [], E = [], x = "", j = "", U = "", P = "", z = "", O = "", R = !0, _ = !0, k = !0, W = !1, H = "", V = "", Q = !1, J = !1, $ = 0, B = L.length - 1;
        if (L.map(function(e, a) {
            A.push({
                name: e,
                activeClass: !1,
                editClass: !0
            });
        }), S.map(function(e, a) {
            "BEFORE_ACTIVITY" === e && (x = e, j = w[e]), E.push({
                name: e,
                message: w[e]
            });
        }), F) {
            T = {
                id: F.typeId,
                val: e.typeName
            };
            var X = void 0, Y = void 0, q = void 0, G = void 0, Z = void 0, K = void 0, ee = void 0, ae = void 0, te = void 0, ie = void 0;
            g = F.activeTitle;
            var se = F.describeId;
            h = void 0 === se ? "" : se, P = F.contactName, z = F.contactCall, O = F.creatorWeixinNo, 
            R = F.publiced, _ = F.allowQueue, k = F.allowCarry, W = F.needSignUp, q = F.gmtStart, 
            G = F.gmtEnd, Z = F.gmtRegisterEnd, K = F.gmtModifyRegisterEnd, ee = F.changeFee, 
            y = F.enterNum;
            var ne = F.addressDescribe;
            D = void 0 === ne ? "" : ne, Y = F.longitude, X = F.latitude;
            var oe = F.chargeFeeType;
            ie = void 0 === oe ? {} : oe, U = F.limitNum;
            var de = F.userTypeAndFeeMap;
            ae = void 0 === de ? {} : de, te = F.activeLabels, s ? y = 0 : (n = q.substring(0, 10), 
            d = G.substring(0, 10), l = Z.substring(0, 10), u = K.substring(0, 10), ee || (Q = !0), 
            J = !0), o = q.substring(11, 16), c = G.substring(11, 16), r = Z.substring(11, 16), 
            m = K.substring(11, 16), C = Y ? Y + "@" + X : "", x = ie.name, j = ie.message, 
            H = ae.M, V = ae.W, te.map(function(e) {
                $++, -1 === L.indexOf(e) ? A.push({
                    name: e,
                    activeClass: !0,
                    editClass: !0
                }) : A[L.indexOf(e)].activeClass = !0;
            }), I = F.synchronizedCreateSubject;
        }
        b = N + i, a.setData({
            dataLabels: A,
            dataLabelsLength: B,
            objectArrayFeeType: E,
            feeTypeName: x,
            feeTypeMessage: j,
            contactName: P,
            contactCall: z,
            creatorWeixinNo: O,
            publiced: R,
            allowQueue: _,
            allowCarry: k,
            needSignUp: W,
            activeTitle: g,
            describeId: h,
            activeTitleLength: g.length || 0,
            startDate: n,
            startTime: o,
            endDate: d,
            endTime: c,
            closeDate: l,
            closeTime: r,
            cancelCloseDate: u,
            cancelCloseTime: m,
            addressDescribe: D,
            address: C,
            limitNum: U,
            manFee: H,
            womanFee: V,
            isdisabled: Q,
            isModify: J,
            enterNum: y,
            activeCount: $,
            pagePreviewImageSrc: b,
            type: T,
            synchronizedCreateSubject: I
        });
    },
    onLoad: function(e) {
        var t = !!e.fromType;
        this.setData({
            activeId: e.id || "",
            isFromTemplate: t,
            isIpx: a.globalData.isIpx || !1
        }), this.initPageLogin();
    },
    navigateToUploadImage: function() {
        var e = this.data.authedUserId;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original", "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(a) {
                var t = a.tempFilePaths;
                wx.navigateTo({
                    url: "/pages/package-template/uploadImage?authedUserId=" + e + "&imageResouce=" + t[0]
                });
            }
        });
    },
    navigatorToSort: function() {
        var e = this.data, a = e.type, t = (e.activeId, e.isFromTemplate, "");
        t = 0 !== a.id ? "/pages/package-activity/activityType?id=" + a.id : "/pages/package-activity/activityType", 
        wx.navigateTo({
            url: t
        });
    },
    navigatorToDescr: function() {
        var e = this.data, a = e.describeId, t = e.activeId, i = e.isFromTemplate, s = "";
        s = t ? i ? "/pages/package-template/activityRules?id=" + a + "&activityId=" + t + "&from=activity&fromType=template" : "/pages/package-template/activityRules?id=" + a + "&activityId=" + t + "&from=activity" : a ? "/pages/package-template/activityRules?id=" + a + "&from=activity" : "/pages/package-template/activityRules?from=activity", 
        wx.navigateTo({
            url: s
        });
    },
    initPageLogin: function(a) {
        var t = this;
        e.initPageLogin(a).then(function(e) {
            t.setData({
                authedUserId: e
            }), wx.showLoading({
                title: "加载中"
            }), t.initPage();
        });
    },
    initPage: function() {
        var a = new Date(), t = this, i = t.data, s = i.activeId, n = i.authedUserId, o = i.isFromTemplate, d = {
            service: "ACTIVE_INITIATE_PAGE",
            authedUserId: n
        };
        t.setData({
            startDate: e.date.formatNoSecondTime(a),
            endDate: e.date.formatNoSecondTime(a),
            closeDate: e.date.formatNoSecondTime(a),
            cancelCloseDate: e.date.formatNoSecondTime(a),
            startTime: "20:00",
            endTime: "22:00",
            closeTime: "18:00",
            cancelCloseTime: "18:00"
        }), s && (d.activeId = s, o ? d.service = "ACTIVE_CREATE_WITH_STENCIL_INIT" : (d.service = "ACTIVE_MODIFIED_INIT", 
        t.setData({
            showCreateSubject: !1,
            synchronizedCreateSubject: !1
        }))), e.AJAX("service.json", e.MD5(d), function(a) {
            if (a.data) {
                var i = a.data.response;
                i.success ? t.initActivityData(i) : ("ACTIVE_IS_STARTED" === i.error.name && t.setData({
                    iModifyActivity: !1
                }), e.showToast(e.showErrorResult(i)));
            } else e.showToast(a.errMsg);
            wx.hideLoading();
        });
    }
});