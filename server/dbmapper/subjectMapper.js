var driver = require('./driverFactory').createDriver('subject');

module.exports = {
    findById: (id, callback) => {
        var collection = driver.db.collection('subject');
        collection.findOne({
            _id: id
        }, callback);
    },

    findByNumberAndTerm: (number, term, callback) => {
        var collection = driver.db.collection('subject');
        collection.findOne({
            number: number,
            term: term
        }, callback);
    },

    insert: (doc, callback) => {
        var collection = driver.db.collection('subject');
        collection.insert(doc, {
            forceServerObjectId: true,
            w:1
            }, callback);
    }
};