Component({
    properties: {
        enterTime: String
    },
    attached: function() {
        this.setData({
            enterTimeRange: "报名截止时间" + this.data.enterTime + "，请在此时间前提交团队报名名单。"
        });
    }
});