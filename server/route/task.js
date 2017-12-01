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
    
    taskRoute.route('/countType').get((req, res) => {
        // var types = req.query.types || ['incoming', 'allocated', 'pending', 'completed'];

        // var promises = [];
        // types.forEach(type => {
        //     var p = new Promise((resolve, reject) => {
        //         dbmapper.count({
        //             type: type
        //         }, (err, count) => {
        //             resolve(count);
        //         });    
        //     });
        //     promises.push(p);
        // })
        // Promise.all(promises).then(values => {
        //     for (var i = 0, len = types.length; i < len; i++) {
        //         resBody[types[i]] = values[i];
        //     }
        //     res.json(resBody);            
        // });
        dbmapper.countByType((error, result) => {
            var resBody = {};            
            result.forEach(item => {
                resBody[item._id] = item.count;
            });
            res.json(resBody);
        });
    });

    return taskRoute;
};