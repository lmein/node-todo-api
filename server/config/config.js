//the following to differientiate between test(local), development(mocha), and production
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];

  //console.log(Object.keys(envConfig));
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
    //console.log(process.env[key]);
  });
}

// if (env === 'development') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 3000;
//   process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }

//heroku config
//heroku config:set JWT_SECRET=alfjajklsgfjdshgl - sets env variable JWT_SECRET to string
//heroku get JWT_SECRET - gets the value of the JWT_SECRET env variable
//heroku unset JWT_SECRET - removes the JWT_SECRET env variable
