'use strict'

const express = require('express');
const UserController = require('../controllers/user');
const md_auth = require('../Middleware/authenticated');
const multipart = require('connect-multiparty'); // To work this files.
const md_upload = multipart({ uploadDir: './uploads/users' });

const api = express.Router();

api.get('/test-controller', md_auth.ensureAuth, UserController.test);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
// api.patch('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', UserController.getImageFile);

module.exports = api;
