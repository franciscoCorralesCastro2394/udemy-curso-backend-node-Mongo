'use strict'

var express = require('express');
var UserControler = require('../controlers/user');

var api = express.Router();
var md_auth = require('../middlewar/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});

api.get('/probando-controlador', md_auth.ensureAuth , UserControler.pruebas);
api.post('/register', UserControler.saveUser);
api.post('/login', UserControler.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserControler.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth , md_upload], UserControler.uploadImage);
api.get('/get-image-user/:imageFile', UserControler.getImageFile);


module.exports = api;