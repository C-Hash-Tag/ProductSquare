angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', function($scope, $http, data){
  var vm = this;

  data.getIdeasData()

  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);
  })
  
}])