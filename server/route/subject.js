var consts = require('../common/consts');
var dbmapper = require('../dbmapper/subjectMapper');
var commonSubject = require('../common/subject');

module.exports = function(express) {
    var subjectRoute = express.Router();

    subjectRoute.route('/searchByNumber').get((req, res) => {
        var number = req.query.number;
        var term = req.query.term;
        dbmapper.findByNumberAndTerm(number, term, (error, subject) => {
            if (subject) {
                res.json(subject);
                return;
            }

            commonSubject.retriveAndRegisterSubject(number, term, (newSubject) => {
                res.json(newSubject);
            });
        });
    });

    subjectRoute.route('/list').get((req, res) => {
        var query = Object.assign({
            userId: consts.DUMMY_USER_ID            
        }, res.query);
        dbmapper.find(query, (error, result) => {
            res.json(result);
        });
    });
    
    return subjectRoute;
};