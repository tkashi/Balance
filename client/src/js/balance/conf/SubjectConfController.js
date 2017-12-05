(function() {
    "use strict";

    var consts = balance.common.consts;

    var subjectConfController = {
        __name: 'balance.conf.SubjectConfController',

        __templates: ['../ejs/course-conf.ejs'],

        __ready: function(context) {
            h5.ajax('../usersubject/list', {
                data: {
                    term: consts.DEFAULT_CURRENT_TERM
                }
            }).done((res) => {
                this.view.update('.table tbody', 'subjects', {
                    subjects: res
                });
            });
        },

        '.search click': function() {
            var number = this.$find('#subject-number').val();
            h5.ajax('../subject/searchByNumber', {
                data: {
                    number: number,
                    term: this.$find('#subject-term').val()
                }
            }).done(res => {
                if (!res.number) {
                    alert('No subject is found');
                    return
                }

                this.$find('#subject-title').val(res.title);
                this.$find('#subject-lecturer').val(res.lecturer);

                this._setLogistics(res.lectures[0], this.$find('#lecture'));

                if (res.lectures.length > 2) {
                    this.$find('.lecture-tab').hide();
                    this.$find('.lecture-tab-dropdown').show();
                } 
            });
        },

        _setLogistics: function(logistics, $form) {
            var $checks = $form.find('[name=day]');
            var days = logistics.day.split('');
            for (var i = 0, len = days.length; i < len; i++) {
                $checks.filter('[value=' + days[i] + ']').prop('checked', true);
            }
            $form.find('[name=startTime]').val(logistics.startTime);
            $form.find('[name=endTime]').val(logistics.endTime);    
            $form.find('[name=place]').val(logistics.place);    
        },

    };

    h5.core.expose(subjectConfController);

})();
