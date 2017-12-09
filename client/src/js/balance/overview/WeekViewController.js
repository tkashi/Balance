(function() {
    "use strict";

    var utils = balance.common.utils; 

    var weekViewController = {
        __name: 'balance.overview.WeekViewController',

        _taskListController: h5.res.dependsOn('balance.overview.TaskListController'),

        __meta: {
            _taskListController: {
                rootElement: '.task-widget2'
            }
        },

        __ready: function(context) {
            this.$find('.date').text(new Date().toDateString());
            this._showTaskList();
        },

        _showTaskList: function() {
            var d = utils.convertDateToNum(new Date());
            var day = new Date().getDay();
            var from = d - day + 1; // Monday
            var to = from + 6; // Sunday

            h5.ajax('../task/list', {
                dataType: 'json',
                data: {
                    date: {
                        '$gte': from,
                        '$lte': to                       
                    }
                }
            }).done(res => {
                var tasks = {};
                res.forEach(task => {
                    var taskDate = task.date;
                    if (!tasks[taskDate]) {
                        tasks[taskDate] = [];
                    }
                    tasks[taskDate].push(task);
                });
                var $widget = this.$find('.task-widget2 > .row');
                for (var i = from; i <= to; i++) {
                    var $dayTask = $(this.view.get('week-tasks', {
                        date: utils.convertNumToDate(i)
                    }));
                    var $listGroup = $dayTask.find('.list-group');
                    $widget.eq((i == to ? 1 : 0)).append($dayTask);
                    this._taskListController.showTaskList(tasks[i], $listGroup, true);
                }
            });
        },
    };

    h5.core.expose(weekViewController);
})();
