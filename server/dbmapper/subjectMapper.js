var driver = require('./driverFactory').createDriver();

module.exports = {
    findById: (id, callback) => {
        var collection = driver.db.collection('subject');
        collection.findOne({
            id: id
        }, callback);
    },

    insert: (doc, callback) => {
        driver.db.collection('subject').insert(doc, {
                w:1
            }, callback);
    }
};