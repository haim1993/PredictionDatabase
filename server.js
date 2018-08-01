var express = require('express');
var path = require('path');
var DecisionTree = require('decision-tree');
var formidable = require('formidable');
var fs = require('fs');
var Binary = require('mongodb').Binary;

// var hdfs = require('./webhdfs-client');
var mongo = require('./mongoDB.js');

var app = express();

mongo.connect(function(err) {
    if (err) throw err;

    mongo.db.collection("salaries").find({}).toArray(function(err, result) {
        if (err) throw err;

        var training_data = result;

        var class_name = "School Type";

        var features = [
            "Starting Median Salary",
            "Mid-Career Median Salary",
            "Mid-Career 10th Percentile Salary",
            "Mid-Career 25th Percentile Salary",
            "Mid-Career 75th Percentile Salary",
            "Mid-Career 90th Percentile Salary"
        ];

        var dt = new DecisionTree(training_data, class_name, features);


        const bodyParser = require("body-parser");


        app.use(bodyParser.urlencoded({
            extended: true
        }));

        app.use(bodyParser.json());


        // POST methods
        app.post("/", function(req, res) {

            var predicted_class = dt.predict({
                "Starting Median Salary": req.body.start_median_salary,
                "Mid-Career Median Salary": req.body.mid_median_salary,
                "Mid-Career 10th Percentile Salary": req.body.percentile_salary_10th,
                "Mid-Career 25th Percentile Salary": req.body.percentile_salary_25th,
                "Mid-Career 75th Percentile Salary": req.body.percentile_salary_75th,
                "Mid-Career 90th Percentile Salary": req.body.percentile_salary_90th
            });

            var treeModel = dt.toJSON();

            res.send("<h1>We predict that your 'School Type' is : " + predicted_class + "</h1><script>setTimeout(function () {window.location = '/add';}, 2000)</script>");
        });

        app.post("/uploaded", function(req, res) {
            var form = new formidable.IncomingForm();
            form.parse(req, function(err, fields, files) {
                var oldpath = files.filetoupload.path;
                var newpath = __dirname + '/uploadedfiles/' + files.filetoupload.name;
                fs.rename(oldpath, newpath, function(err) {
                    if (err) throw err;
                    console.log("Uploaded file '" + files.filetoupload.name + "'");
                    res.send('File uploaded and moved! <script>setTimeout(function () {window.location = "/upload";}, 2000)</script>');
                });

                setTimeout(function() {

///////////////////     Write to Hadoop      //////////////////

                    var WebHDFS = require('webhdfs');
                    var hdfs = WebHDFS.createClient();

                    // Initialize readable stream from local file
                    var localFileStream = fs.createReadStream(newpath);

                    // Initialize writable stream to HDFS target
                    var remoteFileStream = hdfs.createWriteStream("/files/" + files.filetoupload.name);

                    // Pipe data to HDFS
                    localFileStream.pipe(remoteFileStream);

                    // Handle errors
                    remoteFileStream.on('error', function onError(err) {
                        console.log(err);
                    });

                    // Handle finish event
                    remoteFileStream.on('finish', function onFinish() {
                        console.log("upload is done!");
                    });

                    var data = fs.readFileSync(newpath);
                    var insert_data = {};
                    insert_data.file_data = Binary(data);

                    var collection = mongo.db.collection('files');
                    collection.insert(insert_data, function(err, result) {});
                }, 1000);
            });
        });

        // db.close();
    });

});

const PORT = 8080;


// GET methods
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/index.html'));
});
app.get('/add', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/add.html'));
});
app.get('/upload', function(req, res) {
    res.sendFile(path.join(__dirname + '/html/upload.html'));
});


// Allows me to use static files
app.use('/', express.static(__dirname + '/'));
app.use('/add', express.static(__dirname + '/add'));
app.use('/upload', express.static(__dirname + '/upload'));

app.listen(PORT);

console.log("Server running...");
console.log("Listening on port " + PORT);
