angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', function($scope, $http, data, $log){
  var vm = this;

  data.getIdeasData();

  vm.newIdeas = [{'text':'a'}, {'text': 'b'}];

  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);
   $scope.ideas = ideas;
  })

  //TODO: add the username too
  $scope.postIdea = function(name, description, username){
    data.createIdea(name, description, username);
  }


  //vm.options = {flippedClass : 'card', pageSize: 12};
  //vm.flippedClass = "card";

  // ng-click="toggleClass($index)"
  vm.toggleClass = function($index){
    vm.ideas[$index].flipped = !vm[$index].flipped;
    //if ($scope.idea[$index].flipped === "card flipped") {
    //  $scope.flippedClass = "card";
    //}
    //else {
    //  $scope.flippedClass = "card flvped";
    //} 
  }
  
  //FOR TESTING PURPOSES  
  $scope.postIdea("facebook for neighbors", "build a social network", "ting");

  return vm;


}])