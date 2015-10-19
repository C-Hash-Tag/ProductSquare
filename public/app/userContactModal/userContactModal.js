angular.module('myApp.userContactModal', [])

.directive('userContactModal', ['$http', function($http){
  return {
    restrict: 'E',
    scope: {
      obj: '='
    },
    templateUrl: '/app/userContactModal/userContactModal.html',
    link: function(scope){
      //probably the wrong scope.
      scope.sendEmail = function(message) {
        $('#contactModal').modal('hide'); //use jQuery to hide the modal when the submit email button his hit.
        console.log("in sendMail and here is my email", scope.email);
        $http.post('/email', {
          email: scope.obj.email, //to be populated from the factory.
          message: message,
          username: scope.obj.realName //to be populated from the factory.
        }).
        then(function(response) {
          console.log("email sent");
        }, function(response) {
          console.log("email error");
        });
      }
    }
  }
}])