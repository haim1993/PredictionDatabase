
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://haim:Aa123456@ds247001.mlab.com:47001/my-work-database";

module.exports.connect = function connect(callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        module.exports.db = db.db("my-work-database");
        callback(err);
    });
};
// mongoimport -h mongodb://haim:Aa123456@ds247001.mlab.com:47001/my-work-database --collection salaries --file database.json --jsonArray
