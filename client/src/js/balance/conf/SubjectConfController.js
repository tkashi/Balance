(function() {
    "use strict";

    var consts = balance.common.consts;

    var DAYS = ['M', 'T', 'W', 'R', 'F'];

    function convetDaysToValues(day) {
        return DAYS.map(D => {
            return day.indexOf(D) > -1;
        });
    }

    var subjectConfController = {
        __name: 'balance.conf.SubjectConfController',

        _formController: h5.ui.FormController,

        __meta: {
            _formController: {
                rootElement: 'form'
            }
        },

        __templates: ['../ejs/course-conf.ejs'],

        __ready: function(context) {
            this._loadSubjectList();
        },

        '.add-btn click': function() {
            if (this._isUpdatedPushed) {
                this._formController.clearValue();
            }
            this.$find('.add-subject').text('Add Subject');      
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

                this._setLogisticsTab('lecture', res.lectures);

                if (res.recitations) {
                    this._setLogisticsTab('recitation', res.recitations);
                }
            });
        },

        '.logistics .dropdown-menu li click': function(context, $el) {
            $el.siblings().removeClass('active');
            var index = $el.index();
            this._setLogistics(this._recitations[index], 'recitation', this.$find('#recitation'));
        },

        '.add-subject click': function(context, $el) {
            var values = this._formController.getValue();

            var subject = {
                number: values.number,
                term: values.term,
                title: values.title,
                lecturer: values.lecturer,
                lecture: {
                    day: values.lectureDay.join(''),
                    startTime: values.lectureStartTime,
                    endTime: values.lectureEndTime,
                    place: values.lecturePlace
                }
            };

            if (values.recitationDay && values.recitationDay.length) {
                subject.recitation = {
                    day: values.recitationDay.length == 1 ? values.recitationDay : values.recitationDay.join(''),
                    startTime: values.recitationStartTime,
                    endTime: values.recitationEndTime,
                    place: values.recitationPlace
                };
            }

            h5.ajax('../usersubject/register', {
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(subject)
            }).done((res) => {
                this._loadSubjectList();
                alert('Registered.');
                this.$find('#subject-modal').modal('hide');

            });
        },

        '[data-original-title="Edit"] click': function(context, $el) {
            this._isUpdatedPushed = true;
            var index = $el.closest('tr').index();
            var subject = this._subjects[index];
            this._formController.setValue({
                number: subject.number,
                term: subject.term,
                title: subject.title,
                lecturer: subject.lecturer,
                lectureDay: convetDaysToValues(subject.lecture.day),
                lectureStartTime: subject.lecture.startTime,
                lectureEndTime: subject.lecture.endTime,
                lecturePlace: subject.lecture.place
            });

            if (subject.recitation) {
                this._formController.setValue({
                    recitationDay: convetDaysToValues(subject.recitation.day),
                    recitationStartTime: subject.recitation.startTime,
                    recitationEndTime: subject.recitation.endTime,
                    recitationPlace: subject.recitation.place    
                });
            }
            this.$find('.add-subject').text('Update Subject');
        },

        _loadSubjectList: function() {
            h5.ajax('../usersubject/list', {
                data: {
                    term: consts.DEFAULT_CURRENT_TERM
                }
            }).done((res) => {
                res.forEach(subject => {
                    this._appendSubject(subject);   
                });
                this._subjects = res;
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

    h5.core.expose(subjectConfController);

})();
