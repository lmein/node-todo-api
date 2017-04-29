var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

// //creates a new instance
// var newTodo = new Todo({
//   text: 'Cook dinner.'
// });
//
// //saves instance to database
// newTodo.save().then((doc) => {
//   console.log('Saved todo.', doc);
// }, (e) => {
//   console.log('Unable to save todo.');
// });

var otherTodo = new Todo({
  text: 'Something to do'
  // text: 'Wash dishes.',
  // completed: true,
  // compeltedAt: 2017
});

otherTodo.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save todo.', e);
});

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

var otherUser = new User({
  email: 'Johndoe@site.com'
  // text: 'Wash dishes.',
  // completed: true,
  // compeltedAt: 2017
});

otherUser.save().then((doc) => {
  console.log(JSON.stringify(doc, undefined, 2));
}, (e) => {
  console.log('Unable to save user.', e);
});
