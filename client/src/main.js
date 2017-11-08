var jQuery = require('jQuery')
(function($) {
    var h5 = require('../lib/h5/h5.dev.mod');
    var constants = require('./consts')

    // Client ID and API key from the Developer Console
    var CLIENT_ID = '1084756031819-4njot1fb1cg5bfl83r8tj75in968on17.apps.googleusercontent.com';
    
    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    var calendarController = {
        __name: 'balance.main.CalendarController',

        __ready: function() {
            this._$authorizeButton = this.$find('#authorize-button');
            this._$signoutButton = this.$find('#signout-button');
            this._$content = this.$find('#content');
      
            /**
             *  On load, called to load the auth2 library and API client library.
             */
            gapi.load('client:auth2', this.own(this._initClient));
        },

        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        _initClient: function() {
            gapi.client.init({
                discoveryDocs: DISCOVERY_DOCS,
                clientId: CLIENT_ID,
                scope: SCOPES
            }).then(() => {
                // Listen for sign-in state changes.
                gapi.auth2.getAuthInstance().isSignedIn.listen(this.own(this._updateSigninStatus));
        
                // Handle the initial sign-in state.
                this._updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
        },
    
        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        _updateSigninStatus: function(isSignedIn) {
            if (isSignedIn) {
                this._$authorizeButton.hide();
                this._$signoutButton.show();
                this._listUpcomingEvents();
            } else {
                this._$authorizeButton.show();
                this._$signoutButton.hide();
            }
        },
    
        /**
         *  Sign in the user upon button click.
         */
        '#authorize-button click': function(event) {
            gapi.auth2.getAuthInstance().signIn();
        },
    
        /**
         *  Sign out the user upon button click.
         */
        '#signout-button click': function(event) {
            gapi.auth2.getAuthInstance().signOut();
        },
    
        /**
         * Append a pre element to the body containing the given message
         * as its text node. Used to display the results of the API call.
         *
         * @param {string} message Text to be placed in pre element.
         */
        _appendPre: function(message) {
            this._$content.text(message);
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
            }).then(response => {
                var events = response.result.items;
                this._appendPre('Upcoming events:');
    
                if (events.length > 0) {
                    for (i = 0; i < events.length; i++) {
                    var event = events[i];
                    var when = event.start.dateTime;
                    if (!when) {
                        when = event.start.date;
                    }
                    this._appendPre(event.summary + ' (' + when + ')')
                    }
                } else {
                    this._appendPre('No upcoming events found.');
                }
            });
        }
    
    };

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

        // _calendarController: calendarController,

        _scheduleController: scheduleController,

        __meta: {
            // _calendarController: {
            //     rootElement: '#calendar'
            // },
            _scheduleController: {
                rootElement: '#schedule'
            }
        },

        __ready: function(context){
            h5.ajax('mycourses', {
               
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
            h5.ajax('mycourses', {
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

