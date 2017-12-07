(function() {
    "use strict";

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
            var d = new Date();
            var from = new Date();
            from.setDate(d.getDate() - d.getDay() + 1); // Monday
            var to = new Date();
            to.setDate(d.getDate() - d.getDay() + 7); // Sunday

            h5.ajax('../task/list', {
                dataType: 'json',
                data: {
                    date: {
                        '$gte': from.toLocaleDateString(),
                        '$lte': to.toLocaleDateString()                        
                    }
                }
            }).done(res => {
                var tasks = {};
                res.forEach(task => {
                    var taskDate = task.date.split('T')[0];
                    if (!tasks[taskDate]) {
                        tasks[taskDate] = [];
                    }
                    tasks[taskDate].push(task);
                });
                var $widget = this.$find('.task-widget2 > .row');
                for (var i = 0; i < 7; i++) {
                    d.setDate(from.getDate() + i);
                    var $dayTask = $(this.view.get('week-tasks', {
                        date: d.toDateString().slice(0, -5)
                    }));
                    var $listGroup = $dayTask.find('.list-group');
                    $widget.eq(parseInt((i + 1)/7)).append($dayTask);
                    this._taskListController.showTaskList(tasks[d.toISOString().split('T')[0]], $listGroup, true);
                }
            });
        },
    };

    h5.core.expose(weekViewController);
})();
