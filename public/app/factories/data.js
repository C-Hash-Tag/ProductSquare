angular.module('myApp.data', [])
.factory('data', ['$rootScope', function($rootScope){
    var factory = {};
    var Ref = new Firebase('https://productsquare.firebaseio.com/');

    // Return today's date in mm/dd/yyyy format
    function currentDate(){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd<10) {
        dd='0'+dd;
      }
      if(mm<10) {
          mm='0'+mm;
      }
      today = mm+'/'+dd+'/'+yyyy;
      return today;
    }

    // Collect user data from sign up and store it in Firebase
    factory.createUser = function(email, password, userId, name){
      // Store the user data in Firebase
      Ref.child("users").child(userId).set({
        name: name,
        email: email,
        userId: userId,
        projects: {},
        ideas: {},
        likedIdeas: {}
      });
    };

    // Collect idea data from createIdea and store it in Firebase
    factory.createIdea = function(ideaName, desc, userID){
      // Store the idea data in Firebase
      Ref.child("ideas").child(ideaName).set({
        ideaName: ideaName,
        description: desc,
        date: currentDate(),
        userID: userID,
        usersWhoLikeIt: {},
      });

      // Add the idea data to the user in Firebase
      Ref.child('users').child(userID).child('ideas').child(ideaName).set({
        idea: desc
      });
    };

    // Collect project data from createProject and store it in Firebase
    factory.createProject = function(desc, repo, projName, userID){
      // Store the project data in Firebase
      Ref.child('projects').child(projName).set({
        description: desc,
        githubRepo: repo,
        projName: projName,
        date: currentDate(),
        user: "tc1234"
      });

      // Add the project data to the user in Firebase
      Ref.child('users').child("tc1234").child('projects').child(projName).set({
        githubRepo: repo
      });
    };

    // Get users data from Firebase
    factory.getUsersData = function(userID){
      Ref.child("users").child(userID).on("value", function(data){

        // Broadcast users data to all 'gotUsers' event listeners
        var user = data.val();
        $rootScope.$broadcast('gotUsers', user);
      });
    };

    // Get projects data from Firebase
    factory.getProjectsData = function(){
      Ref.child("projects").on("value", function(data){
        // Broadcast projects data to all 'gotProjects' event listeners
        var projects = data.val();
        $rootScope.$broadcast('gotProjects', projects);
      });
    };

    // Get ideas data from Firebase
    factory.getIdeasData = function(){
      Ref.child("ideas").on("value", function(data){
        // Broadcast projects data to all 'gotProjects' event listeners
        var ideas = data.val();
        var arr = [];
        for(var prop in ideas){
          arr.push(ideas[prop]);
        }
        console.log("inside getIdeasData factory", arr);
        $rootScope.$broadcast('gotIdeas', arr);
      });
    };

    factory.updateLike = function(userID, ideaName){
      //update ideas table to store users who like it
      Ref.child("ideas").child(ideaName).child("usersWhoLikeIt").transaction(function(usersWhoLikeIt){
        if(usersWhoLikeIt === null){
          usersWhoLikeIt = {};
        } 
        usersWhoLikeIt[userID] = true;

        console.log(Object.keys(usersWhoLikeIt).length); //how many likes for a given idea
        return usersWhoLikeIt;
      })
      
      //update users table to store ideas that users like
      Ref.child("users").child(username).child("likedIdeas").transaction(function(likedIdeas){
        if(likedIdeas === null){
          likedIdeas = {};
        }
        likedIdeas[ideaName] = true;
        return likedIdeas;
      })
      
    }

    return factory;
}]);