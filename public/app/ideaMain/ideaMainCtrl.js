angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', 'auth', function($scope, $http, data, $log, auth){
  auth.authLogin($scope);
  var vm = this;
  
  //NOTE: set the listener before you get the dat
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
  vm.postIdea = function(name, description){
    data.createIdea(name, description, localStorage.userID);
  }

  vm.like = function(userID, ideaName){
    //update css of the like button
    
    //update the database 
    data.updateLike(userID, ideaName);
      //TODO: if username liked it before, remove her; if username hasn't, add her
      //add/ remove idea in user's liked ideas 
  }

  //FOR TESTING PURPOSES  
  vm.postIdea("trello222", "trello for wizards", "ting");
  console.log("in ideas")


  return vm;

}])