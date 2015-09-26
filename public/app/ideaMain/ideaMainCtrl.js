angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', function($scope, $http, data){
  var vm = this;

  data.getIdeasData()

  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);

   //TODO: add your new cards here
  })

  //TODO: add the username too
  vm.postIdea = function(name, description){
    //TODO: submit to firebase
  }

  $scope.flippedClass = "card";

  $scope.toggleClass = function(){
    if ($scope.flippedClass == "card flipped") {
      $scope.flippedClass = "card";
    }
    else {
      $scope.flippedClass = "card flipped";
    } 
  }

}])