angular.module('myApp.data', [])
.factory('data', ['$rootScope', function($rootScope){
    var factory = {};
    var Ref = new Firebase('https://productsquare.firebaseio.com/');

    factory.createUser = function(email, password, username, name){
      Ref.child("users").child(username).set({
        name: name,
        email: email,
        username: username,
        projects: {}
      })

      Ref.createUser({
        email: email,
        password: password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
        }
      });
    }

    factory.createProject = function(desc, repo, name, username){
      Ref.child('projects').child(name).set({
        description: desc,
        githubRepo: repo,
        name: name
      })

      Ref.child('users').child(username).child('projects').child(name).set({
        githubRepo: repo
      })
    }

    factory.getUsersData = function(name){
      Ref.child("users").child(name).on("value", function(data){
        var users = data.val();
        console.log(users);
        $rootScope.$broadcast('gotUsers', users);
      });
    }

    factory.getProjectsData = function(){
      Ref.child("projects").on("value", function(data){
        var projects = data.val();
        $rootScope.$broadcast('gotProjects', projects);
      });
    }

    factory.getIdeasData = function(){
      Ref.child("ideas").on("value", function(data){
        var ideas = data.val();
        $rootScope.$broadcast('gotIdeas', ideas);
      });
    }

    return factory;
}]);