(function() {
    var consts = balance.common.consts;
    
    h5.u.obj.expose('balance.common.utils', {
        formatDate: function(date, timeStr) {
            var d = typeof date === 'number' ? this.convertNumToDate(date) : new Date(date);
            var dateStr = d.toLocaleDateString() + ' ' + timeStr; 
            return dateStr;
        },

        formatDueDate: function(datetime) {
            var d = typeof datetime === 'number' ? this.convertNumToDate(datetime) : new Date(datetime);
            var time = d.toLocaleTimeString();
            var hourAndMin = time.split(':');
            if (time.indexOf('PM') > -1) {
                hourAndMin[0] = parseInt(hourAndMin[0]) + 12;
            }
            var dateStr = d.toLocaleDateString() + ' ' + hourAndMin[0] + ':' + hourAndMin[1]; 
            return dateStr;
        },

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
    });
})();