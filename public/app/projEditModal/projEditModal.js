angular.module('myApp.projEditModal', [])

.directive('projEditModal', ['data', function(data){
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
    }
    
  }
}])

// .controller('ProjEditModalCtrl', ['$scope', function($scope){

// }])



