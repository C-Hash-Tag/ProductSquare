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
      var profileImage = (userType === "organization" ? "https://www.softaculous.com/website/images/customlogo.gif" : '/img/default-user.png');
      var cleanUrl = realName.toLowerCase().replace(/[^0-9a-z-]/g,"") +"-"+ Date.now();

      var user = {
        cleanUrl: cleanUrl,
        realName: realName,
        email: email,
        userId: userId,
        projects: {},
        likedIdeas: {},
        profileImage: profileImage, //this will update with aws image when input by the user.
        userType: userType,
      };

      Ref.child("users").child(userId).set(user);
      cb();
    };

    factory.updateLoggedInUser = function(userId, newSettings, cleanUrl) { //takes an object of settings and updates the users profile with those settings.
      Ref.child("users").child(userId).update(newSettings);
      $rootScope.$broadcast('loggedInUserUpdated', userId);
      $location.path('/user/'+cleanUrl+"/");
    }

    factory.updateOrg = function(userId, orgSettings, cleanUrl){
      Ref.child("users").child(userId).update(orgSettings);
      $rootScope.$broadcast('loggedInOrgUpdated', userId);
      $location.path('/organization/'+cleanUrl+"/");
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Collect idea data from createIdea and store it in Firebase
    factory.createIdea = function(ideaID, ideaName, desc, userRealName){
      Ref.child("ideas").child(ideaID).set({
        ideaName: ideaName,
        description: desc,
        date: currentDate(),
        userID: localStorage.userID,
        usersWhoLikeIt: {},
        backgroundPath: "",
        userRealName: userRealName,
        ideaID: ideaID,
        count: 0
      });

      // Add the idea data to the user in Firebase
      Ref.child('users').child(localStorage.userID).child('ideasThatIsubmitted').child(ideaID).set({
        ideaName: ideaName,
        description: desc,
        date: currentDate(),
        userID: localStorage.userID,
        usersWhoLikeIt: {},
        backgroundPath: "",
        userRealName: userRealName,
        ideaID: ideaID,
        count: 0
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
        userRealName: userRealName,
        count: 0      
      });

      // Add the project data to the user in Firebase
      Ref.child('users').child(localStorage.userID).child('projects').child(projID).set({

        description: projDesc,
        githubRepo: githubUrl,
        projName: projName,
        projUrl: projUrl,
        projID: projID,
        date: currentDate(),
        userID: localStorage.userID,
        projectImage: projectImage,
        userRealName: userRealName,
        count: 0
      });
    };

    factory.getUser = function(userID, cb) {
      Ref.child("users").child(userID).once("value", function(data){
        console.log("userdata fetched from getUser!", data.val());
        // $rootScope.$broadcast('gotUser', data.val());  //alert all controllers that the loggedin user has been modified.
        cb(data.val());
      });
    };

    factory.getUserByCleanUrl = function(cleanUrl, cb, errorCb){
      Ref.child("users").orderByChild('cleanUrl').equalTo(cleanUrl).once("value", function(data){
        var fetchedData = data.val();
        if (fetchedData === null){
          errorCb();
        }
        else {
          for (var first in fetchedData){
            console.log("data by CleanURL", fetchedData[first])
            cb(fetchedData[first]);
          }
        }
      });
    };

    // Get projects data from Firebase
    factory.getProjects = function(cb){
      Ref.child("projects").on("value", function(data){
        cb(data.val());
      });
    };

    factory.getLoggedInUsersIdeas = function(userID, cb){
      Ref.child("users").child(userID).child('ideasThatIsubmitted').on("value", function(data){
        cb(data.val());
      });
    }

    // Get ideas data from Firebase
    factory.getIdeas = function(cb){
      Ref.child("ideas").on("value", function(data){
        cb(data.val());
      });
    };

    factory.updateLike = function(userID, ideaID){

      //update ideas table to reflect current count
      var count;
      var counter = function(count){
        Ref.child("ideas").child(ideaID).child("count").transaction(function(currentCount){
          currentCount = count;
          return currentCount;
        });

        Ref.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).once('value', function(idea){
          if(idea.val()){
            Ref.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child("count").transaction(function(currentCount){
              currentCount = count;
              return currentCount;
            });
          }
        });
      }

      //update ideas table to store users who like it
      Ref.child("ideas").child(ideaID).child("usersWhoLikeIt").transaction(function(usersWhoLikeIt){
        if(usersWhoLikeIt === null){
          usersWhoLikeIt = {};
        }
        usersWhoLikeIt[userID] = true;

        count = Object.keys(usersWhoLikeIt).length; //how many likes for a given idea
        counter(count);
        return usersWhoLikeIt;
      });

      //update users table to store ideas that users like
      Ref.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).once('value', function(idea){
        if(idea.val()){
          Ref.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child("usersWhoLikeIt").transaction(function(likedIdeas){
            if(likedIdeas === null){
              likedIdeas = {};
            }
            likedIdeas[userID] = true;
            count = Object.keys(likedIdeas).length; //how many likes for a given idea
            counter(count);
            return likedIdeas;
          });
        }
      });

    }

    factory.updateProjectLike = function(userID, projectID, cb){

      //update projects table to reflect current count
      var count;
      var counter = function(count){
        Ref.child("projects").child(projectID).child("count").transaction(function(currentCount){
          if (currentCount === undefined) {
            count = 0;
          }
          currentCount = count;
          return currentCount;
        });

        Ref.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).once('value', function(project){
          if(project.val()){
            Ref.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).child("count").transaction(function(currentCount){
              currentCount = count;
              return currentCount;
            });
          }
        });
      }

      //update project table to store users who like it
      Ref.child("projects").child(projectID).child("usersWhoLikeIt").transaction(function(usersWhoLikeIt){
        if(usersWhoLikeIt === null){
          usersWhoLikeIt = {};
        }
        usersWhoLikeIt[userID] = true;

        count = Object.keys(usersWhoLikeIt).length; //how many likes for a given projects
        counter(count);
        return usersWhoLikeIt;
      });

      //update users table to store projects that users like
      Ref.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).once('value', function(project){
        if(project.val()){
          Ref.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).child("usersWhoLikeIt").transaction(function(likedIdeas){
            if(likedProjects === null){
              likedProjects = {};
            }
            likedProjects[userID] = true;
            count = Object.keys(likedProjects).length; //how many likes for a given projects
            counter(count);
            return likedProjects;
          });
        }
      });

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

    factory.updateIdea = function(userID, ideaID, ideaName, ideaDesc, ideaImage){
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

      Ref.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child('description').transaction(function(desc){
        desc = ideaDesc;
        return desc;
      });
      Ref.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child('ideaName').transaction(function(name){
        name = ideaName;
        return name;
      });
      Ref.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child('backgroundPath').transaction(function(path){
        path = ideaImage;
        return path;
      });
    };

    factory.getUserCleanUrl = function(userID,cb){
      Ref.child("users").child(userID).child("cleanUrl").on("value", function(data){
        console.log(data.val(), "dataVALLLLLL")
        cb(data.val());

      })
    }

    // factory.getIdeas = function(cb){
    //   Ref.child("ideas").on("value", function(data){
    //     cb(data.val());
    //   });
    // };


    return factory;
}]);
