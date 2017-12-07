var driver = require('./driverFactory').createDriver();

module.exports = {
    find: (query, callback) => {
        var collection = driver.db.collection('task');
        if (query.date) {
            if (typeof query.date === 'string') {
                query.date = new Date(query.date);
            } else {
                for (var prop in query.date) {
                    query.date[prop] = new Date(query.date[prop]);
                }
            }
        }
        console.log(query);
        collection.find(query).toArray((error, tasks) => {
            var ids = tasks.map(item => {
                return item.subjectId
            });
            driver.db.collection('userSubject').find({
                _id: {
                    '$in': ids
                }
            }).toArray((err, subjects) => {
                tasks.forEach(task => {
                    if (task.subjectId) {
                        for (var i = 0, len = subjects.length; i < len; i++) {
                            if (subjects[i]._id.equals(task.subjectId)) {
                                task.subject = subjects[i];
                                console.log(task);
                                return;
                            }
                        }
                    }
                });
                callback(error || err, tasks);
            });
        });
    },
    
    findById: (id, callback) => {
        var collection = driver.db.collection('task');
        collection.findOne({
            _id: id
        }, callback);
    },

    count: (query, callback) => {
        var collection = driver.db.collection('task');
        collection.count(query, callback);
    },

    countByType: (callback) => {
        var collection = driver.db.collection('task');
        collection.aggregate([{
            '$group': {
                '_id': '$type',
                count: {
                    '$sum': 1
                }
            }
        }], callback);
    },

    countByTypeAndDate: (query, callback) => {
        var collection = driver.db.collection('task');
        collection.aggregate([{
            '$match': query, 
            '$group': {
                '_id': {
                    type: '$type',
                    date: '$startDate'
                 },
                count: {
                    '$sum': 1
                }
            }
        }], callback);
    },

    insert: (doc, callback) => {
        driver.db.collection('task').insert(doc, {
                w:1,
                forceServerObjectId: true,
            }, callback);
    }
};