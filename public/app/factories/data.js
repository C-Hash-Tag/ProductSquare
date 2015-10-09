angular.module('myApp.data', [])
.factory('data', ['$rootScope', '$location', function($rootScope, $location){
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
    factory.createUser = function(email, password, userId, realName, userType, cb){
      // Store the user data in Firebase      
      var user = {
        realName: realName,
        email: email,
        userId: userId,
        projects: {},
        likedIdeas: {},
        profileImage: '/img/default-user.png', //this will update with aws image when input by the user.
        userType: userType,
      };

      Ref.child("users").child(userId).set(user);
      cb();
    };

    factory.updateLoggedInUser = function(userId, newSettings) { //takes an object of settings and updates the users profile with those settings.
      Ref.child("users").child(userId).update(newSettings);
      $rootScope.$broadcast('loggedInUserUpdated', userId);
    }

    factory.updateUser = function(userID, newSettings) { //takes an object of settings and updates the users profile with those settings.
      Ref.child("users").child(userID).update(newSettings);
      $location.path('/user/'+userID+"/");
    }

    factory.updateOrg = function(userId, orgSettings){
      Ref.child("users").child(userId).update(orgSettings);
      $rootScope.$broadcast('loggedInOrgUpdated', userId);
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Collect idea data from createIdea and store it in Firebase
    factory.createIdea = function(ideaID, ideaName, desc, userRealName){
      // Store the idea data in Firebase
      // var image = (arguments[3] ? arguments[3] : "../background/wood" + getRandomInt(1,3)+".jpg");
      Ref.child("ideas").child(ideaID).set({
        ideaName: ideaName,
        description: desc,
        date: currentDate(),
        userID: localStorage.userID,
        usersWhoLikeIt: {},
        backgroundPath: "",
        userRealName: userRealName,
        ideaID: ideaID
      });

      // Add the idea data to the user in Firebase
      Ref.child('users').child(localStorage.userID).child('ideas').child(ideaName).set({
        idea: desc
      });
    };

    // Collect project data from createProject and store it in Firebase
    factory.createProject = function(userRealName, projDesc, githubUrl, projName, projUrl, projID, projectImage){
      // Store the project data in Firebase
      Ref.child('projects').child(projID).set({
        description: projDesc,
        githubRepo: githubUrl,
        projName: projName,
        projUrl: projUrl,
        projID: projID,
        date: currentDate(),
        userID: localStorage.userID,
        projectImage: projectImage,
        userRealName: userRealName

      });

      // Add the project data to the user in Firebase
      Ref.child('users').child(localStorage.userID).child('projects').child(projName).set({
        projID: projID
      });
    };

    factory.getUser = function(userID, cb) {
      Ref.child("users").child(userID).once("value", function(data){
        console.log("userdata fetched from getUser!", data.val());
        // $rootScope.$broadcast('gotUser', data.val());  //alert all controllers that the loggedin user has been modified.
        cb(data.val());
      });
    };

    // Get projects data from Firebase
    factory.getProjects = function(cb){
      Ref.child("projects").on("value", function(data){
        cb(data.val());
      });
    };

    // Get ideas data from Firebase
    factory.getIdeas = function(cb){
      Ref.child("ideas").on("value", function(data){
        cb(data.val());
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

    factory.updateProject = function(projID, projDesc, projName, githubUrl, projUrl, projectImage){
      Ref.child('projects').child(projID).child('description').transaction(function(desc){
        desc = projDesc;
        return desc;
      });
      Ref.child('projects').child(projID).child('projName').transaction(function(name){
        name = projName;
        return name;
      });
      Ref.child('projects').child(projID).child('githubRepo').transaction(function(repo){
        repo = githubUrl;
        return repo;
      });
      Ref.child('projects').child(projID).child('projUrl').transaction(function(proj){
        proj = projUrl;
        return proj;
      });
      Ref.child('projects').child(projID).child('projectImage').transaction(function(image){
        image = projectImage;
        return image;
      });
    };

    factory.updateIdea = function(ideaID, ideaName, ideaDesc, ideaImage){
      Ref.child('ideas').child(ideaID).child('description').transaction(function(desc){
        desc = ideaDesc;
        return desc;
      });
      Ref.child('ideas').child(ideaID).child('ideaName').transaction(function(name){
        name = ideaName;
        return name;
      });
      Ref.child('ideas').child(ideaID).child('backgroundPath').transaction(function(path){
        path = ideaImage;
        return path;
      });
    };

    return factory;
}]);
