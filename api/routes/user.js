'use strict'

var express = require('express'),
    UserController = require('../controllers/user'),
    md_auth = require('../Middleware/authenticated'),
    multipart = require('connect-multiparty'), // To work this files.
    md_upload = multipart({ uploadDir: './uploads/users' }),

    api = express.Router();

api.get('/test-controller', md_auth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
// api.patch('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;
