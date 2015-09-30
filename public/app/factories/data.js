angular.module('myApp.data', [])
.factory('data', ['$rootScope', function($rootScope){
    var factory = {};
    var Ref = new Firebase('https://productsquare.firebaseio.com/');

    function currentDate(){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
        dd='0'+dd
      } 
      if(mm<10) {
          mm='0'+mm
      } 
      today = mm+'/'+dd+'/'+yyyy;
      return today;
    }

    factory.login = function(email, password){
      Ref.authWithPassword({
          email: email,
          password: password
        }, 
        function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
          }
      });
    }

    factory.createUser = function(email, password, username, name){
      Ref.child("users").child(username).set({
        name: name,
        email: email,
        username: username,
        projects: {},
        ideas: {}
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
    };

    factory.createIdea = function(name, desc, username){
      Ref.child("ideas").child(name).set({
        name: name,
        description: desc,
        date: currentDate()
      });

      Ref.child('users').child(username).child('ideas').child(name).set({
        idea: desc
      })
    };

    factory.createProject = function(desc, repo, name, username){
      Ref.child('projects').child(name).set({
        description: desc,
        githubRepo: repo,
        name: name,
        date: currentDate()
      })

      Ref.child('users').child(username).child('projects').child(name).set({
        githubRepo: repo
      })
    };

    factory.getUsersData = function(name){
      Ref.child("users").child(name).on("value", function(data){
        var users = data.val();
        console.log(users);
        $rootScope.$broadcast('gotUsers', users);
      });
    };

    factory.getProjectsData = function(){
      Ref.child("projects").on("value", function(data){
        var projects = data.val();
        $rootScope.$broadcast('gotProjects', projects);
      });
    };

    factory.getIdeasData = function(){
      Ref.child("ideas").on("value", function(data){
        var ideas = data.val();
        var arr = [];
        for(var prop in ideas){
          arr.push(ideas[prop]);
        }
        $rootScope.$broadcast('gotIdeas', arr);
      });
    };

    return factory;
}]);