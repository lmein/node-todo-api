//this gets the test, development, production config file.
require('./config/config.js');

//library imports
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require ('mongodb');

//local imports
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');
var {authenticate} = require('./middleware/authenticate.js');

//app stores express application
var app = express();
//change for heroku
const port = process.env.PORT;

//bodyParser takes json and converts to object and attaches to request object
app.use(bodyParser.json());

//route configuration  2 arguements - URL ('/todos') and callback (req, res)
app.post('/todos', authenticate, (req, res) => {
  //console.log(req.body);
  //creates instance of a mongoose model
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  //save model to database
  todo.save().then((doc) => {
    //sends the doc back to the user - useful information
    res.send(doc);
  }, (e) => {
    //sends the error back to the user
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
      res.send({todos});
      //the following is in case an error happens in todo.find above.
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    //console.log('ID is not valid.');
    return res.status(404).send();
  };
  //  res.send({id});
  // console.log('ID:', id);
  //Todo.findById(id).then((todo) => {
  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    //the following if handles if ID is invalid
    if(!todo) {
      //return console.log('ID not found.');
      return res.status(404).send('ID not valid.');
    }
    //console.log('Todo by id: ', todo);
    //res.send(todo);
    res.send({todo});
    //res.status(200).send('Todo by id', todo);
    //the following catch is for an invalid id (such as one with additional characters)
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  //get the id
  var id = req.params.id;
  //validate the id
  if (!ObjectID.isValid(id)) {
    //console.log('ID is not valid.');
    return res.status(404).send();
  };
  //remove todo
  //Todo.findByIdAndRemove(id).then((todo) => {
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if(!todo) {
      return res.status(404).send('ID not valid.');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', authenticate, (req, res) => {
  //get the id
  var id = req.params.id;
  //pick of lodash controls what properties can be updated.  Here, the text and completed is put in an array as these can be chnaged by the user.
  var body = _.pick(req.body, ['text', 'completed']);
  //validate the id
  if (!ObjectID.isValid(id)) {
    //console.log('ID is not valid.');
    return res.status(404).send();
  };

  //update completedAt field based on completed field
  if (_.isBoolean(body.completed) && body.completed) {
    //Date().getTime() returns a javascript timestamp.  1/1/70 - unix epic
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    //the following removes value from database.
    body.completedAt = null;
  }

  //first argument: id itself (query), second argument: {set body} (update object), third argument: {new true} - (options)  this is the query.  .then callback and catch callback follow.
  //Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id
  }, {$set: body}, {new: true}).then((todo) => {
    if (!todo) {
      return res.status(404).send()
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

//route configuration  2 arguements - URL ('/todos') and callback (req, res)
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  //console.log(req.body);
  //creates instance of a mongoose model
  var user = new User(body);
//model methods on upper case user
  //User.findByToken
//instance methods on lower case user
  //user.generateAuthToken

  //save model to database
  user.save().then(() => {
    //sends the doc back to the user - useful information
    return user.generateAuthToken();
  }).then((token) =>{
    //x-: custom header
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    //sends the error back to the user
    res.status(400).send(e);
  });
});



//app.get('/users/me', (req, res) => {
//add authenticate to this to use the middleware above
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
  // var token = req.header('x-auth');
  //
  // User.findByToken(token).then((user) => {
  //   if (!user) {
  //     //res.status(401).send();
  //     //the following stops execution and then it goes to the catch below.
  //     return Promise.reject();
  //   }
  //
  //   res.send(user);
  // }).catch((e) => {
  //   res.status(401).send();
  // });
});

//post /userslogin {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then ((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    //the following sets status to 400 and then sends that to app user.
    res.status(400).send();
  });
  //res.send(body);
});

//port for the server to listen on for the application
app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = {app};
