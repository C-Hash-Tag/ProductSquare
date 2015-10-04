angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', 'auth', function($scope, $http, data, $log, auth){
  // var vm = this;

  //NOTE: set the listener before you get the dat
  $scope.$on('gotIdeas', function (event, ideas){
   console.log("ideas retrieved!", ideas);
   $scope.newIdeas = ideas;
   $scope.$apply();
  })

  $scope.getIdeasData = function(){
    // console.log("inside get Ideas Data")
    data.getIdeasData();
  }

  $scope.getIdeasData()

  $scope.test = function() {
    console.log("click works")
  }

  // vm.newIdeas;

  // console.log("inside initScope");

  $scope.ideaSubmit = function(ideaName, ideaDesc) {
    // console.log("In Idea Submit");
    data.createIdea(ideaName, ideaDesc);
  }

  // $scope.like = function(userID, ideaName){
  //   //update css of the like button

  //   //update the database
  //   data.updateLike(userID, ideaName);
  //     //TODO: if username liked it before, remove her; if username hasn't, add her
  //     //add/ remove idea in user's liked ideas
  // }

}])
