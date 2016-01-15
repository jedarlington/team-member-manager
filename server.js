var express = require('express');
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

var member = new Member({
  name: "Jim",
  job_title: "Front End Developer",
  url: "http://www.jedarlington.co.uk"
});

member.save();


// Express config
var app = express();

app.use(express.static(__dirname + '/public'));


// ROUTES
app.get('/api/members', function(request, response) {
  Member.find(function(erro, docs) {
    docs.forEach(function(item) {
      console.log('Received a GET request for _id: ' + item._id);
    });

    response.send(docs);
  });
});

app.post('api/members', function(request, response) {
  var member = new Members(request.body);
});


var port = 3000;

app.listen(port);
console.log('Server on ' + port);