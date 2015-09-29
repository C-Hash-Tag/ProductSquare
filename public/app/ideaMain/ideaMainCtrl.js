angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', function($scope, $http, data, $log){
  var vm = this;

  data.getIdeasData();

  vm.newIdeas = [{'text':'a'}, {'text': 'b'}];

  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);
   vm.newIdeas = ideas;
   $scope.$apply();
  })

  //TODO: add the username too
  $scope.postIdea = function(name, description, username){
    data.createIdea(name, description, username);
  }

  
  //FOR TESTING PURPOSES  
  $scope.postIdea("facebook for neighbors", "build a social network", "ting");

  return vm;


}])