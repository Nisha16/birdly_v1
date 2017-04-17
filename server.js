const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express();
var ml = require('machine_learning');
var mysql      = require('mysql');
var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'gamblers',
   database : 'askTia'
});

var dt;
var dt_1;

// establishing connection to db
connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");
 } else {
     console.log("Error connecting database ... \n\n");
 }
});


// Algorithm Training Model Implementation
// Function to train decision tree model
var training_model = function() {

  connection.query('SELECT * from birds', function(err, rows, fields) {
  if (!err){
    // target as bird
    var data = [];
    var result = [];
    table_data = rows
    var data_len = table_data.length;
    for (var i = 0; i < data_len; i++){
      var temp = [table_data[i].day, table_data[i].hour, table_data[i].minutes, table_data[i].session.toLowerCase()];
      result.push(table_data[i].birdName.toLowerCase());
      // console.log(temp);
      data.push(temp);
    }
    console.log(data);
    console.log(result);
    dt = new ml.DecisionTree({
      data : data,
      result : result
    });
    dt.build();
    dt.prune(1.0); // 1.0 : mingain.
    // dt.print();

    // target as time of day
    var data_1 = [];
    var result_1 = [];
    for (var j = 0; j < data_len; j++) {
      var temp_1 = [table_data[j].day, table_data[j].hour, table_data[j].minutes, table_data[j].birdName.toLowerCase()];
      result_1.push(table_data[j].session.toLowerCase());
      data_1.push(temp_1);
    }
    dt_1 = new ml.DecisionTree({
      data : data_1,
      result : result_1
    });
    dt_1.build();
    // console.log("Classify : ", dt_1.classify([0,12,0,'Robin']));
    dt_1.prune(1.0); // 1.0 : mingain.
    dt_1.print();
  }
 else{
   console.log('Error while performing Query.');
 }
});
}

console.log("calling x");
training_model();

// ExpressJS application Implementation
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static('./build'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './build', 'home.html'));
});

app.post('/api', function (req, res) {
  console.log(req.body);
});

app.post('/submit',function(req,res){
  console.log("POST request");
  var d = new Date(req.body.date);
  var unix_seconds = ((new Date(d)).getTime()) /1000;
  console.log("EPOCH: ",unix_seconds);
  var hr = d.getHours();
  if (hr < 12 && hr >= 5) {
    var s = "morning";
  } else if (hr >= 12 && hr < 16) {
    var s = "afternoon";
  } else if (hr >= 16 && hr <= 23) {
    var s = "night";
  } else {
    var s = "midnight";
  }

  var bird = req.body.bird.toLowerCase();
  var bird_data  = {day: d.getDay(), hour: d.getHours(), minutes: d.getMinutes(), session: s, birdName: bird, epoch:unix_seconds};
  var query = connection.query('INSERT INTO birds SET ?', bird_data, function(err, result) {
    if(!err) {
      console.log("Query executed ... \n\n");
    } else {
      console.log("Error updating the table. \n\n")
    }
  console.log(query.sql)
  });
});


var days_mapping = {"sunday":0, "monday":1, "tuesday":2, "wednesday":3,"thursday":4,"friday":5,"saturday":6};
app.post('/predict-bird',function(req,res){
  console.log("POST request");
  var val = req.body.day.toLowerCase();
  var day = days_mapping[val];
  console.log("Day: ", day);
  var hr = req.body.hour;
  var min = req.body.minutes;
  if (hr < 12 && hr >= 5) {
    var s = "morning";
  } else if (hr >= 12 && hr < 16) {
    var s = "afternoon";
  } else if (hr >= 16 && hr <= 23) {
    var s = "night";
  } else {
    var s = "midnight";
  }

  result = dt.classify([day,hr,min,s]);
  console.log("result: ", result)
  res.render('index', {
    classifier_result: Object.keys(result)
  });
});


var num_mapping = {0:"sunday", 1:"monday", 2:"tuesday", 3:"wednesday", 4:"thursday" , 5:"friday",6:"saturday"};
app.post('/predict-time',function(req,res){
  console.log("POST request");
  var bird = req.body.type.toLowerCase();
  connection.query('SELECT day, hour, minutes from birds', function(err, rows, fields) {
  if (!err){
    // target as bird
    var day = [];
    var hr = [];
    var min = []
    table_data = rows
    var data_len = table_data.length;
    for (var i = 0; i < data_len; i++){
      day.push(table_data[i].day);
      hr.push(table_data[i].hour);
      min.push(table_data[i].minutes);
    }
    var frequency = {};  // array of frequency.
    var max = 0;  // holds the max frequency.
    var result;   // holds the max frequency element.
    for(var v in day) {
            frequency[day[v]]=(frequency[day[v]] || 0)+1; // increment frequency.
            if(frequency[day[v]] > max) { // is this frequency > max so far ?
                    max = frequency[day[v]];  // update max.
                    result = day[v];          // update result.
            }
    }
    var sum_hr = hr.reduce(function(a, b) { return a + b; });
    var avg_hr = Math.ceil(sum_hr / hr.length);
    var sum_min = min.reduce(function(a, b) { return a + b; });
    var avg_min = Math.ceil(sum_min / min.length);
    var resultant_day = num_mapping[result];
    console.log(num_mapping[result]);
    console.log(avg_hr);
    console.log(avg_min);
    var output = dt_1.classify([result,avg_hr,avg_min,bird])
    console.log("result: ", result)
    res.render('index', {
      time_result: Object.keys(output),
      r_day: resultant_day
    });
  }
 else{
   console.log('Error while performing Query.');
 }
});
});


app.post('/train', function(req, res){
  console.log("calling training_model manually");
  training_model()
});

app.listen(9000);
