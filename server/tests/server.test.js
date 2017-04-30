const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// ./../ goes back one directory from current and then down into server directory
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

//seed database
const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 666
}];

//this function runs each time and will only move onto test case once this is complete.
beforeEach((done) => {
  //this deletes everything in the database
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('Should create a new todo.', (done) => {
    var text = 'Test todo text';

    //supertest on the app to test
    request(app)
      .post('/todos')
      //pass in an object that gets converted to JSON by supertest
      .send({text})
      //start of assertions
      .expect(200)
      .expect((res) => {
        //this checks to see if body of text matches text from above.
        expect(res.body.text).toBe(text);
      })
      //wraps up test
      .end((err, res) => {
        if (err) {
          //if err, then wraps up test
          return done(err);
        }

        Todo.find({text}).then((todos) => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
            //the following is in case an error happens in todo.find above.
        }).catch((e) => done(e));
      });
    });

    it('Should not create todo with invalid body data.', (done) => {
        request(app)
          .post('/todos')
          .send({})
          .expect(400)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            Todo.find().then((todos) => {
              expect(todos.length).toBe(2);
              done();
            }).catch((e) => done(e));
          });
      });
});

describe ('GET /todos', () => {
  it('Should get all todos.', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe ('GET /todos/:id', () => {
  it('Should return todo doc.', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString() + 1}`)
      .expect(404)
      .end(done);
  });

  it('Should return 404 for non-object ids.', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done);
  });

});

describe ('DELETE /todos/:id', () => {
  it('Should remove a todo.', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done (err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));

      });
  });

  it('Should return a 404 if todo not found.', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('Should return a 404 if object id is invalid.', (done) => {
     request(app)
       .delete('/todos/123')
       .expect(404)
       .end(done);
  });
});

describe ('PATCH /todos/:id', () => {
  it('Should update a todo.', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'Patch todo text 1';

    console.log({text});
    request(app)
      .patch(`/todos/${hexId}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((res) => {
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(true);
         expect(res.body.todo.completedAt).toBeA('number');
      })
     .end(done);
    });
  //});

  it('Should clear completedAt when todois not completed.', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'Patch todo text 2';

    request(app)
      .patch(`/todos/${hexId}`)
      .send({completed: false,
        text})
      .expect(200)
      .expect((res) => {
         expect(res.body.todo.text).toBe(text);
         expect(res.body.todo.completed).toBe(false);
         expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
    });

});
