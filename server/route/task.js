var consts = require('../common/consts');
var dbmapper = require('../dbmapper/taskMapper');



module.exports = function(express) {
    var taskRoute = express.Router();

    taskRoute.route('/register').post((req, res) => {
        var tasks = Array.isArray(req.body) ? req.body : [req.body];

        tasks.forEach(task => {
            task.userId = consts.DUMMY_USER_ID;           
        });

        dbmapper.insert(tasks, (err, result) => {
            res.json(result);
        });
    });

    taskRoute.route('/list').get((req, res) => {
        var query = Object.assign({
            userId: consts.DUMMY_USER_ID            
        }, res.query);
        dbmapper.find(query, (error, result) => {
            res.json(result);
        });
    });    

    return taskRoute;
};