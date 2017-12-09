(function() {
    "use strict";

    var utils = balance.common.utils; 

    var taskController = {
        __name: 'balance.overview.TaskListController',

        _formController: h5.ui.FormController,

        __meta: {
            _formController: {
                rootElement: '#register-task'
            }
        },

        __init: function() {
            this.view.update('#new-task-modal', 'modal-dialog');
        },

        __ready: function(context) {
            this.$find('.date').text(new Date().toDateString());
        },

        '.add-task click': function(context, $el) {
            context.event.preventDefault();
            var values = this._formController.getValue();
            values.type = 'incoming';
            values.dueDate = utils.convertDateToNum(new Date(values.dueDate));
            h5.ajax('../task/register', {
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(values)
            }).done(res => {
                alert('A task has registered');
                this.$find('#new-task-modal').modal('hide');
                this.trigger('taskRegistered', {
                    task: res
                });
            });
        },

        showTaskList: function(tasks, element, isSimple) {
            element = element || '.list-group';
            this.view.update(element, 'tasks', {
                tasks: tasks,
                isSimple: isSimple || false
            });
        }
    };

    h5.core.expose(taskController);
})();
