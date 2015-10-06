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

  $scope.$on('gotUser', function(event, user){
    $scope.userRealName = user.name;
  })
  data.getUserData(localStorage.userID);

  //TODO: add the username too
  $scope.postIdea = function(ideaName, description, ideaImage){
    data.createIdea(ideaName, description, $scope.userRealName, ideaImage);
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

  //EDITING FEATURE -- TO DO! 
  $scope.submission = false;
  $scope.save = false;

  $scope.editIdea = function(userID) {
    if (localStorage.userID === userID) {
      return true;
    }
  }

  $scope.edible = false;
  $scope.editModal = function() {
    console.log("in the edit function", $scope.edible)
    // if ($scope.editProj(userID)) {
    $scope.edible = true;
  }

  $scope.saveModal = function(projDesc, githubUrl, projName, projUrl, projectImage){
    // firebase logic
    console.log("in the save function");
    $scope.edible = false;
    data.createProject(projDesc, githubUrl, projName, projUrl, projID, projectImage);
  }


  $scope.ideaSubmit = function(projDesc, githubUrl, projName, projUrl, projectImage) {
    var projID = uniqProjID(projName)
    if (projectImage === "") {
      projectImage = "http://nexo-sa.com/images/systems/small/category_small_ps.jpg"
    }
    data.createProject(projDesc, githubUrl, projName, projUrl, projID, projectImage);
    $scope.projDesc = "";
    $scope.githubUrl = "";
    $scope.projName = "";
    $scope.projUrl = "";
    $scope.projectImage = "";
    $scope.submission = true;
  }

  $scope.close = function() {
    $scope.submission = false;
  }

}]);
