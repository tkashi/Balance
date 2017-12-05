(function() {
    "use strict";

    var consts = balance.common.consts;

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
            h5.ajax('../usersubject/list', {
                data: {
                    term: consts.DEFAULT_CURRENT_TERM
                }
            }).done((res) => {
                res.forEach(subject => {
                    this._appendSubject(subject);   
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

                this._setLogisticsTab('lecture', res.lectures);

                if (res.recitations) {
                    this._setLogisticsTab('recitation', res.recitations);
                }
            });
        },

        '.logistics .dropdown-menu li click': function(context, $el) {
            $el.siblings().removeClass('active');
            var index = $el.index();
            this._setLogistics(this._recitations[index], this.$find('#recitation'));
        },

        '.add-subject click': function() {
            var values = this._formController.getValues();
            

        },

        _appendSubject: function(subject) {
            this.view.append('.table tbody', 'subject', {
                subject: subject
            });
        },

        _setLogisticsTab: function(type, list) {
            this['_' + type + 's'] = list;
            this._setLogistics(list[0], this.$find('#' + type));
            
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

        _setLogistics: function(logistics, $form) {
            var $checks = $form.find('[name=day]');
            $checks.prop('checked', false);
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
