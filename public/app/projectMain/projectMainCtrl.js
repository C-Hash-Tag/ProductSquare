angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', 'imageUpload', '$route', function($scope, $http, data, auth, imageUpload, $route) {
  $scope.$route = $route;
  $scope.$on('gotUser', function(event, user){
    $scope.userRealName = user.name;
  });
  
  if(localStorage.userID){
    data.getUserData(localStorage.userID);
  }


  // flag declarations to show/hide views
  $scope.submission = false;
  $scope.save = false;

  $scope.$on('gotProjects', function (event, projects) {
    console.log('projects retrieved', projects);
    $scope.newProjects = projects;
    $scope.$apply();
  });

  $scope.getProjectsData = function() {
    data.getProjectsData();
  }

  $scope.getProjectsData();


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

  $scope.projSpecific = function(projName) {
    $scope.projDisplay = newProjects[projName];
  }

  $scope.editProj = function(userID) {
    if (localStorage.userID === userID) {
      return true;
    }
  }

  $scope.editModal = function() {
    $scope.edible = true;
    $scope.checked = false;
  };

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
    data.createProject($scope.userRealName, projDesc, githubUrl, projName, projUrl, projID, projectImage);
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

  // return vm;

  //INFO MODAL LOADING
  $scope.passit = function(projName, description, projUrl, githubRepo, projectImage, date, userID, projID){
    $scope.specificProjName = projName;
    $scope.specificDescription = description;
    $scope.specificProjUrl = projUrl; 
    $scope.specificGithubRepo = githubRepo; 
    $scope.specificProjectImage = projectImage; 
    $scope.specificDate = date; 
    $scope.specificUserID = userID;
    $scope.specificProjID  = projID;
  }

}])

