angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', 'imageUpload', function($scope, $http, data, auth, imageUpload) {
  var vm = this;

// flag declarations to show/hide views
  $scope.submission = false;
  $scope.save = false;

  $scope.$on('gotProjects', function (event, projects) {
      console.log('projects retrieved', projects);
      vm.newProjects = projects;
      $scope.$apply();
    })

  vm.getProjectsData = function() {
    data.getProjectsData();
  }

  vm.getProjectsData();

  $scope.projSpecific = function(projName) {
    $scope.projDisplay = vm.newProjects[projName];
  }

  $scope.editProject = function() {
    console.log("In edit project!");
    $scope.save = true;
  }

  $scope.saveProject = function() {
    console.log("In save project!");
    $scope.save = false;
  }

  vm.newProjects;

  $scope.projectSubmit = function(projDesc, githubUrl, projName, projUrl, projectImage) {
    console.log("this is the projectDescription: ", projDesc);
    console.log("this is the githubUrl: ",githubUrl);
    console.log("this is projName", projName);
    if (projectImage === "") {
      projectImage = "https://pbs.twimg.com/profile_images/378800000230205597/294cc5c6c74f80d1a0af481802edd80c_400x400.jpeg"
    }
    data.createProject(projDesc, githubUrl, projName, projUrl, projectImage);
    $scope.projDesc = "";
    $scope.githubUrl = "";
    $scope.projName = "";
    $scope.projUrl = "";
    $scope.submission = true;
    $scope.projectImage = "";
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

  return vm;

}])

