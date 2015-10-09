angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', 'imageUpload', '$route', function($scope, $http, data, auth, imageUpload, $route) {
  $scope.$route = $route;
  // if(localStorage.userID){
  //   data.getUserData(localStorage.userID);
  // }

  // $scope.$on('userFoundInLocal', function(event, user){
  //   if ($scope.loggedInUserID );

  // })

  // flag declarations to show/hide views
  $scope.submission = false;
  $scope.save = false;

  var uniqProjID = function(str) {
    str = str.split("");
    for (var i = 0; i< str.length; i++) {
      str[i] = (str[i] === ' ' ? '-' : str[i].toLowerCase());
    }
    return str.join('');
  }

  function uniqueNumber(projName) {
    var date = Date.now();
    // If created at same millisecond as previous
    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }
    return uniqProjID(projName)+date;
  }

  // $scope.projSpecific = function(projName) {
  //   $scope.projDisplay = newProjects[projName];
  // }

  $scope.userProfLink = function(userId) {
    var userLink = "http://127.0.0.1:3000/#/user/" + $scope.loggedInUserID;
    console.log("in user prof link", userLink);
    //concat url and loggedInUserID
    return userLink;
  }

  $scope.editProj = function(userID) {
    console.log("userID", userID);
    if ($scope.loggedInUserID === userID) {
      return true;
    }
  }

  //HANDLES CLOSING MODALS WITHOUT SAVING EDITS
  $scope.editModal = function() {
    $scope.edible = true;
    $scope.checked = false;
  };

  $scope.closeModal = function(){
    $scope.edible = false;
    $scope.checked = true;
  }

  $scope.saveModal = function(projID, projName, projDesc, githubUrl, projUrl, projectImage){
    // firebase logic
    $scope.edible = false;
    $scope.checked = true;
    data.updateProject(projID, projDesc, projName, githubUrl, projUrl, projectImage);
  };

  $scope.checked = true;


  $scope.projectSubmit = function(projDesc, githubUrl, projName, projUrl, projectImage) {
    var projID = uniqueNumber(projName)
    if (projectImage === "") {
      projectImage = "http://nexo-sa.com/images/systems/small/category_small_ps.jpg"
    }
    data.createProject($scope.loggedInUserRealName, projDesc, githubUrl, projName, projUrl, projID, projectImage);
    $scope.projDesc = "";
    $scope.githubUrl = "";
    $scope.projName = "";
    $scope.projUrl = "";
    $scope.projectImage = "";
    $scope.submission = true;
  }

  $scope.close = function() {
    $scope.submission = false;
  }

  $scope.saveProjectImage = function() {
    console.log("selectedFile!!!");
    console.log("event", event);
    imageUpload.projectImage("dswright", event, function(url){
      console.log(url, "url!");
      $scope.projectImage = url;
      $scope.$apply();
    }); //run the userImage upload from the imageUpload factory.
  };

  $scope.editProjectImage = function() {
    console.log("selectedFile!!!");
    console.log("event", event);
    imageUpload.projectImage("dswright", event, function(url){
      console.log(url, "url!");
      $scope.specificProjectImage = url;
      $scope.$apply();
    }); //run the userImage upload from the imageUpload factory.
  };

  // return vm;

  //INFO MODAL LOADING
  $scope.passit = function(projName, description, projUrl, githubRepo, projectImage, date, userID, projID, userRealName, test){
    $scope.specificProjName = projName;
    $scope.specificDescription = description;
    $scope.specificProjUrl = projUrl;
    $scope.specificGithubRepo = githubRepo;
    $scope.specificProjectImage = projectImage;
    $scope.specificDate = date;
    $scope.specificUserID = userID;
    $scope.specificProjID  = projID;
    $scope.specificUserRealName = userRealName;
    $scope.specificTest = "https://www.google.com"
  }

}])

