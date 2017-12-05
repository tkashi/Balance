var consts = require('../common/consts');
var dbmapper = require('../dbmapper/userSubjectMapper');
var commonSubject = require('../common/subject');

function checkAndRegisterSubject(subjectId) {
    subjetDbMapper.findByNumberAndTerm(subjectId, term, (error, result) => {
        if (result) {
            return;
        }

        // retreive from MIT course catalog
        commonSubject.retriveAndRegisterSubject(subjectId, term);
    })
}


module.exports = function(express) {
    var userSubjectRoute = express.Router();

    userSubjectRoute.route('/register').post((req, res) => {
        var s = req.body;
        s.userId = consts.DUMMY_USER_ID;

        // checkAndRegisterSubject(s.number, s.term);

        dbmapper.upsert(s, (err, result) => {
            res.json(result);
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