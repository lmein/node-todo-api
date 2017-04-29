//library imports
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require ('mongodb');

//local imports
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

//app stores express application
var app = express();
const port = process.env.PORT || 3000;

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
    res.status(400).send()
  });
});

//port for the server to listen on for the application
app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
