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
        }, req.query);
        dbmapper.find(query, (error, result) => {
            result.sort((a, b) => {
                return a.dueDateTime > b.dueDateTime ? 1 : -1;
            });
            res.json(result);
        });
    });
    
    taskRoute.route('/countType').get((req, res) => {
        dbmapper.countByType((error, result) => {
            var resBody = {};            
            result.forEach(item => {
                resBody[item._id] = item.count;
            });
            res.json(resBody);
        });
    });

    taskRoute.route('/countByTypeAndDate').get((req, res) => {
        var dates = [];
        for (var i = -7; i < 7; i++) {
            var d = new Date();
            d.setDate(d.getDate() + i);
            dates.push(d.getFullYear() + '-' + d.getMonth().padStart() + '-' + d.getDate());
        }

        dbmapper.countByTypeAndDate({
            startDate: {
                '$in': dates
            }
        }, (error, result) => {
            var resBody = {};      
            result.forEach(item => {
                resBody[item._id] = item.count;
            });
            res.json(resBody);
        });
    });

    return taskRoute;
};