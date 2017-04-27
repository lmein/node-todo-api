
const {MongoClient, ObjectId} = require('mongodb');

//the following connects to database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Mongodb database server.');
  }
  console.log('Connected to Mongodb database server.');

  //what is in brackets in find is the key value pair to query for.
//  db.collection('Todos').find({completed: false}).toArray().then((docs) => {
  // db.collection('Todos').find({_id: new ObjectId('59023f38dfb666ccd63fe84e')}).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log(`Todos count: ${count}`);
  //   //console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('Unable to fetch todos', err);
  // });

   db.collection('Users').find({name: 'Dave'}).toArray().then((docs) => {
      console.log('Users');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('Unable to fetch todos', err);
    });

  //closes db connection
  db.close();
});
