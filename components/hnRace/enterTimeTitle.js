Component({
    properties: {},
    data: {
        enterTimeRange: ""
    },
    attached: function() {
        this.setData({
            enterTimeRange: "报名时间: " + wx.getStorageSync("enterRange")
        });
    },
    methods: {}
});