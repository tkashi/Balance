var jQuery = require('jQuery')
(function($) {
    var h5 = require('../lib/h5/h5.dev.mod');
    var constants = require('./consts')

    var scheduleController = {
        __name: 'balance.main.ScheduleController',

        '#create_schedule click': function(contex, $el) {
            h5.ajax('events').done(res => {
                var $ul = this.$find('#event_list');
                $ul.empty();
                res.forEach((item) => {
                   $ul.append('<tr><td>' + item.summary + '</td><td>' + new Date(item.start.dateTime).toLocaleString() + '</td></tr>'); 
                });
            })
        }
    };

    var mainController = {
        __name: 'balance.main.MainController',

        _scheduleController: scheduleController,

        __meta: {
            _scheduleController: {
                rootElement: '#schedule'
            }
        },

        __ready: function(context){
            h5.ajax('usersubject/list', {
               data: {
                   term: constants.DEFAULT_CURRENT_TERM
               }
            }).done((res) => {
                var $subjects = this.$find('.subject');
                res.forEach((item, idx) => {
                    $subjects.eq(idx).find('.subject_id').val(item.subjectId);
                    $subjects.eq(idx).find('.subject_title').text(item.title);
                });
            });
        },

        '.subject_id change': function(context, $el){
            var $title = $el.siblings('.subject_title');
            h5.ajax(constants.BASE_URL + 'terms/2017FA/subjects/' + $el.val(), {
                headers: {
                   client_id: constants.CLIENT_ID,
                   client_secret: constants.CLIENT_SECRET
                }
            }).done((data) => {
                $title.text(data.item.title);
            }).fail((jqXhr, textStatus, errorThrownbata) => {
                $title.text('Not Found');
            })
        },

        '#register click': function(contex, $el) {
            var courses = this.$find('.subject').toArray().map((item) => {
                var $el = $(item);
                return {
                    subjectId: $el.find('.subject_id').val(),
                    title: $el.find('.subject_title').text()
                }
            });
            h5.ajax('usersubject/register', {
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(courses)
            }).done((res) => {
                alert('Registered.')
            });
        }
    };

    $(function() {
        h5.core.controller('#container', mainController)
    })
        
})(jQuery);

