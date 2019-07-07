'use strict'

var express = require('express');
var ArtistControles = require('../controlers/artist');
var api = express.Router();
var md_auth = require('../middlewar/authenticated');

api.get('/artist/:id', md_auth.ensureAuth  ,ArtistControles.getArtist);
api.post('/artist', md_auth.ensureAuth  ,ArtistControles.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth  ,ArtistControles.getArtists);
api.put('/artists/:id?', md_auth.ensureAuth  ,ArtistControles.updateArtist);
api.delete('/artists/:id', md_auth.ensureAuth  ,ArtistControles.deleteArtist);



module.exports = api;
