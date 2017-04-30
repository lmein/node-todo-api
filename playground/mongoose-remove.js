const {ObjectID} = require ('mongodb');

const {mongoose} = require('./../server/db/mongoose.js');
const {Todo} = require('./../server/models/todo.js');
const {User} = require('./../server/models/user.js');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

//Todo.findOneAndRemove
Todo.findOneAndRemove({_id: '59060bc9ce74964cff2501de'}).then((todo) => {
  console.log(todo);
});

//Todo.findByIdAndRemove

Todo.findByIdAndRemove('59060bc9ce74964cff2501de').then((todo) => {
  console.log(todo);
});
