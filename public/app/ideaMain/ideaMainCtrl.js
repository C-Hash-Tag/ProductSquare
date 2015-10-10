angular.module('myApp.ideaMain', [])

.controller('IdeaMainCtrl', ['$scope', '$http', 'data', '$log', 'auth', 'imageUpload', '$route', function($scope, $http, data, $log, auth, imageUpload, $route){
  $scope.$route = $route;
  //NOTE: set the listener before you get the data
  var uniqIdeaID = function(str) {
    str = str.split("");
    for (var i = 0; i< str.length; i++) {
      str[i] = (str[i] === ' ' ? '-' : str[i].toLowerCase());
    }
    return str.join('');
  }

  function uniqueNumber(ideaName) {
    var date = Date.now();
    // If created at same millisecond as previous
    if (date <= uniqueNumber.previous) {
      date = ++uniqueNumber.previous;
    } else {
      uniqueNumber.previous = date;
    }
    return uniqIdeaID(ideaName)+date;
  }


  //TODO: add the username too
  $scope.postIdea = function(ideaName, description, ideaImage){
    var ideaID = uniqueNumber(ideaName);
    data.createIdea(ideaID, ideaName, description, $scope.loggedInUserRealName, ideaImage);
    $scope.ideaName = "";
    $scope.description = "";
    $scope.ideaImage = "";
    $scope.$apply();
  }

  // $scope.idea.liked = false;

  $scope.like = function(ideaID){
    //check if user already liked idea

    //update css of the like button
    //update the database
    data.updateLike($scope.loggedInUserID, ideaID, function(usersWhoLikeItCount){
      console.log("HERRRRRE", usersWhoLikeItCount);
    });
      //TODO: if username liked it before, remove her; if username hasn't, add her
      //add/ remove idea in user's liked ideas
  }

  $scope.saveIdeaImage = function() {
    console.log("selectedFile!!!");
    console.log("event", event);
    imageUpload.ideaImage($scope.loggedInUserID, event, function(url){
      console.log(url, "url!");
      $scope.ideaImage = url;
      $scope.$apply();
    }); //run the userImage upload from the imageUpload factory.
  };

  //EDITING FEATURE -- TO DO!
  $scope.submission = false;
  $scope.save = false;

  $scope.editIdea = function(userID) {
    if ($scope.loggedInUserID === userID) {
      return true;
    }
  }

  $scope.edible = false;
  $scope.checked = true; //if user's current userId matches the idea's userId and this is true, then the edit button will show

  $scope.editModal = function() {
    console.log("in the edit function", $scope.edible)
    // if ($scope.editProj(userID)) {
    $scope.checked = false; 
    $scope.edible = true;
  }


  $scope.saveModal = function(ideaID, ideaDesc, ideaName, ideaImage){
    // firebase logic
    console.log("in the save function");
    $scope.edible = false;
    data.updateIdea(ideaID, ideaDesc, ideaName, ideaImage);
  };

  $scope.closeModal = function(){
    $scope.edible = false;
    $scope.checked = true;
  }

  $scope.close = function() {
    $scope.submission = false;
  }

  //INFO MODAL LOADING
  $scope.passit = function(ideaName, description, backgroundPath, date, userID, ideaID){
    $scope.specificIdeaName = ideaName;
    $scope.specificDescription = description;
    $scope.specificBackgroundPath = backgroundPath;
    $scope.specificDate = date;
    $scope.specificUserID = userID;
    $scope.specificIdeaID = ideaID;
  }

  //SORTING FEATURE
  $scope.selectedSort = "mostLiked";

  $scope.setSort = function(type){
   console.log($scope.selectedSort, "selectedSort") 
   $scope.selectedSort = type;
   console.log($scope.selectedSort, "selectedSort", " and type", type);
  }

}]);
