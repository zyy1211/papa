Component({
    properties: {
        footerData: {
            type: Object,
            value: {}
        }
    },
    data: {
        enterType: "",
        hideProtocol: !0,
        hideRelief: !0
    },
    attached: function() {
        this.setData({
            enterType: wx.getStorageSync("enterType")
        });
    },
    methods: {
        onSubmit: function(e) {
            this.triggerEvent("onSubmit", {
                type: e.currentTarget.dataset.etype
            });
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