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

//app stores express application
var app = express();
//change for heroku
const port = process.env.PORT;

//bodyParser takes json and converts to object and attaches to request object
app.use(bodyParser.json());

//route configuration  2 arguements - URL ('/todos') and callback (req, res)
app.post('/todos', (req, res) => {
  //console.log(req.body);
  //creates instance of a mongoose model
  var todo = new Todo({
    text: req.body.text
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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
      res.send({todos});
      //the following is in case an error happens in todo.find above.
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    //console.log('ID is not valid.');
    return res.status(404).send();
  };
  //  res.send({id});
  // console.log('ID:', id);
  Todo.findById(id).then((todo) => {
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

app.delete('/todos/:id', (req, res) => {
  //get the id
  var id = req.params.id;
  //validate the id
  if (!ObjectID.isValid(id)) {
    //console.log('ID is not valid.');
    return res.status(404).send();
  };
  //remove todo
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo) {
      return res.status(404).send('ID not valid.');
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', (req, res) => {
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
  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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

//port for the server to listen on for the application
app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};
