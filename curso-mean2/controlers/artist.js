'use strict'

var path = require('path');
var fs = require('fs');

var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist'); 
var Album = require('../models/albun');
var Song = require('../models/song');

 function getArtist(req,res){
	
    var artistID = req.params.id;

    Artist.findById(artistID, (err, artist) => {
    	if (err) {
			res.status(500).send({message : 'Error en la peticion'});	
    	}else{

    		if (!artist) {
				res.status(404).send({message : 'Artista no encontrado'});
    		} else{
				res.status(200).send({Artista : artist});
    		}
    	}
    });

} 


function getArtists(req,res){
	if (req.params.page) {
	 var page = req.params.page;	
	}else{
	 var page = 1;	
	}

	var itemsPerPage = 3;
    //sort: ordena por nombre 
	Artist.find().sort('name').paginate(page,itemsPerPage, function(err,artists,total){
		if (err) {
				res.status(500).send({message : 'Error en la peticion'});
		}else{
			if (!artists) {
				res.status(404).send({message : 'No existen artistas'});		
			}else{
				res.status(200).send({ total_items : total,
									   artists : artists 	
				});
			}
		}
	}); 

}
   

function saveArtist(req,res){
   var artist = new Artist();

   var params = req.body;
   artist.name = params.name;
   artist.description = params.description;
   artist.image = 'null';

   artist.save((err,artistStored) =>
   {
      if (err) {
      	res.status(500).send({message:'Error al guardar'});
      }else{
      	if (!artistStored) {
      		res.status(404).send({message:'El artista no ha sido guardado'});
      	}else{
      		res.status(200).send({artist: artistStored});
      	}
      }

   });
}

function updateArtist(req,res){
    // var artist = new Artist();
     var artistId = req.params.id;
     var update = req.body;
     console.log(update);
     console.log("Prueba");


     Artist.findByIdAndUpdate(artistId, update, (err, artistsUpdated) => {
     	if(err) {
			res.status(500).send({message : 'Error al guar el artista'});
     	}else{
     		if (!artistsUpdated) {
				res.status(404).send({message : 'Artista no existe, no ha sido actualizafo'});
     		}else{
				res.status(200).send({artists : artistsUpdated});
     		}
     	}
     });

}


function deleteArtist(req,res){
  var artistsId = req.params.id;

  Artist.findByIdAndRemove(artistsId, (err,artistsRemoved) => {

    if(err){
      res.status(500).send({message:'Error al remover el artista'});
    }else{
      if(!artistsRemoved){
        res.status(404).send({message:'El artista no ha sido removido'});
      }else{

        Album.find({artist: artistsRemoved._id}).remove((err , albumRemoved)=>{
          if(err){
            res.status(500).send({message:'El album ha sido eliminado'});
          }else{
            if(!albumRemoved){
              res.status(404).send({message:'El albun no sa ha podido eliminar'});
            }else{
             
             Song.find({artist: albumRemoved._id}).remove((err , songRemoved)=>{
              if(err){
                res.status(500).send({message:'El album ha sido eliminado'});
              }else{
                if(!songRemoved){
                  res.status(404).send({message:'El albun no sa ha podido eliminar'});
                }else{
                 res.status(404).send({artistsRemoved});

               }
             }
           });
           }
         }
       });
      }
    }
  });
}



module.exports = {
 
 getArtist,
 saveArtist,
 getArtists,
 updateArtist,
 deleteArtist

};


