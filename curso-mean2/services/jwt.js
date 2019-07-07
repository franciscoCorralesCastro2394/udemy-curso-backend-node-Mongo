'use strict'

var jwt = require('jwt-simple');

var moment = require('moment');

var secret = 'Clave_secreta_curso';


exports.createToken = function(user){

   var payLoad = {
      sub: user._id,
      mane: user.name,
      surmane: user.surmane,
      email: user.email,
      rol: user.role,
      image: user.image,
      iat: moment().unix(),
      exp: moment().add(30,'days').unix 
   };

   return jwt.encode(payLoad, secret);
};