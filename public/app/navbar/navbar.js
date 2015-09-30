angular.module("myApp").directive("navBar", ['$window', "data", function($window, data) {

  return {
    restrict: 'E',
    templateUrl: 'app/navbar/navbar.html',
    link: function(scope, elem, attrs) {
      
      //put the newuser function here.  
      scope.newUser = function() {
        console.log("blah blah");
      };
    
    }
  };
}]);


