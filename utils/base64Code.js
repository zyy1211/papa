module.exports = {
    Base64: function() {
        var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        this.encode = function(t) {
            var e, o, a, n, c, h, d, C = "", f = 0;
            for (t = this._utf8_encode(t); f < t.length; ) n = (e = t.charCodeAt(f++)) >> 2, 
            c = (3 & e) << 4 | (o = t.charCodeAt(f++)) >> 4, h = (15 & o) << 2 | (a = t.charCodeAt(f++)) >> 6, 
            d = 63 & a, isNaN(o) ? h = d = 64 : isNaN(a) && (d = 64), C = C + r.charAt(n) + r.charAt(c) + r.charAt(h) + r.charAt(d);
            return C;
        }, this.decode = function(t) {
            var e, o, a, n, c, h, d = "", C = 0;
            for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); C < t.length; ) e = r.indexOf(t.charAt(C++)) << 2 | (n = r.indexOf(t.charAt(C++))) >> 4, 
            o = (15 & n) << 4 | (c = r.indexOf(t.charAt(C++))) >> 2, a = (3 & c) << 6 | (h = r.indexOf(t.charAt(C++))), 
            d += String.fromCharCode(e), 64 != c && (d += String.fromCharCode(o)), 64 != h && (d += String.fromCharCode(a));
            return d = _utf8_decode(d);
        }, this._utf8_encode = function(r) {
            r = r.replace(/\r\n/g, "\n");
            for (var t = "", e = 0; e < r.length; e++) {
                var o = r.charCodeAt(e);
                o < 128 ? t += String.fromCharCode(o) : o > 127 && o < 2048 ? (t += String.fromCharCode(o >> 6 | 192), 
                t += String.fromCharCode(63 & o | 128)) : (t += String.fromCharCode(o >> 12 | 224), 
                t += String.fromCharCode(o >> 6 & 63 | 128), t += String.fromCharCode(63 & o | 128));
            }
            return t;
        }, this._utf8_decode = function(r) {
            for (var t = "", e = 0, o = c1 = c2 = 0; e < r.length; ) (o = r.charCodeAt(e)) < 128 ? (t += String.fromCharCode(o), 
            e++) : o > 191 && o < 224 ? (c2 = r.charCodeAt(e + 1), t += String.fromCharCode((31 & o) << 6 | 63 & c2), 
            e += 2) : (c2 = r.charCodeAt(e + 1), c3 = r.charCodeAt(e + 2), t += String.fromCharCode((15 & o) << 12 | (63 & c2) << 6 | 63 & c3), 
            e += 3);
            return t;
        };
    }
};