angular.module('myApp.projectMain', [])

.controller('ProjectMainCtrl', ['$scope', '$http', 'data', 'auth', 'imageUpload', '$route', function($scope, $http, data, auth, imageUpload, $route) {
  $scope.$route = $route;
  // if(localStorage.userID){
  //   data.getUserData(localStorage.userID);
  // }

  // $scope.$on('userFoundInLocal', function(event, user){
  //   if ($scope.loggedInUserID );

  // })

  // flag declarations to show/hide views
  // $scope.submission = false;

  $scope.sortBy = 'date';
  $scope.reverse = false;

  $scope.newProjectsInArray = _.values($scope.newProjects);

  $scope.save = false;
  $scope.projectImage = "/img/default-product-image.png";

  var uniqProjID = function(str) {
    str = str.split("");
    for (var i = 0; i< str.length; i++) {
      str[i] = (str[i] === ' ' ? '-' : str[i].toLowerCase());
    }
    return str.join('');
  }

  function uniqueNumber(projName) {
    var date = Date.now();
    // If created at same millisecond as previous
    if (date <= uniqueNumber.previous) {
        date = ++uniqueNumber.previous;
    } else {
        uniqueNumber.previous = date;
    }
    return uniqProjID(projName)+date;
  }

  // $scope.projSpecific = function(projName) {
  //   $scope.projDisplay = newProjects[projName];
  // }

  $scope.removeTeamMember = function(index, teamMemberIds, teamMemberObjects, teamMembersRemoved){
    if(teamMemberIds.length > 1){
      if (teamMembersRemoved !== undefined){
        teamMembersRemoved.push(teamMemberIds[index]);
      }
      teamMemberIds.splice(index, 1);
      teamMemberObjects.splice(index, 1);
    } else {
      $scope.error = "Projects must have at least one project owner."
      $scope.errorFound = true;
      window.setTimeout(function(){
        $scope.errorFound = false;
        $scope.$apply();
      }, 5000)

    }
  }

  $scope.userLookUp = function(inputUser, teamMemberIdArray){
    console.log("theUserInput", inputUser);
    data.filterForUser(inputUser, function(filteredUsers){
      console.log(filteredUsers, "filteredUsers before filter")

      for (var key in filteredUsers){
        if (teamMemberIdArray.indexOf(filteredUsers[key].userId) !== -1){
          delete filteredUsers[key];
        }
      }

      $scope.filteredUsers = filteredUsers;
      console.log(filteredUsers, "filteredUsers!")
      $scope.$apply();
    });
  }


  $scope.addTeamMember = function(userId, teamMemberIdArray, teamMemberObjectsArray){
    // $scope.newProjTeamMembers.push(userId);
    console.log(userId);
    $scope.inputUser = "";
    teamMemberIdArray.push(userId);
    data.getUser(userId, function(user){
      teamMemberObjectsArray.push(user);
      for (var key in $scope.filteredUsers){
        if ($scope.filteredUsers[key].userId === userId){
          delete $scope.filteredUsers[key];
          break;
        }
      }
      $scope.$apply();
    });

  }

  // $scope.addSpecificTeamMember = function(userId){
  //   $scope.specificTeamMembers.push(userId);
  //   data.getUser(userId, function(user){
  //     $scope.teamMemberObjects.push(user);
  //     $scope.$apply();
  //   });
  //   console.log("in add specfic team member");
  // };

   $scope.projectLike = function(projectID){
    console.log("in project like", projectID);
    //check if user already liked idea

    //update css of the like button
    //update the database
    data.updateProjectLike($scope.loggedInUserID, projectID, function(usersWhoLikeItCount){
      console.log("HERRRRRE", usersWhoLikeItCount);
    });
      //TODO: if username liked it before, remove her; if username hasn't, add her
      //add/ remove idea in user's liked ideas
  }

  $scope.editProj = function() {
    if ($scope.specificTeamMembers !== undefined) {
      for (var i=0; i<$scope.specificTeamMembers.length; i++){
        if ($scope.loggedInUserID === $scope.specificTeamMembers[i]) {
          return true;
        }
      }
      return false;
    }
    return false;
  }

  //HANDLES CLOSING MODALS WITHOUT SAVING EDITS
  $scope.editModal = function() {
    $scope.edible = true;
    $scope.checked = false;
  };

  $scope.closeModal = function(){
    $scope.edible = false;
    $scope.checked = true;
  }

  $scope.saveModal = function(projID, projName, projDesc, githubUrl, projUrl, projectImage, teamMembers, teamMembersRemoved){
    // firebase logic
    //$scope.edible = false;
    //$scope.checked = true;

      var projSaveSetting = {
        gitRepo: githubUrl || "",
        projectLink: projUrl || "",
        projDesc: projDesc || "",
        projName: projName || ""
    };
    console.log("in project save", githubUrl, projUrl);
    if (projSaveSetting.gitRepo.indexOf("http://") === -1 && projSaveSetting.gitRepo.indexOf("https://") === -1) {
      console.log("in project save save settings");
      // throw err
      // $scope.submission = true;
      $scope.errorFound = true;
      $scope.error = "Please provide a complete link to your github repository - https://github.com/yourRepoHere"
    }
    else {
      if (projSaveSetting.projectLink.indexOf("http://") === -1 && projSaveSetting.projectLink.indexOf("https://") === -1) {
        $scope.errorFound = true;
        $scope.error = "Please provide a complete link to your hosted project - https://myproject.com/"
      }
      else {
        //data.createProject($scope.loggedInUserRealName, projDesc, githubUrl, projName, projUrl, projID, projectImage, $scope.newProjTeamMembers);
        data.updateProject(projID, projDesc, projName, githubUrl, projUrl, projectImage, teamMembers, teamMembersRemoved);
        console.log("in save section of projectMainCtrl")
        // $scope.githubUrl = "";
        // $scope.projName = "";
        // $scope.projUrl = "";
        // $scope.projectImage = "";
        // $scope.projDesc = "";
        // $scope.newProjTeamMemberObjects = [$scope.loggedInUser];
        $scope.error = "";
        $scope.errorFound = false;
        $scope.edible = false;
        $scope.checked = true;
      }
    }
  };

  $scope.checked = true;

  $scope.projectSubmit = function(projDesc, githubUrl, projName, projUrl, projectImage) {
    var projID = uniqueNumber(projName)
    if (!projectImage) {
      projectImage = "http://nexo-sa.com/images/systems/small/category_small_ps.jpg"
    }
    var projSubmitSetting = {
      gitRepo: githubUrl || "",
      projectLink: projUrl || "",
      projDesc: projDesc || "",
      projName: projName || ""
    };
    console.log("in project submit", githubUrl, projUrl);
    if (projSubmitSetting.gitRepo.indexOf("http://") === -1 && projSubmitSetting.gitRepo.indexOf("https://") === -1) {
      console.log("in project submit settings");
      // throw err
      // $scope.submission = true;
      $scope.errorFound = true;
      $scope.error = "Please provide a complete link to your github repository - https://github.com/yourRepoHere"
    }
    else {
      if (projSubmitSetting.projectLink.indexOf("http://") === -1 && projSubmitSetting.projectLink.indexOf("https://") === -1) {
        $scope.errorFound = true;
        $scope.error = "Please provide a complete link to your hosted project - https://myproject.com/"
      }
      else {
        data.createProject($scope.loggedInUserRealName, projDesc, githubUrl, projName, projUrl, projID, projectImage, $scope.newProjTeamMembers);
        $scope.githubUrl = "";
        $scope.projName = "";
        $scope.projUrl = "";
        $scope.projectImage = "";
        $scope.projDesc = "";
        $scope.newProjTeamMemberObjects = [$scope.loggedInUser];
        $scope.error = "";
        $scope.errorFound = false;
        $('#submitModalProject').modal('hide');
      }
    }


    // $scope.submission = true;
  }

    // this function saves the additional profile attributes. The name needs to be updated.
    // $scope.finishDevProfile = function(githubLink, linkedinLink, blogLink, location, school, skills) {
    // var newSettings = {
    //   github: githubLink || "",
    //   linkedin: linkedinLink || "",
    //   blog: blogLink || "",
    //   location: location || "",
    //   school: school || "",
    //   skills: skills || "",
    //   profileImage: $scope.loggedInUserProfileImage //loggedInUserProfileImage is set in the app.js when user logs in. Can be reset here if new pic is selected.
    // };

  //   // Validate Links
  //   if (newSettings.github.indexOf("http://") === -1 && newSettings.github.indexOf("https://") === -1 && newSettings.github !== ""){
  //     console.log("github invalid");
  //     $scope.errorFound = true;
  //     $scope.error = "Please provide a complete link to your Github - 'https://github.com/user'";
  //   }
  //   else {
  //     if (newSettings.linkedin.indexOf("http://") === -1 && newSettings.linkedin.indexOf("https://") === -1 && newSettings.linkedin !== ""){
  //       $scope.errorFound = true;
  //       $scope.error = "Please provide a complete link to your LinkedIn profile - https://linkedin.com/in/name"
  //     }
  //     else {
  //       if (newSettings.blog.indexOf("http://") === -1 && newSettings.blog.indexOf("https://") === -1 && newSettings.blog !== ""){
  //         $scope.errorFound = true;
  //         $scope.error = "Please provide a complete link to your blog - 'http://blog.com'";
  //       }
  //       else {
  //         data.updateLoggedInUser($scope.loggedInUserID, newSettings, $scope.loggedInUserCleanUrl);
  //         $('#devProfileCompleteModal').modal('hide'); //hide the signup modal.
  //       }
  //     }
  //   }
  // };

  $scope.saveProjectImage = function() {
    console.log("selectedFile!!!");
    console.log("event", event);
    imageUpload.projectImage("dswright", event, function(url){
      console.log(url, "url!");
      $scope.projectImage = url;
      $scope.$apply();
    }); //run the userImage upload from the imageUpload factory.
  };

  $scope.editProjectImage = function() {
    console.log("selectedFile!!!");
    console.log("event", event);
    imageUpload.projectImage("dswright", event, function(url){
      console.log(url, "url!");
      $scope.projectImage = url;
      $scope.$apply();
    }); //run the userImage upload from the imageUpload factory.
  };

  // return vm;



  //INFO MODAL LOADING
  $scope.projEditObj = {prop: "Hello"}
  $scope.projectObjects = [];

  $scope.passit = function(projName, description, projUrl, githubRepo, projectImage, date, projID, teamMembers){
   console.log($scope.loggedInUserID, "loggedInUserID!!!");
   $scope.projEditObj = {
      loggedInUserID: $scope.loggedInUserID,
      editProj: false,
      projName: projName,
      description: description,
      projUrl: projUrl,
      githubRepo: githubRepo,
      projectImage: projectImage,
      date: date,
      projID: projID,
      teamMembers: teamMembers,
      teamMemberObjects: [],
      teamMembersRemoved: [],
    }
    console.log(teamMembers, "teamMembers!");
    if (teamMembers !== undefined){
      for(var i=0; i <teamMembers.length; i++){
        if (teamMembers[i] === $scope.projEditObj.loggedInUserID){
          $scope.projEditObj.editProj = true;
        }
        data.getUser(teamMembers[i], function(user){
          $scope.projEditObj.teamMemberObjects.push(user);
          $scope.$apply();
        });
      }
    }
  }

  //SORTING FEATURE
  $scope.doSort = function(type){
   console.log("newProjects", $scope.newProjects);
   $scope.sortBy = type;
   console.log('type', $scope.sortBy);
   console.log('reverse:before', $scope.reverse);
   $scope.reverse = !$scope.reverse;
   console.log('reverse:after', $scope.reverse);
  };

}]);
