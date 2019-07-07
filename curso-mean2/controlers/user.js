'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt'); 

function pruebas(req, res){
	res.status(200).send({
		message: 'Probando accion de controlador'
	});
} 


function saveUser(rep,res){
    var user = new User();

    var params = rep.body;
    
    console.log(params);

    user.name = params.name;
    console.log(user.name);
    user.surName = params.surName;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password){
    	//encripta contraseña y guarada datos
    	bcrypt.hash(params.password,null,null,function(err, hash){
    		user.password = hash;
    		if (user.name != null && user.surName != null && user.email != null){
    			//guaradar usuario
    			user.save((err, userStored) => {
 					if (err) {
    				res.status(500).send({message: 'Error al guaradar usuario'});
 		            }else{
 		            	if(!userStored){
  						  	res.status(404).send({message: 'No se ha registrado el usario'});
 		            	}else{
 		            		res.status(200).send({user: userStored});
 		            	}
 		            }
    			});
    		}else{
    	      err.status(200).send({message: 'Rellena todos los campos'});		
    		}
    	});
    }else{
    	res.status(200).send({message: 'Introduce la contraseña'});
    }
}


function loginUser(req, res){
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({email: email.toLowerCase()}, (err, user) =>{
    if(err){
       res.status(500).send({message: 'Error en la peticion'});
    }else{
    	if (!user) {
       res.status(404).send({message: 'El usuario no existre'});  
    	}else{
    		//existe el usuario comparamos 
    		bcrypt.compare(password,user.password, function(err,check){
    			if (check) {
    				//devuelve los datos del usuario logueado
    				if (params.gethash) {
    					//devolver un token de jwt
                        res.status(200).send({
                            token: jwt.createToken(user)
                        });
    				}else{
    				   res.status(200).send({user});  
    				}
    			}else{
    				//contraseña incorrecta 
                    res.status(404).send({message: 'El usuario no ha podido identificarce'});  
    			}
    		});
    	}
    }

  });
}


function updateUser(req,res){

    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {

        if(err){
            res.status(500).send({message:'Error al actualizar usario'});
        }else{
            if (!userUpdated) {
            res.status(500).send({message:'No se ha podido actualizar el usuario'});   
            }else{
            res.status(200).send({user: userUpdated});   
            }
        }
    });
}



function uploadImage(req, res){

    var userId = req.params.id;
    var file_name = 'No subio..'

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];
        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];
        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {

            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
               if(!userUpdated){
                    res.status(200).send({message:'No se ha podido actualizar el usuario'});   
               }else{
                    res.status(200).send({user:userUpdated});    
               }
            });

        }else{
        res.status(200).send({message:'Extension del archi no correcta'});   
        }    

        console.log(file_path);
    }else{
        res.status(200).send({message:'No se ha subido imagen'});   
    }

}


function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var path_File = './uploads/users/' + imageFile; 
    fs.exists(path_File, function(exists){
        if (exists){
            res.sendFile(path.resolve(path_File));
        }else{
            res.status(200).send({message: 'No existela imagen...'})
        }
    }); 
}




module.exports = {
pruebas,
saveUser,
loginUser,
updateUser,
uploadImage,
getImageFile
};