var t = require("../utils/util.js");

Component({
    properties: {
        noData: {
            type: String,
            value: "暂无数据！"
        }
    },
    data: {
        dataList: [],
        currentPage: 1,
        pages: 1
    },
    methods: {
        initQueryParameter: function(t) {
            this.setData({
                options: t,
                currentPage: 2
            }), this.initQuery();
        },
        initQuery: function(a) {
            var e = this, i = e.data, n = i.options, s = void 0 === n ? {} : n, r = i.currentPage, c = void 0 === r ? 1 : r;
            "{}" !== JSON.stringify(s) && (a || (c = 1), s.currentPage = c, s.sign && delete s.sign, 
            wx.showLoading({
                title: "加载中"
            }), t.request("service.json", t.MD5(s)).then(function(t) {
                wx.hideLoading(), e.getListData(t, a);
            }));
        },
        getListData: function(a, e) {
            var i = this, n = i.data.dataList, s = a.activityIdAndJoinerNum, r = a.idAndJoinerNumMap, c = void 0 === r ? {} : r, o = a.activityList, d = a.activeList, v = a.list, g = void 0 === v ? [] : v, u = a.activityImageUrl, l = a.clubIdAndNameMap, p = void 0 === l ? {} : l, m = a.clubLogoUrl, I = void 0 === m ? "" : m, y = a.currentPage, N = a.pages, T = a.typeIdAndTypeName, D = void 0 === T ? {} : T, E = a.parentTypeIdAndBackGroundColor, h = void 0 === E ? {} : E, L = a.activeImageJointUrl, A = void 0 === L ? "" : L;
            e || (n = []);
            var _ = o || d || g, b = u || A, P = s || c;
            _.map(function(a) {
                var e = a.id, i = a.activityLabel, s = void 0 === i ? "" : i, r = a.gmtStart, c = a.gmtEnd, o = void 0 === c ? "" : c, d = a.activityStatus, v = void 0 === d ? {} : d, g = a.activitySort, u = void 0 === g ? {} : g, l = a.belongType, m = void 0 === l ? {} : l, y = a.belongId, N = void 0 === y ? "" : y, T = a.typeId, E = a.parentTypeId, L = t.date.getTimeInterval(r, o), A = P[e], _ = s.split(","), f = "/pages/package-race/raceDetail?id=" + e, k = "/static/icon-end.svg", U = "", w = "", C = "", O = D[T], R = h[E];
                switch ("NORMAL" === u.name && (f = "../package-activity/activityDetail?id=" + e, 
                u.message = "活动"), v.name) {
                  case "ENTERING":
                    k = "/static/icon-entering.svg";
                    break;

                  case "ACTIVITY_END_WITH_NO_PAIED":
                  case "ACTIVITY_END_WITH_PAIED":
                  case "ACTIVITY_END_WITH_EXPIRED_NO_PAIED":
                    k = "/static/icon-end.svg", U = "themes-list-memo-end";
                    break;

                  case "ENTER_END":
                    k = "/static/icon-wait.svg";
                    break;

                  case "WORKING":
                    k = "/static/icon-working.svg";
                }
                "CLUB" === m.name && (w = p[N], C = I + N), Object.assign(a, {
                    imageUrl: b + e,
                    iconUrl: k,
                    navigateUrl: f,
                    activityLabels: _,
                    activityTimeInterval: L,
                    joinerNum: A,
                    className: U,
                    iconMessage: "已结束",
                    clubName: w,
                    clubUrl: C,
                    typeName: O,
                    typeBack: R
                }), n.push(a);
            }), n = t.uniqueArray(n), i.setData({
                dataList: n,
                currentPage: ++y,
                pages: N
            });
        },
        onReachBottom: function() {
            var t = this, a = t.data;
            a.currentPage <= a.pages && t.initQuery(!0);
        },
        navigate: function(t) {
            var a = {
                e: t
            };
            this.triggerEvent("navigate", a);
        }
    }
});