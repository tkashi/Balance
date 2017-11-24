var consts = require('../common/consts');
var MongoClient = require('mongodb').MongoClient;


// the name "mongo" comes from the docker link, in the docker-compose.yml
var url = 'mongodb://' + consts.DB_HOST + ':27017/balance';
var driver = {
    db: null
};

MongoClient.connect(url, function (err, database) {
    if(err){ console.log('failed to connect: ' + err); return;}
    driver.db = database;
    console.log("Connected correctly to server!!");
});

module.exports = {
    createDriver: () => driver
};