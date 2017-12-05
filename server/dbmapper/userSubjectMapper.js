var driver = require('./driverFactory').createDriver();

module.exports = {
    find: (query, callback) => {
        var collection = driver.db.collection('userSubject');
        collection.find(query).toArray(callback);
    },

    upsert: (d, callback) => {
        var collection = driver.db.collection('userSubject');

        collection.findOne({
            userId: d.userId,
            number: d.number,
            term: d.term
        }, (error, result) => {
            if (!result) {
                collection.insert(d, {
                    forceServerObjectId: true,
                    w: 1
                }, callback);
            } else {
                collection.update({
                    userId: d.userId,
                    subjectId: d.subjectId,
                    term: d.term
                }, d, {
                    w: 1
                }, callback);
            }
        });
    }
};