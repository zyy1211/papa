var e = require("../../utils/util.js");

Component({
    properties: {
        raceId: {
            type: String,
            value: ""
        },
        isIpx: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        authedUserId: "",
        projectList: [],
        selectProjectId: "",
        resultType: "",
        pictureResultList: [],
        currentPage: 1,
        pages: 1,
        showResultSequence: !1,
        resultIdMapResultDetail: {},
        objectIdMapObjectName: {},
        teamList: []
    },
    methods: {
        initPageLogin: function() {
            var t = this;
            e.initPageLogin().then(function(e) {
                var a = e;
                a && "" !== a && (t.setData({
                    authedUserId: a
                }), t.getData(!0));
            });
        },
        getData: function(t) {
            var a = this, i = a.data, s = i.raceId, r = void 0 === s ? "" : s, o = i.authedUserId, d = void 0 === o ? "" : o, c = i.currentPage, u = void 0 === c ? 1 : c, n = i.pages, l = void 0 === n ? 1 : n, p = i.teamList, v = void 0 === p ? [] : p, I = i.resultIdMapResultDetail, j = void 0 === I ? {} : I, g = i.objectIdMapObjectName, L = void 0 === g ? {} : g, R = (i.projectList, 
            i.selectProjectId), m = void 0 === R ? "" : R, h = i.resultType, b = void 0 === h ? "" : h, D = i.pictureResultList, P = void 0 === D ? [] : D;
            t && (b = "", P = [], u = 1, l = 1, v = [], j = {}, L = {}, a.setData({
                currentPage: u,
                pages: l,
                teamList: v,
                resultIdMapResultDetail: j,
                objectIdMapObjectName: L,
                resultType: b,
                pictureResultList: P
            }));
            var E = {
                service: "SPECIAL_RACE_RESULT_LIST_PAGE_QUERY",
                authedUserId: d,
                raceId: r,
                raceItemId: m,
                currentPage: u
            };
            "" === m && delete E.raceItemId, (u <= l && "GRADE_RESULT" === b || "" === b) && e.request("service.json", e.MD5(E)).then(function(e) {
                a.initData(e);
            });
        },
        initData: function(e) {
            var t = this, a = t.data, i = a.currentPage, s = void 0 === i ? 1 : i, r = a.pages, o = void 0 === r ? 1 : r, d = a.teamList, c = void 0 === d ? [] : d, u = a.resultIdMapResultDetail, n = void 0 === u ? {} : u, l = a.objectIdMapObjectName, p = void 0 === l ? {} : l, v = a.projectList, I = void 0 === v ? [] : v, j = a.resultType, g = void 0 === j ? "" : j, L = e.resultList, R = void 0 === L ? [] : L, m = e.paginator, h = void 0 === m ? {} : m, b = e.resultIdAndResultDetail, D = void 0 === b ? {} : b, P = e.showResultSequence, E = void 0 !== P && P, T = (e.objectIdAndPointChanges, 
            e.objectIdAndEachNameList, e.objectIdAndObjectName), M = void 0 === T ? {} : T, U = e.raceItemList, S = void 0 === U ? [] : U, f = e.pictureResultList, A = void 0 === f ? [] : f, O = e.imageUrl, y = void 0 === O ? "" : O, N = e.raceResultType, _ = [];
            I = S, "GRADE_RESULT" === (g = (void 0 === N ? {} : N).name || "") ? (s = h.page + 1, 
            o = h.pages, n = Object.assign(n, D), p = Object.assign(p, M), (c = c.concat(R)).map(function(e, t) {
                e.resultInfo = n[e.id], e.teamName = p[e.resultObjectId];
            })) : "PICTURE_RESULT" === g && (_ = A.map(function(e) {
                return "" + y + e;
            })), t.setData({
                currentPage: s,
                pages: o,
                teamList: c,
                resultIdMapResultDetail: n,
                objectIdMapObjectName: p,
                showResultSequence: E,
                projectList: I,
                resultType: g,
                pictureResultList: _
            });
        },
        chooseProject: function(e) {
            var t = e.detail.project.project;
            this.setData({
                selectProjectId: t.id
            }), this.initPageLogin();
        }
    }
});