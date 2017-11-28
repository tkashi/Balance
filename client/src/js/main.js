var jQuery = require('jQuery')
(function($) {
    var h5 = require('../../plugins/h5/h5.dev.mod');
    var constants = require('./consts');

     // Client ID and API key from the Developer Console
     var CLIENT_ID = '1084756031819-4njot1fb1cg5bfl83r8tj75in968on17.apps.googleusercontent.com';
     var API_KEY = '';

     var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];     

     // Authorization scopes required by the API; multiple scopes can be
     // included, separated by spaces.
     var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
   

    var scheduleController = {
        __name: 'balance.main.ScheduleController',

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      __ready: function() {
        gapi.load('client:auth2', this.own(this._initClient));
      },

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      _initClient: function() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(res => {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(this.own(this._updateSigninStatus));
        });
      },

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
       _updateSigninStatus: function(isSignedIn) {
        if (isSignedIn) {
        //   authorizeButton.style.display = 'none';
        //   signoutButton.style.display = 'block';
          this._listUpcomingEvents();
        // } else {
        //   authorizeButton.style.display = 'block';
        //   signoutButton.style.display = 'none';
        }
      },

      /**
       *  Sign in the user upon button click.
       */
      '#create_schedule click': function(context) {
        gapi.auth2.getAuthInstance().signIn();
      },

      /**
       *  Sign out the user upon button click.
       */
      '#signout-button click': function(context) {
        gapi.auth2.getAuthInstance().signOut();
      },

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      _listUpcomingEvents: function() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(res =>  {
          var events = res.result.items;
          var tasks = events.map(event => {
            var start = new Date(event.start.dateTime);
            var end = new Date(event.end.dateTime);
            return {
                title: event.summary        ,
                duration: end.getHours() - start.getHours(),
                plannedStartDate: start.getHours() + ':' + start.getMinutes(),
                plannedEndDate: end.getHours() + ':' + end.getMinutes(),
                dueDate: start.getFullYear() + '-' + start.getMonth() + '-' + start.getDate(),
                type: 'allocted'
            };
          });
          h5.ajax('task/register', {
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(tasks)
        }).done(res => {
            alert('Registered a task');
        });
        });
      }
    };

    var taskController = {
        __name: 'balance.main.TaskController',

        _formController: h5.ui.FormController,

        __meta: {
            _formController: {
                rootElement: '#register_task'                
            }
        },

        __ready: function(context) {
            h5.ajax('task/list', {
                dataType: 'json'
            }).done(res => {
                var $table = this.$find('#task_list');
                var list = res;
                list.forEach(task => {
                    var tr = '<tr>';
                    tr += '<td><input type="checkbox" ' + (task.type == 'completed' ? 'checked' : '') +'></td>';
                    tr += '<td>' + task.title + '</td>';
                    tr += '<td>' + task.dueDate+ '</td>';
                    tr += '<td>' + task.duration + '</td>';
                    tr += '<td>' + (task.subjectId || '')  + '</td>';
                    tr += '<td>' + (task.priority || '')  + '</td>';
                    tr += '<td>' + (task.urgency || '') + '</td>';
                    tr += '<td><button datre-delete>Delete</button></td>';
                    tr += '</td>';
                    $table.append(tr);
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

    var mainController = {
        __name: 'balance.main.MainController',

        _scheduleController: scheduleController,

        _taskController: taskController,

        __meta: {
            _scheduleController: {
                rootElement: '#schedule'
            },
            _taskController: {
                rootElement: '#task'
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

