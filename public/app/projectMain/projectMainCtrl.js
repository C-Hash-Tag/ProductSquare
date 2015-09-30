angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', function($scope, $http, data) {
  var vm = this;

  $scope.$on('gotProjects', function (event, projects) {
      console.log('projects retrieved', projects);
      vm.newProjects = projects;
      $scope.$apply();
    })

  vm.newProjects

  data.getProjectsData();
  console.log("this is data", data);

  $scope.projectSubmit = function(projectDescription, githubUrl, projName) {
    console.log("this is the projectDescription: ", projectDescription);
    console.log("this is the githubUrl: ",githubUrl);
    console.log("this is projName", projName);
    data.createProject(projectDescription, githubUrl, projName)
  }

}])

