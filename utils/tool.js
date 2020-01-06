var e = {
    formatTime: function(e) {
        var t = e.getFullYear(), n = e.getMonth() + 1, r = e.getDate(), a = e.getHours(), s = e.getMinutes(), g = e.getSeconds();
        return [ t, n, r ].map(this.formatNumber).join("-") + " " + [ a, s, g ].map(this.formatNumber).join(":");
    },
    formatNoSecondTime: function(e) {
        return [ e.getFullYear(), e.getMonth() + 1, e.getDate() ].map(this.formatNumber).join("-");
    },
    formatAddDayNoSecondTime: function(e, t) {
        e.setDate(e.getDate() + t);
        var n = e.getFullYear(), r = e.getMonth() + 1, a = e.getDate();
        return n + "-" + this.formatNumber(r) + "-" + this.formatNumber(a);
    },
    formatHourMinTime: function(e) {
        var t = e.getHours(), n = e.getMinutes();
        e.getSeconds();
        return [ t, n ].map(this.formatNumber).join(":");
    },
    formatNumber: function(e) {
        return (e = e.toString())[1] ? e : "0" + e;
    },
    getTime: function(e) {
        var t, n, r, a, s, g, i, u = arguments[0] || 0;
        return t = u ? new Date(1e3 * u) : new Date(), n = t.getFullYear(), r = t.getMonth() + 1, 
        a = t.getDate(), s = t.getHours(), g = t.getMinutes(), i = t.getSeconds(), [ n, r, a ].map(this.formatNumber).join("-") + " " + [ s, g, i ].map(this.formatNumber).join(":");
    },
    getNoSecondTime: function(e) {
        var t, n, r, a, s = arguments[0] || 0;
        return t = s ? new Date(1e3 * s) : new Date(), n = t.getFullYear(), r = t.getMonth() + 1, 
        a = t.getDate(), [ n, r, a ].map(this.formatNumber).join("-");
    },
    getFormatDate: function(e, t) {
        var n = e.substring(0, 4) + "/" + e.substring(5, 7) + "/" + e.slice(-2), r = [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ], a = [ "周日", "周一", "周二", "周三", "周四", "周五", "周六" ], s = new Date(n).getDay();
        return "short" === t ? a[s] : n + " " + r[s];
    },
    getSubYear: function(e) {
        return (e = e.replace(/-/g, "/")).substring(5, 7) + "月" + e.slice(8, 10) + "日" + " " + [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" ][new Date(e).getDay()];
    },
    toDate: function(e) {
        return e ? new Date(Date.parse(e.replace(/\-/g, "/"))) : null;
    },
    format: function(e, t) {
        var n = {
            "M+": e.getMonth() + 1,
            "d+": e.getDate(),
            "h+": e.getHours(),
            "m+": e.getMinutes(),
            "s+": e.getSeconds(),
            "q+": Math.floor((e.getMonth() + 3) / 3),
            S: e.getMilliseconds()
        };
        t = t || "yyyy-MM-dd hh:mm:ss", /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var r in n) new RegExp("(" + r + ")").test(t) && (t = t.replace(RegExp.$1, 1 === RegExp.$1.length ? n[r] : ("00" + n[r]).substr(("" + n[r]).length)));
        return t;
    },
    zeropad: function(e, t) {
        for (e = "" + e, t = t || 2; e.length < t; ) e = "0" + e;
        return e;
    },
    getVagueTime: function(e, t, n, r) {
        "string" != typeof e && (e = e.toString());
        var a = e.split(" ")[0] + " 00:00:00";
        arguments.length < 2 && (t = !0), e.getDate || (e = this.toDate(e));
        var s = this.getNow(), g = s.getFullYear() == e.getFullYear(), i = s.getDate() == e.getDate(), u = s.getTime() / 1e3 - e.getTime() / 1e3, o = e.getHours(), m = e.getMinutes(), l = e.getDay(), c = 86400 + 3600 * s.getHours() + 60 * s.getMinutes() + s.getSeconds(), f = "";
        o = this.zeropad(o, 2), m = this.zeropad(m, 2);
        var D = parseInt((s - this.toDate(a)) / 1e3 / 60 / 60 / 24), b = {
            0: "日",
            1: "一",
            2: "二",
            3: "三",
            4: "四",
            5: "五",
            6: "六"
        };
        switch (!0) {
          case u < 3600:
            f = o + ":" + m;
            break;

          case u >= 3600 && u < 86400:
            f = i ? o + ":" + m : "昨天 " + (n ? o + ":" + m : "");
            break;

          case u >= 86400 && u <= c:
            f = "昨天 " + (n ? o + ":" + m : "");
            break;

          case u >= c && D <= 6:
            f = "星期" + b[l] + " " + (n ? o + ":" + m : "");
            break;

          default:
            f = e.getMonth() + 1 + "月" + e.getDate() + "日 " + (n ? o + ":" + m : "");
        }
        return r && $.isFunction(r) && r(u), (t && !g ? e.getFullYear() + "年" : "") + f;
    },
    addOneMinTime: function(e, t) {
        var n;
        return e += "", n = -1 !== e.indexOf("-") ? new Date(e.replace(/\-/g, "/")) : new Date(e), 
        t = t || 1, n.setMinutes(n.getMinutes() + t, n.getSeconds(), 0), this.formatHourMinTime(n);
    },
    minusOneMinTime: function(e, t) {
        var n;
        return e += "", n = -1 !== e.indexOf("-") ? new Date(e.replace(/\-/g, "/")) : new Date(e), 
        t = t || 1, n.setMinutes(n.getMinutes() - t, n.getSeconds(), 0), this.formatHourMinTime(n);
    },
    getDay: function(e) {
        var t = new Date();
        return t.setDate(t.getDate() + e), t.toDateString();
    },
    getTimeInterval: function(e, t) {
        e = e.replace(new RegExp("-", "gm"), "/"), t = t.replace(new RegExp("-", "gm"), "/");
        var n = e.substring(0, 16) + " - " + t.substring(0, 16);
        return e.substring(0, 4) === t.substring(0, 4) && (new Date(e).getFullYear() === new Date().getFullYear() ? e.substring(0, 10) === t.substring(0, 10) ? n = e.substring(5, 16) + " - " + t.substring(10, 16) : (n = e.substring(5, 16), 
        t && (n += " - " + t.substring(5, 16))) : e.substring(0, 10) === t.substring(0, 10) ? n = e.substring(0, 16) + " - " + t.substring(10, 16) : (n = e.substring(0, 16), 
        t && (n += " - " + t.substring(5, 16)))), n;
    },
    getFormatGmt: function(e) {
        var t = (e = e.replace(/-/g, "/")).substring(0, 4) + "年" + e.substring(5, 7) + "月" + e.slice(8, 10) + "日";
        return this.formatNoSecondTime(new Date()) === this.formatNoSecondTime(new Date(e)) ? t = "今天" + e.substring(10, 16) : new Date().getFullYear === new Date(e).getFullYear && (t = e.substring(5, 7) + "月" + e.slice(8, 10) + "日"), 
        t;
    }
};

module.exports = {
    date: e
};