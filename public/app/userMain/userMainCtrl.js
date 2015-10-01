angular.module('myApp.UserMain', [])

.directive('customOnChange', function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      var onChangeFunc = scope.$eval(attrs.customOnChange);
      element.bind('change', onChangeFunc);
    }
  };
})

.controller('UserMainCtrl', ['$scope', '$http', function($scope, $http){
  var vm = this;

  console.log("using user cntrl!");

  $scope.$on('gotUsers', function(event, user){
    console.log("ideas retrieved!", ideas);
    //set the scope variables here in the future.
  });

  $scope.name = "Dylan Wright";
  $scope.profilePic = "http://ds-wright.com/images/dylan-wright.png";
  $scope.projects = [
    {
      name: "Facebook",
      pic: "http://tctechcrunch2011.files.wordpress.com/2008/09/facebooknew.jpg",
      idea: "A social media website to connect friends, like mySpace, but better."
    },
    {
      name: "Google",
      pic: "http://brandthunder.com/wp/wp-content/uploads/2012/05/Google-Homepage-300x170.png",
      idea: "A search engine for the internet. Like Yahoo, but better"
    }
  ];

  $scope.ideas = [
    {
      name: "Product Square",
      idea: "A website for sharing ideas for students to to turn into a reality.",
    },
    {
      name: "Twitter",
      idea: "a useless website where people post useless content, called Tweets, with a maximum of 140 characters, to ensure uselessness."
    }
  ];

  $scope.imagePreview = "/img/default-user.png";

  var s3Upload = function(response, file, url) {
    console.log("inside s3", response);
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", response.data.signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
      if (xhr.status === 200) {
        console.log("file loaded!");
        $scope.imagePreview = response.data.url;
        $scope.$apply();
        // document.getElementById("preview").src = url;
        // document.getElementById("avatar_url").value = url;
      }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);

  };
  $scope.username = "dswright";

  $scope.signS3 = function(username){
    var file = event.target.files[0];
    $http.post('/sign_s3', {
      fileName: "profileImage-"+$scope.username,
      fileType: file.type
    }).
    then(function(response) {
      //run upload function upon completion of signed certificate.
      console.log("signed!", response, response.data.url, response.data.signed_request);
      s3Upload(response, file);
    })

    console.log(file);
  };

  $scope.sendEmail = function(message){
    $('#contactModal').modal('hide'); //use jQuery to hide the modal when the submit email button his hit.
    console.log("in sendMail");
    $http.post('/email', {
      email: "dylansamuelwright@gmail.com", //to be populated from the factory.
      message: message,
      username: "Dylan" //to be populated from the factory.
    }).
    then(function(response) {
      console.log("email sent");
    }, function(response) {
      console.log("email error");
    });
  }

 
}])