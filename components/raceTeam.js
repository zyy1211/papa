Component({
    properties: {
        teamInfo: {
            type: Object,
            value: {}
        },
        teamIndex: {
            type: Number,
            value: null
        },
        isHnRace: {
            type: Boolean,
            value: !1
        }
    },
    data: {
        isShowMore: !1
    },
    methods: {
        changeShowMore: function() {
            this.setData({
                isShowMore: !this.data.isShowMore
            });
        }
    }
});