(function() {
    "use strict";

    var consts = balance.common.consts;

    var detailController = {
        __name: 'balance.subject.DetailController',

        __templates: '../ejs/subject-detail.ejs',

        __construct: function(context) {
            this._id = location.hash.slice(location.hash.indexOf('_h5_arg=') + 9);         
        },

        __ready: function(context) {
            this._loadSubjectInfo();
        },

        _loadSubjectInfo: function() {
            h5.async.when(h5.ajax('../usersubject/' + this._id), h5.ajax('../task/list', {
                    data: {
                        userSubjectId: this._id,
                        type: {
                            '$not': 'completed'
                        }
                    }
            })).done((subject, tasks) => {
                var tasksGroupByCategory = {
                    subject: subject[0],
                    Lecture: [],
                    Assignment: [],
                    Reading: []
                };
                for (var i = 0, len = tasks[0].length; i < len; i++) {
                    var t = tasks[0][i];
                    tasksGroupByCategory[t.category].push(t);
                }
                this.view.update('.container-fluid', 'detail', tasksGroupByCategory);
            });
        }
    };

    h5.core.expose(detailController);

})();
