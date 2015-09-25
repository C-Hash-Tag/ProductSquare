angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', function($scope, $http) {
  var vm = this;
  console.log("this is data", data);

  data.getProjectsData();

  $scope.$on('gotProjects')
    .then(function(projects) {
      console.log('projects retrieved', projects);
    })
}])

