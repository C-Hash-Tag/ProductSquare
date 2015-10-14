angular.module('myApp.projEditModal', [])

.directive('projEditModal', function(){
  return {
    restrict: 'E',
    scope: { obj: '='},
    templateUrl: '/app/projEditModal/projEditModal.html'
  }
});



