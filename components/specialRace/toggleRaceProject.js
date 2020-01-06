Component({
    properties: {
        projectList: {
            type: Array,
            value: [],
            observer: function(t, e) {
                if (JSON.stringify(t) !== JSON.stringify(e)) {
                    var a = this.data.projectList;
                    a.length > 0 && this.setData({
                        projectName: a[0].name
                    });
                }
            }
        }
    },
    data: {
        isToggle: !1,
        projectName: ""
    },
    methods: {
        toggle: function() {
            var t = this, e = t.data.isToggle;
            t.setData({
                isToggle: !e
            });
        },
        chooseProject: function(t) {
            t.target.dataset.project.id;
            var e = t.target.dataset.project.name;
            this.setData({
                projectName: e
            }), this.closeToggle(), this.triggerEvent("chooseProject", {
                project: t.target.dataset
            });
        },
        closeToggle: function() {
            this.setData({
                isToggle: !1
            });
        }
    }
});