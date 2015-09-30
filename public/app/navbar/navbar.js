angular.module("myApp").directive("navBar", ['$window', function($window) {
  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      /*
      The below methods are used to modify the navbar routes available to a
      specific user based on their privilege and current url path
      */
    }
  };
}]);


