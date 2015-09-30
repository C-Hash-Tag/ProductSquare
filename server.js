var express = require('express');
var app = express();
var port = process.env.Port || 3000;
var bodyParser = require('body-parser');


//need a real post route for the api.
//create email process.

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var dummyData = {
  name: "Building a coffee app",
  video: {"0":"youtubeURL", "1":"youtubeURL"},
  images: {'0':"imgeURL"},
  description: "this app help makes coffee",
  githubRepo: "whatever@url.com",
  users: {'0':"userId", '1':"userId"},
  nonusers: {'0':"Dylan", '1':"Aaron", '2':"Ting"},
  likes: 3,
  dateCreated: "10/25/2015"
}

var dummyData1 = {
  name: "Idea to make coffee app",
  description: "making an app about coffee",
  likes: 4,
  name: "Aaron",
  dateCreated: "10/25/2015"
}



app.post('/email', function(req, resp) {
  sendgrid.send({
    to: req.body.email,
    from: 'ProductSquare',
    subject: 'New Message from '+req.body.username,
    text: req.body.message
  },
  function(err, json) {
    if (err) { return console.error(err); }
    console.log(json);
  });
  console.log("in email post");
  resp.send("email sent");
});



app.use(express.static(__dirname + "/public"));


app.listen(port);
console.log('Server listening on ' + port);

