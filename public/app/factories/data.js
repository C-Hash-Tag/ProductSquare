angular.module('myApp.data', [])
.factory('data', ['$rootScope', function($rootScope){
    var factory = {};
    factory.dataRef = new Firebase('https://productsquare.firebaseio.com/');

    factory.getUsersData = function(){
      factory.dataRef.child("users").on("value", function(data){
        var users = data.val();
        $rootScope.$broadcast('gotUsers', users);
      });
    }

    factory.getProjectsData = function(){
      factory.dataRef.child("projects").on("value", function(data){
        var projects = data.val();
        $rootScope.$broadcast('gotProjects', projects);
      });
    }

    factory.getIdeasData = function(){
      factory.dataRef.child("ideas").on("value", function(data){
        var ideas = data.val();
        $rootScope.$broadcast('gotIdeas', ideas);
      });
    }

    return factory;
}]);