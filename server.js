var express = require('express');
var app = express();
var port = process.env.Port || 3000;

app.use(express.static(__dirname + "/public"));

app.listen(port);
console.log('Server listening on ' + port);
