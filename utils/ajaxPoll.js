var t = require("util.js");

module.exports = {
    AjaxPoll: function() {
        function a() {
            var t = getCurrentPages(), a = t[t.length - 1];
            return this.__page = a, this.__timeout = null, a.ajaxPoll = this, this;
        }
        return a.prototype = {
            init: function(t) {
                t = t || {};
                var a = this;
                a.timeGap = t.timeGap || 2e3, a.callback = t.callback, a.url = t.url, a.requestData = t.requestData, 
                a.isStop = !1, a.onGetData = function(t) {
                    a._onGetData(t);
                }, a.reqData = function() {
                    a._reqData();
                }, a.maxGapTime = 3e4, a.gapTimer = setInterval(function() {
                    a.checkMaxGapTime();
                }, a.maxGapTime), a.reqData();
            },
            _reqData: function() {
                t.AJAX(this.url, this.requestData, this.onGetData, function(a) {
                    t.showToast(a.errMsg);
                });
            },
            _onGetData: function(t) {
                this.callback(t), this.lastReqDate = new Date(), !0 !== this.isStop && this.reReqData();
            },
            reReqData: function() {
                this.timer && clearTimeout(this.timer), this.timer = setTimeout(this.reqData, this.timeGap);
            },
            checkMaxGapTime: function() {
                var t = new Date();
                this.lastReqDate && t.valueOf() - this.lastReqDate.valueOf() >= this.maxGapTime && this.reqData();
            },
            start: function() {
                var t = this;
                t.isStop = !1, t.reqData(), t.gapTimer && clearInterval(t.gapTimer), t.gapTimer = setInterval(function() {
                    t.checkMaxGapTime();
                }, t.maxGapTime);
            },
            stop: function() {
                this.timer && clearTimeout(this.timer), this.xhr && this.xhr.abort && (this.xhr.onreadystatechange = $.noop, 
                this.xhr.abort()), this.gapTimer && clearInterval(this.gapTimer), this.isStop = !0;
            }
        }, new a();
    }
};