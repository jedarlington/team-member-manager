var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');


// Mongoose config
// Tell mongoose which database we want to connect to
mongoose.connect('mongodb://localhost/drupal_team_manager');

var Schema =  mongoose.Schema;

var MemberSchema = new Schema({
  name: String,
  job_title: String,
  url: String
});

mongoose.model('Member', MemberSchema);

var Member = mongoose.model('Member');

/*var member = new Member({
  name: "Jim",
  job_title: "Front End Developer",
  url: "http://www.jedarlington.co.uk"
});

member.save();*/


// Express config
var app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


// ROUTES
app.get('/api/members', function(req, res) {
  Member.find(function(err, docs) {
    docs.forEach(function(item) {
      console.log('Received a GET request for _id: ' + item._id);
    });

    res.send(docs);
  });
});

app.post('/api/members', function(req, res) {
  console.log('Received a POST request:');

  for(var key in req.body) {
    console.log(key + ': ' + req.body[key]);
  }

  var member = new Member(req.body);

  member.save(function(err, doc) {
    res.send(doc);
  });
});

app.delete('/api/members/:id', function(req, res) {
  console.log('Received a DELETE request for _id: ' + req.params.id);

  Member.remove({
    _id: req.params.id
  }, function(err) {
    res.send({
      _id: req.params.id
    });
  });
});

app.put('/api/members/:id', function(req, res) {
  console.log('Received an update request for _id: ' + req.params.id);

  Member.update({
    _id: req.params.id
  }, req.body, function(err) {
    res.send({
      _id: req.params.id
    });
  });
});


var port = 3000;

app.listen(port);
console.log('Server on ' + port);