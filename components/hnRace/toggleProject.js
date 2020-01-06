Component({
    attached: function() {},
    properties: {
        projectList: {
            type: Array,
            default: [],
            observer: function(t, e) {
                var a = this.data.projectList;
                a.length > 0 && this.setData({
                    projectName: a[0].name
                });
            }
        }
    },
    data: {
        arrowTransition: !1,
        projectName: "",
        projectTop: 0,
        buttonTop: 0,
        toggleText: "切换组别",
        hasBorder: !1,
        hasMask: !1,
        hideMask: !1
    },
    methods: {
        toggleProject: function() {
            var t = this, e = this.data.projectTop, a = !1, o = 0, s = "", r = !1;
            0 !== e ? (s = "切换组别", o = e = 0, a = !1, r = !1, this.setData({
                hideMask: r,
                arrowTransition: !1
            }), setTimeout(function() {
                t.setData({
                    hasMask: !1
                });
            }, 400)) : (a = !0, s = "收起", o = (e = 86 * this.data.projectList.length) - 10 > 600 ? 590 : e - 10, 
            r = !0, this.setData({
                hasMask: !0,
                arrowTransition: !0
            }), setTimeout(function() {
                t.setData({
                    hideMask: r
                });
            }, 100)), this.setData({
                projectTop: e,
                buttonTop: o,
                toggleText: s,
                hasBorder: a
            });
        },
        chooseProject: function(t) {
            t.target.dataset.project.id;
            var e = t.target.dataset.project.name;
            this.setData({
                projectName: e
            }), this.closeList(), this.triggerEvent("chooseProject", {
                projectId: t.target.dataset
            });
        },
        closeList: function() {
            var t = this;
            this.setData({
                hideMask: !1,
                buttonTop: 0,
                projectTop: 0,
                hasBorder: !1,
                toggleText: "切换项目",
                arrowTransition: !1
            }), setTimeout(function() {
                t.setData({
                    hasMask: !1
                });
            }, 400);
        }
    }
});