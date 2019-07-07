'use strict'

var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({

   mumber: String,
   nane: String,
   duraction: String,
   file: String,
   album: { type: Schema.ObjectId, ref: 'Album'}
});

module.exports = mongoose.model('Song',SongSchema);