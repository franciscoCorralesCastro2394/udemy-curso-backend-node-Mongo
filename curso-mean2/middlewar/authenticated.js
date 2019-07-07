'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'Clave_secreta_curso';

exports.ensureAuth = function(req, res, next){

   if(!req.headers.authorization){
       return res.status(443).send({message: 'La peticion no teiene la cabecera de authorization'});
   }

   var token = req.headers.authorization.replace(/['"]+/g,'');

   try{
      var payLoad = jwt.decode(token,secret);
      if(payLoad.exp <= moment().unix()){
     	return res.status(401).send({message: 'Token ha expirado'});
      }

   }catch(ex){
   	 //console.log(ex);
     return res.status(404).send({message: 'Token no es valido'});
   }

   req.user = payLoad;
   next();
};