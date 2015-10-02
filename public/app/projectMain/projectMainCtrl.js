angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', function($scope, $http, data, auth) {
  auth.authLogin($scope);
  var vm = this;

  $scope.submission = false;

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

