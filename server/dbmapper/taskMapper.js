var utils = require('../common/utils');
var driver = require('./driverFactory').createDriver();
var ObjectID = require('mongodb').ObjectID;

function toDate(str) {
    if (!isNaN(parseInt(str))) {
        return parseInt(str);
    }
    return utils.convertDateToNum(new Date(str));
//     return new Date(str.split('T')[0].replace('/', '-').replace('/', '-'));
}

module.exports = {
    find: (query, callback) => {
        var collection = driver.db.collection('task');
        if (query.date) {
            if (typeof query.date === 'string') {
                query.date = toDate(query.date);
            } else {
                for (var prop in query.date) {
                    query.date[prop] = toDate(query.date[prop]);
                }
            }
        }
        console.log(query);
        collection.find(query).toArray((error, tasks) => {
            var ids = tasks.map(item => {
                return ObjectID(item.userSubjectId);
            });
            driver.db.collection('userSubject').find({
                _id: {
                    '$in': ids
                }
            }).toArray((err, subjects) => {
                tasks.forEach(task => {
                    if (task.userSubjectId) {
                        for (var i = 0, len = subjects.length; i < len; i++) {
                            if (subjects[i]._id.toHexString() == task.userSubjectId) {
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
        if (doc.dueDate != null) {
            doc.dueDate = utils.convertDateTimeToNum(new Date(doc.dueDate));
        }
        driver.db.collection('task').insert(doc, {
                w:1,
                forceServerObjectId: true,
            }, callback);
    }
};