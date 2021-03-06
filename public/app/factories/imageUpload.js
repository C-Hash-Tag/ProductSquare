angular.module('myApp.imageUpload', [])
.factory('imageUpload', ['$rootScope', '$http', function($rootScope, $http){
  
  var s3Upload = function(response, file, cb) {
    console.log("inside s3", response);
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", response.data.signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log("file loaded!");
        cb(response.data.url);
      }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);
  };

  var factory = {
    //get a signed token from aws for the user input image and pass it to the upload function.
    userImage: function(userId, event, cb) {
      var file = event.target.files[0]; //get the file from the change event.
      $http.post('/sign_s3', {
        fileName: "profileImage-"+userId+"-"+Date.now(), //append a timestamp to create a unique image file name on AWS.
        fileType: file.type
      }).
      then(function(response) {
        //run upload function upon completion of signed certificate.
        console.log("signed!", response, response.data.url, response.data.signed_request);
        s3Upload(response, file, cb);
      })
      console.log(file);
    },

    projectImage: function(projID, event, cb) {
      var file = event.target.files[0]; //get the file from the change event.
      $http.post('/sign_s3', {
        fileName: "projectImage-"+projID+"-"+Date.now(), //append a timestamp to create a unique image file name on AWS.
        fileType: file.type
      }).
      then(function(response) {
        //run upload function upon completion of signed certificate.
        console.log("signed!", response, response.data.url, response.data.signed_request);
        s3Upload(response, file, cb);
      })
      console.log(file);
    },

    ideaImage: function(ideaID, event, cb) {
      var file = event.target.files[0]; //get the file from the change event.
      $http.post('/sign_s3', {
        fileName: "ideaImage-"+ideaID+"-"+Date.now(), //append a timestamp to create a unique image file name on AWS.
        fileType: file.type
      }).
      then(function(response) {
        //run upload function upon completion of signed certificate.
        console.log("signed!", response, response.data.url, response.data.signed_request);
        s3Upload(response, file, cb);
      })
      console.log(file);
    },
      
    


  };


  return factory;


}]);