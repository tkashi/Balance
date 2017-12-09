var consts = require('../common/consts');

module.exports = {
    convertDateTimeToNum: function(datetime) {
        var msecDiff = datetime.getTime() - consts.BASE_DATE.getTime();
        msecDiff -= (datetime.getTimezoneOffset() - consts.BASE_DATE.getTimezoneOffset()) * 60 * 1000;
        return msecDiff / 1000 / 60 / 60 / 24;
    },

    convertDateToNum: function(date) {
        return Math.floor(this.convertDateTimeToNum(date));
    },

    convertNumToDate: function(num) {
        var date = new Date(consts.BASE_DATE);
        date.setDate(consts.BASE_DATE.getDate() + num);
        return date;
    }
};