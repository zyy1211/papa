var e = require("../../utils/util.js"), t = {
    isLink: !0
};

Component({
    properties: {
        footerData: {
            type: Object,
            value: {}
        },
        memberList: {
            type: Object,
            value: []
        }
    },
    data: {
        hideProtocol: !0,
        hideRelief: !0
    },
    methods: {
        onSubmit: function(i) {
            var o = i.detail, a = void 0 === o ? {} : o, n = (a.formId, a.target), s = void 0 === n ? {} : n;
            t.isLink && (t.isLink = !1, this.triggerEvent("onSubmit", {
                type: s.dataset.etype
            }), setTimeout(function() {
                t.isLink = !0, e.requestEmpty(i);
            }, 1500));
        },
        checkboxChange: function(e) {
            this.triggerEvent("checkboxChange", {
                checked: Boolean(e.detail.value.length)
            });
        },
        showProtocolModal: function() {
            this.setData({
                hideProtocol: !1
            });
        },
        hideProtocolModal: function() {
            this.setData({
                hideProtocol: !0
            });
        },
        showReliefModal: function() {
            this.setData({
                hideRelief: !1
            });
        },
        hideReliefModal: function() {
            this.setData({
                hideRelief: !0
            });
        }
    }
});