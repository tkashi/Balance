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
        },

        _appendSubject: function(subject) {
            this.view.append('.table tbody', 'subject', {
                subject: subject
            });
        },

        _setLogisticsTab: function(type, list) {
            this['_' + type + 's'] = list;
            this._setLogistics(list[0], type, this.$find('#' + type));
            
            var length = list.length;
            if (length > 1) {
                this.$find('.' + type +'-tab').hide();
                var $dropdown = this.$find('.' + type + '-tab-dropdown');
                $dropdown.show();
                var $dropdownMenu = $dropdown.find('.dropdown-menu');
                var $li = $dropdownMenu.find('li').eq(0);
                $dropdownMenu.empty();
                $dropdownMenu.append($li);
                for (var i = 1; i < length; i++) {
                    var $cloneLi = $li.clone();
                    $cloneLi.children().eq(0).text(type + ' ' + (i+1));
                    $dropdownMenu.append($cloneLi);
                }
            }
        },

        _setLogistics: function(logistics, type, $form) {
            var $checks = $form.find('[name=' + type +'Day]');
            $checks.prop('checked', false);
            var days = logistics.day.split('');
            for (var i = 0, len = days.length; i < len; i++) {
                $checks.filter('[value=' + days[i] + ']').prop('checked', true);
            }
            $form.find('[name=' + type + 'StartTime]').val(logistics.startTime);
            $form.find('[name=' + type + 'EndTime]').val(logistics.endTime);    
            $form.find('[name=' + type + 'Place]').val(logistics.place);    
        },

    };

    h5.core.expose(detailController);

})();
