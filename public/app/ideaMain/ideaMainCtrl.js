angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', 'auth', function($scope, $http, data, $log, auth){
  //NOTE: set the listener before you get the dat
  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);
   $scope.newIdeas = ideas;
   $scope.$apply();
  })

  $scope.getIdeasData = function(){
    console.log("inside get Ideas Data")
    data.getIdeasData();
  }

  $scope.getIdeasData()

  //TODO: add the username too
  $scope.postIdea = function(ideaName, description){
    data.createIdea(ideaName, description, localStorage.userID);
  }

  $scope.like = function(ideaName){
    //update css of the like button
    
    //update the database 
    data.updateLike(localStorage.userID, ideaName);
      //TODO: if username liked it before, remove her; if username hasn't, add her
      //add/ remove idea in user's liked ideas 
  }

}]);
