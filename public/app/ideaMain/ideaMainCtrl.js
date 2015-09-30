angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', function($scope, $http, data, $log){
  var vm = this;
  
  //NOTE: set the listener before you get the data
  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);
   vm.newIdeas = ideas;
   $scope.$apply();
  })

  vm.getIdeasData = function(){
    console.log("inside get Ideas Data")
    data.getIdeasData();
  }

  vm.getIdeasData()

  vm.newIdeas; 

  console.log("inside initScope");


  //TODO: add the username too
  vm.postIdea = function(name, description, username){
    data.createIdea(name, description, 'username');
  }

  //FOR TESTING PURPOSES  
  vm.postIdea("trello222", "trello for wizards", "ting");
  console.log("in ideas")



  // $scope.$on('$routeChangeUpdate', initScope);
  // $scope.$on('$routeChangeSuccess', initScope);

  return vm;

}])