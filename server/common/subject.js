var consts = require('../common/consts');
var dbmapper = require('../dbmapper/subjectMapper');
var axios = require('axios');
var jsdom = require("jsdom");
var { JSDOM } = jsdom;

function convertTime(time, isSurelyPM) {
    var splits = time.split('.');
    if (isSurelyPM || splits[0] <= 7) {
        splits[0] = parseInt(splits[0]) + 12;
    }
    if (splits[1] == null) {
        splits[1] = '00';
    }
    return splits[0] + ':' + splits[1];
}

function retriveAndRegisterSubject(number, term, callback) {
    // retreive from MIT course catalog
    var url = consts.SUBJECT_CATALOG_URL + number;
    axios.get(url).then(response => {
        // var response = await axios.get(url);
        var data = response.data;

        var dom = new JSDOM(data);

        var subject = {
            number: number,
            term: term
        };

        var blockquote = dom.window.document.getElementsByTagName('blockquote')[0];
        var lectureType = null;
        var lectures = [];
        var recitations = [];
        var placeCounter = 0;
        blockquote.childNodes.forEach((node) => {
            switch(node.nodeName.toLowerCase()) {
                case 'h3':
                    subject.title = node.textContent.slice(number.length + 1);
                    break;
                case 'b':
                    lectureType = node.textContent;
                    placeCounter = 0;
                    break;
                case 'i':
                    var text = node.textContent;
                    var day = text.match(/[MTWRF]{1,2}/)[0];
                    if (day && text.indexOf('-') > 0) {
                        if (!lectureType) {
                            break;
                        }

                        var hours = text.slice(day.length);
                        isPM = text.indexOf('EVE') > 0;
                        if (isPM) {
                            var indexOfOpenBracket = text.indexOf('(');
                            hours = text.slice(indexOfOpenBracket + 1, text.indexOf(' ', indexOfOpenBracket));
                        }
                        var times = hours.split('-');
                        var logistics = {
                            day: day,
                            startTime: convertTime(times[0], isPM),
                            endTime: convertTime(times[1], isPM)
                        };
                        if (lectureType == 'Lecture:') {
                            lectures.push(logistics);
                        } else if (lectureType == 'Recitation:') {
                            recitations.push(logistics);
                        }
                    } else {
                        subject.lecturer = node.textContent;
                    }
                    break;
                case 'a':
                    if (node.href.startsWith('http://whereis.mit.edu/map-jpg')) {
                        if (lectureType == 'Lecture:') {
                            lectures[placeCounter].place = node.textContent;
                        } else if (lectureType == 'Recitation:') {
                            recitations[placeCounter].place = node.textContent;
                        }
                        placeCounter++;
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
        subject.lectures = lectures;
        if (recitations.length) {
            subject.recitations = recitations;            
        }
        dbmapper.insert(subject, (error, result) => {
            callback(subject);
        });    
    })
}

module.exports = {
    retriveAndRegisterSubject: retriveAndRegisterSubject
};