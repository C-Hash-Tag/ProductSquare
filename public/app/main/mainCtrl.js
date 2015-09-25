// add controller info for angular main
angular.module('myApp.main', [])

.controller('MainCtrl', ['data', function(user) {
  var vm = this;
  user.getIdeasData();
}])

