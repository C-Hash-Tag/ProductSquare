angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', function($scope, $http, data, $log){
  var vm = this;

  data.getIdeasData();

  vm.newIdeas = [{'text':'a'}, {'text': 'b'}];

  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);

   //TODO: add your new cards here
  })

  //TODO: add the username too
  vm.postIdea = function(name, description){
    //TODO: submit to firebase
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
  
  return vm;
}])