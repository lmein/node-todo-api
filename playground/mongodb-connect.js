//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectId} = require('mongodb');

//destructing user object

// var obj = new ObjectId();
// console.log(obj);

//the following connects to database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Mongodb database server.');
  }
  console.log('Connected to Mongodb database server.');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert to todo', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  //insert new doc into Users (name:, age, location)
  // db.collection('Users').insertOne({
  //   name: 'Dave',
  //   age: 22,
  //   location: 'home'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert to Users', err);
  //   }
  //   //console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  //closes db connection
  db.close();
});
