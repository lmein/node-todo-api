var {User} = require('./../models/user');

//this is to convert app.get to middleware
var authenticate = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    //res.send(user);
    //the following change is for middleware
    req.user = user;
    req.token = token;
    //the next is needed for the code below to execute.
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};
