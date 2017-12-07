(function() {
    "use strict";

    var consts = balance.common.consts;

    var listController = {
        __name: 'balance.task.ListController',

        __templates: '../ejs/task-list.ejs',

        __construct: function(context) {
            this._type = context.args.type;      
        },

        __ready: function(context) {
            this._loadList();
        },

        _loadList: function() {
            h5.ajax('../task/list', {
                data: {
                    type: this._type
                }
            }).done(res => {
                // res.sort((a, b) => {
                //     return a.date > b.date ? 1 : -1;
                // });
                this.view.update('.white-box', this._type, {
                    tasks: res
                });
            });
        }
    };

    h5.core.expose(listController);

})();
