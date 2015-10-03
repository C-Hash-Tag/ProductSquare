var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var aws = require('aws-sdk');


//check if the server is on the Heroku environment, if not, we're on local - include the credentials file
if (process.env.SENDGRID_API_KEY === undefined){
  var credentials = require('./credentials');
  var SENDGRID_API_KEY  =   credentials.sendgrid.api_key;
  var AWS_API_KEY       =   credentials.aws.access_key;
  var AWS_SECRET_KEY    =   credentials.aws.secret_key;
  var S3_BUCKET_NAME    =   credentials.aws.s3_bucket_name;
}
else { //if we are on Heroku, just set the environment variable to the heroku environment variable
  var SENDGRID_API_KEY  =   process.env.SENDGRID_API_KEY;
  var AWS_API_KEY       =   process.env.AWS_ACCESS_KEY_ID;
  var AWS_SECRET_KEY    =   process.env.AWS_SECRET_ACCESS_KEY;
  var S3_BUCKET_NAME    =   process.env.S3_BUCKET_NAME;
}

var sendgrid = require('sendgrid')(SENDGRID_API_KEY);

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

//
app.post('/sign_s3', function(req, res){
  aws.config.update({accessKeyId: AWS_API_KEY, secretAccessKey: AWS_SECRET_KEY, region: 'us-west-1'});
  var s3 = new aws.S3();
  console.log(req.body.fileName);
  var s3_params = {
    Bucket: S3_BUCKET_NAME,
    Key: req.body.fileName,
    Expires: 60,
    ContentType: req.body.fileType,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', s3_params, function(err, data){
    if(err){
      console.log(err);
    }
    else {
      var return_data = {
        signed_request: data,
        url: 'https://'+S3_BUCKET_NAME+'.s3.amazonaws.com/'+req.body.fileName
      };
      res.write(JSON.stringify(return_data));
      res.end();
    }
  });
});



app.use(express.static(__dirname + "/public"));


app.listen(port);
console.log('Server listening on ' + port);

