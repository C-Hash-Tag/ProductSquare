angular.module('myApp.projEditModal', [])

.directive('projEditModal', ['data', 'imageUpload', function(data, imageUpload){
  return {
    restrict: 'E',
    scope: { 
      obj: '='
    },
    templateUrl: '/app/projEditModal/projEditModal.html',
    link: function(scope, element, attrs){
       scope.saveModal = function(projID, projName, projDesc, githubUrl, projUrl, projectImage, teamMembers, teamMembersRemoved){
        // firebase logic
        scope.edible = false;
        data.updateProject(projID, projName, projDesc, githubUrl, projUrl, projectImage, teamMembers, teamMembersRemoved);
      };

      console.log("scope in directive", scope);
      scope.edible = false;
      scope.projEdit = false;
      scope.editModal = function(){
        scope.edible = true;
        console.log("edible?", scope.edible);
      };

      scope.projectLike = function(projID){
        data.updateProjectLike(scope.obj.loggedInUserID, projID, function(usersWhoLikeItCount){
          console.log("HERRRRRE", usersWhoLikeItCount);
        });
      }

      scope.editProjectImage = function() {
        console.log("selectedFile!!!");
        console.log("event", event);
        imageUpload.projectImage(scope.obj.projID, event, function(url){
          console.log(url, "url!");
          scope.obj.projectImage = url;
          scope.$apply();
        }); //run the userImage upload from the imageUpload factory.
      };

      scope.userLookUp = function(inputUser, teamMemberIdArray){
        console.log("theUserInput", inputUser);
        data.filterForUser(inputUser, function(filteredUsers){
          console.log(filteredUsers, "filteredUsers before filter")
          
          for (var key in filteredUsers){
            if (teamMemberIdArray.indexOf(filteredUsers[key].userId) !== -1){
              delete filteredUsers[key];
            }
          }
          scope.filteredUsers = filteredUsers;
          console.log(filteredUsers, "filteredUsers!")
          scope.$apply();
        });
      }

      scope.addTeamMember = function(userId, teamMemberIdArray, teamMemberObjectsArray){
        // scope.newProjTeamMembers.push(userId);
        console.log(userId);
        teamMemberIdArray.push(userId);
        data.getUser(userId, function(user){
          teamMemberObjectsArray.push(user);
          for (var key in scope.filteredUsers){
            if (scope.filteredUsers[key].userId === userId){
              delete scope.filteredUsers[key];
              break;
            }
          }
        });
      }

      scope.removeTeamMember = function(index, teamMemberIds, teamMemberObjects, teamMembersRemoved){
        if(teamMemberIds.length > 1){
          if (teamMembersRemoved !== undefined){
            teamMembersRemoved.push(teamMemberIds[index]);
          }
          teamMemberIds.splice(index, 1);
          teamMemberObjects.splice(index, 1);
        } else {
          scope.error = "Projects must have at least one project owner."
          scope.errorFound = true;
          window.setTimeout(function(){
            scope.errorFound = false;
            scope.$apply();
          }, 5000) 

        }
      }

      //HANDLES CLOSING MODALS WITHOUT SAVING EDITS
      scope.checked= true; 

      scope.editModal = function() {
        scope.edible = true;
        scope.checked = false;
      };

      scope.closeModal = function(){
        scope.edible = false;
        scope.checked = true;
      }
    }
  }
}])

// .controller('ProjEditModalCtrl', ['scope', function($scope){

// }])



