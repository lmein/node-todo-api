const {ObjectID} = require ('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

var id = '5904d53598eb7148dcc802de';
//an id that is not in the database will not throw an error
var userId = '590493a01a43ce41186f6be1';

//this validates IDs:
if (!ObjectID.isValid(id)) {
  console.log('ID is not valid.');
};

if (!ObjectID.isValid(userId)) {
  console.log('ID is not valid.');
};


// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });
//
// Todo.findById(id).then((todo) => {
//   //the following if handles if ID is invalid
//   if(!todo){
//     return console.log('ID not found.');
//   }
//   console.log('Todo by id: ', todo);
//   //the following catch is for an invalid id (such as one with additional characters)
// }).catch((e) => console.log(e));

User.findById(userId).then((user) => {
  //the following if handles if ID is invalid
  if(!user){
    return console.log('User ID not found.');
  }
  //console.log('User by id', user);
  console.log(JSON.stringify(user, undefined, 2));
  //the following catch is for an invalid id (such as one with additional characters)
}).catch((e) => console.log(e));
