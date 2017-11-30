$(function() {
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

    var taskLogic = {
        __name: 'balance.desktop.TaskLogic',        
    };

    var taskController = {
        __name: 'balance.desktop.TaskController',

        // _formController: h5.ui.FormController,

        // __meta: {
        //     _formController: {
        //         rootElement: '#register_task'                
        //     }
        // },

        __ready: function(context) {
            this.$find('.date').text(new Date().toDateString());
            h5.ajax('../task/list', {
                dataType: 'json'
            }).done(res => {
                this.$find('.task-num').text(res.length);
                this.view.update('.list-group', 'tasks', {
                    tasks: res.slice(0, 5)
                });
            });
        },

        '#register_task button click': function(context, $el) {
            context.event.preventDefault();
            var values = this._formController.getValue();
            h5.ajax('task/register', {
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(values)
            }).done(res => {
                alert('Registered a task');
            });
        }
    }

    $(function() {
        h5.core.controller('.page-wrapper', taskController);
    });
});
