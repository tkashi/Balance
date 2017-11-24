var driver = require('./dbmapper/driverFactory').createDriver();

module.exports = {
    upsertCourses: (user, doc, callback) => {
        driver.db.collection('courses').update({
            user: user
        }, doc, {
            w:1,
            upsert: true
        }, callback);  
    },

    readCourses: (user, callback) => {
        driver.db.collection('courses').findOne({
                user: user
            }, callback);
        }
};