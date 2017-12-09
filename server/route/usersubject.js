var consts = require('../common/consts');
var utils = require('../common/utils');
var dbmapper = require('../dbmapper/userSubjectMapper');
var taskMapper = require('../dbmapper/taskMapper');
var commonSubject = require('../common/subject');
var axios = require('axios');

var DAY_MAP = {
    'M': 1,
    'T': 2,
    'W': 3,
    'R': 4,
    'F': 5
};

var holidays = [];
axios.get('http://m.mit.edu/apis/calendars/academic_holidays/events/').then(res => {
    res.data.forEach(h => {
        var start = new Date(h.start_at);
        var end = new Date(h.end_at);
        for (var d = start; d <= end; d.setDate(d.getDate() + 1)) {
            holidays.push(d.toISOString().split('T')[0]);
        }
    });
});


function checkAndRegisterSubject(subjectId) {
    subjetDbMapper.findByNumberAndTerm(subjectId, term, (error, result) => {
        if (result) {
            return;
        }

        // retreive from MIT course catalog
        commonSubject.retriveAndRegisterSubject(subjectId, term);
    })
}

function getHour(time) {
    return parseInt(time.split(':')[0]);
}

function registerTask(type, s) {
    if (!s[type]) {
        return;
    }
    
    var days = s[type].day.split('');
    var diffOfDays = days.map(day => {
        var diffOfDay = DAY_MAP[day] - consts.CURRENT_TERM_FROM.getDay();
        if (diffOfDay < 0) {
            diffOfDay += 7;
        }
        return diffOfDay;
    });

    diffOfDays.sort();

    var label = type == 'lecture' ? 'Lecture' : 'Recitation';
    var today = utils.convertDateToNum(new Date());
    diffOfDays.forEach((diff, index) => {
        var date = utils.convertDateToNum(consts.CURRENT_TERM_FROM);
        date += diff;

        var count = index + 1;
        var toDate = utils.convertDateToNum(consts.CURRENT_TERM_TO);
        while (date <= toDate) {
            var dateStr = utils.convertNumToDate(date).toISOString().split('T')[0];
            var dueDateTime = utils.convertDateTimeToNum(new Date(dateStr + ' ' + s[type].endTime));
            if (holidays.indexOf(dateStr) == -1) {
                taskMapper.insert({
                    userId: s.userId,
                    userSubjectId: s._id.toHexString(),
                    number: s.number,
                    title: s.number + ' - ' + label +' ' + count,
                    importance: 5,
                    type: today <= dueDateTime ? 'allocated' : 'completed',
                    dueDateTime: dueDateTime,
                    startTime: s[type].startTime,
                    endTime: s[type].endTime,
                    duration: getHour(s[type].endTime) - getHour(s[type].startTime),
                    date: date,
                    category: 'Lecture'
                });    
            }
            date += 7;
            count += days.length;           
        }
    });
}


module.exports = function(express) {
    var userSubjectRoute = express.Router();

    userSubjectRoute.route('/register').post((req, res) => {
        var s = req.body;
        s.userId = consts.DUMMY_USER_ID;

        dbmapper.upsert(s, (err, result) => {
            dbmapper.find({
                userId: s.userId,
                term: s.term,
                number: s.number
            }, (error, subjects) => {
                s = subjects[0];
                registerTask('lecture', s);
                registerTask('recitation', s);
                res.json(result);
            });
        });
    });

    userSubjectRoute.route('/list').get((req, res) => {
        var query = Object.assign({
            userId: consts.DUMMY_USER_ID            
        }, res.query);
        dbmapper.find(query, (error, result) => {
            res.json(result);
        });
    });
    
    userSubjectRoute.route('/:id').get((req, res) => {
        dbmapper.findById(req.params.id, (error, result) => {
            res.json(result);
        });
    }); 

    return userSubjectRoute;

};