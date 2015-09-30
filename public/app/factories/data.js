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

    factory.createIdea = function(ideaName, desc, username){
      Ref.child("ideas").child(ideaName).set({
        ideaName: ideaName,
        description: desc,
        date: currentDate()
        user: username
      });

      Ref.child('users').child(username).child('ideas').child(ideaName).set({
        idea: desc
      })
    };

    factory.createProject = function(desc, repo, projName, username){
      Ref.child('projects').child(projName).set({
        description: desc,
        githubRepo: repo,
        projName: projName,
        date: currentDate(),
        user: "tc1234"
      })

      Ref.child('users').child("tc1234").child('projects').child(projName).set({
        githubRepo: repo
      })
    };

    factory.getUsersData = function(username){
      Ref.child("users").child(username).on("value", function(data){
        var user = data.val();
        $rootScope.$broadcast('gotUsers', user);
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
        console.log("inside getIdeasData factory", arr)
        $rootScope.$broadcast('gotIdeas', arr);
      });
    };

    return factory;
}]);
