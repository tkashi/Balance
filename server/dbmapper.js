var MongoClient = require('mongodb').MongoClient;

// the name "mongo" comes from the docker link, in the docker-compose.yml
var url = 'mongodb://localhost:27017/balance';
var db;

MongoClient.connect(url, function (err, database) {
    if(err){ console.log('failed to connect: ' + err); return;}
    db = database;
    console.log("Connected correctly to server!!");
});

module.exports = {
    upsertCourses: (user, doc, callback) => {
        db.collection('courses').update({
            user: user
        }, doc, {
            w:1,
            upsert: true
        }, callback);  
    },

    readCourses: (user, callback) => {
        db.collection('courses').findOne({
                user: user
            }, callback);
        }
};