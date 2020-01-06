Component({
    properties: {
        cardDetail: {
            type: Object,
            value: {}
        }
    },
    data: {},
    methods: {
        onRemove: function(e) {
            var t = e.currentTarget.dataset, r = t.id, i = t.racememberid;
            this.triggerEvent("onRemove", {
                id: r,
                racememberid: i
            });
        },
        onCheck: function(e) {
            var t = e.currentTarget.dataset, r = t.groupid, i = t.registered, n = t.total, o = t.name, a = t.checked;
            if (Number(i) >= Number(n) && !a) return wx.showModal({
                title: "提示",
                showCancel: !1,
                content: "当前组别" + o + "可报名人数已满"
            }), void this.triggerEvent("onCheck", {
                groupid: ""
            });
            this.triggerEvent("onCheck", {
                groupid: r
            });
        },
        showRejectInfo: function(e) {
            var t = e.currentTarget.dataset.id;
            this.triggerEvent("showInfo", {
                id: t
            });
        }
    }
});