var driver = require('./driverFactory').createDriver();

module.exports = {
    find: (query, callback) => {
        var collection = driver.db.collection('task');
        collection.find(query).toArray(callback);
    },
    
    findById: (id, callback) => {
        var collection = driver.db.collection('task');
        collection.findOne({
            _id: id
        }, callback);
    },

    insert: (doc, callback) => {
        driver.db.collection('task').insert(doc, {
                w:1,
                forceServerObjectId: true,
            }, callback);
    }
};