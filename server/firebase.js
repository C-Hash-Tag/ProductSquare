var Firebase = require('firebase');

var myDataRef = new Firebase('https://productsquare.firebaseio.com/');

var submitProject = exports.submitProject = function(data){
  myDataRef.child('projects/').push({
    name: data.name,
    video: data.video,
    images: data.images,
    description: data.description,
    githubRepo: data.githubRepo,
    users: data.users,
    nonusers: data.nonusers,
    likes: data.likes,
    dateCreated: data.dateCreated
  });
};

var submitIdeas = 

// myDataRef.child('users/').push({
//   email: "ceo@chashtag.com",
//   name: "Aaron",
//   password: "123",
//   github: "something@github.com",
//   projects: {"0": "xyz"},
//   ideas: {"0": "idea1"},
//   profilePicture: "picturelink",
//   "liked-projects": {"0": "project1id"},
//   "liked-ideas": {"0": "idea1id"}
// })

// myDataRef.child('ideas/').push({
//   name: "Idea to make coffee app",
//   description: "making an app about coffee",
//   likes: 4,
//   name: "Aaron",
//   dateCreated: "10/25/2015"
// })

