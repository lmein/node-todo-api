const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email.'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

//to specify what is converted into a JSON value (i.e. override what fields are sent)
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  //return user = _.pick(req.userObject, ['email', '_id']);
  return _.pick(userObject, ['email', '_id']);
};

//arrow functions do not bind this keyword
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  //sign({object you want to sign}, 'secret value to salt hash')
  var token = jwt.sign({_id: user._id.toHexString(), access}, '123abc').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
