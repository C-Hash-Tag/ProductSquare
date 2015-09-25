var express = require('express');
var app = express();
var port = process.env.Port || 3000;

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

app.use(express.static("../public"));

app.listen(port);
console.log('Server listening on ' + port);

