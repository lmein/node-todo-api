const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    //pull from tokens array any token that is equal to token passed into this function.
    $pull: {
      tokens: {token}
    }
  })
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    // return new Promise((resolve, reject) => {
    //   reject();
    // });
    //the following is the same as above
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    //find a tokens array where token matches token passed in on first line.  these two are also in schema above
    'tokens.token': token,
    'tokens.access': 'auth'

  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    //bcrypt only supports callbacks
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    })
  });
};

//next needed in () next to function so app finishes
UserSchema.pre('save', function (next) {
  var user = this;
  //checks to see if password has been modified
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        //console.log(hash);
        user.password = hash;
        //console.log(user.password);
        next();
      });
    });

    // bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(password, salt, (err, hash) => {
    //     console.log(hash);
    //   });
    // });
    //user.password = hash;

    // var hashedPassword = '$2a$10$E0iuhNwJD.H6SOeSmDpBquCsVHgm1eViijTBAMMfQ6Ad7HHUoiN2m';
    //
    // bcrypt.compare(password, hashedPassword, (err, res) => {
    //     console.log(res);
    // });
  } else {
    next ();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
