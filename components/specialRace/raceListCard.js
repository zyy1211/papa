require("../../utils/util.js");

Component({
    properties: {
        raceInfo: {
            type: Object,
            value: {}
        }
    },
    methods: {
        navigate: function(e) {
            this.triggerEvent("navigate", {
                e: e
            });
        }
    }
});