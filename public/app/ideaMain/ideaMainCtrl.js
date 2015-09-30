angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', function($scope, $http, data, $log){
  var vm = this;

  data.getIdeasData();

  vm.newIdeas 

  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);
   vm.newIdeas = ideas;
   $scope.$apply();
  })

  //TODO: add the username too
  vm.postIdea = function(name, description, username){
    data.createIdea(name, description, 'username');
    console.log("args", arguments);
  }

  vm.test = function(){
    console.log("test called!")
  }
  //FOR TESTING PURPOSES  
  vm.postIdea("trello222", "trello for wizards", "ting");

  vm.testString = "hello";
  return vm;


}])