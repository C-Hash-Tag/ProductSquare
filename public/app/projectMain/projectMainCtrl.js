angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', 'imageUpload', function($scope, $http, data, auth, imageUpload) {
  // var vm = this;

// flag declarations to show/hide views
  $scope.submission = false;
  $scope.save = false;

  $scope.$on('gotProjects', function (event, projects) {
      console.log('projects retrieved', projects);
      $scope.newProjects = projects;
      $scope.$apply();
    })

  $scope.getProjectsData = function() {
    data.getProjectsData();
  }

  $scope.getProjectsData();

  var uniqProjID = function(str) {
    str = str.toLowerCase().split("");
    for (var i = 0; i< str.length; i++) {
      str[i] = (str[i] === ' ' ? '-' : str[i]);
    }
    return str.join('');
  }

  $scope.projSpecific = function(projName) {
    $scope.projDisplay = vm.newProjects[projName];
  }

  $scope.editProj = function(userID) {
    console.log("in EDIT PROJ");
    if (localStorage.userID === userID) {
      return true;
    }
  }

  // vm.newProjects;


  $scope.projectSubmit = function(projDesc, githubUrl, projName, projUrl, projectImage) {
    var projID = uniqProjID(projName)
    if (projectImage === "") {
      projectImage = "http://nexo-sa.com/images/systems/small/category_small_ps.jpg"
    }
    data.createProject(projDesc, githubUrl, projName, projUrl, projID, projectImage);
    $scope.projDesc = "";
    $scope.githubUrl = "";
    $scope.projName = "";
    $scope.projUrl = "";
    $scope.projectImage = "";
    $scope.submission = true;
  }

  $scope.close = function(projName) {
    console.log("in close function!!!")
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

}])

