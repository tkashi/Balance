var dbmapper = require('./dbmapper');
var calendar = require('./calendar');

module.exports = function(app) {
    app.route('/mycourses')
        .get((req, res) => {
            dbmapper.readCourses('test', (err, item) => {
                res.json(item ? item.courses : []);
            });
        })
        .post((req, res) => {
            var item = {
                user: 'test',
                courses: req.body
            };
            dbmapper.upsertCourses('test', item, (err, result) => {
                res.json(result);
            });
        });
    app.get('/events', (req, res) => {
        calendar.listEvent().then(list => {
            res.send(list);
        })
    });
};