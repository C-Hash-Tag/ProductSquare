angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', function($scope, $http, data) {
  var vm = this;

  data.getProjectsData();
  console.log("this is data", data);

  $scope.projectSubmit = function(projectDescription, githubUrl) {
    console.log("this is the projectDescription: ", projectDescription);
    console.log("this is the githubUrl: ",githubUrl);
  }

  $scope.$on('gotProjects', function (event, projects) {
      console.log('projects retrieved', projects);
    })
}])

