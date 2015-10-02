angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', function($scope, $http, data, auth) {
  auth.authLogin($scope);
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

  $scope.projectSubmit = function(projectDescription, githubUrl, projName) {
    console.log("this is the projectDescription: ", projectDescription);
    console.log("this is the githubUrl: ",githubUrl);
    console.log("this is projName", projName);
    data.createProject(projectDescription, githubUrl, projName);
    $scope.projectDescription = "";
    $scope.githubUrl = "";
    $scope.projName = "";
    $scope.submission = true;
  }

  $scope.close = function(projName) {
    console.log("in close function!!!")
    $scope.submission = false;
  }

  return vm;

}])

