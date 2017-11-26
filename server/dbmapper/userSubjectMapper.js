var driver = require('./driverFactory').createDriver();

module.exports = {
    find: (query, callback) => {
        var collection = driver.db.collection('userSubject');
        collection.find(query).toArray(callback);
    },
    upsert: (doc, callback) => {
        var docs = Array.isArray(doc) ? doc : [doc];
        var collection = driver.db.collection('userSubject');

        docs.forEach((d) => {
            collection.findOne({
                userId: d.userId,
                subjectId: d.subjectId,
                term: d.term
            }, (error, result) => {
                if (!result) {
                    collection.insert(d, {
                        forceServerObjectId: true,
                        w: 1
                    });
                } else {
                    collection.update({
                        userId: d.userId,
                        subjectId: d.subjectId,
                        term: d.term
                    }, d, {
                        w: 1
                    });
                }
            });
        });
    }
};