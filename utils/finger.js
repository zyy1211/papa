function t(t) {
    return Math.sqrt(t.x * t.x + t.y * t.y);
}

function i(t, i) {
    return t.x * i.x + t.y * i.y;
}

function s(s, h) {
    var n = t(s) * t(h);
    if (0 === n) return 0;
    var e = i(s, h) / n;
    return e > 1 && (e = 1), Math.acos(e);
}

function h(t, i) {
    return t.x * i.y - i.x * t.y;
}

function n(t, i) {
    var n = s(t, i);
    return h(t, i) > 0 && (n *= -1), 180 * n / Math.PI;
}

var e = function(t) {
    this.preV = {
        x: null,
        y: null
    }, this.pinchStartLen = null, this.scale = 1, this.isDoubleTap = !1, this.rotate = t.rotate || function() {}, 
    this.touchStart = t.touchStart || function() {}, this.multipointStart = t.multipointStart || function() {}, 
    this.multipointEnd = t.multipointEnd || function() {}, this.pinch = t.pinch || function() {}, 
    this.swipe = t.swipe || function() {}, this.tap = t.tap || function() {}, this.doubleTap = t.doubleTap || function() {}, 
    this.longTap = t.longTap || function() {}, this.singleTap = t.singleTap || function() {}, 
    this.pressMove = t.pressMove || function() {}, this.touchMove = t.touchMove || function() {}, 
    this.touchEnd = t.touchEnd || function() {}, this.touchCancel = t.touchCancel || function() {}, 
    this.delta = null, this.last = null, this.now = null, this.tapTimeout = null, this.touchTimeout = null, 
    this.longTapTimeout = null, this.swipeTimeout = null, this.x1 = this.x2 = this.y1 = this.y2 = null, 
    this.preTapPosition = {
        x: null,
        y: null
    };
};

e.prototype = {
    start: function(i) {
        if (i.touches) {
            this.now = Date.now(), this.x1 = i.touches[0].pageX, this.y1 = i.touches[0].pageY, 
            this.delta = this.now - (this.last || this.now), this.touchStart(i), null !== this.preTapPosition.x && (this.isDoubleTap = this.delta > 0 && this.delta <= 250 && Math.abs(this.preTapPosition.x - this.x1) < 30 && Math.abs(this.preTapPosition.y - this.y1) < 30), 
            this.preTapPosition.x = this.x1, this.preTapPosition.y = this.y1, this.last = this.now;
            var s = this.preV;
            if (i.touches.length > 1) {
                this._cancelLongTap();
                var h = {
                    x: i.touches[1].pageX - this.x1,
                    y: i.touches[1].pageY - this.y1
                };
                s.x = h.x, s.y = h.y, this.pinchStartLen = t(s), this.multipointStart(i);
            }
            this.longTapTimeout = setTimeout(function() {
                this.longTap(i);
            }.bind(this), 750);
        }
    },
    move: function(i) {
        if (i.touches) {
            var s = this.preV, h = i.touches.length, e = i.touches[0].pageX, o = i.touches[0].pageY;
            if (this.isDoubleTap = !1, h > 1) {
                var u = {
                    x: i.touches[1].pageX - e,
                    y: i.touches[1].pageY - o
                };
                null !== s.x && (this.pinchStartLen > 0 && (i.scale = t(u) / this.pinchStartLen, 
                this.pinch(i)), i.angle = n(u, s), this.rotate(i)), s.x = u.x, s.y = u.y;
            } else null !== this.x2 ? (i.deltaX = e - this.x2, i.deltaY = o - this.y2) : (i.deltaX = 0, 
            i.deltaY = 0), this.pressMove(i);
            this.touchMove(i), this._cancelLongTap(), this.x2 = e, this.y2 = o, i.touches.length > 1 && this._cancelLongTap();
        }
    },
    end: function(t) {
        this._cancelLongTap();
        var i = this;
        t.touches.length < 2 && this.multipointEnd(t), this.touchEnd(t), this.x2 && Math.abs(this.x1 - this.x2) > 30 || this.y2 && Math.abs(this.preV.y - this.y2) > 30 ? (t.direction = this._swipeDirection(this.x1, this.x2, this.y1, this.y2), 
        this.swipeTimeout = setTimeout(function() {
            i.swipe(t);
        }, 0)) : this.tapTimeout = setTimeout(function() {
            i.tap(t), i.isDoubleTap ? (i.doubleTap(t), clearTimeout(i.touchTimeout), i.isDoubleTap = !1) : i.touchTimeout = setTimeout(function() {
                i.singleTap(t);
            }, 250);
        }, 0), this.preV.x = 0, this.preV.y = 0, this.scale = 1, this.pinchStartLen = null, 
        this.x1 = this.x2 = this.y1 = this.y2 = null;
    },
    cancel: function(t) {
        clearTimeout(this.touchTimeout), clearTimeout(this.tapTimeout), clearTimeout(this.longTapTimeout), 
        clearTimeout(this.swipeTimeout), this.preV.x = 0, this.preV.y = 0, this.scale = 1, 
        this.pinchStartLen = null, this.x1 = this.x2 = this.y1 = this.y2 = null, this.touchCancel(t);
    },
    _cancelLongTap: function() {
        clearTimeout(this.longTapTimeout);
    },
    _swipeDirection: function(t, i, s, h) {
        return Math.abs(t - i) >= Math.abs(s - h) ? t - i > 0 ? "Left" : "Right" : s - h > 0 ? "Up" : "Down";
    }
}, module.exports = e;