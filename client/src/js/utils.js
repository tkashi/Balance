(function() {
    h5.u.obj.expose('balance.common.utils', {
        formatDate: function(dateStr, timeStr) {
            var d = new Date(dateStr);
            var dateStr = d.toLocaleDateString() + ' ' + timeStr; 
            return dateStr;
        },

        formatDueDate: function(datetime) {
            var d = new Date(datetime);
            var time = d.toLocaleTimeString();
            var hourAndMin = time.split(':');
            if (time.indexOf('PM') > -1) {
                hourAndMin[0] = parseInt(hourAndMin[0]) + 12;
            }
            var dateStr = d.toLocaleDateString() + ' ' + hourAndMin[0] + ':' + hourAndMin[1]; 
            return dateStr;
        }
    });
})();