(function() {
    "use strict";

    /* ===== Knob chart initialization ===== */

    $(function() {

        $('.knob').each(function() {

            var elm = $(this);
            var perc = elm.attr("value");

            elm.knob();

            $({ value: 0 }).animate({ value: perc }, {
                duration: 1000,
                easing: 'swing',
                progress: function() {
                    elm.val(Math.ceil(this.value)).trigger('change')
                }
            });
        });
    });

    $("#earning").easyPieChart({
        barColor: "#4da8db",
        trackColor: !1,
        scaleColor: !1,
        scaleLength: 0,
        lineCap: "square",
        lineWidth: 12,
        size: 96,
        rotate: 180,
        animate: { duration: 2e3, enabled: !0 }
    });
    $("#pending").easyPieChart({
        barColor: "#4db7df",
        trackColor: !1,
        scaleColor: !1,
        scaleLength: 0,
        lineCap: "square",
        lineWidth: 12,
        size: 74,
        rotate: 180,
        animate: { duration: 2e3, enabled: !0 }
    });
    $("#booking").easyPieChart({
        barColor: "#4ccfe4",
        trackColor: !1,
        scaleColor: !1,
        scaleLength: 0,
        lineCap: "square",
        lineWidth: 12,
        size: 50,
        rotate: 180,
        animate: { duration: 2e3, enabled: !0 }
    });

    h5.settings.scene.autoInit = true;
    h5.settings.scene.urlHistoryMode = h5.scene.urlHistoryMode.HASH; // comment in during development
    h5.settings.res.baseUrl = 'js/';

    var consts = balance.common.consts;
    
    var pageController = {
        __name: 'balance.PageController',

        _mainSceneContainer: null,

        __ready: function() {
            this._mainSceneContainer = h5.scene.getMainSceneContainer();
            this._updateSubjectMenu();
        },

        '#side-menu a[href] click': function(context, $el) {
            context.event.preventDefault();
            this._mainSceneContainer.navigate($el.attr('href'));
        },

        '#page-wrapper updateSubjects': function() {
            this._updateSubjectMenu();
        },

        '#side-menu .subjects a click': function(context, $el) {
            context.event.preventDefault();
            this._mainSceneContainer.navigate({
                to: $el.attr('href'),
                arg: $el.data('subjectId')
            });
        },

        _updateSubjectMenu: function() {
            h5.ajax('../usersubject/list', {
                data: {
                    term: consts.DEFAULT_CURRENT_TERM
                }
            }).done((res) => {
                this.view.update('#side-menu .subjects', 'subjectMenu', {
                    subjects: res
                });
            });
        }
    };

    $(function() {
        h5.core.controller(document.body, pageController);
    });

    var taskController = {
        __name: 'balance.overview.TaskController',

        _formController: h5.ui.FormController,

        __meta: {
            _formController: {
                rootElement: '#register-task'
            }
        },

        __ready: function(context) {
            this.$find('.date').text(new Date().toDateString());
            this._showTaskList();
            this._showTaskTypeCount();
        },

        '.add-task click': function(context, $el) {
            context.event.preventDefault();
            var values = this._formController.getValue();
            h5.ajax('../task/register', {
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(values)
            }).done(res => {
                alert('A task has registered');
                this.$find('#new-task-modal').modal('hide');
                this._showTaskList();
            });
        },

        _showTaskTypeCount: function() {
            h5.ajax('../task/countType', {
                type: 'GET',
                dataType: 'json'
            }).done(res => {
                var total = 0;
                var $infoBoxes = this.$find('.info-box');
                ['incoming', 'allocated', 'completed'].forEach(type => {
                    $infoBoxes.filter('.' + type).find('.info-count').text(res[type] || 0);
                    total += res[type] || 0;
                });
                $infoBoxes.filter('.allocated').find('.pending').text(res.pending || 0);
                total += res.pending || 0;
                $infoBoxes.filter('.completed').find('.total-num').text(total);

                this._showPercentage(res.completed, total);
            });
        },

        _showPercentage: function(completed, total) {
            var percentage = parseInt(completed / total);
            this.$find('.report-widget .m-0').text(percentage);
            this.$find('.css-bar').addClass('css-bar-' + percentage);            
        },

        _showTaskList: function() {
            h5.ajax('../task/list', {
                dataType: 'json'
            }).done(res => {
                this.$find('.today-task-num').text(('0' + res.length).slice(-2) + ' ');
                this.view.update('.list-group', 'tasks', {
                    tasks: res
                });
                var dangerTaskNum = 0;
                res.forEach(task => {
                    if (task.urgency == 5) {
                        dangerTaskNum++;
                    }
                });
                this.$find('.danger-task-num').text(('0' + dangerTaskNum).slice(-2) + ' ');
            });
        }
    };

    h5.core.expose(taskController);

    // $(function() {
    //     h5.core.controller('.page-wrapper', taskController);
    // });
})();
