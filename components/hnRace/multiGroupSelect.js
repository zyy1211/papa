Component({
    properties: {
        allSubjects: {
            type: Array,
            value: []
        },
        multiSelectTitle: String
    },
    data: {
        checked: [],
        scrollViewHeight: 360,
        allowPlayerInTwoMatcher: !0
    },
    attached: function() {
        var e = this;
        wx.getStorage({
            key: "allowPlayerInTwoMatcher",
            success: function(t) {
                e.setData({
                    allowPlayerInTwoMatcher: t.data
                });
            }
        });
        var t = void 0, r = this.properties.allSubjects, s = void 0 === r ? [] : r;
        t = s.length <= 1 ? 360 : 2 === s.length ? 600 : 720, this.setData({
            scrollViewHeight: t
        }), this.selectedGroupIds = this.properties.allSubjects.filter(function(e) {
            return e.checked;
        }).map(function(e) {
            return e.id;
        });
    },
    methods: {
        onRemove: function(e) {
            var t = this, r = e.detail, s = r.id, i = r.racememberid;
            wx.showModal({
                title: "移除确认",
                content: "移除组别视为取消该组别报名，是否继续移除",
                success: function(e) {
                    e.confirm && t.triggerEvent("removeGroup", {
                        id: s,
                        racememberid: i
                    });
                }
            });
        },
        onCheck: function(e) {
            var t = e.detail.groupid;
            this.data.allowPlayerInTwoMatcher ? this.selectedGroupIds.indexOf(t) > -1 ? this.selectedGroupIds = this.selectedGroupIds.filter(function(e) {
                return e !== t;
            }) : this.selectedGroupIds.push(t) : this.selectedGroupIds.length > 0 ? (-1 === this.selectedGroupIds.indexOf(t) && wx.showModal({
                title: "提示",
                showCancel: !1,
                content: "一人不可选择多个组别"
            }), this.selectedGroupIds = this.selectedGroupIds.filter(function(e) {
                return e !== t;
            })) : this.selectedGroupIds.push(t), this.triggerEvent("groupCheck", {
                ids: this.selectedGroupIds
            });
        },
        showErrorInfo: function(e) {
            var t = e.detail.id;
            this.triggerEvent("showErrorInfo", {
                id: t
            });
        }
    }
});