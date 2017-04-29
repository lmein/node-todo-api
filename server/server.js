//library imports
var express = require('express');
var bodyParser = require('body-parser');

//local imports
var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

//app stores express application
var app = express();

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

//port for the server to listen on for the application
app.listen(3000, () => {
  console.log('Started on port 3000.');
});

module.exports = {app};
