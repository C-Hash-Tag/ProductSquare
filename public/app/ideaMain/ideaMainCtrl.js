angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', 'auth', 'imageUpload', '$route', function($scope, $http, data, $log, auth, imageUpload, $route){
  $scope.$route = $route;

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

  $scope.getIdeasData();

  //TODO: add the username too
  $scope.postIdea = function(ideaName, description, ideaImage){
    data.createIdea(ideaName, description, ideaImage);
    $scope.ideaName = "";
    $scope.description = "";
    $scope.ideaImage = "";
    $scope.$apply();
  }

  $scope.like = function(ideaName){
    //update css of the like button

    //update the database
    data.updateLike(localStorage.userID, ideaName);
      //TODO: if username liked it before, remove her; if username hasn't, add her
      //add/ remove idea in user's liked ideas
  }

  $scope.saveIdeaImage = function() {
    console.log("selectedFile!!!");
    console.log("event", event);
    imageUpload.ideaImage(localStorage.userID, event, function(url){
      console.log(url, "url!");
      $scope.ideaImage = url;
      $scope.$apply();
    }); //run the userImage upload from the imageUpload factory.
  };

}]);
