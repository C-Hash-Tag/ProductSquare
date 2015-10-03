angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', function($scope, $http, data, auth) {
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

  $scope.projectSubmit = function(projDesc, githubUrl, projName, projUrl) {
    console.log("this is the projectDescription: ", projDesc);
    console.log("this is the githubUrl: ",githubUrl);
    console.log("this is projName", projName);
    data.createProject(projDesc, githubUrl, projName, projUrl);
    $scope.projDesc = "";
    $scope.githubUrl = "";
    $scope.projName = "";
    $scope.projUrl = "";
    $scope.submission = true;
  }

  $scope.close = function(projName) {
    console.log("in close function!!!")
    $scope.submission = false;
  }

  return vm;

}])

