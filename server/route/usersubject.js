var consts = require('../common/consts');
var dbmapper = require('../dbmapper/userSubjectMapper');
var subjetDbMapper = require('../dbmapper/subjectMapper');
var axios = require('axios');
var jsdom = require("jsdom");
var { JSDOM } = jsdom;

function checkAndRegisterSubject(subjectId) {
    subjetDbMapper.findById(subjectId, (error, result) => {
        if (result) {
            return;
        }

        // retreive from MIT course catalog
        var url = 'http://student.mit.edu/catalog/search.cgi?search=' + subjectId;
        axios.get(url).then(response => {
            // var response = await axios.get(url);
            var data = response.data;

            var dom = new JSDOM(data);
    
            var subject = {
                id: subjectId
            };
            var blockquote = dom.window.document.getElementsByTagName('blockquote')[0];
            blockquote.childNodes.forEach((node) => {
                switch(node.nodeName) {
                    case 'H3':
                        subject.title = node.textContent.slice(subjectId.length + 1);
                        break;
                    case 'i':
                        var text = node.textContent;
                        if (texts.match(/[MTWRF]{1,2}[\d:]+-[\d:]+/)) {
                            subject.day = texts.match(/[MTWRF]{1,2}/)[0];
                            var hours = text.slice(subject.day.length);
                            var times = hours.split('-');
                            subject.start = times[0];
                            subject.start = times[1];
                        }
                        break;
                    case 'a':
                        if (node.href.startsWith('http://whereis.mit.edu/map-jpg')) {
                            subject.place = node.textContent;
                        }
                        break;
                    case '#text': 
                        if (node.textContent.length > 60) {
                            subject.description = node.textContent;
                        }
                        break;
                    default:
                        // do nothing
                } 
            });
            subjetDbMapper.insert(subject);    
        })
    })
}


module.exports = function(app, express) {
    var userSubjectRoute = express.Router();
    app.use('/usersubject', userSubjectRoute);

    userSubjectRoute.route('/register')
        .post((req, res) => {
            var subjects = req.body;
            subjects.forEach((s) => {
                s.term = '2017FA';
                s.userId = consts.DUMMY_USER_ID

                checkAndRegisterSubject(s.subjectId);
            });


            dbmapper.upsert(subjects, (err, result) => {
                res.json(result);
            });
        });
    app.get('/events', (req, res) => {
        calendar.listEvent().then(list => {
            res.send(list);
        })
    });
};