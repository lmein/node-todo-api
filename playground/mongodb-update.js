
const {MongoClient, ObjectID} = require('mongodb');

//the following connects to database
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to Mongodb database server.');
  }
  console.log('Connected to Mongodb database server.');

  //findOneAndUpdate
  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('59027f79dfb666ccd63feeff')
  }, {
    $set: {
      completed: true
      }
    }, {
      returnOrignial: false
    }).then((result) => {
      console.log(result);
    });

//  db.close();
});
