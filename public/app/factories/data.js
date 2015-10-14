angular.module('myApp.data', [])
.factory('data', ['$rootScope', '$location', 'firebase', function($rootScope, $location, firebase){
    var factory = {};
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

      firebase.child("users").child(userId).set(user);
      cb();
    };

    factory.updateLoggedInUser = function(userId, newSettings, cleanUrl) { //takes an object of settings and updates the users profile with those settings.
      firebase.child("users").child(userId).update(newSettings);
      $rootScope.$broadcast('loggedInUserUpdated', userId);
      $location.path('/user/'+cleanUrl+"/");
    }

    factory.updateOrg = function(userId, orgSettings, cleanUrl){
      firebase.child("users").child(userId).update(orgSettings);
      $rootScope.$broadcast('loggedInOrgUpdated', userId);
      $location.path('/organization/'+cleanUrl+"/");
      console.log("update org function run, should run broadcast", orgSettings);
    }

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Collect idea data from createIdea and store it in Firebase
    factory.createIdea = function(ideaID, ideaName, desc, userRealName, ideaSubmitterID){
      firebase.child("ideas").child(ideaID).set({
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
      firebase.child('users').child(localStorage.userID).child('ideasThatIsubmitted').child(ideaID).set({
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
    factory.createProject = function(userRealName, projDesc, githubUrl, projName, projUrl, projID, projectImage, teamMembers){
      // Store the project data in Firebase
      firebase.child('projects').child(projID).set({
        description: projDesc || "",
        githubRepo: githubUrl || "",
        projName: projName || "",
        projUrl: projUrl || "",
        projID: projID,
        date: currentDate(),
        // userID: localStorage.userID,
        projectImage: projectImage,
        count: 0,
        teamMembers: teamMembers
      });

      // Add the project data to the user in Firebase
      console.log(teamMembers, "teamMembers in data.js")
      for (var i = 0; i < teamMembers.length; i++){
        firebase.child('users').child(teamMembers[i]).child('projects').transaction(function(projIDs){
          if (projIDs === null){
            projIDs = [];
          }
          if (projIDs.indexOf(projID) === -1) {
            projIDs.push(projID);  
          }
          return projIDs;
        });
      }
    };

    factory.filterForUser = function(userString, cb){
      firebase.child("users").orderByChild('realName').startAt(userString).endAt(userString+"\uf8ff").once("value", function(data){
        console.log("filteredUser", data.val());
        cb(data.val());
      });
    }

    factory.getUser = function(userID, cb) {
      firebase.child("users").child(userID).once("value", function(data){
        // $rootScope.$broadcast('gotUser', data.val());  //alert all controllers that the loggedin user has been modified.
        cb(data.val());
      });
    };

    factory.getUserByCleanUrl = function(cleanUrl, cb, errorCb){
      firebase.child("users").orderByChild('cleanUrl').equalTo(cleanUrl).on("value", function(data){
        var fetchedData = data.val();
        if (fetchedData === null){
          errorCb();
        }
        else {
          for (var first in fetchedData){
            cb(fetchedData[first]);
          }
        }
      });
    };

    // Get projects data from Firebase
    factory.getProjects = function(cb){
      firebase.child("projects").on("value", function(data){
        cb(data.val());
        console.log("proj Obs", data.val());
      });
    };


    factory.getProject = function(projID, cb){
      firebase.child("projects").child(projID).on("value", function(projectObject){
        cb(projectObject.val());
      })
    };

    factory.getUserProjects = function(projIds, cb){
      var result = [];
      for (var i=0; i<projIds.length; i++){
        factory.getProject(projIds[i], function(projObj){
          result.push(projObj);
        })
      }
    }

    factory.getLoggedInUsersIdeas = function(userID, cb){
      firebase.child("users").child(userID).child('ideasThatIsubmitted').on("value", function(data){
        cb(data.val());
      });
    }

    // Get ideas data from Firebase
    factory.getIdeas = function(cb){
      firebase.child("ideas").on("value", function(data){
        cb(data.val());
      });
    };

    factory.updateLike = function(userID, ideaSubmiterID, ideaID){

      //update ideas table to firebaselect current count
      var count;
      var counter = function(count){
        firebase.child("ideas").child(ideaID).child("count").transaction(function(currentCount){
          currentCount = count;
          return currentCount;
        });

        firebase.child("users").child(ideaSubmiterID).child("ideasThatIsubmitted").child(ideaID).once('value', function(idea){
          if(idea.val()){
            firebase.child("users").child(ideaSubmiterID).child("ideasThatIsubmitted").child(ideaID).child("count").transaction(function(currentCount){
              currentCount = count;
              return currentCount;
            });
          }
        });
      }

      //update ideas table to store users who like it
      firebase.child("ideas").child(ideaID).child("usersWhoLikeIt").transaction(function(usersWhoLikeIt){
        if(usersWhoLikeIt === null){
          usersWhoLikeIt = {};
        }
        usersWhoLikeIt[userID] = true;

        count = Object.keys(usersWhoLikeIt).length; //how many likes for a given idea
        counter(count);
        return usersWhoLikeIt;
      });

      //update users table to store ideas that users like
      firebase.child("users").child(ideaSubmiterID).child("ideasThatIsubmitted").child(ideaID).once('value', function(idea){
        if(idea.val()){
          firebase.child("users").child(ideaSubmiterID).child("ideasThatIsubmitted").child(ideaID).child("usersWhoLikeIt").transaction(function(likedIdeas){
            if(likedIdeas === null){
              likedIdeas = {};
            }
            likedIdeas[userID] = true;
            return likedIdeas;
          });
        }
      });

    }

    factory.updateProjectLike = function(userID, projectID, cb){

      //update projects table to firebaselect current count
      var count;
      var counter = function(count){
        firebase.child("projects").child(projectID).child("count").transaction(function(currentCount){
          if (currentCount === undefined) {
            count = 0;
          }
          currentCount = count;
          return currentCount;
        });

        firebase.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).once('value', function(project){
          if(project.val()){
            firebase.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).child("count").transaction(function(currentCount){
              currentCount = count;
              return currentCount;
            });
          }
        });
      }

      //update project table to store users who like it
      firebase.child("projects").child(projectID).child("usersWhoLikeIt").transaction(function(usersWhoLikeIt){
        if(usersWhoLikeIt === null){
          usersWhoLikeIt = {};
        }
        usersWhoLikeIt[userID] = true;

        count = Object.keys(usersWhoLikeIt).length; //how many likes for a given projects
        counter(count);
        return usersWhoLikeIt;
      });

      //update users table to store projects that users like
      firebase.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).once('value', function(project){
        if(project.val()){
          firebase.child("users").child(userID).child("projectsThatIsubmitted").child(projectID).child("usersWhoLikeIt").transaction(function(likedIdeas){
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

    factory.updateProject = function(projID, projName, projDesc, githubUrl, projUrl, projectImage, teamMembers, teamMembersRemoved){
      firebase.child('projects').child(projID).child('description').transaction(function(desc){
        desc = projDesc;
        return desc;
      });
      firebase.child('projects').child(projID).child('projName').transaction(function(name){
        name = projName;
        return name;
      });
      firebase.child('projects').child(projID).child('githubRepo').transaction(function(repo){
        repo = githubUrl;
        return repo;
      });
      firebase.child('projects').child(projID).child('projUrl').transaction(function(proj){
        proj = projUrl;
        return proj;
      });
      firebase.child('projects').child(projID).child('projectImage').transaction(function(image){
        image = projectImage;
        return image;
      });
      firebase.child('projects').child(projID).child('teamMembers').transaction(function(teamMemberIds){
        teamMemberIds = teamMembers;
        return teamMemberIds;
      });

      //update users projects
      console.log(teamMembers);
      for (var i = 0; i < teamMembers.length; i++){
        firebase.child('users').child(teamMembers[i]).child('projects').transaction(function(projIDs){
          if (projIDs === null || projIDs === undefined){
            projIDs = [];
          }
          if (projIDs.indexOf(projID) === -1) {
            projIDs.push(projID);  
          }
          console.log(projIDs, "projIDS on firebase updated")
          return projIDs;
        });
      }

      console.log(teamMembersRemoved, "removed!!");
      for (var i = 0; i < teamMembersRemoved.length; i++){
        firebase.child('users').child(teamMembersRemoved[i]).child('projects').transaction(function(projIDs){
          console.log("projects of removed user", projIDs);
          if (projIDs !== null && projIDs !== undefined){
            var projectIndex = projIDs.indexOf(projID);
            if (projectIndex !== -1){
              projIDs.splice(projectIndex, 1);
            }
          }
          return projIDs;
        })
      }


    };

    factory.updateIdea = function(userID, ideaID, ideaName, ideaDesc, ideaImage){
      firebase.child('ideas').child(ideaID).child('description').transaction(function(desc){
        desc = ideaDesc;
        return desc;
      });
      firebase.child('ideas').child(ideaID).child('ideaName').transaction(function(name){
        name = ideaName;
        return name;
      });
      firebase.child('ideas').child(ideaID).child('backgroundPath').transaction(function(path){
        path = ideaImage;
        return path;
      });

      firebase.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child('description').transaction(function(desc){
        desc = ideaDesc;
        return desc;
      });
      firebase.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child('ideaName').transaction(function(name){
        name = ideaName;
        return name;
      });
      firebase.child("users").child(userID).child("ideasThatIsubmitted").child(ideaID).child('backgroundPath').transaction(function(path){
        path = ideaImage;
        return path;
      });
    };

    factory.getUserCleanUrl = function(userID,cb){
      firebase.child("users").child(userID).child("cleanUrl").on("value", function(data){
        console.log(data.val(), "dataVALLLLLL")
        cb(data.val());

      })
    }

    // factory.getIdeas = function(cb){
    //   firebase.child("ideas").on("value", function(data){
    //     cb(data.val());
    //   });
    // };


    return factory;
}]);
