var driver = require('./driverFactory').createDriver();

module.exports = {
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